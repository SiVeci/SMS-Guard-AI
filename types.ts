
export enum AppStatus {
  LISTENING = 'LISTENING',
  INTERCEPTING = 'INTERCEPTING'
}

export interface Rule {
  id: string;
  name: string;
  pattern: string; // Regex string
  isEnabled: boolean;
  type: 'BLACKLIST' | 'WHITELIST';
  hits: number;
}

export interface InterceptedMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  ruleId: string;
  ruleName: string;
}

export interface AppSettings {
  frequencyThreshold: number; // e.g., 2 times
  timeWindow: number; // e.g., 60 seconds
  observationPeriod: number; // e.g., 30 minutes (in ms)
}

export interface SystemState {
  status: AppStatus;
  interceptedCount: number;
  lastHitTime: number | null;
  recentHits: number[]; // timestamps of recent pattern matches
}
