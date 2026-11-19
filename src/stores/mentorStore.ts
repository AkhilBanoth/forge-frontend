import { create } from 'zustand';
import type { AIMessage, QuickPrompt } from '../types';
import { aiService } from '../lib/api/services';

interface MentorStore {
  isOpen: boolean;
  messages: AIMessage[];
  isTyping: boolean;
  error: string | null;
  quickPrompts: QuickPrompt[];

  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  fetchMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  resetLocalState: () => void;
}

export const useMentorStore = create<MentorStore>((set, get) => ({
  isOpen: false,
  messages: [],
  isTyping: false,
  error: null,
  quickPrompts: [
    {
      id: 'qp_next',
      label: 'What should I do next?',
      action: 'learning_path',
      prompt: 'What is my highest-leverage next recommended action based on my skill gaps?',
    },
    {
      id: 'qp_weakness',
      label: 'Analyze weak areas',
      action: 'skill_analysis',
      prompt: 'Analyze my weak areas and explain what is preventing me from reaching 85% readiness.',
    },
    {
      id: 'qp_practice',
      label: 'Practice Docker quiz',
      action: 'practice_questions',
      prompt: 'Generate 2 targeted practice questions on Docker containers for Python backends.',
    },
  ],

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open: boolean) => set({ isOpen: open }),

  fetchMessages: async () => {
    try {
      const res = await aiService.getMessages();
      set({ messages: res.data, error: null });
    } catch {
      set({ error: 'Failed to load conversation history.' });
    }
  },

  sendMessage: async (content: string) => {
    if (!content.trim()) return;
    set({ isTyping: true, error: null });
    try {
      await aiService.sendMessage(content);
      const allRes = await aiService.getMessages();
      set({ messages: allRes.data, isTyping: false });
    } catch {
      set({
        isTyping: false,
        error: 'Unable to communicate with AI Mentor. Please retry.',
      });
    }
  },

  clearHistory: async () => {
    await aiService.clearMessages();
    set({ messages: [], error: null });
  },

  resetLocalState: () => {
    set({ messages: [], isOpen: false, isTyping: false, error: null });
  },
}));
