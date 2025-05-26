import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '~/components/chat/useChat';
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
  const { messages, send } = useChat(chatId || '', initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const routeParams = useParams();
  const activeChatId = chatId || routeParams.id;
  console.log('initialmessages', initialMessages)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      send(content)
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error (could add an error message to the UI)
    } finally {
      setIsLoading(false);
    }
  };


  console.log('messages', messages)

  return (
    <Flex direction="column" h="100%" bg="white" style={{ width: '100%', maxWidth: '100%', minHeight: 0 }}>
      <Box sx={{ flex: 1, overflowY: 'auto', width: '100%', padding: '1rem 0' }}>
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
