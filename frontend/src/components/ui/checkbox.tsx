import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
}

export const Checkbox = ({ checked, onCheckedChange, className }: CheckboxProps) => {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                checked && "bg-primary text-primary-foreground",
                className
            )}
        >
            {checked && <Check className="h-4 w-4" />}
        </button>
    );
};
