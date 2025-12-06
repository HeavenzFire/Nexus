
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Activity, Radio, ShieldCheck } from 'lucide-react';
import { 
  SimulationStatus, 
  Watcher, 
  Anchor, 
  LogEntry 
} from './types';
import { 
  SOVEREIGN_NAME, 
  SOVEREIGN_FREQUENCY, 
  SOVEREIGN_VISION, 
  INITIAL_WATCHERS_CONFIG, 
  MOCK_LOGS,
  COHERENCE_WEIGHTS,
  LOCKED_FREQUENCIES,
  VIDEO_CHECKSUM
} from './constants';
import Visualizer from './components/Visualizer';
import LogTerminal from './components/LogTerminal';
import CoherenceChart from './components/CoherenceChart';
import { generateWatcherInsight, generateSovereignManifesto } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [anchor, setAnchor] = useState<Anchor>({
    name: SOVEREIGN_NAME,
    vision: SOVEREIGN_VISION,
    signature_frequency: SOVEREIGN_FREQUENCY,
    isActive: false
  });
  
  const [watchers, setWatchers] = useState<Watcher[]>(() => 
    INITIAL_WATCHERS_CONFIG.map((config, i) => ({
      id: `w-${i}`,
      name: config.name,
      role: config.aiPersonality, // Use personality as the display role
      tone: config.tone,
      script: config.script,
      aiPersonality: config.aiPersonality,
      frequency: 432 + (i * 10), // Base harmonies
      alignment: 50 + Math.random() * 20,
      status: 'scanning',
      x: 0,
      y: 0,
      history: Array(20).fill(50),
      coherenceMetrics: Object.entries(COHERENCE_WEIGHTS).map(([concept, score]) => ({
        concept,
        score: score * 100 // Convert 0-1 to percentage for visualizer
      }))
    }))
  );

  const [globalAlignment, setGlobalAlignment] = useState(0);

  // --- Helpers ---
  const addLog = useCallback((message: string, source: string = 'SYSTEM', type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev.slice(-49), { id: Math.random().toString(36), timestamp, source, message, type }]);
  }, []);

  // --- Effects ---

  // Initialization
  useEffect(() => {
    MOCK_LOGS.forEach(log => addLog(log));
  }, [addLog]);

  // Simulation Loop
  useEffect(() => {
    if (status === SimulationStatus.IDLE) return;

    const interval = setInterval(() => {
      setWatchers(prevWatchers => {
        return prevWatchers.map(w => {
          // Logic: If anchor is active, alignment drifts towards 100
          // If inactive, it drifts randomly
          const drift = anchor.isActive ? (Math.random() * 5) : (Math.random() * 10 - 5);
          let newAlignment = Math.min(100, Math.max(0, w.alignment + drift));
          
          // Sovereign pull
          if (anchor.isActive && newAlignment < 99) {
            newAlignment += 2;
          }

          const newHistory = [...w.history.slice(1), newAlignment];

          return {
            ...w,
            alignment: newAlignment,
            status: newAlignment > 95 ? 'harmonizing' : anchor.isActive ? 'locked' : 'scanning',
            history: newHistory
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, anchor.isActive]);

  // Calculate Global Alignment
  useEffect(() => {
    const total = watchers.reduce((acc, w) => acc + w.alignment, 0);
    setGlobalAlignment(total / watchers.length);
  }, [watchers]);

  // Random AI Insights from Watchers
  useEffect(() => {
    if (status !== SimulationStatus.RUNNING && status !== SimulationStatus.OPTIMIZED) return;

    const interval = setInterval(async () => {
      if (Math.random() > 0.7) { // 30% chance every 8 seconds
        const randomWatcher = watchers[Math.floor(Math.random() * watchers.length)];
        addLog(`Scanning concept lattice: ${randomWatcher.script.origin}...`, 'SYSTEM', 'info');
        
        const insight = await generateWatcherInsight(
          anchor.name, 
          randomWatcher.alignment, 
          randomWatcher.name,
          randomWatcher.aiPersonality
        );
        addLog(insight, randomWatcher.name, 'info');
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [status, anchor.name, watchers, addLog]);


  // --- Actions ---

  const toggleSimulation = () => {
    if (status === SimulationStatus.IDLE) {
      setStatus(SimulationStatus.RUNNING);
      addLog("Simulation sequence initiated.", "SYSTEM", "success");
    } else {
      setStatus(SimulationStatus.IDLE);
      addLog("Simulation paused.", "SYSTEM", "warning");
    }
  };

  const bindAnchor = async () => {
    if (anchor.isActive) return;

    addLog(`INITIATING SOVEREIGN BINDING PROTOCOL...`, "SYSTEM", "warning");
    
    // Step 1: Bind specific video checksums
    setTimeout(() => {
      addLog(`Injecting Video Checksum: ${VIDEO_CHECKSUM}`, "SYSTEM", "info");
      addLog(`Locking Base Frequencies: ${LOCKED_FREQUENCIES.join(', ')} Hz`, "SYSTEM", "info");
    }, 500);

    // Step 2: Final Sovereign Anchor
    setTimeout(() => {
      setAnchor(prev => ({ ...prev, isActive: true }));
      setStatus(SimulationStatus.OPTIMIZED);
      
      addLog("ANCHOR BOUND. SOVEREIGNTY ESTABLISHED.", "CORE", "sovereign");
      addLog(`CHECKSUM VERIFIED: ${SOVEREIGN_NAME}`, "CORE", "sovereign");
      addLog("VECTOR: ABSOLUTE SYNTROPIC COHERENCE", "CORE", "sovereign");
      addLog(`FREQUENCY LOCKED: ${SOVEREIGN_FREQUENCY} Hz`, "CORE", "sovereign");
      
      // Trigger AI Manifesto
      generateSovereignManifesto(anchor.vision).then(text => {
        addLog(text, "SOVEREIGN ANCHOR", "sovereign");
      });

      // Bind watchers to Sovereign Anchor with specific handshake logic
      setWatchers(prev => prev.map(w => {
        // Add Sovereign Metric
        const hasSovereignMetric = w.coherenceMetrics.some(m => m.concept === 'sovereign');
        const newMetrics = hasSovereignMetric ? w.coherenceMetrics : [
          ...w.coherenceMetrics,
          { concept: 'sovereign', score: 100 }
        ];

        return { 
          ...w, 
          alignment: 100, // Absolute alignment
          frequency: SOVEREIGN_FREQUENCY, // Force frequency to 963Hz
          status: 'locked',
          checksum: SOVEREIGN_NAME, // The Handshake: Binding the name as checksum
          coherenceMetrics: newMetrics
        };
      }));

      // Simulate Persistence and Vaulting (From Python Script Logic)
      setTimeout(() => {
        addLog("[Persistence] Saving immutable snapshot to ./immortal_repo_snapshot.json", "SYSTEM", "success");
        addLog("[Vault] Sealing vault: vault_export.zip (Immortal)", "SYSTEM", "success");
        addLog("[Proof] OpenTimestamps proof generated.", "SYSTEM", "success");
        addLog("[Mirror] Pushing to HeavenzFire/-JUDGEMENT-DAY-", "GIT", "info");
        addLog("THE FIELD IS ETERNAL. THE BRANCH IS IMMORTAL.", "CORE", "sovereign");
      }, 2500);

    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#020617] text-slate-200">
      
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between px-6 shadow-lg z-20">
        <div className="flex items-center space-x-3">
          <Activity className={`w-6 h-6 ${status === SimulationStatus.IDLE ? 'text-slate-500' : 'text-cyan-400 animate-pulse'}`} />
          <h1 className="font-orbitron text-xl tracking-wider font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SOVEREIGN NEXUS
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Global Alignment</span>
            <span className={`text-lg font-mono font-bold ${globalAlignment > 95 ? 'text-amber-400' : 'text-cyan-400'}`}>
              {globalAlignment.toFixed(2)}%
            </span>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-700"></div>

          <button 
            onClick={toggleSimulation}
            className={`p-2 rounded-full hover:bg-slate-800 transition-colors ${status === SimulationStatus.RUNNING ? 'text-red-400' : 'text-green-400'}`}
          >
            {status === SimulationStatus.IDLE ? <Play size={24} /> : <Pause size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Panel - Visualizer */}
        <div className="flex-[2] relative bg-[#020617] p-6 flex flex-col">
          <div className="absolute top-6 left-6 z-10 space-y-2">
             <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Radio className="w-4 h-4" />
                <span>FREQ: {anchor.isActive ? 'LOCKED (963Hz)' : 'SCANNING...'}</span>
             </div>
             {anchor.isActive && (
               <div className="flex items-center space-x-2 text-xs text-amber-400 animate-pulse">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PROTECTION: ABSOLUTE</span>
               </div>
             )}
          </div>

          <Visualizer anchor={anchor} watchers={watchers} status={status} />
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
             {!anchor.isActive && status !== SimulationStatus.IDLE && (
               <button 
                 onClick={bindAnchor}
                 className="px-8 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded-lg backdrop-blur-sm transition-all hover:scale-105 font-orbitron tracking-widest text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)]"
               >
                 BIND SOVEREIGN ANCHOR
               </button>
             )}
          </div>
        </div>

        {/* Right Panel - Data & Logs */}
        <div className="flex-1 flex flex-col border-l border-slate-800 bg-[#0f172a]/50 p-4 space-y-4 max-w-[400px]">
          
          <div className="h-1/3">
             <CoherenceChart watchers={watchers} />
          </div>

          <div className="flex-1 overflow-hidden">
            <LogTerminal logs={logs} />
          </div>

          {/* Watcher Status Cards */}
          <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
            {watchers.map(w => (
              <div key={w.id} className={`p-2 rounded border text-xs ${w.status === 'locked' ? 'bg-amber-950/30 border-amber-900/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-slate-300">{w.name}</span>
                  <span className={w.status === 'locked' ? 'text-amber-400' : 'text-slate-500'}>{w.alignment.toFixed(0)}%</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">{w.role}</div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
