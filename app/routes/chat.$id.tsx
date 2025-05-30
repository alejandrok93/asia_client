import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getUserSession, getUserToken } from "~/utils/session.server";
import Sidebar from "~/components/layout/Sidebar";
import ChatContainer from "~/components/chat/ChatContainer";
import { getConversations, getConversation, sendMessage } from "~/models/conversation.server";
import type { Conversation } from "~/types";
import { Flex, Box } from "@mantine/core";

// Loader function to check authentication and get chat data
export async function loader({ request, params }: LoaderFunctionArgs) {
  console.log('params ', params)
  const { id } = params;

  // Reject non-numeric IDs (like .js.map files)
  if (!id || !/^\d+$/.test(id)) {
    throw new Response("Not Found", { status: 404 });
  }

  const session = await getUserSession(request)
  const token = await getUserToken(request);

  if (!token) {
    return redirect("/login");
  }

  try {
    const conversation = await getConversation(token, id);
    // Fetch all conversations for the sidebar
    const conversations = await getConversations(token);

    return json({ user: session, conversation, conversations });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    // If conversation doesn't exist or there's an error, redirect to the main page
    return redirect("/");
  }
}

export const meta: MetaFunction = ({ data }) => {
  const conversationTitle = data?.conversation?.title || "Chat";
  return [
    { title: `${conversationTitle} | ASIA.ai` },
    { name: "description", content: `ASIA.ai chat conversation: ${conversationTitle}` },
  ];
};

export async function action({ request, params }: ActionFunctionArgs) {
  const token = await getUserToken(request);
  const { id } = params;

  if (!token || !id) {
    return json({ error: "Unauthorized or missing chat ID" }, { status: 401 });
  }

  const formData = await request.formData();
  const content = formData.get("content") as string;

  if (!content) {
    return json({ error: "Message content is required" }, { status: 400 });
  }

  try {
    await sendMessage(token, Number(id), content);
    return json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    return json({ error: "Failed to send message" }, { status: 500 });
  }
}

export default function ChatConversation() {
  const { user, conversation, conversations } = useLoaderData<typeof loader>();
  const params = useParams();
  const chatId = params.id;

  // Extract messages from the included array
  const messages = conversation?.included?.filter((item: any) => item.type === 'message').map((msg: any) => ({
    id: msg.id,
    role: msg.attributes.role,
    content: msg.attributes.content,
    timestamp: new Date(msg.attributes.created_at)
  })) || [];
  console.log('messages', messages)

  return (
    <Flex h="100vh" bg="gray.1">
      <Sidebar
        user={user}
        activeChatId={chatId}
        conversations={conversations.map(c => ({
          id: String(c.id),
          title: c.attributes.title,
          date: new Date(c.attributes.created_at)
        }))}
        onNewChat={() => window.location.href = "/"}
        onSelectChat={(id) => window.location.href = `/chat/${id}`}
      />

      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0
        }}
      >
        <ChatContainer
          chatId={chatId}
          user={user}
          initialMessages={messages}
        />
      </Box>
    </Flex>
  );
}
