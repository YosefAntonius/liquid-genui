import { ReactNode } from "react";
import { useLiquid } from "./LiquidProvider";
import { motion } from "framer-motion";

export function LiquidLayout({ header, footer, children }: { header: boolean; footer: boolean; children: ReactNode }) {
    const { isChatOpen, isGenerating } = useLiquid();

    if (!header && !footer) return <>{children}</>;

    return (
        <div className="w-full h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
            {header && (
                <motion.nav
                    initial={false}
                    animate={{
                        height: isChatOpen ? "5rem" : 0,
                        opacity: isChatOpen ? 1 : 0,
                        borderBottomWidth: isChatOpen ? 1 : 0,
                    }}
                    className="border-white/10 flex items-center justify-between px-10 flex-shrink-0 overflow-hidden"
                >
                    <div className="flex items-center gap-4">
                        <div className="group w-12 h-12 p-[1.5px] bg-gradient-to-tr from-blue-600 via-purple-500 to-cyan-400 rounded-full transition-transform duration-500 hover:scale-110">
                            <div className="w-full h-full bg-white hover:cursor-pointer hover:bg-black rounded-full flex items-center justify-center overflow-hidden">

                                <div className="relative w-5 h-5 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-[135deg]">
                                    <div className="absolute inset-0 bg-[#0a0a0a] 
                  rounded-[30%] rotate-45
                  group-hover:rounded-[10%] group-hover:bg-white
                  transition-all duration-700 ease-in-out"
                                    ></div>

                                    {/* Capa secundaria para forzar el look de octágono (opcional para más detalle) */}
                                    <div className="absolute inset-0 bg-white rounded-[10%] rotate-0 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                                </div>

                            </div>
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
                            GEN<span className="bg-gradient-to-tr from-blue-600 via-purple-500 to-cyan-400 bg-clip-text text-transparent font-stong">
                                UI
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">
                                Engine Status
                            </span>
                            <span className="text-xs font-mono text-emerald-400 whitespace-nowrap">
                                v0.4.2-STABLE
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center overflow-hidden bg-white/5 flex-shrink-0">
                            <div className="w-6 h-6 border-2 border-white/40 rounded-full"></div>
                        </div>
                    </div>
                </motion.nav>
            )}

            <div className="flex flex-1 min-h-0 bg-[radial-gradient(circle_at_top_right,_#1a1a1a_0%,_#0a0a0a_70%)] relative">
                {children}
            </div>

            {footer && (
                <motion.footer
                    initial={false}
                    animate={{
                        height: isChatOpen ? "3rem" : 0,
                        opacity: isChatOpen ? 1 : 0,
                        borderTopWidth: isChatOpen ? 1 : 0,
                    }}
                    className="border-white/10 px-10 flex items-center justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest bg-black flex-shrink-0 overflow-hidden"
                >
                    <div className="flex gap-6 whitespace-nowrap">
                        <span>Session ID: {isGenerating ? "GENERATING..." : "45A-88Z"}</span>
                        <span>Latency: 12ms</span>
                    </div>
                    <div className="flex gap-6 items-center whitespace-nowrap">
                        <div className="flex gap-2 items-center">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
                            <span>SQLite Local Engine Active</span>
                        </div>
                    </div>
                </motion.footer>
            )}
        </div>
    );
}