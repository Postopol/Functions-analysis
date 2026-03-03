import React, { useState } from 'react';
import { GovData, Ministry, ExternalCollision } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ArrowRight, Building, Network } from 'lucide-react';

interface MacroViewProps {
  data: GovData;
  onSelectMinistry: (ministry: Ministry) => void;
}

export default function MacroView({ data, onSelectMinistry }: MacroViewProps) {
  const [hoveredMinistry, setHoveredMinistry] = useState<string | null>(null);
  const [selectedCollision, setSelectedCollision] = useState<ExternalCollision | null>(null);

  const getConnectedMinistries = (minId: string) => {
    const connected = new Set<string>();
    data.externalCollisions.forEach(c => {
      if (c.source === minId) connected.add(c.target);
      if (c.target === minId) connected.add(c.source);
    });
    return connected;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Network className="w-5 h-5 text-slate-500" />
          Макро-уровень: Взаимодействие ведомств
        </h2>
        <div className="text-sm text-slate-500">
          Выберите ведомство для детализации
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ministries Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.ministries.map(min => {
            const isHovered = hoveredMinistry === min.id;
            const isConnected = hoveredMinistry && getConnectedMinistries(hoveredMinistry).has(min.id);
            const isDimmed = hoveredMinistry && !isHovered && !isConnected;

            return (
              <motion.div
                key={min.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredMinistry(min.id)}
                onMouseLeave={() => setHoveredMinistry(null)}
                onClick={() => onSelectMinistry(min)}
                className={`
                  relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                  ${isDimmed ? 'opacity-40 grayscale' : 'opacity-100'}
                  ${isHovered ? 'border-blue-500 shadow-lg bg-white' : 'border-slate-200 bg-white shadow-sm hover:border-blue-300'}
                  ${isConnected ? 'border-red-400 shadow-md bg-red-50/30' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {min.shortName}
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 leading-tight mb-2">{min.name}</h3>
                <p className="text-sm text-slate-500">
                  Подразделений: {min.departments.length}
                </p>
                
                {/* Collision Indicators */}
                {data.externalCollisions.some(c => c.source === min.id || c.target === min.id) && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Collisions Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Выявленные коллизии
            </h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {data.externalCollisions.map(col => {
              const sourceMin = data.ministries.find(m => m.id === col.source);
              const targetMin = data.ministries.find(m => m.id === col.target);
              const isHighlighted = hoveredMinistry === col.source || hoveredMinistry === col.target;
              const isSelected = selectedCollision?.id === col.id;

              return (
                <div 
                  key={col.id}
                  onClick={() => setSelectedCollision(isSelected ? null : col)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all duration-200
                    ${isHighlighted ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-red-300 hover:bg-slate-50'}
                    ${isSelected ? 'ring-2 ring-red-500 border-red-500 bg-red-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">{col.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                    <span className="truncate">{sourceMin?.shortName}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{targetMin?.shortName}</span>
                  </div>
                  
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-slate-600 mt-2 pt-2 border-t border-red-200/50">
                          {col.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
