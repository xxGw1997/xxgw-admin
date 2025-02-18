import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "~/store/auth";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

const Login = () => {
  const { user, login } = useAuthStore();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
    try {
      setIsSubmit(true);
      const res = await login(email, password);
      if (res) navigate("/", { replace: true });
    } catch (error) {
      setIsSubmit(false);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/60 h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={loginForm.control}
                name="email"
                disabled={isSubmit}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="xxgw@exapmle.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your account email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                disabled={isSubmit}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your account password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmit}>
                {isSubmit && <Loader2 className="animate-spin" />} Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
