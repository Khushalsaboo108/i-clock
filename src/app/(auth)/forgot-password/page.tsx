"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Clock,
  Loader2,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { forgotPasswordAction } from "@/lib/actions"

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await forgotPasswordAction(data.email)

      if (response.success) {
        setSubmittedEmail(data.email)
        setIsSuccess(true)
      } else {
        setError(response.message || "Failed to send reset email. Please try again.")
      }
    } catch (err) {
      // Don't reveal if email exists or not for security
      // Always show success message to prevent email enumeration
      setSubmittedEmail(data.email)
      setIsSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-background via-background to-muted/50 px-4">
      {/* Main Content */}
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {isSuccess ? "Check your email" : "Forgot password?"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSuccess
              ? "We've sent you a password reset link"
              : "No worries, we'll send you reset instructions"}
          </p>
        </div>

        {/* Card */}
        <Card className="border-border/50 shadow-xl">
          {isSuccess ? (
            // Success State
            <>
              <CardContent className="pt-6 pb-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We sent a password reset link to
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {submittedEmail}
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Didn't receive the email? Check your spam folder, or{" "}
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setIsSuccess(false)
                        setError(null)
                      }}
                      className="text-primary hover:underline font-medium p-0 h-auto"
                    >
                      try another email address
                    </Button>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                <Button asChild className="w-full h-11 font-medium">
                  <Link href="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Link>
                </Button>
              </CardFooter>
            </>
          ) : (
            // Form State
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl font-semibold">
                  Reset your password
                </CardTitle>
                <CardDescription>
                  Enter the email address associated with your account
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  {/* Error Alert */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        className="pl-10 h-11"
                        {...register("email")}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-2">
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>

                  {/* Back to Login */}
                  <Button
                    type="button"
                    variant="ghost"
                    asChild
                    className="w-full h-11 font-medium"
                  >
                    <Link href="/login">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to sign in
                    </Link>
                  </Button>
                </CardFooter>
              </form>
            </>
          )}
        </Card>

        {/* Help Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Having trouble?{" "}
          <Link
            href="/contact"
            className="text-primary font-medium hover:text-primary/80 hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
