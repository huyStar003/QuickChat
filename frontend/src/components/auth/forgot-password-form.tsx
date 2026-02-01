import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { useState } from "react";
import { authService } from "@/services/authService";

const forgotPasswordSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            await authService.forgotPassword(data.email);
            setIsSuccess(true);
        } catch (error) {
            console.error("Error sending reset email:", error);
            // Vẫn hiển thị success để tránh email enumeration
            setIsSuccess(true);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 border-border">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            {/* header - logo */}
                            <div className="flex flex-col items-center text-center gap-2">
                                <a href="/" className="mx-auto block w-fit text-center">
                                    <img src="/logo.svg" alt="logo" />
                                </a>

                                <h1 className="text-2xl font-bold">Khôi phục mật khẩu</h1>
                                <p className="text-muted-foreground text-balance">
                                    {isSuccess
                                        ? "Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn."
                                        : "Nhập email để nhận link đặt lại mật khẩu"}
                                </p>
                            </div>

                            {!isSuccess ? (
                                <>
                                    {/* email */}
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="email" className="block text-sm">
                                            Email
                                        </Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            placeholder="example@gmail.com"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <p className="text-destructive text-sm">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* submit button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        Gửi email khôi phục
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-4 text-center">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-green-600 dark:text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn
                                        đặt lại mật khẩu trong vài phút.
                                    </p>
                                </div>
                            )}

                            {/* back to login */}
                            <div className="text-center text-sm">
                                <a
                                    href="/signin"
                                    className="text-primary hover:underline underline-offset-4"
                                >
                                    ← Quay lại đăng nhập
                                </a>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.png"
                            alt="Image"
                            className="absolute top-1/2 -translate-y-1/2 object-cover"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
                Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
                <a href="#">Chính sách bảo mật</a> của chúng tôi.
            </div>
        </div>
    );
}
