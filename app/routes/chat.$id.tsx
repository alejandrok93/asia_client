import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getUserSession } from "~/utils/session.server";
import Sidebar from "~/components/layout/Sidebar";
import ChatContainer from "~/components/chat/ChatContainer";

// Sample chat data - in a real app, this would come from a database
const sampleChats = [
  {
    id: "chat1",
    title: "Project Discussion",
    messages: [
      { id: "m1", role: "assistant", content: "How can I help with your project?", timestamp: new Date() },
      { id: "m2", role: "user", content: "I need to plan the architecture", timestamp: new Date() }
    ]
  },
  {
    id: "chat2",
    title: "Technical Support",
    messages: [
      { id: "m3", role: "assistant", content: "What technical issue are you experiencing?", timestamp: new Date() },
      { id: "m4", role: "user", content: "My application keeps crashing", timestamp: new Date() }
    ]
  }
];

// Loader function to check authentication and get chat data
export async function loader({ request, params }: LoaderFunctionArgs) {
  const chatId = params.id;

  // Get user session
  const session = await getUserSession(request);

  if (!session) {
    return redirect("/login");
  }

  // In a real app, you would fetch the chat data from your API or database
  // Here we're simulating finding a chat by ID from our sample data
  const chat = sampleChats.find(chat => chat.id === chatId) || null;

  // If chat doesn't exist, redirect to the main chat page
  if (!chat) {
    return redirect("/");
  }

  return json({ user: session, chat });
}

export const meta: MetaFunction = ({ data }) => {
  const chatTitle = data?.chat?.title || "Chat";
  return [
    { title: `${chatTitle} | ASIA.ai` },
    { name: "description", content: `ASIA.ai chat conversation: ${chatTitle}` },
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
  const { user, chat } = useLoaderData<typeof loader>();
  const params = useParams();
  const chatId = params.id;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        user={user}
        activeChatId={chatId}
        conversations={sampleChats.map(c => ({ id: c.id, title: c.title, date: new Date() }))}
        onSelectChat={(id) => window.location.href = `/chat/${id}`}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatContainer
          chatId={chatId}
          user={user}
          initialMessages={chat?.messages || []}
        />
      </main>
    </div>
  );
}
