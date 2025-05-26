import React from 'react';
import { Button, Divider, NavLink, Text, Stack, Box, Group } from '@mantine/core';
import { IconPlus, IconMessageCircle, IconLogout } from '@tabler/icons-react';

type Conversation = {
  id: string;
  title: string;
  date: Date;
};

interface SidebarProps {
  conversations?: Conversation[];
  activeConversationId?: string | null;
  onNewChat?: () => void;
  onConversationClick?: (id: string) => void;
  user?: any;
  activeChatId?: string | null;
  onSelectChat?: (chatId: string) => void;
  onLogout?: () => void;
}

const Sidebar = ({
  conversations = [],
  activeConversationId,
  onNewChat,
  onConversationClick,
  user,
  activeChatId,
  onSelectChat,
  onLogout
}: SidebarProps) => {
  // Use either activeChatId or activeConversationId based on what's provided
  const activeId = activeChatId || activeConversationId;
  // Use either onSelectChat or onConversationClick based on what's provided
  const handleChatSelect = onSelectChat || onConversationClick;
  console.log('conversations', conversations);

  return (
    <Box
      w={260}
      bg="#f8f9fa"
      style={{
        borderRight: '1px solid #e9ecef',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100vh',
        flexShrink: 0
      }}
    >
      <Stack spacing="xs" p="md" h="100%" style={{ flex: 1 }}>
        <Button
          onClick={onNewChat}
          leftSection={<IconPlus size={16} />}
          fullWidth
          variant="filled"
          color="blue"
        >
          New chat
        </Button>

        <Divider my="sm" />

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Text size="xs" fw={500} c="dimmed" px="xs" py="xs">
            Recent conversations
          </Text>

          <Stack spacing="xs" mt="xs">
            {conversations.map((conversation) => (
              <NavLink
                key={conversation.id}
                label={conversation.title}
                icon={<IconMessageCircle size={16} />}
                active={activeId === conversation.id}
                onClick={() => handleChatSelect && handleChatSelect(conversation.id)}
                variant="light"
                color="blue"
              />
            ))}
          </Stack>
        </Box>

        <Divider my="sm" />

        <Group position="apart" px="xs">
          <Text size="xs" c="dimmed">
            ASIA.ai v1.0
          </Text>
          {user && (
            <Text size="xs" c="dimmed">
              {user.first_name} {user.last_name}
            </Text>
          )}
        </Group>

        {user && (
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconLogout size={16} />}
            onClick={onLogout}
            fullWidth
            size="sm"
            mt="xs"
          >
            Logout
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default Sidebar;
