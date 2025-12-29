"use client";

import { cn } from "@/lib/utils";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import { useEffect, useMemo, useState } from "react";
import { Content } from "@tiptap/core";
import { Label } from "@/components/ui/label";

export const TextEditor = ({
  description,
  handleChange,
  label,
  error,
}: {
  description: Content | string | null;
  handleChange: (val: any) => void;
  label?: string;
  error?: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize the content to prevent unnecessary re-renders
  const content = useMemo(() => {
    if (!description) return "";

    // If it's already a proper Content object, return it
    if (
      typeof description === "object" &&
      !Array.isArray(description) &&
      "type" in description
    ) {
      return description;
    }

    // If it's a string (HTML or plain text), return as-is
    // TipTap will parse HTML and render it as formatted text
    if (typeof description === "string") {
      return description;
    }

    return "";
  }, [description]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <MinimalTiptapEditor
        value={content}
        onChange={handleChange}
        throttleDelay={500}
        className={cn("w-full min-h-[200px] h-auto", {
          "border-destructive focus-within:border-destructive": error,
        })}
        editorContentClassName="p-5"
        output="html"
        placeholder="Type your content here..."
        autofocus={false}
        immediatelyRender={true}
        editable={true}
        shouldRerenderOnTransaction={false}
        editorClassName="focus:outline-none"
      />
    </div>
  );
};
