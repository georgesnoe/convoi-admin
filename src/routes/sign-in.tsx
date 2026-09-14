import { useState } from "react";
import { Button } from "../components/ui/button";
import z from "zod";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { Logo } from "../components/logo";
import { signIn } from "../lib/api";
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
import { NavLink, useNavigate } from "react-router";
import { Separator } from "../components/ui/separator";
import { IconBrandGoogle } from "@tabler/icons-react";

const signInSchema = z.object({
  email: z
    .email("Entrer une adresse email valide")
    .min(1, "L'adresse email est obligatoire"),
  password: z.string().min(8, "Le mot de passe est obligatoire"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = signInSchema.safeParse(data);
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
      const response = await signIn({
        email: result.data.email,
        password: result.data.password,
      });
      if (response.status === 200) {
        toast.success("Bon retour");
        navigate("/dashboard");
      } else {
        toast.error("La connexion a échoué. Veuillez réessayer.");
      }
    } catch {
      toast.error("La connexion a échoué. Veuillez réessayer.");
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
            Connexion
          </CardTitle>
          <CardDescription className="text-sm">
            Bon retour. Entrez vos informations pour continuer
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
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
                  aria-invalid={!!errors.password}
                  onChange={() => clearError("password")}
                />
                <FieldError>{errors.password}</FieldError>
              </Field>
              <Field orientation="horizontal" className="justify-between">
                <Button
                  variant="link"
                  size="xs"
                  className="h-auto p-0 text-xs"
                  render={<NavLink to="#" />}
                  nativeButton={false}
                >
                  Mot de passe oublié?
                </Button>
              </Field>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Connexion…" : "Connexion"}
              </Button>
            </FieldGroup>
          </form>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" />
            Ou
            <Separator className="flex-1" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => toast("Connexion avec Google…")}
            >
              <IconBrandGoogle data-icon="inline-start" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          Vous n'avez pas de compte?
          <Button
            variant="link"
            className="px-1"
            render={<NavLink to="/sign-up" />}
            nativeButton={false}
          >
            S'inscrire
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
