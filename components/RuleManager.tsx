
import React, { useState } from 'react';
import { Rule } from '../types';
import { suggestRegexForRule } from '../services/geminiService';

interface RuleManagerProps {
  rules: Rule[];
  onAddRule: (rule: Omit<Rule, 'id' | 'hits'>) => void;
  onToggleRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
}

const RuleManager: React.FC<RuleManagerProps> = ({ rules, onAddRule, onToggleRule, onDeleteRule }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRulePattern, setNewRulePattern] = useState('');
  const [newRuleType, setNewRuleType] = useState<'BLACKLIST' | 'WHITELIST'>('BLACKLIST');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAdd = () => {
    if (!newRuleName || !newRulePattern) return;
    onAddRule({
      name: newRuleName,
      pattern: newRulePattern,
      isEnabled: true,
      type: newRuleType
    });
    setNewRuleName('');
    setNewRulePattern('');
    setIsAdding(false);
  };

  const handleAiSuggest = async () => {
    if (!newRuleName) return;
    setIsAiLoading(true);
    const regex = await suggestRegexForRule(newRuleName);
    setNewRulePattern(regex);
    setIsAiLoading(false);
  };

  return (
    <div className="material-card overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">拦截规则配置</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
        >
          <i className={`fas ${isAdding ? 'fa-times' : 'fa-plus'}`}></i>
          {isAdding ? '取消' : '添加新规则'}
        </button>
      </div>

      {isAdding && (
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">规则描述 / 场景</label>
              <input 
                type="text" 
                placeholder="例如：金融诈骗"
                className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newRuleName}
                onChange={e => setNewRuleName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">拦截类型</label>
              <select 
                className="w-full p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newRuleType}
                onChange={e => setNewRuleType(e.target.value as any)}
              >
                <option value="BLACKLIST">黑名单 (内容过滤)</option>
                <option value="WHITELIST">白名单 (号码放行)</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 flex justify-between">
              <span>正则表达式模式</span>
              <button 
                onClick={handleAiSuggest}
                disabled={isAiLoading}
                className="text-indigo-600 hover:text-indigo-800 disabled:text-slate-400"
              >
                <i className="fas fa-magic mr-1"></i>
                {isAiLoading ? 'AI 正在分析生成...' : '使用 AI 自动生成正则'}
              </button>
            </label>
            <input 
              type="text" 
              placeholder="^.*(关键词).*$"
              className="w-full p-2 border border-slate-200 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newRulePattern}
              onChange={e => setNewRulePattern(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAdd}
            className="w-full py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-colors"
          >
            确认创建
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">规则名称</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">正则模式</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">类型</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">状态</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rules.map(rule => (
              <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{rule.name}</div>
                </td>
                <td className="px-6 py-4">
                  <code className="bg-slate-100 px-2 py-1 rounded text-xs text-rose-600 font-mono">{rule.pattern}</code>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${rule.type === 'WHITELIST' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {rule.type === 'WHITELIST' ? '白名单' : '黑名单'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={rule.isEnabled} 
                      onChange={() => onToggleRule(rule.id)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onDeleteRule(rule.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RuleManager;
