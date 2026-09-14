import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import z from "zod";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field";
import { Input } from "../components/ui/input";
import { Logo } from "../components/logo";
import { signUp } from "../lib/api";

const signUpSchema = z.object({
  name: z.string().min(2, "Entrer votre nom et prénoms"),
  email: z
    .email("Entrer une adresse email valide")
    .min(1, "L'adresse email est obligatoire"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export default function SignUp() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = signUpSchema.safeParse(data);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key]) {
          next[key] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      const response = await signUp({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });
      if (response.status === 200) {
        toast.success("Compte créé. Bon retour !");
        navigate("/dashboard");
      } else {
        toast.error("L'inscription a échoué. Veuillez réessayer.");
      }
    } catch {
      toast.error("L'inscription a échoué. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <Toaster />
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Logo className="mx-auto size-7 shrink-0 text-primary" />
          <CardTitle className="mt-4 text-xl font-bold tracking-tight">
            Créer un compte
          </CardTitle>
          <CardDescription className="text-sm">
            Entrez vos informations pour commencer
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nom & Prénoms</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jean Dupont"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  onChange={() => clearError("name")}
                />
                <FieldError>{errors.name}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  onChange={() => clearError("email")}
                />
                <FieldError>{errors.email}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  onChange={() => clearError("password")}
                />
                <FieldError>{errors.password}</FieldError>
              </Field>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Inscription…" : "S'inscrire"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          Vous avez déjà un compte?
          <Button
            variant="link"
            className="px-1"
            render={<NavLink to="/sign-in" />}
            nativeButton={false}
          >
            Se connecter
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
