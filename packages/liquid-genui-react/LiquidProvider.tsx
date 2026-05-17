import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion } from "motion/react";
import Dexie, { type Table } from "dexie";
import { LiquidContext, type EngineConfig, type SavedSkin } from "./LiquidContext";
import { LiquidLayout } from "./LiquidLayout";

class LiquidDatabase extends Dexie {
  skins!: Table<SavedSkin, string>;
  constructor() {
    super("LiquidUI_DB");
    this.version(1).stores({ skins: "id" });
  }
}
export const dexieDb = new LiquidDatabase();

export const useLiquid = () => {
  const context = useContext(LiquidContext);
  if (!context) throw new Error("useLiquid must be used within LiquidProvider");
  return context;
};

interface LiquidProviderProps {
  config: EngineConfig;
  skills?: Record<string, Function>;
  children: ReactNode;
  header?: boolean;
  footer?: boolean;
}

export const LiquidProvider = ({ config, skills = {}, children, header = false, footer = false }: LiquidProviderProps) => {
  const [liquidHtml, setLiquidHtml] = useState<string | null>(null);
  const [savedSkins, setSavedSkins] = useState<SavedSkin[]>([]);
  const [currentSkinId, setCurrentSkinId] = useState<string | null>(null);
  const [isCurrentSaved, setIsCurrentSaved] = useState<boolean>(true);
  const [useActual, setUseActual] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(() => {
    return localStorage.getItem("liquid_chat_open") !== "false";
  });
  const [contextData, setContextData] = useState<any>({});

  useEffect(() => {
    localStorage.setItem("liquid_chat_open", String(isChatOpen));
  }, [isChatOpen]);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    "> SYNC COMPLETED.",
    "> Soy el LiquidEngine. ¿Cómo quieres transformar esta vista?",
    "> Ej: \"Convierte esta tabla en tarjetas oscuras\""
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${msg}`]);
  };

  // Note: the component using this context needs to provide `data` on generate, or we fetch it via a standard skill.
  // We'll keep things generic.

  useEffect(() => {
    const loadSkins = async () => {
      const defaultSkinId = localStorage.getItem("liquid_default_skin_id");
      let localSkins: SavedSkin[] = [];

      try {
        const dexieSkins = await dexieDb.skins.toArray();
        if (dexieSkins.length > 0) {
          localSkins = dexieSkins;
        } else {
          // Compatibility with localStorage
          const storedSkins = localStorage.getItem("liquid_skins");
          if (storedSkins) {
            try {
              localSkins = JSON.parse(storedSkins);
              if (localSkins.length > 0) {
                await dexieDb.skins.bulkAdd(localSkins).catch(e => console.error(e));
              }
            } catch (e) { }
          } else {
            const savedSkin = localStorage.getItem("liquid_view_dashboard");
            if (savedSkin) {
              const newSkin = {
                id: Date.now().toString(),
                name: "Skin 1",
                html: savedSkin,
              };
              localSkins = [newSkin];
              await dexieDb.skins.add(newSkin).catch(e => console.error(e));
              localStorage.setItem("liquid_default_skin_id", newSkin.id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load from Dexie", err);
      }

      if (config.getSkinsRemoteApiEndpoint) {
        try {
          const endpoint = new URL(config.getSkinsRemoteApiEndpoint, window.location.origin);
          endpoint.searchParams.append('projectId', config.projectId);
          const res = await fetch(endpoint.toString());
          if (res.ok) {
            const dbSkins: SavedSkin[] = await res.json();
            const skinsMap = new Map<string, SavedSkin>();
            localSkins.forEach(s => skinsMap.set(s.id, s));
            dbSkins.forEach(s => skinsMap.set(s.id, { ...s, isRemote: true }));
            localSkins = Array.from(skinsMap.values());

            // Sync with dexie (using bulkPut instead of clear + bulkAdd to preserve other projects' skins)
            await dexieDb.skins.bulkPut(localSkins).catch(e => console.error(e));
          }
        } catch (e) {
          console.error("Failed to load skins from DB", e);
        }
      }

      const filteredSkins = localSkins.filter(s => !s.projectId || s.projectId === config.projectId);
      setSavedSkins(filteredSkins);

      if (defaultSkinId) {
        const found = filteredSkins.find((s: SavedSkin) => s.id === defaultSkinId);
        if (found) {
          setLiquidHtml(found.html);
          setCurrentSkinId(found.id);
          setIsCurrentSaved(true);
        }
      }
      setIsLoaded(true);
    };

    loadSkins();
  }, [config.getSkinsRemoteApiEndpoint]);

  const handleGenerate = async (prompt: string, instructions?: string) => {
    setIsGenerating(true);
    try {
      const availableSkills = (config.skills || []).map((s) => ({
        name: s.tag,
        description: s.method ? `source: ${s.source}, method: ${s.method}` : 'Function',
      }));

      const requestBody = {
        prompt,
        data: contextData,
        availableSkills,
        currentHtml: useActual ? liquidHtml : null,
        safeLibraries: config.safeLibraries,
        instructions
      };

      const endpoint = config.apiEndpoint || "/api/generate-ui-stream";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.body) throw new Error("No stream body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedHtml = "";
      let isDone = false;
      let lastRenderTime = Date.now();
      const RENDER_INTERVAL = 400; // ms

      setActivePrompt(instructions ? `${prompt}\n\n[Adjunto: ${instructions}...]` : prompt);
      setIsCurrentSaved(false);
      setLiquidHtml("");

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n\n')) >= 0) {
          const event = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 2);

          if (event.startsWith('data: ')) {
            const dataStr = event.slice(6);
            if (dataStr === '[DONE]') {
              isDone = true;
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.chunk) {
                streamedHtml += parsed.chunk;
              } else if (parsed.error) {
                console.error("Stream error:", parsed.error);
                throw new Error(parsed.error);
              }
            } catch (ignore) { }
          }
        }

        if (isDone) break;

        const now = Date.now();
        if (now - lastRenderTime > RENDER_INTERVAL) {
          const cleanedHtml = streamedHtml.replace(/^```html\n|```$/g, "").trim();
          setLiquidHtml(cleanedHtml);
          lastRenderTime = now;
        }
      }

      const finalHtml = streamedHtml.replace(/^```html\n|```$/g, "").trim();
      setLiquidHtml(finalHtml);
      addLog("Generación de UI completada.");
    } catch (err) {
      console.error(err);
      addLog("Error: Falló la generación de UI");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveSkin = async (name: string) => {
    if (liquidHtml) {
      const id = Date.now().toString();
      const newSkin: SavedSkin = { id, name, html: liquidHtml, prompt: activePrompt || undefined, projectId: config.projectId };
      const newSkins = [...savedSkins, newSkin];
      setSavedSkins(newSkins);

      await dexieDb.skins.add(newSkin).catch(e => console.error(e));

      if (config.saveSkinRemoteApiEndpoint) {
        try {
          await fetch(config.saveSkinRemoteApiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSkin)
          });
        } catch (e) {
          console.error("Failed to save skin to DB", e);
        }
      }

      setCurrentSkinId(id);
      setIsCurrentSaved(true);
      addLog(`Skin "${name}" guardada con éxito.`);
    }
  };

  const uploadSkin = async (id: string) => {
    const skin = savedSkins.find((s) => s.id === id);
    if (!skin || !config.saveSkinRemoteApiEndpoint) return;

    try {
      addLog(`Subiendo skin "${skin.name}" a la nube...`);
      const res = await fetch(config.saveSkinRemoteApiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skin)
      });

      if (res.ok) {
        const updatedSkin = { ...skin, isRemote: true };
        
        // Update local state
        const newSkins = savedSkins.map(s => s.id === id ? updatedSkin : s);
        setSavedSkins(newSkins);

        // Update Dexie
        await dexieDb.skins.put(updatedSkin).catch(e => console.error(e));

        addLog(`Skin "${skin.name}" subida a la nube correctamente.`);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (e) {
      console.error("Failed to upload skin to DB", e);
      addLog(`Error al subir skin "${skin.name}".`);
    }
  };

  const applySkin = (id: string | null) => {
    if (id === null) {
      setLiquidHtml(null);
      setCurrentSkinId(null);
      setIsCurrentSaved(true);
    } else {
      const skin = savedSkins.find((s) => s.id === id);
      if (skin) {
        setLiquidHtml(skin.html);
        setCurrentSkinId(skin.id);
        setIsCurrentSaved(true);
      }
    }
  };

  const updateLiquidHtml = (html: string) => {
    setLiquidHtml(html);
    setIsCurrentSaved(false);
  };

  const confirmDeleteSkin = async (id: string) => {
    const newSkins = savedSkins.filter(s => s.id !== id);
    setSavedSkins(newSkins);

    await dexieDb.skins.delete(id).catch(e => console.error("Failed to delete skin from Dexie: ", e));

    if (config.deleteSkinRemoteApiEndpoint) {
      try {
        await fetch(`${config.deleteSkinRemoteApiEndpoint}/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.error('Failed to delete skin from DB', e);
      }
    }

    const defaultSkinId = localStorage.getItem("liquid_default_skin_id");
    if (defaultSkinId === id) {
      if (newSkins.length > 0) {
        localStorage.setItem("liquid_default_skin_id", newSkins[0].id);
      } else {
        localStorage.removeItem("liquid_default_skin_id");
      }
    }

    if (currentSkinId === id) {
      if (newSkins.length > 0) {
        applySkin(newSkins[0].id);
      } else {
        applySkin(null);
      }
    }
    addLog("Skin eliminada.");
  };

  const setDefaultSkin = () => {
    if (currentSkinId) {
      localStorage.setItem("liquid_default_skin_id", currentSkinId);
      addLog("Skin actual establecida como predeterminada.");
    } else if (!liquidHtml) {
      localStorage.removeItem("liquid_default_skin_id");
      addLog("Se ha restablecido la UI normal por defecto.");
    } else if (!isCurrentSaved) {
      addLog("⚠️ Primero guarda la skin actual antes de establecerla por defecto.");
    }
  };

  return (
    <LiquidContext.Provider value={{
      config,
      systemSkills: skills,
      liquidHtml,
      savedSkins,
      currentSkinId,
      isCurrentSaved,
      isGenerating,
      isChatOpen,
      useActual,
      contextData,
      isLoaded,
      activePrompt,
      logs,
      addLog,
      setContextData,
      setUseActual,
      setIsChatOpen,
      handleGenerate,
      saveSkin,
      uploadSkin,
      applySkin,
      confirmDeleteSkin,
      setDefaultSkin,
      updateLiquidHtml
    }}>
      <LiquidLayout header={header} footer={footer}>
        {children}
      </LiquidLayout>
    </LiquidContext.Provider>
  );
};


