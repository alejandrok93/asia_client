import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatMessage, { Message, MessageRole } from './ChatMessage';
import ChatInput from './ChatInput';
import { Box, Flex, Stack, Group, Text, Loader } from '@mantine/core';
import { IconLoader2 } from '@tabler/icons-react';

interface ChatContainerProps {
  initialMessages?: Message[];
  chatId?: string;
  user?: any;
}

const ChatContainer = ({ initialMessages = [], chatId, user }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const routeParams = useParams();
  const activeChatId = chatId || routeParams.id;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Create new message object
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, newUserMessage]);

    // Simulate API request
    setIsLoading(true);

    try {
      // In a real app, you would send the message to your API here
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Sample AI responses based on input keywords
      let aiResponse = "I'm your ASIA.ai assistant, here to help you with your tasks. How can I assist you today?";

      if (content.toLowerCase().includes('pricing')) {
        aiResponse = "When discussing pricing with customers, remember to focus on value rather than cost. Try phrases like 'This is an investment of X' instead of 'This costs X'. Would you like some specific pricing objection handling techniques?";
      } else if (content.toLowerCase().includes('objection')) {
        aiResponse = "Common objections can be handled with the LAER method: Listen, Acknowledge, Explore, Respond. Let's break down the specific objection you're facing and craft a tailored response strategy.";
      } else if (content.toLowerCase().includes('follow up')) {
        aiResponse = "For follow-ups, I recommend the 3x3 strategy: try 3 different contact methods (email, call, social) over 3 different time periods. Here's a template you can use for your next follow-up email:\n\nSubject: Value proposition for [Company]\n\nHi [Name],\n\nI'm following up on our conversation about [specific pain point they mentioned]. I thought you might be interested in seeing how [Your Product] helped [similar company] achieve [specific result].\n\nDo you have 15 minutes this week to discuss how we might achieve similar results for [Their Company]?";
      }

      // Create AI response
      const newAiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      // Add AI response to chat
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error (could add an error message to the UI)
    } finally {
      setIsLoading(false);
    }
  };

  // Welcome message when no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: "👋 Hello! I'm your ASIA.ai assistant, designed to help you with your tasks. You can ask me about:\n\n• General information\n• Creating content\n• Analysis and recommendations\n• Strategic advice\n• Data interpretation\n\nHow can I help you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  return (
    <Flex direction="column" h="100%" style={{ width: '100%', maxWidth: '100%' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', width: '100%' }}>
        {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <Box py="md" width="100%">
            <Box mx="auto" style={{ maxWidth: '850px' }} px="md">
              <Group align="flex-start" spacing="md">
                <Box
                  h={32}
                  w={32}
                  bg="dark"
                  sx={{ borderRadius: 6 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text size="xs" fw={500} c="white">AI</Text>
                </Box>
                <Group spacing="xs">
                  <Loader size="sm" color="blue" />
                  <Text size="sm" c="dimmed">Thinking...</Text>
                </Group>
              </Group>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </Flex>
  );
};

export default ChatContainer;
