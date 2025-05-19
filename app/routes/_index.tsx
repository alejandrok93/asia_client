import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { getUser, getUserSession } from "~/utils/session.server";
import Sidebar from "~/components/layout/Sidebar";
import ChatContainer from "~/components/chat/ChatContainer";
import EmptyState from "~/components/EmptyState";
import { useState } from "react";
import type { Conversation } from "~/types";
// Import server modules only in the server-side loader and action functions
import { createConversation, getConversations } from "~/models/conversation.server";

// Loader function to check authentication
export async function loader({ request }: LoaderFunctionArgs) {
  console.log('index')
  const session = await getUserSession(request);
  console.log('user', session);

  // If no user is found, redirect to login page
  if (!session) {
    return redirect("/login");
  }

  // Fetch the user's conversations
  const conversations = await getConversations(session.token);

  return json({ user: session, conversations });
}

// Action function to handle conversation creation
export async function action({ request }: ActionFunctionArgs) {
  const session = await getUserSession(request);

  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get("title") as string || "New Conversation";

  try {
    const newConversation = await createConversation(session.token, { title });
    // Redirect to the same page, which will trigger the loader to get fresh data
    // Include the new conversation ID as a URL parameter to activate it
    return redirect(`/chat/${newConversation.id}`);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return json({ error: "Failed to create conversation" }, { status: 500 });
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "ASIA.ai Dashboard" },
    { name: "description", content: "ASIA.ai Dashboard" },
  ];
};

export default function Index() {
  const { user, conversations } = useLoaderData<typeof loader>();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const fetcher = useFetcher<typeof action>();

  // Create a new conversation using the action
  const createNewConversation = () => {
    const formData = new FormData();
    formData.append("title", "New Conversation");

    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="flex flex-row w-full h-screen bg-gray-50 overflow-hidden">
      <div className="flex-shrink-0">
        <Sidebar
          user={user}
          activeChatId={activeChatId}
          onNewChat={createNewConversation}
          onSelectChat={(chatId) => {
            // Navigate to the chat page when selecting a chat
            window.location.href = `/chat/${chatId}`;
          }}
          conversations={conversations.map(conv => ({
            id: String(conv.id),
            title: conv.title,
            date: new Date(conv.created_at)
          }))}
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
