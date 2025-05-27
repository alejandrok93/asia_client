import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '~/components/chat/useChat';
import ChatMessage, { Message, MessageRole } from './ChatMessage';
import ChatInput from './ChatInput';
import { Box, Flex, Stack, Group, Text, Loader, Avatar, Paper } from '@mantine/core';
import { IconLoader2 } from '@tabler/icons-react';

interface ChatContainerProps {
  initialMessages?: Message[];
  chatId?: string;
  user?: any;
}

const ChatContainer = ({ initialMessages = [], chatId, user }: ChatContainerProps) => {
  const { messages, send, isTyping } = useChat(chatId || '', initialMessages);
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
    <Flex direction="column" h="100%" bg="white" style={{ width: '100%', maxWidth: '100%' }}>
      {/* Messages container with proper scrolling */}
      <Box 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          width: '100%',
          minHeight: 0,
          position: 'relative'
        }}
      >
        <Box style={{ padding: '1rem 0', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box style={{ flex: 1 }}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {(isLoading || isTyping) && (
              <Box px="lg" py="sm">
                <Box mx="auto" maw={900}>
                  <Flex align="flex-start" gap="md">
                    {/* Avatar */}
                    <Box style={{ flexShrink: 0 }}>
                      <Avatar
                        size="sm"
                        radius="xl"
                        color="gray"
                        bg="#495057"
                      >
                        AI
                      </Avatar>
                    </Box>

                    {/* Typing indicator bubble */}
                    <Box style={{ maxWidth: '70%', minWidth: '120px' }}>
                      <Paper
                        p="md"
                        radius="lg"
                        bg="#f8f9fa"
                        sx={{
                          position: 'relative',
                          borderRadius: '18px 18px 18px 4px',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                          border: '1px solid #e9ecef',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: 0,
                            height: 0,
                            border: '6px solid transparent',
                            left: -6,
                            bottom: 8,
                            borderTopColor: '#f8f9fa',
                            borderRightColor: '#f8f9fa',
                          }
                        }}
                      >
                        <Group spacing="xs" align="center">
                          <Loader size="xs" color="gray" />
                          <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                            {isTyping ? 'Typing...' : 'Thinking...'}
                          </Text>
                        </Group>
                      </Paper>

                      <Text 
                        size="xs" 
                        c="dimmed" 
                        ta="left"
                        mt={4}
                        px="sm"
                      >
                        ASIA.ai
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            )}
          </Box>
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Fixed input at bottom */}
      <Box style={{ flexShrink: 0 }}>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </Box>
    </Flex>
  );
};

export default ChatContainer;
