import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";

interface UserProfileDialogProps {
    userId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface UserProfile {
    _id: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
    email: string;
    createdAt: string;
}

const UserProfileDialog = ({
    userId,
    open,
    onOpenChange,
}: UserProfileDialogProps) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && userId) {
            const fetchUser = async () => {
                setLoading(true);
                try {
                    const userData = await userService.getUserById(userId);
                    setUser(userData);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [open, userId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thông tin tài khoản</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <span className="loading loading-spinner text-primary">Loading...</span>
                    </div>
                ) : user ? (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <Avatar className="h-24 w-24 border-2 border-primary/20">
                            <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                                {user.displayName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-bold">{user.displayName}</h3>
                            <p className="text-muted-foreground">@{user.username}</p>
                        </div>

                        <div className="w-full grid grid-cols-1 gap-3 mt-4 text-sm">
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium">{user.email}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <span className="text-muted-foreground">Ngày tham gia</span>
                                <span className="font-medium">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                        <User className="h-12 w-12 mb-2 opacity-50" />
                        <p>Không tìm thấy thông tin người dùng</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UserProfileDialog;
