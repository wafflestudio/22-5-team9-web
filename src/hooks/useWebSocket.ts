import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (userId: number) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{
    sender_id: number;
    receiver_id: number;
    text: string;
    creation_date: string;
  }>>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token == null) return;

    const ws = new WebSocket('wss://waffle-instaclone.kro.kr/ws');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket Connected');
      // Send authentication message
      ws.send(JSON.stringify({ token }));
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as { sender_id: number; receiver_id: number; text: string; creation_date: string; };
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = (receiverId: number, text: string) => {
    if ((wsRef.current == null) || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }

    const message = {
      receiver_id: receiverId,
      text: text
    };

    wsRef.current.send(JSON.stringify(message));
  };

  return {
    isConnected,
    messages,
    sendMessage
  };
};