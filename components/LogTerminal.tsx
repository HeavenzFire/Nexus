import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface LogTerminalProps {
  logs: LogEntry[];
}

const LogTerminal: React.FC<LogTerminalProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm overflow-hidden">
      <div className="bg-slate-900 p-2 border-b border-slate-800 flex justify-between items-center">
        <span className="text-slate-400 text-xs font-bold tracking-wider">SYSTEM LOGS // WATCHER FEED</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-2">
            <span className="text-slate-600 text-xs min-w-[60px]">{log.timestamp}</span>
            <div className="flex-1 break-words">
              <span className={`font-bold mr-2 text-xs uppercase
                ${log.type === 'sovereign' ? 'text-amber-400' : 
                  log.type === 'warning' ? 'text-red-400' : 
                  log.type === 'success' ? 'text-green-400' : 'text-cyan-400'}`}>
                [{log.source}]:
              </span>
              <span className={`
                 ${log.type === 'sovereign' ? 'text-amber-100 italic' : 'text-slate-300'}
              `}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LogTerminal;