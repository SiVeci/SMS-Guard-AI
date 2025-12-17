
import React from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="material-card p-6 mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-4">拦截触发器配置</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
            命中次数阈值
            <span className="ml-2 text-indigo-500 normal-case">{settings.frequencyThreshold} 次匹配</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            className="w-full accent-indigo-600"
            value={settings.frequencyThreshold}
            onChange={e => onUpdate({ ...settings, frequencyThreshold: parseInt(e.target.value) })}
          />
          <p className="text-[10px] text-slate-400 mt-1">激活动态拦截模式所需的规则匹配次数。</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
            滑动时间窗口
            <span className="ml-2 text-indigo-500 normal-case">{settings.timeWindow} 秒</span>
          </label>
          <input 
            type="range" 
            min="10" 
            max="300" 
            step="10"
            className="w-full accent-indigo-600"
            value={settings.timeWindow}
            onChange={e => onUpdate({ ...settings, timeWindow: parseInt(e.target.value) })}
          />
          <p className="text-[10px] text-slate-400 mt-1">统计命中次数的动态时间范围。</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
            观察期 (冷却时间)
            <span className="ml-2 text-indigo-500 normal-case">{settings.observationPeriod / 60000} 分钟</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="60" 
            className="w-full accent-indigo-600"
            value={settings.observationPeriod / 60000}
            onChange={e => onUpdate({ ...settings, observationPeriod: parseInt(e.target.value) * 60000 })}
          />
          <p className="text-[10px] text-slate-400 mt-1">系统无异常后自动切换回监听模式的时长。</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
