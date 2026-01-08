"use client";

import { useState, useEffect } from "react";
import { MinimalTiptapEditor } from "../components/minimal-tiptap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";
import { Loader2 } from "lucide-react";

type EmailRecipient = {
  email: string;
  firstName: string;
  lastName?: string;
};

export default function ComposePage() {
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    subject?: string;
    body?: string;
  }>({});

  useEffect(() => {
    const stored = localStorage.getItem("email_recipients");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as EmailRecipient[];
        if (Array.isArray(parsed)) {
          setRecipients(parsed);
        }
      } catch (e) {
        console.error("Failed to parse recipients", e);
      }
    }
  }, []);

  // const replaceVariables = (template: string, recipient: EmailRecipient) => {
  //   return template
  //     .replace(/\{firstName\}/g, recipient.firstName || "")
  //     .replace(/\{lastName\}/g, recipient.lastName || "")
  //     .replace(/\{email\}/g, recipient.email || "")
  //     .replace(/\{contactNumber\}/g, "982626262626")
  //     .replace(/\{ctaLink\}/g, "https://kaamhubs.com");
  // };

  const handleSendEmails = async () => {
    if (isLoading) return;

    const newErrors: typeof errors = {};

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    const cleanBody = body
      .replace(/<(.|\n)*?>/g, "")
      .replace(/&nbsp;/g, "")
      .trim();

    if (!cleanBody) {
      newErrors.body = "Email body is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (recipients.length === 0) {
      alert("No recipients selected");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          body,
          recipients,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send emails");
      }

      // alert(`Emails sent to ${recipients.length} recipients`);
    } catch (err) {
      console.error(err);
      alert("Error sending emails");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
        <h1 className="text-xl sm:text-3xl font-bold">Compose Bulk Email</h1>
        <p className="text-xs sm:text-base text-gray-300">
          Write a custom subject and message for your recipients.
        </p>
      </div>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="flex w-full rounded-lg overflow-hidden border">
          <TabsTrigger
            value="compose"
            className="flex-1 py-2 sm:py-3 text-sm sm:text-base flex items-center justify-center
                   data-[state=active]:bg-blue-50 data-[state=active]:text-blue-500"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>

          <TabsTrigger
            value="SMS"
            className="flex-1 py-2 sm:py-3 text-sm sm:text-base flex items-center justify-center
                   data-[state=active]:bg-blue-50 data-[state=active]:text-blue-500"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            SMS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4 sm:space-y-5">
          {/* Subject */}
          <div className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] gap-2 sm:gap-4">
            <Label
              htmlFor="subject"
              className="font-semibold text-sm sm:text-base"
            >
              Subject
            </Label>

            <div className="w-full sm:max-w-lg">
              <Input
                id="subject"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setErrors((p) => ({ ...p, subject: undefined }));
                }}
                className={`w-full ${
                  errors.subject
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              {errors.subject && (
                <p className="text-xs sm:text-sm text-red-500 mt-1">
                  {errors.subject}
                </p>
              )}
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-2">
            <Label className="font-semibold text-sm sm:text-base">
              Email Body
            </Label>

            <div
              className={`rounded-md ${
                errors.body
                  ? "border border-red-500"
                  : "border border-transparent"
              }`}
            >
              <MinimalTiptapEditor
                value={body}
                onChange={(val) => {
                  if (typeof val === "string") {
                    setBody(val);
                    setErrors((p) => ({ ...p, body: undefined }));
                  }
                }}
              />
            </div>

            {errors.body && (
              <p className="text-xs sm:text-sm text-red-500">{errors.body}</p>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            Sending to <strong>{recipients.length}</strong> recipient(s)
          </p>

          <Button
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 disabled:opacity-60"
            onClick={handleSendEmails}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Bulk Emails"
            )}
          </Button>
        </TabsContent>

        <TabsContent value="SMS" className="space-y-3">
          <Label className="font-semibold text-sm sm:text-base">SMS</Label>
          <MinimalTiptapEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
