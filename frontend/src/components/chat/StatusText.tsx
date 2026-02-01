import { useSocketStore } from "@/stores/useSocketStore";

interface StatusTextProps {
    userId: string;
}

const StatusText = ({ userId }: StatusTextProps) => {
    const { onlineUsers } = useSocketStore();
    const isOnline = onlineUsers.includes(userId);

    return (
        <span className="text-sm text-muted-foreground">
            {isOnline ? "Đang hoạt động" : "Offline"}
        </span>
    );
};

export default StatusText;
