import React, { useState } from 'react';
import { Ministry, InternalCollision } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Building2, GitMerge, AlertCircle, Users, ChevronDown, ChevronUp, Briefcase, Activity, Clock, FileText } from 'lucide-react';

interface MicroViewProps {
  ministry: Ministry;
  onBack: () => void;
}

export default function MicroView({ ministry, onBack }: MicroViewProps) {
  const [selectedCollision, setSelectedCollision] = useState<InternalCollision | null>(null);
  const [expandedDep, setExpandedDep] = useState<string | null>(null);

  // Group collisions by type
  const groupedCollisions = ministry.internalCollisions.reduce((acc, col) => {
    const sourceDep = ministry.departments.find(d => d.id === col.source);
    const targetDep = ministry.departments.find(d => d.id === col.target);
    
    if (!sourceDep || !targetDep) return acc;

    let groupKey = 'Смешанные';
    if (sourceDep.type === 'committee' && targetDep.type === 'committee') groupKey = 'Комитет ↔ Комитет';
    else if (sourceDep.type === 'department' && targetDep.type === 'department') groupKey = 'Департамент ↔ Департамент';
    else if (sourceDep.type === 'division' && targetDep.type === 'division') groupKey = 'Управление ↔ Управление';

    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(col);
    return acc;
  }, {} as Record<string, InternalCollision[]>);

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'committee': return 'Комитет';
      case 'department': return 'Департамент';
      case 'division': return 'Управление';
      default: return '';
    }
  };

  const getWorkloadColor = (index: number) => {
    if (index < 100) return 'text-green-600 bg-green-100 border-green-200';
    if (index <= 120) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getWorkloadBarColor = (index: number) => {
    if (index < 100) return 'bg-green-500';
    if (index <= 120) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      {/* Breadcrumb & Header */}
      <div className="flex items-start gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600 mt-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <div className="text-sm text-slate-500 mb-1">Макро-уровень / {ministry.shortName}</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{ministry.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                <Users className="w-4 h-4" /> Штатная численность
              </div>
              <div className="text-2xl font-bold text-slate-800">{ministry.staffCount.toLocaleString('ru-RU')} <span className="text-sm font-normal text-slate-500">чел.</span></div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                <Activity className="w-4 h-4" /> Индекс нагрузки
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-slate-800">{ministry.workload.index}%</div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full border mb-1 ${getWorkloadColor(ministry.workload.index)}`}>
                  {ministry.workload.index > 120 ? 'Перегруз' : ministry.workload.index >= 100 ? 'Повышенная' : 'Норма'}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                <Clock className="w-4 h-4" /> СКУД (ср. время)
              </div>
              <div className="text-2xl font-bold text-slate-800">{ministry.workload.avgHours} <span className="text-sm font-normal text-slate-500">часов/день</span></div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-1">
                <FileText className="w-4 h-4" /> Функций на 1 чел.
              </div>
              <div className="text-2xl font-bold text-slate-800">{ministry.workload.functionsPerEmployee} <span className="text-sm font-normal text-slate-500">функций</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Departments List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-slate-500" />
            Внутренняя структура и функции
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {ministry.departments.map(dep => {
              const isColliding = ministry.internalCollisions.some(
                c => c.source === dep.id || c.target === dep.id
              );
              const isSelectedCollisionTarget = selectedCollision && 
                (selectedCollision.source === dep.id || selectedCollision.target === dep.id);
              const isExpanded = expandedDep === dep.id;

              return (
                <motion.div
                  key={dep.id}
                  layout
                  className={`
                    rounded-xl border-2 transition-all duration-300 bg-white overflow-hidden
                    ${isSelectedCollisionTarget ? 'border-orange-500 shadow-md bg-orange-50/30' : 'border-slate-200 hover:border-blue-300'}
                    ${!isSelectedCollisionTarget && selectedCollision ? 'opacity-50 grayscale' : ''}
                  `}
                >
                  <div 
                    className="p-5 cursor-pointer flex justify-between items-start"
                    onClick={() => setExpandedDep(isExpanded ? null : dep.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase tracking-wider">
                          {getTypeLabel(dep.type)}
                        </span>
                        {isColliding && (
                          <span className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            <AlertCircle className="w-3 h-3" />
                            Есть дублирования
                          </span>
                        )}
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded border ${getWorkloadColor(dep.workload.index)}`}>
                          <Activity className="w-3 h-3" />
                          Нагрузка: {dep.workload.index}%
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-lg leading-snug">{dep.name}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 mt-2">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Users className="w-4 h-4" />
                        <span>{dep.staffCount} чел.</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50">
                          
                          {/* Workload Detailed Stats */}
                          <div className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg border border-slate-200">
                            <div>
                              <div className="text-xs text-slate-500 font-medium mb-1">СКУД (ср. время на работе)</div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span className="font-bold text-slate-800">{dep.workload.avgHours} часов</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 font-medium mb-1">Функций на 1 сотрудника</div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="font-bold text-slate-800">{dep.workload.functionsPerEmployee}</span>
                              </div>
                            </div>
                            <div className="col-span-2 mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500 font-medium">Индекс нагрузки</span>
                                <span className="font-bold text-slate-700">{dep.workload.index}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getWorkloadBarColor(dep.workload.index)}`} 
                                  style={{ width: `${Math.min(dep.workload.index, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            Закрепленные функции:
                          </h5>
                          <ul className="space-y-2">
                            {dep.functions.map((func, idx) => (
                              <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                <span>{func}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Internal Collisions Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[700px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-orange-500" />
              Внутренние дублирования
            </h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1 space-y-6">
            {ministry.internalCollisions.length === 0 ? (
              <div className="text-center text-slate-500 py-8">
                <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>Внутренних дублирований функций не выявлено</p>
              </div>
            ) : (
              Object.entries(groupedCollisions).map(([groupName, cols]) => (
                <div key={groupName} className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                    {groupName}
                  </h4>
                  {cols.map(col => {
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
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
