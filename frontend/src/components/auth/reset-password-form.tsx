import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { authService } from "@/services/authService";

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            if (!token) {
                setErrorMessage("Token không hợp lệ");
                return;
            }

            await authService.resetPassword(token, data.password);
            setIsSuccess(true);

            // Redirect về signin sau 3 giây
            setTimeout(() => {
                navigate("/signin");
            }, 3000);
        } catch (error: any) {
            console.error("Error resetting password:", error);
            setErrorMessage(
                error.response?.data?.message ||
                "Có lỗi xảy ra. Vui lòng thử lại sau."
            );
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

                                <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
                                <p className="text-muted-foreground text-balance">
                                    {isSuccess
                                        ? "Mật khẩu đã được đặt lại thành công!"
                                        : "Nhập mật khẩu mới cho tài khoản của bạn"}
                                </p>
                            </div>

                            {!isSuccess ? (
                                <>
                                    {/* error message */}
                                    {errorMessage && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {errorMessage}
                                        </div>
                                    )}

                                    {/* new password */}
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="password" className="block text-sm">
                                            Mật khẩu mới
                                        </Label>
                                        <Input
                                            type="password"
                                            id="password"
                                            placeholder="Nhập mật khẩu mới"
                                            {...register("password")}
                                        />
                                        {errors.password && (
                                            <p className="text-destructive text-sm">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* confirm password */}
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="confirmPassword" className="block text-sm">
                                            Xác nhận mật khẩu
                                        </Label>
                                        <Input
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="Nhập lại mật khẩu mới"
                                            {...register("confirmPassword")}
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-destructive text-sm">
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* submit button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        Đặt lại mật khẩu
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
                                        Đang chuyển hướng về trang đăng nhập...
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
