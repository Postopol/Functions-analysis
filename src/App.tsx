import React, { useState } from 'react';
import { govData, Ministry } from './data';
import MacroView from './components/MacroView';
import MicroView from './components/MicroView';
import LevelView from './components/LevelView';
import ChatAssistant from './components/ChatAssistant';
import { Building2, Layers, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'by_ministry' | 'by_level'>('by_ministry');
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 text-slate-700 flex flex-col shrink-0 sticky top-0 h-screen transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-16'}`}
      >
        <div className={`p-4 flex items-center border-b border-slate-100 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && (
            <div className="flex items-center gap-3 overflow-hidden">
              <Building2 className="w-6 h-6 text-slate-400 shrink-0" />
              <h1 className="text-sm font-bold leading-tight text-slate-600 truncate">GovTech<br/>Analytics</h1>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title={isSidebarOpen ? "Скрыть меню" : "Показать меню"}
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        
        <nav className="p-2 space-y-1 mt-2 shrink-0">
          <button
            onClick={() => { setActiveTab('by_ministry'); setSelectedMinistry(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
              activeTab === 'by_ministry' 
                ? 'bg-slate-100 text-slate-900 font-medium' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            } ${!isSidebarOpen && 'justify-center'}`}
            title="Дубли по госорганам"
          >
            <LayoutDashboard className={`w-5 h-5 shrink-0 ${activeTab === 'by_ministry' ? 'text-blue-500' : ''}`} />
            {isSidebarOpen && <span className="text-sm truncate">По госорганам</span>}
          </button>
          <button
            onClick={() => setActiveTab('by_level')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
              activeTab === 'by_level' 
                ? 'bg-slate-100 text-slate-900 font-medium' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            } ${!isSidebarOpen && 'justify-center'}`}
            title="Дубли по уровням"
          >
            <Layers className={`w-5 h-5 shrink-0 ${activeTab === 'by_level' ? 'text-blue-500' : ''}`} />
            {isSidebarOpen && <span className="text-sm truncate">По уровням</span>}
          </button>
        </nav>

        <ChatAssistant isSidebarOpen={isSidebarOpen} onOpenSidebar={() => setIsSidebarOpen(true)} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-6 sticky top-0 z-10 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'by_ministry' ? 'Карта дублирования функций (По ведомствам)' : 'Горизонтальный срез (По уровням)'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {activeTab === 'by_ministry' 
              ? 'Анализ пересечений полномочий между министерствами и внутри них' 
              : 'Анализ дублирования функций на одинаковых иерархических уровнях (Комитеты, Департаменты, Управления)'}
          </p>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'by_ministry' ? (
            selectedMinistry ? (
              <MicroView ministry={selectedMinistry} onBack={() => setSelectedMinistry(null)} />
            ) : (
              <MacroView data={govData} onSelectMinistry={setSelectedMinistry} />
            )
          ) : (
            <LevelView data={govData} />
          )}
        </div>
      </main>
    </div>
  );
}
