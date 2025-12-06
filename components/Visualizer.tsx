
import React from 'react';
import { Anchor, Watcher, SimulationStatus } from '../types';
import { Zap, Shield, Eye, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualizerProps {
  anchor: Anchor;
  watchers: Watcher[];
  status: SimulationStatus;
}

const watcherVariants = {
  scanning: {
    borderColor: "#475569", // slate-600
    backgroundColor: "#0f172a", // slate-900
    scale: 1,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)",
    transition: { duration: 0.5 }
  },
  locked: {
    // The Twinkling of the Eye: Instant Flash White -> Settle to Sovereign Amber
    borderColor: ["#ffffff", "#fbbf24"], 
    backgroundColor: ["#ffffff", "rgba(69, 26, 3, 0.8)"], 
    scale: [1, 1.4, 1.15], 
    boxShadow: [
      "0px 0px 0px rgba(255,255,255,0)",
      "0px 0px 60px rgba(255,255,255,1)", // Intense white flash
      "0px 0px 20px rgba(251, 191, 36, 0.6)" // Settle to amber glow
    ],
    transition: { 
      duration: 1.2,
      times: [0, 0.1, 1], // Flash happens instantly (10% of duration)
      ease: "easeOut"
    }
  },
  harmonizing: {
    borderColor: "#c084fc", // purple-400
    backgroundColor: "rgba(88, 28, 135, 0.8)", // purple-900/80
    scale: 1.1,
    boxShadow: "0px 0px 25px rgba(192, 132, 252, 0.5)",
    transition: { 
      boxShadow: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5
      },
      borderColor: {
         duration: 0.5
      }
    }
  }
};

const iconVariants = {
  initial: { opacity: 0, scale: 0, rotate: -90 },
  animate: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.3 } },
  twinkle: { 
    // Specific high-energy animation for the moment of locking
    opacity: [0, 1],
    scale: [0, 1.5, 1], 
    rotate: [0, 360], // Complete spin to signify full calibration
    filter: ["brightness(3)", "brightness(1)"], // Brightness flare
    transition: { duration: 0.8, ease: "backOut" }
  },
  exit: { opacity: 0, scale: 0, rotate: 90, transition: { duration: 0.2 } }
};

