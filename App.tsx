
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Rule, 
  InterceptedMessage, 
  AppSettings, 
  SystemState, 
  AppStatus 
} from './types';
import { INITIAL_RULES, DEFAULT_SETTINGS } from './constants';
import { checkMessage, evaluateAutoReset } from './services/interceptorEngine';
import Dashboard from './components/Dashboard';
import RuleManager from './components/RuleManager';
import LogList from './components/LogList';
import SimulationPanel from './components/SimulationPanel';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [logs, setLogs] = useState<InterceptedMessage[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [state, setState] = useState<SystemState>({
    status: AppStatus.LISTENING,
    interceptedCount: 0,
    lastHitTime: null,
    recentHits: []
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setState(current => evaluateAutoReset(current, settings));
    }, 5000);
    return () => clearInterval(timer);
  }, [settings]);

  const handleSimulateMessage = useCallback((sender: string, content: string) => {
    const result = checkMessage(sender, content, rules, settings, state);
    
    setState(result.newState);

    if (result.isBlocked) {
      const newLog: InterceptedMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender,
        content,
        timestamp: Date.now(),
        ruleId: result.matchedRule?.id || 'unknown',
        ruleName: result.matchedRule?.name || '动态过滤'
      };
      setLogs(prev => [newLog, ...prev]);
      
      alert(`[系统拦截] 短信已成功拦截：内容匹配规则 "${result.matchedRule?.name}"`);
    } else {
      alert(`[收件箱] 收到来自 ${sender} 的正常短信：\n${content}`);
    }
  }, [rules, settings, state]);

  const handleAddRule = (newRule: Omit<Rule, 'id' | 'hits'>) => {
    setRules(prev => [...prev, { ...newRule, id: Date.now().toString(), hits: 0 }]);
  };

  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isEnabled: !r.isEnabled } : r));
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const handleRestore = (logId: string) => {
    const log = logs.find(l => l.id === logId);
    if (log) {
      alert(`已将来自 ${log.sender} 的短信恢复至系统收件箱。`);
      setLogs(prev => prev.filter(l => l.id !== logId));
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-shield-halved"></i>
          </div>
          <h1 className="text-xl font-bold text-slate-800">智能短信拦截助手 <span className="text-indigo-600">AI</span></h1>
        </div>
        <div className="flex items-center gap-4 text-slate-500 text-sm">
          <span className="hidden md:inline">版本 v2.5 (Material You)</span>
          <i className="fas fa-cog cursor-pointer hover:text-indigo-600"></i>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {/* 状态看板 */}
        <Dashboard state={state} />

        {/* 核心设置 */}
        <Settings settings={settings} onUpdate={setSettings} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧：规则管理与日志 */}
          <div className="lg:col-span-8">
            <RuleManager 
              rules={rules} 
              onAddRule={handleAddRule} 
              onToggleRule={handleToggleRule} 
              onDeleteRule={handleDeleteRule} 
            />
            <LogList 
              logs={logs} 
              onRestore={handleRestore} 
              onClearAll={() => setLogs([])} 
            />
          </div>

          {/* 右侧：模拟器与帮助 */}
          <div className="lg:col-span-4">
            <SimulationPanel onSimulate={handleSimulateMessage} />
            
            <div className="material-card p-6 bg-slate-50 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <i className="fas fa-info-circle text-indigo-500"></i>
                系统运行原理
              </h3>
              <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">1.</span>
                  系统会根据您配置的正则表达式实时扫描每条入站短信。
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">2.</span>
                  频率触发器会统计在预设的“时间窗口”内命中规则的次数。
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">3.</span>
                  当命中次数达到“阈值”时，系统会自动切入“拦截模式”。
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">4.</span>
                  若在“观察期”内未发现新骚扰，系统将自动复位为静默模式，防止误杀。
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* 移动端悬浮状态栏 */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${state.status === AppStatus.INTERCEPTING ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
            系统状态：{state.status === AppStatus.INTERCEPTING ? '拦截中' : '监听中'}
          </span>
        </div>
        <div className="text-xs text-slate-400">
          今日已拦截 {state.interceptedCount} 条
        </div>
      </div>
    </div>
  );
};

export default App;
