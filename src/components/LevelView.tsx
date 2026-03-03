import React, { useState, useMemo } from 'react';
import { GovData, CollisionLevel } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, AlertCircle, GitMerge } from 'lucide-react';

interface LevelViewProps {
  data: GovData;
}

interface UnifiedCollision {
  id: string;
  title: string;
  sourceMinName: string;
  sourceDepName: string;
  targetMinName: string;
  targetDepName: string;
  description: string;
  level: CollisionLevel;
  criticality: number;
  similarity: number;
}

export default function LevelView({ data }: LevelViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CollisionLevel | 'all'>('all');

  const allCollisions = useMemo(() => {
    const cols: UnifiedCollision[] = [];

    // External (Min-Min)
    data.externalCollisions.forEach(col => {
      const sMin = data.ministries.find(m => m.id === col.source);
      const tMin = data.ministries.find(m => m.id === col.target);
      if (sMin && tMin) {
        cols.push({
          id: col.id,
          title: col.title,
          sourceMinName: sMin.shortName,
          sourceDepName: sMin.name, // For MIN level, department is the ministry itself
          targetMinName: tMin.shortName,
          targetDepName: tMin.name,
          description: col.description,
          level: col.level,
          criticality: col.criticality,
          similarity: col.similarity
        });
      }
    });

    // Internal
    data.ministries.forEach(min => {
      min.internalCollisions.forEach(col => {
        const sDep = min.departments.find(d => d.id === col.source);
        const tDep = min.departments.find(d => d.id === col.target);
        if (sDep && tDep) {
          cols.push({
            id: col.id,
            title: col.title,
            sourceMinName: min.shortName,
            sourceDepName: sDep.name,
            targetMinName: min.shortName,
            targetDepName: tDep.name,
            description: col.description,
            level: col.level,
            criticality: col.criticality,
            similarity: col.similarity
          });
        }
      });
    });

    // Cross-Department
    data.crossDepartmentCollisions.forEach(col => {
      const sMin = data.ministries.find(m => m.id === col.sourceMinId);
      const tMin = data.ministries.find(m => m.id === col.targetMinId);
      const sDep = sMin?.departments.find(d => d.id === col.sourceDepId);
      const tDep = tMin?.departments.find(d => d.id === col.targetDepId);
      
      if (sMin && tMin && sDep && tDep) {
        cols.push({
          id: col.id,
          title: col.title,
          sourceMinName: sMin.shortName,
          sourceDepName: sDep.name,
          targetMinName: tMin.shortName,
          targetDepName: tDep.name,
          description: col.description,
          level: col.level,
          criticality: col.criticality,
          similarity: col.similarity
        });
      }
    });

    return cols;
  }, [data]);

  const filteredCollisions = useMemo(() => {
    if (activeTab === 'all') return allCollisions;
    return allCollisions.filter(c => c.level === activeTab);
  }, [allCollisions, activeTab]);

  const stats = useMemo(() => {
    return {
      total: allCollisions.length,
      crit5: allCollisions.filter(c => c.criticality === 5).length,
      fullDups: allCollisions.filter(c => c.similarity >= 90).length
    };
  }, [allCollisions]);

  const getLevelConfig = (level: CollisionLevel | 'all') => {
    switch(level) {
      case 'min': return { label: 'МИН', color: 'text-red-600', bg: 'bg-red-600', lightBg: 'bg-red-50', border: 'border-red-600', badge: 'bg-red-600 text-white' };
      case 'com': return { label: 'КОМ', color: 'text-orange-600', bg: 'bg-orange-600', lightBg: 'bg-orange-50', border: 'border-orange-600', badge: 'bg-orange-600 text-white' };
      case 'upr': return { label: 'УПР', color: 'text-amber-600', bg: 'bg-amber-600', lightBg: 'bg-amber-50', border: 'border-amber-600', badge: 'bg-amber-600 text-white' };
      case 'dep': return { label: 'ДЕП', color: 'text-green-600', bg: 'bg-green-600', lightBg: 'bg-green-50', border: 'border-green-600', badge: 'bg-green-600 text-white' };
      case 'mixed': return { label: 'СМЕШ', color: 'text-purple-600', bg: 'bg-purple-600', lightBg: 'bg-purple-50', border: 'border-purple-600', badge: 'bg-purple-600 text-white' };
      default: return { label: 'ВСЕ', color: 'text-slate-600', bg: 'bg-slate-600', lightBg: 'bg-slate-50', border: 'border-slate-600', badge: 'bg-slate-600 text-white' };
    }
  };

  const renderCriticality = (score: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i <= score ? 'bg-slate-800' : 'bg-slate-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-slate-500 text-sm font-medium mb-2">Критичность 5</div>
          <div className="font-mono text-4xl font-bold text-red-600">{stats.crit5}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-slate-500 text-sm font-medium mb-2">Полных дублирований (&gt;90%)</div>
          <div className="font-mono text-4xl font-bold text-slate-900">{stats.fullDups}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="text-slate-500 text-sm font-medium mb-2">Всего коллизий</div>
          <div className="font-mono text-4xl font-bold text-slate-900">{stats.total}</div>
        </div>
      </div>

      {/* Navigation / Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(['all', 'min', 'com', 'dep', 'upr'] as const).map(tab => {
          const config = getLevelConfig(tab);
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all duration-200 border-2 
                ${isActive ? `${config.bg} text-white border-transparent` : `bg-white text-slate-600 border-slate-200 hover:border-slate-300`}`}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Collisions List */}
      <div className="space-y-12">
        {(['min', 'com', 'dep', 'upr', 'mixed'] as const).map(level => {
          if (activeTab !== 'all' && activeTab !== level) return null;
          
          const cols = filteredCollisions.filter(c => c.level === level);
          if (cols.length === 0) return null;

          const config = getLevelConfig(level);
          const blockTitle = {
            'min': 'Коллизии уровня министерств',
            'com': 'Коллизии уровня комитетов',
            'dep': 'Коллизии уровня департаментов',
            'upr': 'Коллизии уровня управлений',
            'mixed': 'Смешанные уровни'
          }[level];

          return (
            <div key={level} className="space-y-4">
              <h3 className={`font-serif text-xl font-bold flex items-center gap-2 ${config.color} mb-6`}>
                <GitMerge className="w-6 h-6" />
                {blockTitle}
                <span className="font-mono text-sm font-medium text-slate-500 ml-2 bg-white border border-slate-200 shadow-sm px-3 py-1 rounded-full">
                  {cols.length}
                </span>
              </h3>
              
              <div className="space-y-4">
                {cols.map(col => {
                  const isExpanded = expandedId === col.id;

                  return (
                    <motion.div 
                      key={col.id}
                      layout
                      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200`}
                    >
                      {/* Collapsed View */}
                      <div 
                        className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center gap-4"
                        onClick={() => setExpandedId(isExpanded ? null : col.id)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`font-mono text-xs font-bold px-2.5 py-1 rounded ${config.badge} shrink-0`}>
                            {config.label}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-serif text-lg font-bold text-slate-900 leading-tight mb-1">{col.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-1">{col.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 shrink-0">
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Критичность</span>
                            {renderCriticality(col.criticality)}
                          </div>
                          <div className="flex flex-col items-end gap-1.5 w-24">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Сходство</span>
                            <div className="flex items-center gap-2 w-full">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${col.similarity >= 90 ? 'bg-red-500' : col.similarity >= 70 ? 'bg-orange-500' : 'bg-blue-500'}`}
                                  style={{ width: `${col.similarity}%` }}
                                />
                              </div>
                              <span className="font-mono text-xs font-bold text-slate-700">{col.similarity}%</span>
                            </div>
                          </div>
                          <div className="text-slate-400">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded View */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-slate-100"
                          >
                            <div className="p-5 bg-slate-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Organ 1 */}
                                <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${config.border}`}>
                                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Орган 1</div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      {col.sourceMinName}
                                    </span>
                                  </div>
                                  <div className="font-medium text-slate-800">{col.sourceDepName}</div>
                                </div>
                                
                                {/* Organ 2 */}
                                <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${config.border}`}>
                                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Орган 2</div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      {col.targetMinName}
                                    </span>
                                  </div>
                                  <div className="font-medium text-slate-800">{col.targetDepName}</div>
                                </div>
                              </div>

                              {/* Why it's interesting */}
                              <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
                                <h4 className="font-serif font-bold text-amber-900 flex items-center gap-2 mb-2">
                                  <span>💡</span> Почему это интересно
                                </h4>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                  {col.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredCollisions.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <GitMerge className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">В данной категории коллизий не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
