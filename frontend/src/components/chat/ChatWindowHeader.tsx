import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import StatusText from "./StatusText";
import GroupChatAvatar from "./GroupChatAvatar";
import { useSocketStore } from "@/stores/useSocketStore";
import { useState } from "react";
import { Button } from "../ui/button";
import { UserPlus, Info } from "lucide-react";
import AddMembersDialog from "./AddMembersDialog";
import UserProfileDialog from "./UserProfileDialog";

const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  let otherUser;

  chat = chat ?? conversations.find((c) => c._id === activeConversationId);

  if (!chat) {
    return (
      <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
      </header>
    );
  }

  if (chat.type === "direct") {
    const otherUsers = chat.participants.filter((p) => p._id !== user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

    if (!user || !otherUser) return;
  }

  return (
    <header className="sticky top-0 z-10 px-4 py-2 flex items-center justify-between bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <div className="p-2 flex items-center gap-3">
          {/* avatar */}
          <div className="relative">
            {chat.type === "direct" ? (
              <>
                <UserAvatar
                  type={"sidebar"}
                  name={otherUser?.displayName || "QuickChat"}
                  avatarUrl={otherUser?.avatarUrl || undefined}
                />
                {/* todo: socket io */}
                <StatusBadge
                  status={
                    onlineUsers.includes(otherUser?._id ?? "") ? "online" : "offline"
                  }
                />
              </>
            ) : (
              <GroupChatAvatar
                participants={chat.participants}
                type="sidebar"
              />
            )}
          </div>

          {/* name and status */}
          <div className="flex flex-col">
            <h2 className="font-semibold text-foreground">
              {chat.type === "direct" ? otherUser?.displayName : chat.group?.name}
            </h2>
            {chat.type === "direct" && otherUser && (
              <StatusText userId={otherUser._id} />
            )}
          </div>
        </div>
      </div>

      {/* Add Members Button - Only for group chats */}
      {chat.type === "group" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAddMembersDialog(true)}
          className="shrink-0"
        >
          <UserPlus className="h-5 w-5" />
        </Button>
      )}

      {/* Info Button - Only for direct chats */}
      {chat.type === "direct" && otherUser && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowProfileDialog(true)}
          className="shrink-0"
        >
          <Info className="h-5 w-5" />
        </Button>
      )}

      {/* Add Members Dialog */}
      {chat.type === "group" && (
        <AddMembersDialog
          open={showAddMembersDialog}
          onOpenChange={setShowAddMembersDialog}
          conversationId={chat._id}
          existingMemberIds={chat.participants.map((p) => p._id)}
        />
      )}

      {/* User Profile Dialog - For direct chat */}
      {chat.type === "direct" && otherUser && (
        <UserProfileDialog
          userId={otherUser._id}
          open={showProfileDialog}
          onOpenChange={setShowProfileDialog}
        />
      )}
    </header>
  );
};

export default ChatWindowHeader;
