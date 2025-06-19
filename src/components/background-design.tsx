import React from 'react'

function BackgroundDesign() {
  return (
    <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {/* Main vibrant purple/pink orb */}
        <div className="absolute top-0 left-1/4 w-[45rem] h-[45rem] rounded-full blur-3xl opacity-50 animate-pulse-slow"
             style={{background: "radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(192, 38, 211, 0.4) 40%, transparent 80%)", 
                    boxShadow: "0 0 120px 60px rgba(236, 72, 153, 0.1)"}}></div>
        
        {/* Bright blue/cyan floating orb */}
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-45 animate-float"
             style={{background: "radial-gradient(circle, rgba(6, 182, 212, 0.55) 0%, rgba(59, 130, 246, 0.35) 45%, transparent 85%)",
                    boxShadow: "0 0 100px 50px rgba(6, 182, 212, 0.08)"}}></div>
        
        {/* Vivid golden/orange corner accent */}
        <div className="absolute -top-28 -right-28 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-0"
             style={{background: "conic-gradient(from 0deg, rgba(251, 191, 36, 0.45), rgba(249, 115, 22, 0.35), rgba(244, 63, 94, 0.4), rgba(251, 191, 36, 0.45))",
                    boxShadow: "0 0 80px 40px rgba(251, 191, 36, 0.08)"}}></div>
        
        {/* Rich violet/magenta accent - replaced teal/emerald */}
        <div className="absolute -bottom-40 -left-20 w-[50rem] h-[50rem] rounded-full blur-3xl opacity-40 animate-float-delayed"
             style={{background: "radial-gradient(circle, rgba(167, 139, 250, 0.55) 0%, rgba(139, 92, 246, 0.35) 40%, transparent 80%)",
                    boxShadow: "0 0 100px 50px rgba(167, 139, 250, 0.08)"}}></div>
        
        {/* Bright amber/orange mid element */}
        <div className="absolute top-1/3 right-1/3 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-45 animate-pulse"
             style={{background: "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 80%)",
                    boxShadow: "0 0 60px 30px rgba(251, 191, 36, 0.06)"}}></div>
        
        {/* Electric indigo accent */}
        <div className="absolute bottom-1/3 left-1/4 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-50 animate-float-slow"
             style={{background: "radial-gradient(circle, rgba(129, 140, 248, 0.45) 0%, rgba(99, 102, 241, 0.3) 50%, transparent 85%)",
                    boxShadow: "0 0 70px 35px rgba(129, 140, 248, 0.07)"}}></div>
        
        {/* Vivid rose/red small accent */}
        <div className="absolute top-2/3 right-1/5 w-[18rem] h-[18rem] rounded-full blur-3xl opacity-45 animate-pulse-soft"
             style={{background: "radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(225, 29, 72, 0.3) 50%, transparent 80%)",
                    boxShadow: "0 0 50px 25px rgba(244, 63, 94, 0.08)"}}></div>
        
        {/* Deep purple accent */}
        <div className="absolute top-1/5 right-2/3 w-[22rem] h-[22rem] rounded-full blur-3xl opacity-40 animate-float"
             style={{background: "radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(124, 58, 237, 0.25) 50%, transparent 85%)",
                    boxShadow: "0 0 60px 30px rgba(139, 92, 246, 0.07)"}}></div>
        
        {/* Enhanced light streaks */}
        <div className="absolute top-1/2 left-0 w-[40rem] h-[3rem] rotate-[20deg] blur-2xl opacity-25"
             style={{background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)"}}></div>
        
        <div className="absolute bottom-1/3 right-0 w-[35rem] h-[2.5rem] -rotate-[15deg] blur-2xl opacity-25"
             style={{background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 50%, transparent 100%)"}}></div>
             
        {/* Subtle cross-light */}
        <div className="absolute top-2/3 left-1/2 w-full h-[1.5rem] -rotate-[75deg] blur-2xl opacity-20"
             style={{background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)"}}></div>
      </div>
  )
}

export default BackgroundDesign