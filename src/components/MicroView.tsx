import React, { useState } from 'react';
import { Ministry, InternalCollision } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Building2, GitMerge, AlertCircle } from 'lucide-react';

interface MicroViewProps {
  ministry: Ministry;
  onBack: () => void;
}

export default function MicroView({ ministry, onBack }: MicroViewProps) {
  const [selectedCollision, setSelectedCollision] = useState<InternalCollision | null>(null);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <div className="text-sm text-slate-500 mb-1">Макро-уровень / {ministry.shortName}</div>
          <h2 className="text-2xl font-bold text-slate-900">{ministry.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Departments List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-slate-500" />
            Внутренняя структура
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ministry.departments.map(dep => {
              const isColliding = ministry.internalCollisions.some(
                c => c.source === dep.id || c.target === dep.id
              );
              const isSelectedCollisionTarget = selectedCollision && 
                (selectedCollision.source === dep.id || selectedCollision.target === dep.id);

              return (
                <motion.div
                  key={dep.id}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    p-5 rounded-xl border-2 transition-all duration-300 bg-white
                    ${isSelectedCollisionTarget ? 'border-orange-500 shadow-md bg-orange-50/30' : 'border-slate-200'}
                    ${!isSelectedCollisionTarget && selectedCollision ? 'opacity-50 grayscale' : ''}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-slate-800 leading-snug">{dep.name}</h4>
                    {isColliding && (
                      <AlertCircle className={`w-5 h-5 shrink-0 ${isSelectedCollisionTarget ? 'text-orange-500' : 'text-slate-400'}`} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Internal Collisions Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-orange-500" />
              Внутренние дублирования
            </h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-3">
            {ministry.internalCollisions.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>Внутренних дублирований функций не выявлено</p>
              </div>
            ) : (
              ministry.internalCollisions.map(col => {
                const sourceDep = ministry.departments.find(d => d.id === col.source);
                const targetDep = ministry.departments.find(d => d.id === col.target);
                const isSelected = selectedCollision?.id === col.id;

                return (
                  <div 
                    key={col.id}
                    onClick={() => setSelectedCollision(isSelected ? null : col)}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all duration-200
                      ${isSelected ? 'ring-2 ring-orange-500 border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'}
                    `}
                  >
                    <div className="flex flex-col gap-2 text-sm font-medium text-slate-700 mb-3">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                        <span>{sourceDep?.name}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                        <span>{targetDep?.name}</span>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-slate-600 mt-2 pt-2 border-t border-orange-200/50">
                            {col.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
