import { useEffect, useState, useCallback } from "react";
import { createConsumer } from "@rails/actioncable";
import { ENV } from "~/utils/env";
import { useFetcher } from "@remix-run/react";

import { Message } from "~/types/index";

export function useChat(conversationId: string, initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetcher = useFetcher();

  // Reset messages when conversation ID changes or initialMessages change
  useEffect(() => {
    setMessages(initialMessages);
  }, [conversationId]);

  useEffect(() => {
    console.log('create action cable consumer!')
    const cable = createConsumer(ENV.ACTION_CABLE_URL);
    const sub = cable.subscriptions.create(
      { channel: "ConversationChannel", conversation_id: conversationId },
      {
        received: data => {
          if (data.type === "assistant_part") {
            setMessages(prev =>
              prev.map(m =>
                m.id === data.message_id
                  ? { ...m, content: m.content + data.delta }
                  : m
              )
            );
          } else if (data.type === "assistant_complete") {
            // Optionally scroll, mark as done, etc.
          } else if (data.type === "message_created") {
            // Add new message to the list
            setMessages(prev => [...prev, data.message]);
          }
        }
      }
    );

    console.log(sub)
    return () => sub.unsubscribe();
  }, [conversationId]);

  async function send(content: string) {
    // Create a temporary user message to show immediately in the UI
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    // Add the message to local state right away
    setMessages(prev => [...prev, tempMessage]);

    // Use Remix fetcher to submit to the action
    const formData = new FormData();
    formData.append("content", content);

    fetcher.submit(formData, {
      method: "post",
      action: `/chat/${conversationId}`
    });
  }

  return { messages, send, isLoading };
}
