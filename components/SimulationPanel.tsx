
import React, { useState } from 'react';
import { analyzeSMS } from '../services/geminiService';

interface SimulationPanelProps {
  onSimulate: (sender: string, content: string) => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({ onSimulate }) => {
  const [sender, setSender] = useState('10650000');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{isSpam: boolean, reason: string} | null>(null);

  const handleSimulate = () => {
    if (!content) return;
    onSimulate(sender, content);
    setContent('');
    setAiAnalysis(null);
  };

  const handleAiAnalysis = async () => {
    if (!content) return;
    setIsAnalyzing(true);
    const result = await analyzeSMS(content);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="material-card p-6 mb-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-500 rounded-lg">
          <i className="fas fa-flask text-white"></i>
        </div>
        <h2 className="text-xl font-bold">拦截模拟器</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">发送者号码</label>
            <input 
              type="text" 
              className="w-full p-3 bg-slate-700 border-none rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
              value={sender}
              onChange={e => setSender(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">短信内容</label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full p-3 bg-slate-700 border-none rounded-lg text-white focus:ring-2 focus:ring-indigo-500 pr-24"
                placeholder="输入测试短信内容..."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <button 
                onClick={handleAiAnalysis}
                disabled={isAnalyzing}
                className="absolute right-2 top-1.5 px-3 py-1.5 bg-indigo-600 rounded-md text-xs font-medium hover:bg-indigo-700 disabled:bg-slate-600"
              >
                {isAnalyzing ? '分析中...' : 'AI 分析'}
              </button>
            </div>
          </div>
        </div>

        {aiAnalysis && (
          <div className={`p-3 rounded-lg text-sm flex gap-3 ${aiAnalysis.isSpam ? 'bg-rose-900/40 border border-rose-500/50' : 'bg-emerald-900/40 border border-emerald-500/50'}`}>
            <i className={`fas ${aiAnalysis.isSpam ? 'fa-exclamation-triangle' : 'fa-check-circle'} mt-1`}></i>
            <div>
              <span className="font-bold">{aiAnalysis.isSpam ? '潜在垃圾信息：' : '正常信息：'}</span> {aiAnalysis.reason}
            </div>
          </div>
        )}

        <button 
          onClick={handleSimulate}
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <i className="fas fa-paper-plane"></i>
          模拟接收短信
        </button>
      </div>
    </div>
  );
};

export default SimulationPanel;
