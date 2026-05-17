import { CategoryLibraries } from "./safeLibraries";

export interface LiquidServerConfig {
    service: "google" | "openai" | "anthropic" | "grok" | "xai" | "deepseek" | "mistral" | "nvidia";
    model: string;
    safeLibraries?: CategoryLibraries[];
    addSafeLibraries?: CategoryLibraries[];
}