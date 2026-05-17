

export function LiquidGenUILogo({ width = 12, height = 12, widthInner = 5, heightInner = 5 }: { width?: number, height?: number, widthInner?: number, heightInner?: number }) {
    return (<div className={`group w-${width} h-${height} p-[1.5px] bg-gradient-to-tr from-blue-600 via-purple-500 to-cyan-400 rounded-full transition-transform duration-500 hover:scale-110`}>
        <div className="w-full h-full bg-white hover:cursor-pointer hover:bg-black rounded-full flex items-center justify-center overflow-hidden">
            <div className={`relative w-${widthInner} h-${heightInner} flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-[135deg]`}>
                <div className="absolute inset-0 bg-[#0a0a0a] 
                  rounded-[30%] rotate-45
                  group-hover:rounded-[10%] group-hover:bg-white
                  transition-all duration-700 ease-in-out"
                ></div>
                <div className="absolute inset-0 bg-white rounded-[10%] rotate-0 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            </div>
        </div>
    </div>
    )
}