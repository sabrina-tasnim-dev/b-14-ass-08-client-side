"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
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

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpFormErrors = Partial<Record<keyof SignUpFormValues, string>>;

type SignUpFieldName = keyof SignUpFormValues;

const initialValues: SignUpFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function validateName(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) return "Your name is required.";
  if (trimmed.length < 3) return "Name must be at least 3 characters.";

  return undefined;
}

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

function validateConfirmPassword(
  value: string,
  password: string
): string | undefined {
  if (!value) return "Please confirm your password.";
  if (value !== password) return "Passwords do not match.";

  return undefined;
}

function validate(values: SignUpFormValues): SignUpFormErrors {
  return {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.confirmPassword,
      values.password
    ),
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

type PasswordFieldProps = {
  id: string;
  label: string;
  autoComplete: string;
  value: string;
  error?: string;
  hint: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
};

function PasswordField({
  id,
  label,
  autoComplete,
  value,
  error,
  hint,
  isVisible,
  onToggleVisibility,
  onChange,
  onBlur,
}: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}{" "}
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder="Enter your password"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-9 pr-9"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={onToggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
        >
          {isVisible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      <FieldMessage id={`${id}-error`} message={error} />
      {!error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function SignUpPage() {
  const [values, setValues] = useState<SignUpFormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<SignUpFieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const errors = validate(values);

  const errorFor = (field: SignUpFieldName) =>
    submitted || touched[field] ? errors[field] : undefined;

  const markTouched = (field: SignUpFieldName) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const update = (field: SignUpFieldName, value: string) => {
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

    toast.success("Sign-up form validated", {
      description:
        "Your account has not been created yet — authentication will be connected later.",
    });
  };

  const handleClear = () => {
    setValues(initialValues);
    setTouched({});
    setSubmitted(false);
    setIsPasswordVisible(false);
    setIsConfirmVisible(false);
  };

  const nameError = errorFor("name");
  const emailError = errorFor("email");
  const passwordError = errorFor("password");
  const confirmPasswordError = errorFor("confirmPassword");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Create your account
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Join StudioSpace to book creative studios by the hour and manage
            your listings.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-base">Sign up for StudioSpace</CardTitle>
            <CardDescription>
              Fill in the details below to create your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="sign-up-name">
                  Full name{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </Label>
                <Input
                  id="sign-up-name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(event) => update("name", event.target.value)}
                  onBlur={() => markTouched("name")}
                  placeholder="e.g. Alex Morgan"
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? "sign-up-name-error" : undefined}
                  className="h-9"
                />
                <FieldMessage id="sign-up-name-error" message={nameError} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sign-up-email">
                  Email address{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </Label>
                <Input
                  id="sign-up-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={values.email}
                  onChange={(event) => update("email", event.target.value)}
                  onBlur={() => markTouched("email")}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "sign-up-email-error" : undefined}
                  className="h-9"
                />
                <FieldMessage id="sign-up-email-error" message={emailError} />
              </div>

              <PasswordField
                id="sign-up-password"
                label="Password"
                autoComplete="new-password"
                value={values.password}
                error={passwordError}
                hint="At least 8 characters, one uppercase letter and one number."
                isVisible={isPasswordVisible}
                onToggleVisibility={() =>
                  setIsPasswordVisible((visible) => !visible)
                }
                onChange={(value) => update("password", value)}
                onBlur={() => markTouched("password")}
              />

              <PasswordField
                id="sign-up-confirm-password"
                label="Confirm password"
                autoComplete="new-password"
                value={values.confirmPassword}
                error={confirmPasswordError}
                hint="Re-enter your password to confirm it."
                isVisible={isConfirmVisible}
                onToggleVisibility={() =>
                  setIsConfirmVisible((visible) => !visible)
                }
                onChange={(value) => update("confirmPassword", value)}
                onBlur={() => markTouched("confirmPassword")}
              />

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <Button type="submit" size="lg" className="flex-1">
                  <UserPlus />
                  Create account
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleClear}
                >
                  Clear form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
