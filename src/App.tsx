import React, { useState } from 'react';
import { govData, Ministry } from './data';
import MacroView from './components/MacroView';
import MicroView from './components/MicroView';
import { Building2 } from 'lucide-react';

export default function App() {
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-slate-900 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Building2 className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">GovTech Analytics</h1>
            <p className="text-slate-400 text-sm">Карта дублирования функций государственных органов</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {selectedMinistry ? (
          <MicroView ministry={selectedMinistry} onBack={() => setSelectedMinistry(null)} />
        ) : (
          <MacroView data={govData} onSelectMinistry={setSelectedMinistry} />
        )}
      </main>
    </div>
  );
}
