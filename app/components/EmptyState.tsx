import React from 'react';
import { IconMessageCircle, IconSettings, IconChevronRight } from '@tabler/icons-react';
import { Button, Paper, Text, Title, SimpleGrid, Box, Stack, Center, Group } from '@mantine/core';

interface SamplePrompt {
  title: string;
  prompt: string;
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  onPromptClick?: (prompt: string) => void;
}

const EmptyState = ({ 
  title = "ASIA.ai", 
  description = "Your AI assistant for conversations, tasks, and more",
  icon = "chat",
  actionText,
  onAction,
  onPromptClick 
}: EmptyStateProps) => {
  const samplePrompts: SamplePrompt[] = [
    {
      title: "Craft a follow-up email",
      prompt: "Help me craft a follow-up email for a prospect who showed interest but hasn't responded in 2 weeks."
    },
    {
      title: "Handle pricing objections",
      prompt: "What are some effective ways to handle the 'your product is too expensive' objection?"
    },
    {
      title: "Create a cold call script",
      prompt: "I need a cold call script for reaching out to SaaS companies about our sales analytics platform."
    },
    {
      title: "Competitive analysis",
      prompt: "How should I position our product against our main competitor who has better market recognition but fewer features?"
    },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack align="center" justify="center" spacing="xl" maw={800} mx="auto" p="xl" w="100%">
        <Stack align="center" spacing="md">
          <Center 
            p="md" 
            sx={theme => ({
              backgroundColor: theme.fn.lighten(theme.colors.blue[1], 0.5),
              borderRadius: theme.radius.xl
            })}
          >
            <IconMessageCircle size={32} color="blue" />
          </Center>
          
          <Title order={2} align="center">{title}</Title>
          <Text c="dimmed" align="center" maw={500}>{description}</Text>
        </Stack>

        {onPromptClick && (
          <SimpleGrid cols={{ base: 1, sm: 2 }} w="100%" spacing="md">
            {samplePrompts.map((item, idx) => (
              <Paper 
                key={idx} 
                withBorder
                p="md"
                radius="md"
                sx={theme => ({
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: theme.fn.lighten(theme.colors.gray[0], 0.5),
                  }
                })}
                onClick={() => onPromptClick(item.prompt)}
              >
                <Group position="apart" noWrap>
                  <Box sx={{ flex: 1 }}>
                    <Text fw={500}>{item.title}</Text>
                    <Text size="xs" c="dimmed" lineClamp={2} mt={4}>
                      {item.prompt}
                    </Text>
                  </Box>
                  <IconChevronRight size={16} color="gray" />
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        )}

        {onAction && actionText && (
          <Button 
            onClick={onAction}
            variant="light"
            color="blue"
            radius="md"
            mt="md"
          >
            {actionText}
          </Button>
        )}

        <Group position="center" mt="xl">
          <Button variant="subtle" size="xs" leftIcon={<IconSettings size={14} />}>
            Settings
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default EmptyState;
