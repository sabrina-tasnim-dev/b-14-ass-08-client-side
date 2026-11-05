"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignInFormValues = {
  email: string;
  password: string;
};

type SignInFormErrors = Partial<Record<keyof SignInFormValues, string>>;

type SignInFieldName = keyof SignInFormValues;

const initialValues: SignInFormValues = {
  email: "",
  password: "",
};

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) return "Email address is required.";
  if (!EMAIL_PATTERN.test(trimmed)) return "Enter a valid email address.";

  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter.";
  if (!/[0-9]/.test(value)) return "Include at least one number.";

  return undefined;
}

function validate(values: SignInFormValues): SignInFormErrors {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
}

function FieldMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} className="text-xs text-destructive">
      {message}
    </p>
  );
}

export default function SignInPage() {
  const [values, setValues] = useState<SignInFormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<SignInFieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const errors = validate(values);

  const errorFor = (field: SignInFieldName) =>
    submitted || touched[field] ? errors[field] : undefined;

  const markTouched = (field: SignInFieldName) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const update = (field: SignInFieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const currentErrors = validate(values);
    const hasErrors = Object.values(currentErrors).some(Boolean);

    if (hasErrors) {
      toast.error("Please fix the highlighted fields and try again.");
      return;
    }

    toast.success("Sign-in form validated", {
      description:
        "Authentication will be connected here later — no data has been sent.",
    });
  };

  const emailError = errorFor("email");
  const passwordError = errorFor("password");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Sign in to see detailed rates, compare studios and manage your
            bookings.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-base">Sign in to StudioSpace</CardTitle>
            <CardDescription>
              Enter your account details below to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="sign-in-email">
                  Email address{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </Label>
                <Input
                  id="sign-in-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={values.email}
                  onChange={(event) => update("email", event.target.value)}
                  onBlur={() => markTouched("email")}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "sign-in-email-error" : undefined}
                  className="h-9"
                />
                <FieldMessage id="sign-in-email-error" message={emailError} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sign-in-password">
                  Password{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="sign-in-password"
                    type={isVisible ? "text" : "password"}
                    autoComplete="current-password"
                    value={values.password}
                    onChange={(event) => update("password", event.target.value)}
                    onBlur={() => markTouched("password")}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={
                      passwordError ? "sign-in-password-error" : undefined
                    }
                    className="h-9 pr-9"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-1/2 right-1 -translate-y-1/2"
                    onClick={() => setIsVisible((visible) => !visible)}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                  >
                    {isVisible ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                <FieldMessage
                  id="sign-in-password-error"
                  message={passwordError}
                />
                {!passwordError && (
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters, one uppercase letter and one number.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-1">
                <Button type="submit" size="lg" className="w-full">
                  <LogIn />
                  Sign in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
