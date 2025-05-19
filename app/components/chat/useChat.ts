import { useEffect, useState } from "react";
import { createConsumer } from "@rails/actioncable";

import { Message } from "~/types/index";

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const cable = createConsumer(process.env.ACTION_CABLE_URL);
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
          }
        }
      }
    );
    return () => sub.unsubscribe();
  }, [conversationId]);

  async function send(content: string) {
    await fetch(`/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
  }

  return { messages, send };
}
