"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function AuthHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between w-full p-4 border-b border-zinc-200 dark:border-zinc-800">
      <span className="text-lg font-semibold">{title}</span>
      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}