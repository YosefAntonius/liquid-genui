import { createContext } from "react";

export interface SkillConfig {
    tag: string;
    source?: string;
    payload?: any;
    method?: string;
    headers?: any;
    reloadItems?: boolean;
    function?: (payload: any) => Promise<any>;
}

export interface LibraryConfig {
    name: string;
    src: string;
}

export interface CategoryLibraries {
    category: string;
    libs: LibraryConfig[];
}


export interface EngineConfig {
    projectId: string;
    apiEndpoint?: string;
    saveSkinRemoteApiEndpoint?: string;
    getSkinsRemoteApiEndpoint?: string;
    deleteSkinRemoteApiEndpoint?: string;
    skills?: SkillConfig[];
    safeLibraries?: CategoryLibraries[];
    theme?: string;
}

export interface SavedSkin {
    id: string;
    name: string;
    html: string;
    prompt?: string;
    projectId?: string;
    isRemote?: boolean;
}


interface LiquidContextType {
    config: EngineConfig;
    systemSkills: Record<string, Function>;
    liquidHtml: string | null;
    savedSkins: SavedSkin[];
    currentSkinId: string | null;
    isCurrentSaved: boolean;
    isGenerating: boolean;
    isChatOpen: boolean;
    useActual: boolean;
    contextData: any;
    isLoaded: boolean;
    activePrompt: string | null;
    logs: string[];
    addLog: (msg: string) => void;
    setContextData: (data: any) => void;
    setUseActual: (val: boolean) => void;
    setIsChatOpen: (val: boolean) => void;
    handleGenerate: (prompt: string, instructions?: string) => Promise<void>;
    saveSkin: (name: string) => Promise<void>;
    uploadSkin: (id: string) => Promise<void>;
    applySkin: (id: string | null) => void;
    confirmDeleteSkin: (id: string) => Promise<void>;
    setDefaultSkin: () => void;
    updateLiquidHtml: (html: string) => void;
}

export const LiquidContext = createContext<LiquidContextType | undefined>(undefined);