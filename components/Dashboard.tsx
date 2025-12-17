
import React from 'react';
import { AppStatus, SystemState } from '../types';

interface DashboardProps {
  state: SystemState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const isIntercepting = state.status === AppStatus.INTERCEPTING;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="material-card p-6 border-l-8 border-indigo-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-slate-500 font-medium uppercase text-xs tracking-wider">当前状态</h3>
          <i className={`fas fa-circle ${isIntercepting ? 'text-red-500 animate-status-pulse' : 'text-emerald-500'} text-[10px]`}></i>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">
            {isIntercepting ? '拦截模式中' : '静默监听中'}
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-2">
          {isIntercepting 
            ? '已激活动态拦截机制' 
            : '正在监听异常短信流入'}
        </p>
      </div>

      <div className="material-card p-6 border-l-8 border-rose-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-slate-500 font-medium uppercase text-xs tracking-wider">今日拦截总数</h3>
          <i className="fas fa-shield-alt text-rose-500"></i>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-800">{state.interceptedCount}</span>
        </div>
        <p className="text-slate-400 text-sm mt-2">今日累计过滤的垃圾短信</p>
      </div>

      <div className="material-card p-6 border-l-8 border-emerald-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-slate-500 font-medium uppercase text-xs tracking-wider">命中频率</h3>
          <i className="fas fa-wave-square text-emerald-500"></i>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">{state.recentHits.length}</span>
          <span className="text-slate-400 text-sm">次 / 窗口内</span>
        </div>
        <p className="text-slate-400 text-sm mt-2">当前滑动窗口内的规则匹配数</p>
      </div>
    </div>
  );
};

export default Dashboard;
