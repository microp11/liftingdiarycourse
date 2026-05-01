"use client";

import { SignIn, SignUp, Show, UserButton } from "@clerk/nextjs";
import { useState } from "react";

function AuthModal({ children, open, onClose, component: Component }: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  component: React.ComponentType<{ routing: "path"; path: string }>;
}) {
  if (!open) return children;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <Component routing="path" path="/sign-in" />
      </div>
    </div>
  );
}

export function AuthHeader({ title }: { title: string }) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <header className="flex items-center justify-between w-full p-4 border-b border-zinc-200 dark:border-zinc-800">
      <span className="text-lg font-semibold">{title}</span>
      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <AuthModal open={showSignIn} onClose={() => setShowSignIn(false)} component={SignIn}>
            <button
              onClick={() => setShowSignIn(true)}
              className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </AuthModal>
          <AuthModal open={showSignUp} onClose={() => setShowSignUp(false)} component={SignUp}>
            <button
              onClick={() => setShowSignUp(true)}
              className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
          </AuthModal>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}