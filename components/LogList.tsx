
import React from 'react';
import { InterceptedMessage } from '../types';

interface LogListProps {
  logs: InterceptedMessage[];
  onRestore: (id: string) => void;
  onClearAll: () => void;
}

const LogList: React.FC<LogListProps> = ({ logs, onRestore, onClearAll }) => {
  return (
    <div className="material-card overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">拦截日志记录</h2>
          <p className="text-slate-400 text-sm">查看最近被系统拦截的短信</p>
        </div>
        {logs.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-slate-400 hover:text-rose-600 text-sm transition-colors"
          >
            清空所有记录
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <i className="fas fa-shield-virus text-4xl mb-4 opacity-20"></i>
          <p>暂无拦截记录</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {logs.map(log => (
            <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors flex gap-4">
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-user-shield text-slate-400"></i>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-slate-800">{log.sender}</span>
                  <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-600 text-sm mb-2">{log.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                    拦截规则：{log.ruleName}
                  </span>
                  <button 
                    onClick={() => onRestore(log.id)}
                    className="text-xs text-indigo-600 hover:underline font-medium"
                  >
                    恢复至收件箱
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogList;
