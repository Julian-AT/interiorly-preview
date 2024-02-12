"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BetaSignupSchema } from "@/schemas/beta";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

export default function BetaSignup() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof BetaSignupSchema>>({
    resolver: zodResolver(BetaSignupSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof BetaSignupSchema>) {
    console.log(values);
    setIsLoading(true);
    const requestURL =
      process.env.NODE_ENV === "production"
        ? "https://interiorly.vercel.app/api/beta/join"
        : "http://localhost:3000/api/beta/join";

    try {
      const result = await fetch(requestURL, {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await result.json();
      console.log(data);
      if (result.ok) {
        toast.success("Successfully signed up for the beta.", {
          description: "Check your email inbox for a confirmation message.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast(error.message || "An error occurred");
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="container py-10 max-w-xl flex flex-col gap-3">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Join the Beta</h1>
        <p className="text-muted-foreground">
          Enter your information to join the beta. <br /> We&apos;ll notify you
          when Interiorly is ready for you.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="hello@interiorly.dev" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-10">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-baseline">
                Signing Up...&nbsp;
                <Icons.spinner className="mr-2 animate-spin w-full h-4 m-auto" />
              </span>
            ) : (
              <span>Sign Up</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
