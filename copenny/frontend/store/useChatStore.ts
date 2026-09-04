import { create } from 'zustand';
import { 
  fetchInsights, 
  fetchActions, 
  sendChatQuery, 
  executeAction as apiExecuteAction,
  Insight, 
  Action 
} from '@/lib/api/chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatStore {
  insights: Insight[];
  actions: Action[];
  chatHistory: ChatMessage[];
  isLoadingInsights: boolean;
  isLoadingActions: boolean;
  isChatting: boolean;
  
  loadInsights: () => Promise<void>;
  loadActions: () => Promise<void>;
  sendMessage: (query: string) => Promise<void>;
  executeAction: (actionId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  insights: [],
  actions: [],
  chatHistory: [],
  isLoadingInsights: false,
  isLoadingActions: false,
  isChatting: false,

  loadInsights: async () => {
    set({ isLoadingInsights: true });
    try {
      const insights = await fetchInsights();
      set({ insights });
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      set({ isLoadingInsights: false });
    }
  },

  loadActions: async () => {
    set({ isLoadingActions: true });
    try {
      const actions = await fetchActions();
      set({ actions });
    } catch (error) {
      console.error('Failed to load actions:', error);
    } finally {
      set({ isLoadingActions: false });
    }
  },

  sendMessage: async (query: string) => {
    if (!query.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    };
    
    set((state) => ({ 
      chatHistory: [...state.chatHistory, userMsg],
      isChatting: true
    }));

    try {
      const aiResponseContent = await sendChatQuery(query);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponseContent,
        timestamp: new Date()
      };
      
      set((state) => ({ 
        chatHistory: [...state.chatHistory, aiMsg]
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      set((state) => ({ 
        chatHistory: [...state.chatHistory, errorMsg]
      }));
    } finally {
      set({ isChatting: false });
    }
  },

  executeAction: async (actionId: string) => {
    try {
      await apiExecuteAction(actionId);
      // Remove action from state after execution
      set((state) => ({
        actions: state.actions.filter(a => a.type !== actionId)
      }));
    } catch (error) {
      console.error('Failed to execute action:', error);
      throw error;
    }
  }
}));
