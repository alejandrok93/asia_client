import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser, getUserSession } from "~/utils/session.server";
import Sidebar from "~/components/layout/Sidebar";
import ChatContainer from "~/components/chat/ChatContainer";
import EmptyState from "~/components/EmptyState";
import { useState } from "react";

// Loader function to check authentication
export async function loader({ request }: LoaderFunctionArgs) {
  console.log('index')
  const session = await getUserSession(request);
  console.log('user', session);

  // If no user is found, redirect to login page
  if (!session) {
    return redirect("/login");
  }

  return json({ user: session });
}

export const meta: MetaFunction = () => {
  return [
    { title: "ASIA.ai Dashboard" },
    { name: "description", content: "ASIA.ai Dashboard" },
  ];
};

// Function to generate a unique chat ID
const generateChatId = () => `new_chat_${Date.now()}`;

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);

  // Function to create a new conversation
  const createNewConversation = () => {
    const newChatId = generateChatId();
    setActiveChatId(newChatId);
    setIsNewChat(true);
    // In a real application, you would make an API call here to create a new chat
    console.log("Creating new conversation with ID:", newChatId);
  };

  return (
    <div className="flex flex-row w-full h-screen bg-gray-50 overflow-hidden">
      <div className="flex-shrink-0">
        <Sidebar
          user={user}
          activeChatId={activeChatId}
          onSelectChat={(chatId) => {
            setActiveChatId(chatId);
            setIsNewChat(false);
          }}
        />
      </div>

      <main className="flex-grow overflow-auto">
        {activeChatId ? (
          <ChatContainer chatId={activeChatId} user={user} initialMessages={isNewChat ? [] : undefined} />
        ) : (
          <EmptyState
            title="Welcome to ASIA.ai"
            description="Select a conversation or start a new one."
            icon="chat"
            actionText="New Conversation"
            onAction={createNewConversation}
          />
        )}
      </main>
    </div>
  );
}
