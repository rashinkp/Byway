// src/components/auth/LoginForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SplitScreenLayout } from "@/components/ui/SplitScreenLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useLogin } from "@/hooks/auth/useLogin";
import { useRoleRedirect } from "@/hooks/useRoleRedirects";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();
  const { redirectByRole } = useRoleRedirect();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: (user) => {
          redirectByRole(user.data.role);
        },
      }
    );
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <SplitScreenLayout
      title="Learning Reimagined"
      description="Join thousands of students and instructors on our platform to unlock your potential."
      imageAlt="Learning platform illustration"
    >
      <AuthForm
        form={form}
        onSubmit={onSubmit}
        fields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "user@example.com",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "••••••",
          },
        ]}
        title="Welcome back"
        subtitle="Please enter your details to sign in"
        submitText="Sign in"
        isSubmitting={isPending}
        error={error?.message}
        googleAuthText="Continue with Google"
        onGoogleAuth={handleGoogleLogin}
        authLink={{
          text: "Don't have an account?",
          linkText: "Create account",
          href: "/signup",
        }}
        extraLink={{
          text: "",
          linkText: "Forgot password?",
          href: "/forgot-password",
        }}
      />
    </SplitScreenLayout>
  );
}

export default LoginForm;
