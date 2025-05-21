import React from 'react';
import { Avatar, Paper, Text, Group, Stack, Box } from '@mantine/core';

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
    <Paper
      p="md"
      bg={isUser ? 'white' : '#f0f8ff'}
      withBorder={false}
      sx={(theme) => ({
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      })}
    >
      <Box mx="auto" maw={900}>
        <Group align="flex-start" spacing="md">
          <Avatar
            size="md"
            radius="md"
            color={isUser ? 'blue' : 'dark'}
          >
            {isUser ? 'You' : 'AI'}
          </Avatar>

          <Stack spacing="xs" style={{ flex: 1 }}>
            <Text fw={500} size="sm">
              {isUser ? 'You' : 'ASIA.ai'}
            </Text>

            <Box>
              {message?.content?.split('\n').map((paragraph, i) => (
                <Text key={i} mb={paragraph.length > 0 ? 'xs' : 0}>
                  {paragraph}
                </Text>
              ))}
            </Box>
          </Stack>
        </Group>
      </Box>
    </Paper>
  );
};

export default ChatMessage;
