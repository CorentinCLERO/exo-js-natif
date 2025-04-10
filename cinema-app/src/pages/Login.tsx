import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Film, LogIn } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    await login(values.email, values.password);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container py-16">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center items-center mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">MovieBooker</span>
            </Link>
          </div>

          <Card>
            <CardContent>
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-6 mt-8"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="votre@email.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginForm.formState.isSubmitting}
                  >
                    {loginForm.formState.isSubmitting ? (
                      "Connexion en cours..."
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Se connecter
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                <>
                  Pas encore de compte ?{" "}
                  <Button variant="link" className="p-0">
                    <Link to="/register">S'inscrire</Link>
                  </Button>
                </>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
