import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getUserSession, getUserToken } from "~/utils/session.server";
import Sidebar from "~/components/layout/Sidebar";
import ChatContainer from "~/components/chat/ChatContainer";
import { getConversations, getConversation } from "~/models/conversation.server";
import type { Conversation } from "~/types";

// Loader function to check authentication and get chat data
export async function loader({ request, params }: LoaderFunctionArgs) {
  console.log('params ', params)
  const { id } = params;

  const session = await getUserSession(request)
  const token = await getUserToken(request);

  if (!token) {
    return redirect("/login");
  }

  try {
    // Fetch the specific conversation
    const conversation = await getConversation(token, Number(id));
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

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const content = formData.get("message")?.toString() || "";
  const chatId = params.id;

  // In a real app, you would save the new message to your database
  console.log(`New message in chat ${chatId}: ${content}`);

  // Return success response
  return json({ success: true });
};

export default function ChatConversation() {
  const { user, conversation, conversations } = useLoaderData<typeof loader>();
  const params = useParams();
  const chatId = params.id;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        user={user}
        activeChatId={chatId}
        conversations={conversations.map(c => ({
          id: String(c.id),
          title: c.title,
          date: new Date(c.created_at)
        }))}
        onNewChat={() => window.location.href = "/"}
        onSelectChat={(id) => window.location.href = `/chat/${id}`}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatContainer
          chatId={chatId}
          user={user}
          initialMessages={conversation?.messages || []}
        />
      </main>
    </div>
  );
}
