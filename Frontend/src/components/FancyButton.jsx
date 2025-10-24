import React from "react";

const StartAssistant = ({ onClick }) => {
return ( <div className="flex items-center justify-center z-50"> <div className="text-center"> <h2 className="text-white text-2xl font-semibold mb-3 tracking-wide">
Click to start assistant 👋 </h2> <p className="text-gray-400 text-sm mb-8">
Allow your browser to use speech for the best experience. </p>


    <button
      onClick={onClick}
      className="relative group overflow-hidden px-12 py-4 rounded-full text-lg font-semibold text-white/90 tracking-wide backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-700 hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:text-white"
    >
      <span className="relative z-10 transition-all duration-700 group-hover:tracking-wider group-hover:opacity-90">
        Start Assistant
      </span>

      {/* Shine swipe effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-[1200ms] ease-out"></div>

      {/* Inner glow reflection */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-10 group-hover:opacity-40 blur-xl transition-all duration-700"></div>

      {/* Outer aura glow */}
      <div className="absolute -inset-1 rounded-full bg-white/10 blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-700"></div>
    </button>
  </div>
</div>


);
};

export default StartAssistant;
