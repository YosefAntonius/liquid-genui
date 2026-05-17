import React, { useState } from "react";
import { motion, useDragControls } from "motion/react";
import { Minus, Trash, Terminal, RefreshCw, Save, X, Paperclip, Edit3 } from "lucide-react";
import { useLiquid } from "./LiquidProvider";
import { SkinEditorModal } from "./SkinEditorModal";
import { LiquidGenUILogo } from "./LiquidGenUILogo";

interface LiquidChatProps {
  placeholder?: string;
}

export function LiquidChat({ placeholder = "Describe the UI you want..." }: LiquidChatProps) {
  const {
    liquidHtml,
    savedSkins,
    currentSkinId,
    isCurrentSaved,
    isGenerating,
    isChatOpen,
    useActual,
    activePrompt,
    setUseActual,
    setIsChatOpen,
    handleGenerate,
    saveSkin,
    uploadSkin,
    applySkin,
    confirmDeleteSkin,
    setDefaultSkin,
    updateLiquidHtml,
    logs,
    config
  } = useLiquid();

  const [promptInput, setPromptInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState("Nueva Skin");
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [mdInstructions, setMdInstructions] = useState<string | null>(null);
  const [mdFileName, setMdFileName] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dragControls = useDragControls();
  const logsEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSave = () => {
    if (saveName.trim()) {
      saveSkin(saveName.trim());
      setSaveModalOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMdFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMdInstructions(ev.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  // Find current prompt
  const currentActivePrompt = currentSkinId
    ? (savedSkins.find(s => s.id === currentSkinId)?.prompt || null)
    : activePrompt;

  return (
    <>
      {showPromptDialog && currentActivePrompt && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-[#111] border border-white/20 p-6 rounded-2xl max-w-2xl w-full text-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Terminal size={18} className="text-indigo-400" /> Prompt Generator
              </h3>
              <button
                onClick={() => setShowPromptDialog(false)}
                className="text-white/40 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-[#0a0a0a] rounded-xl border border-white/10 max-h-[60vh] overflow-y-auto">
              <p className="text-sm font-mono text-white/80 whitespace-pre-wrap leading-relaxed">
                {currentActivePrompt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-[#111] border border-white/20 p-6 rounded-2xl max-w-sm w-full text-white shadow-2xl flex flex-col gap-4">
            <h3 className="font-bold text-lg text-white">Guardar Skin</h3>
            <input
              className="bg-black border border-white/30 rounded p-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Nombre de la skin"
              autoFocus
              onKeyDown={e => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setSaveModalOpen(false);
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="px-4 py-2 hover:bg-white/10 text-white/70 rounded transition-colors text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className="px-4 py-2 bg-emerald-500/20 text-emerald-400 disabled:opacity-50 hover:bg-emerald-500/30 rounded transition-colors text-sm font-bold tracking-wide"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-[#111] border border-white/20 p-6 rounded-2xl max-w-sm w-full text-white shadow-2xl flex flex-col gap-4">
            <h3 className="font-bold text-lg text-white">Eliminar Skin</h3>
            <p className="text-white/70 text-sm">¿Seguro que deseas eliminar esta skin de forma permanente?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 hover:bg-white/10 text-white/70 rounded transition-colors text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  confirmDeleteSkin(deleteModalId);
                  setDeleteModalId(null);
                }}
                className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded transition-colors text-sm font-bold tracking-wide"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditor && liquidHtml && (
        <SkinEditorModal
          initialHtml={liquidHtml}
          onSave={updateLiquidHtml}
          onClose={() => setShowEditor(false)}
        />
      )}

      {/* Floating Chat for "Liquid Engine" */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          style={{ position: "absolute", bottom: 40, right: 40 }}
          className={`pointer-events-auto bg-[#111] shadow-2xl border flex flex-col transition-[height,width,border-radius] duration-300 overflow-hidden ${!isChatOpen ? "h-[50px] w-[50px] border-white/10 rounded-[33px]" : "h-auto w-[400px] border-white/20 rounded-2xl"}`}
        >
          {isChatOpen ? (
            <>
              <div
                className="bg-white/5 text-white p-3 flex justify-between items-center border-b border-white/10 cursor-move"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/60 pointer-events-none">
                    Liquid Chat
                  </h3>
                </div>
                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="text-white/40 hover:text-white transition cursor-pointer"
                >
                  <Minus size={16} />
                </button>
              </div>

              <div className="flex flex-col flex-1 min-h-0">
                <div className="p-4 bg-transparent max-h-48 flex flex-col overflow-y-auto">
                  <div className="flex flex-col justify-end min-h-full">
                    <p className="text-[11px] font-mono text-white/40 leading-relaxed break-words whitespace-pre-wrap">
                      {logs.map((log, idx) => (
                        <React.Fragment key={idx}>
                          {log}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                    <div ref={logsEndRef} />
                  </div>
                </div>
                <div className="bg-white/5 border-t border-white/10 p-3 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest flex-shrink-0">
                      Skin:
                    </label>
                    <select
                      className="bg-[#1a1a1a] max-w-[180px] border border-white/20 text-white text-[11px] rounded px-2 py-1 outline-none flex-1 truncate cursor-pointer"
                      value={currentSkinId || ""}
                      onChange={(e) => applySkin(e.target.value || null)}
                    >
                      <option value="">-- UI Normal --</option>
                      {config.getSkinsRemoteApiEndpoint ? (
                        <>
                          <optgroup label="🌐 Skins Remotas">
                            {savedSkins.filter(s => s.isRemote).map((skin) => (
                              <option key={skin.id} value={skin.id}>
                                {skin.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="💻 Skins Locales">
                            {savedSkins.filter(s => !s.isRemote).map((skin) => (
                              <option key={skin.id} value={skin.id}>
                                {skin.name}
                              </option>
                            ))}
                          </optgroup>
                        </>
                      ) : (
                        savedSkins.map((skin) => (
                          <option key={skin.id} value={skin.id}>
                            {skin.name}
                          </option>
                        ))
                      )}
                      {currentSkinId === null && liquidHtml !== null && (
                        <option value="" disabled hidden>
                          -- Sin guardar --
                        </option>
                      )}
                    </select>
                    {currentSkinId && (
                      <button
                        onClick={() => setDeleteModalId(currentSkinId)}
                        title="Eliminar Skin"
                        className="p-1 hover:bg-white/10 rounded flex-shrink-0 text-white/40 hover:text-red-500 transition-colors"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                    <button
                      onClick={setDefaultSkin}
                      title="Asignar como predeterminada"
                      className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[9px] font-bold uppercase tracking-widest text-white transition-colors flex-shrink-0"
                    >
                      Set Default
                    </button>
                    <button
                      onClick={() => setShowPromptDialog(true)}
                      title={currentActivePrompt ? "Ver Prompt" : "Sin prompt"}
                      disabled={!currentActivePrompt}
                      className="p-1 hover:bg-white/10 rounded flex-shrink-0 text-indigo-400 disabled:text-white/20 disabled:hover:bg-transparent transition-colors disabled:cursor-not-allowed"
                    >
                      <Terminal size={14} />
                    </button>
                    {/*<button
                      onClick={() => setShowEditor(true)}
                      title={liquidHtml ? "Editar Código HTML" : "Nada que editar"}
                      disabled={!liquidHtml}
                      className="p-1 hover:bg-white/10 rounded flex-shrink-0 text-cyan-400 disabled:text-white/20 disabled:hover:bg-transparent transition-colors disabled:cursor-not-allowed"
                    >
                      <Edit3 size={14} />
                    </button>*/}
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-white/70">
                      <input
                        type="checkbox"
                        checked={useActual}
                        onChange={(e) => setUseActual(e.target.checked)}
                        disabled={!liquidHtml}
                        className="accent-emerald-500 rounded"
                      />
                      Use actual
                    </label>
                    {!isCurrentSaved && liquidHtml !== null && (
                      <button
                        onClick={() => {
                          setSaveName("Nueva Skin");
                          setSaveModalOpen(true);
                        }}
                        className="bg-emerald-500/20 text-emerald-400 px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500/30 transition-colors flex-shrink-0"
                      >
                        <Save size={12} /> Guardar
                      </button>
                    )}
                    {isCurrentSaved && currentSkinId && config.saveSkinRemoteApiEndpoint && !savedSkins.find(s => s.id === currentSkinId)?.isRemote && (
                      <button
                        onClick={async () => {
                          setIsUploading(true);
                          await uploadSkin(currentSkinId);
                          setIsUploading(false);
                        }}
                        disabled={isUploading}
                        className="bg-blue-500/20 text-blue-400 px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/30 transition-colors flex-shrink-0 disabled:opacity-50"
                      >
                        <Save size={12} /> {isUploading ? 'Subiendo...' : 'Subir a Nube'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-3 border-t border-white/10 bg-[#0a0a0a] flex items-center gap-2 mt-auto">
                  <div className="flex-1 bg-[#111] border border-white/20 focus-within:border-white transition-colors rounded-xl flex items-center px-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${mdInstructions ? 'text-emerald-400 bg-emerald-400/10' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                      title={mdFileName || "Adjuntar archivo .md"}
                    >
                      <Paperclip size={18} />
                    </button>
                    <input
                      type="file"
                      accept=".md"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {mdFileName && (
                      <div className="flex items-center gap-1 bg-white/10 px-2 py-1 ml-1 rounded text-xs text-white/70 max-w-[100px]">
                        <span className="truncate">{mdFileName}</span>
                        <button onClick={() => { setMdInstructions(null); setMdFileName(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="hover:text-white flex-shrink-0">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      className="w-full bg-transparent px-2 py-3 text-sm font-medium text-white placeholder-white/20 outline-none"
                      placeholder={placeholder}
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isGenerating && promptInput.trim()) {
                          handleGenerate(promptInput, mdInstructions || undefined);
                          setPromptInput("");
                          setMdInstructions(null);
                          setMdFileName(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }
                      }}
                      disabled={isGenerating}
                    />
                  </div>
                  <button
                    onClick={() => {
                      handleGenerate(promptInput, mdInstructions || undefined);
                      setPromptInput("");
                      setMdInstructions(null);
                      setMdFileName(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    disabled={isGenerating || !promptInput.trim()}
                    className="px-6 py-3 bg-white text-black text-[12px] font-black uppercase tracking-tighter rounded-xl disabled:opacity-50 hover:bg-white/90 transition"
                  >
                    {isGenerating ? (
                      <RefreshCw className="animate-spin" size={16} />
                    ) : (
                      "GEN"
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white/40 hover:text-white bg-white/5 cursor-pointer relative"
              onClick={() => setIsChatOpen(true)}
              onPointerDown={(e) => dragControls.start(e)}
            >
              <LiquidGenUILogo />
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