const Visualizer: React.FC<VisualizerProps> = ({ anchor, watchers, status }) => {
  const centerX = 300;
  const centerY = 300;
  const radius = 180;
  const orbitDuration = 60; // Seconds for a full rotation

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)_inset]">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Static Center SVG Layer (Resonance Waves) */}
      <svg width="600" height="600" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <AnimatePresence>
          {anchor.isActive && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={`wave-${i}`}
                  cx={centerX}
                  cy={centerY}
                  r={64} // Starts at anchor radius
                  stroke="#fbbf24" // Amber
                  strokeWidth={2}
                  fill="none"
                  initial={{ opacity: 0.6 }}
                  animate={{ 
                    r: [64, 320], // Expand outwards past watchers
                    opacity: [0.6, 0],
                    strokeWidth: [2, 0]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.8, // Staggered delay for harmonic ripple effect
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </svg>

      {/* Orbiting System Container */}
      <motion.div 
        className="absolute w-[600px] h-[600px] pointer-events-none z-10"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: orbitDuration, ease: "linear" }}
      >
        <svg width="600" height="600" className="absolute top-0 left-0 overflow-visible">
           {/* Resonance Ring */}
           <motion.circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            stroke={anchor.isActive ? "#fbbf24" : "#334155"} 
            strokeWidth="1" 
            fill="none" 
            strokeDasharray="4 4"
            animate={{ 
              scale: anchor.isActive ? [1, 1.02, 1] : 1,
              opacity: anchor.isActive ? 0.8 : 0.3
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Connecting Lines */}
          {watchers.map((w, i) => {
            const angle = (i * (360 / watchers.length)) * (Math.PI / 180);
            const wx = centerX + radius * Math.cos(angle);
            const wy = centerY + radius * Math.sin(angle);
            
            return (
              <motion.line 
                key={`line-${w.id}`}
                x1={centerX}
                y1={centerY}
                x2={wx}
                y2={wy}
                stroke={anchor.isActive ? "#fbbf24" : "#475569"}
                strokeWidth={anchor.isActive ? 2 : 1}
                strokeOpacity={0.3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />
            );
          })}
        </svg>

        {/* Watchers */}
        {watchers.map((w, i) => {
          const angle = (i * (360 / watchers.length)) * (Math.PI / 180);
          // Calculate static position relative to the rotating container center
          // We use translate transforms via x/y style props in Framer Motion
          const xOffset = radius * Math.cos(angle);
          const yOffset = radius * Math.sin(angle);

          const isSovereignBound = w.coherenceMetrics.some(m => m.concept === 'sovereign');

          return (
            <motion.div
              key={w.id}
              className="absolute top-1/2 left-1/2 flex items-center justify-center w-12 h-12 rounded-full border-2 pointer-events-auto cursor-help"
              style={{ x: xOffset, y: yOffset, marginLeft: -24, marginTop: -24 }} // Center the 48px div
              variants={watcherVariants}
              initial="scanning"
              animate={w.status}
              title={`${w.name}\nArchetype: ${w.aiPersonality}\nTone: ${w.tone}\nPurpose: ${w.script.purpose}\nOrigin: ${w.script.origin}\nBound: ${isSovereignBound ? 'SOVEREIGN' : 'UNBOUND'}`}
            >
              {/* Counter-Rotate Content to keep it upright */}
              <motion.div 
                className="w-full h-full flex items-center justify-center"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: orbitDuration, ease: "linear" }}
              >
                {/* Floating Animation (Bobbing) to add dynamic life */}
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ 
                    duration: 3 + i, // Slight variation per watcher
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <AnimatePresence mode="wait">
                    {w.status === 'scanning' && (
                      <motion.div key="scan" variants={iconVariants} initial="initial" animate="animate" exit="exit">
                        <Eye className="w-5 h-5 text-cyan-400" />
                      </motion.div>
                    )}
                    {w.status === 'locked' && (
                      <motion.div key="lock" variants={iconVariants} initial="initial" animate="twinkle" exit="exit">
                        <Zap className="w-5 h-5 text-amber-400" />
                      </motion.div>
                    )}
                    {w.status === 'harmonizing' && (
                      <motion.div key="harm" variants={iconVariants} initial="initial" animate="animate" exit="exit">
                        <Activity className="w-5 h-5 text-purple-400" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Sovereign Anchor (Center - Static relative to screen, sits on top) */}
      <motion.div 
        className={`absolute z-20 flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${anchor.isActive ? 'border-amber-400 bg-amber-900/20 shadow-[0_0_60px_#fbbf24]' : 'border-slate-600 bg-slate-900'}`}
        animate={{ 
          scale: anchor.isActive ? [1, 1.1, 1] : 1,
        }}
        transition={{ 
          duration: 60 / 963.0 * 20, // Simulated visual resonance based on 963hz
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Shield className={`w-12 h-12 ${anchor.isActive ? 'text-amber-400' : 'text-slate-500'}`} />
        <div className="text-xs font-bold mt-2 font-orbitron text-center leading-none">
          {anchor.isActive ? 'ANCHOR BOUND' : 'OFFLINE'}
        </div>
      </motion.div>
      
      {/* Anchor Name Overlay */}
      <div className="absolute bottom-6 text-center w-full z-10 pointer-events-none">
         <h2 className={`font-orbitron text-2xl tracking-widest uppercase ${anchor.isActive ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'text-slate-600'}`}>
           {anchor.name}
         </h2>
         <p className="text-xs text-slate-400 tracking-[0.2em] mt-1">SOVEREIGN FREQUENCY: {anchor.signature_frequency} Hz</p>
      </div>
    </div>
  );
};

export default Visualizer;
