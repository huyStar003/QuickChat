import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

const ForgotPasswordPage = () => {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-purple">
            <div className="w-full max-w-sm md:max-w-4xl">
                <ForgotPasswordForm />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
