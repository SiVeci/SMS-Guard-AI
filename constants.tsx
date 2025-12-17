
import { Rule, AppSettings } from './types';

export const INITIAL_RULES: Rule[] = [
  {
    id: '1',
    name: '贷款刷单诈骗',
    pattern: '^.*(贷款|刷单|利息|额度|兼职).*$',
    isEnabled: true,
    type: 'BLACKLIST',
    hits: 0
  },
  {
    id: '2',
    name: '营销退订',
    pattern: '^.*(退订|回复TD).*$',
    isEnabled: true,
    type: 'BLACKLIST',
    hits: 0
  },
  {
    id: '3',
    name: '银行官方 (白名单)',
    pattern: '^955[0-9]{2}$',
    isEnabled: true,
    type: 'WHITELIST',
    hits: 0
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  frequencyThreshold: 2,
  timeWindow: 60, // seconds
  observationPeriod: 30 * 60 * 1000 // 30 minutes in ms
};
