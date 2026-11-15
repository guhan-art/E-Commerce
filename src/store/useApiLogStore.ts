import { create } from 'zustand';

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  endpoint: string;
  status: number;
  durationMs: number;
  requestBody?: any;
  responseBody?: any;
}

interface ApiLogState {
  logs: ApiLogEntry[];
  isOpen: boolean;
  activeTab: 'logs' | 'tester' | 'architecture';
  setIsOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: 'logs' | 'tester' | 'architecture') => void;
  addLog: (log: Omit<ApiLogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export const useApiLogStore = create<ApiLogState>((set, get) => ({
  logs: [
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      method: 'GET',
      endpoint: '/api/health',
      status: 200,
      durationMs: 14,
      responseBody: { status: 'online', service: 'CHROMALUX FSWD Gateway', uptime: '99.98%' },
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      method: 'GET',
      endpoint: '/api/products',
      status: 200,
      durationMs: 38,
      responseBody: { count: 12, category: 'All' },
    },
  ],
  isOpen: false,
  activeTab: 'logs',
  setIsOpen: (isOpen) => set({ isOpen }),
  setActiveTab: (activeTab) => set({ activeTab }),
  addLog: (entry) => {
    const newEntry: ApiLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    set({ logs: [newEntry, ...get().logs].slice(0, 50) });
  },
  clearLogs: () => set({ logs: [] }),
}));
