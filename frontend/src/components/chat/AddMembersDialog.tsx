import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFriendStore } from "@/stores/useFriendStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { chatService } from "@/services/chatService";
import UserAvatar from "./UserAvatar";

interface AddMembersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    conversationId: string;
    existingMemberIds: string[];
}

const AddMembersDialog = ({
    open,
    onOpenChange,
    conversationId,
    existingMemberIds,
}: AddMembersDialogProps) => {
    const { friends } = useFriendStore();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter out friends already in group
    const availableFriends = friends.filter(
        (f) => !existingMemberIds.includes(f._id)
    );

    const handleToggle = (friendId: string) => {
        setSelectedIds((prev) =>
            prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleAddMembers = async () => {
        if (selectedIds.length === 0) return;

        setLoading(true);
        try {
            await chatService.addMembersToGroup(conversationId, selectedIds);
            onOpenChange(false);
            setSelectedIds([]);
        } catch (error) {
            console.error("Error adding members:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm thành viên</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availableFriends.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-4">
                            Tất cả bạn bè đã là thành viên
                        </p>
                    ) : (
                        availableFriends.map((friend) => (
                            <div
                                key={friend._id}
                                className="flex items-center gap-3 p-2 hover:bg-accent rounded-md cursor-pointer"
                                onClick={() => handleToggle(friend._id)}
                            >
                                <Checkbox
                                    checked={selectedIds.includes(friend._id)}
                                    onCheckedChange={() => handleToggle(friend._id)}
                                />
                                <UserAvatar
                                    type="sidebar"
                                    name={friend.displayName}
                                    avatarUrl={friend.avatarUrl}
                                />
                                <span className="font-medium">{friend.displayName}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                            setSelectedIds([]);
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleAddMembers}
                        disabled={selectedIds.length === 0 || loading}
                    >
                        {loading ? "Đang thêm..." : `Thêm (${selectedIds.length})`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddMembersDialog;
