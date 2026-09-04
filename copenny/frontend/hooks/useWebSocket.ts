"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useChatStore } from '@/store/useChatStore';
import { toast } from 'sonner';
import { Insight, Action } from '@/lib/api/chat';

let socket: Socket | null = null;

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const { insights, actions, loadInsights, loadActions } = useChatStore();

  useEffect(() => {
    const token = Cookies.get('token');
    
    if (!token) return;

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
        auth: { token },
        reconnection: true,
      });

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      });

      // Event Listeners
      socket.on('new-transaction', (transaction) => {
        toast.info(`New transaction added: ${transaction.description}`);
        // In a full app, we would update the transaction store here too
      });

      socket.on('new-insight', (insight: Insight) => {
        toast.message(`New Insight: ${insight.title}`, {
          description: insight.description,
        });
        // We can either push to the store or reload from the backend
        loadInsights();
      });

      socket.on('action-complete', ({ actionId }) => {
        toast.success('Action executed remotely!', {
          description: `Action ${actionId} was completed.`
        });
        loadActions();
      });
      
      socket.on('goal-update', (data) => {
        toast.success(`Goal Progress: ${data.name}`);
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('new-transaction');
        socket.off('new-insight');
        socket.off('action-complete');
        socket.off('goal-update');
      }
    };
  }, [loadInsights, loadActions]);

  return { isConnected };
}
