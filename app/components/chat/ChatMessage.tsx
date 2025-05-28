import { marked } from 'marked';
import React from 'react';
import { Avatar, Paper, Text, Group, Stack, Box, Flex } from '@mantine/core';

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <Box
      px="lg"
      py="sm"
      sx={{
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box mx="auto" maw={900}>
        <Flex
          direction={isUser ? 'row-reverse' : 'row'}
          align="flex-start"
          gap="md"
        >
          {/* Avatar */}
          <Box style={{ flexShrink: 0 }}>
            <Avatar
              size="sm"
              radius="xl"
              color={isUser ? 'blue' : 'gray'}
              bg={isUser ? '#4c6ef5' : '#495057'}
            >
              {isUser ? 'U' : 'AI'}
            </Avatar>
          </Box>

          {/* Message bubble */}
          <Box
            style={{
              maxWidth: '70%',
              minWidth: '120px'
            }}
          >
            <Paper
              p="md"
              radius="lg"
              bg={isUser ? '#4c6ef5' : '#f8f9fa'}
              sx={(theme) => ({
                position: 'relative',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                border: isUser ? 'none' : '1px solid #e9ecef',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  border: '6px solid transparent',
                  [isUser ? 'right' : 'left']: -6,
                  bottom: 8,
                  borderTopColor: isUser ? '#4c6ef5' : '#f8f9fa',
                  ...(isUser ? {} : { borderRightColor: '#f8f9fa' }),
                  ...(isUser ? { borderLeftColor: '#4c6ef5' } : {}),
                }
              })}
            >
              <Stack spacing="xs">
                {/* Message content */}
                <Box>
                  {message?.content?.split('\n').map((paragraph, i) => (
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{__html: marked(paragraph)}}
                      style={{
                        fontSize: '14px',
                        color: isUser ? '#a5b4fc' : '#868e96',
                        textAlign: isUser ? 'right' : 'left',
                        marginTop: '8px'
                      }}
                    />
                  ))}
                </Box>

                {/* Timestamp */}
                <Text
                  size="xs"
                  c={isUser ? 'blue.1' : 'dimmed'}
                  ta={isUser ? 'right' : 'left'}
                  mt="xs"
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </Stack>
            </Paper>

            {/* Sender label */}
            <Text
              size="xs"
              c="dimmed"
              ta={isUser ? 'right' : 'left'}
              mt={4}
              px="sm"
            >
              {isUser ? 'You' : 'ASIA.ai'}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ChatMessage;
