"use client";

import { LoginForm } from "./components/login";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-md  p-6 rounded-lg shadow-md text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Welcome</h1>
        <LoginForm />
      </div>
    </div>
  );
}
