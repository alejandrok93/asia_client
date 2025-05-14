import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { Button, Textarea, Box, Container, Text, Group } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput = ({ onSendMessage, isLoading = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;

    // Reset height to auto to get the correct scrollHeight
    textareaRef.current.style.height = 'auto';

    // Set height based on scrollHeight
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
  }, [message]);

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      py="md" 
      px="md" 
      bg="white"
      sx={theme => ({
        borderTop: `1px solid ${theme.colors.gray[3]}`,
      })}
    >
      <Container size="lg" px="xs">
        <Box pos="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ASIA.ai..."
            minRows={2}
            maxRows={8}
            autosize
            disabled={isLoading}
            rightSection={
              <Button
                type="submit"
                radius="md"
                color="blue"
                disabled={isLoading || !message.trim()}
                sx={theme => ({
                  opacity: isLoading || !message.trim() ? 0.5 : 1,
                })}
              >
                <IconSend size={18} />
              </Button>
            }
            styles={{
              input: {
                paddingRight: 70,
              },
            }}
          />
        </Box>
        <Text align="center" size="xs" c="dimmed" mt="xs">
          ASIA.ai may produce inaccurate information about people, places, or facts.
        </Text>
      </Container>
    </Box>
  );
};

export default ChatInput;
