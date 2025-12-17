
import { Rule, InterceptedMessage, AppSettings, SystemState, AppStatus } from '../types';

export function checkMessage(
  sender: string,
  content: string,
  rules: Rule[],
  settings: AppSettings,
  state: SystemState
): { 
  isBlocked: boolean; 
  matchedRule?: Rule;
  newState: SystemState;
} {
  const now = Date.now();
  let newState = { ...state };

  // 1. Check Whitelist
  const whitelistRule = rules.find(r => r.isEnabled && r.type === 'WHITELIST' && new RegExp(r.pattern).test(sender));
  if (whitelistRule) {
    return { isBlocked: false, matchedRule: whitelistRule, newState };
  }

  // 2. Check Blacklist Rules
  const matchedRule = rules.find(r => r.isEnabled && r.type === 'BLACKLIST' && new RegExp(r.pattern).test(content));

  if (matchedRule) {
    // Update recent hits (Sliding Time Window)
    const windowStart = now - (settings.timeWindow * 1000);
    const updatedHits = [...state.recentHits.filter(h => h > windowStart), now];
    newState.recentHits = updatedHits;
    newState.lastHitTime = now;

    // 3. Evaluate Frequency Trigger
    if (newState.status === AppStatus.LISTENING && updatedHits.length >= settings.frequencyThreshold) {
      newState.status = AppStatus.INTERCEPTING;
    }

    // 4. If Intercepting, block it
    if (newState.status === AppStatus.INTERCEPTING) {
      newState.interceptedCount += 1;
      return { isBlocked: true, matchedRule, newState };
    }
  }

  return { isBlocked: false, newState };
}

export function evaluateAutoReset(state: SystemState, settings: AppSettings): SystemState {
  if (state.status === AppStatus.INTERCEPTING && state.lastHitTime) {
    if (Date.now() - state.lastHitTime > settings.observationPeriod) {
      return {
        ...state,
        status: AppStatus.LISTENING,
        recentHits: []
      };
    }
  }
  return state;
}
