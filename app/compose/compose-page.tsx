"use client";
import { MinimalTiptapEditor } from "../components/minimal-tiptap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const templates = [
  {
    id: "marketing_email",
    name: "Marketing Email",
    subject: "Grow Your Career with {company}",
    body: "<p>Hello! {company} helps professionals, freelancers, and businesses connect with meaningful opportunities. Explore new projects and grow your career today!</p>",
  },
  {
    id: "promotion_offer",
    name: "Promotional Offer",
    subject: "Exclusive Offer for You at {company}!",
    body: "<p>Hi there! Use code <strong>KAAM50</strong> to get 50% off {company} services. Hurry, limited time offer!</p>",
  },
  {
    id: "advertisement",
    name: "Advertisement Email",
    subject: "Discover {company} Opportunities Today",
    body: "<p>{company} connects you with businesses and professionals worldwide. Find new opportunities, grow your network, and succeed faster!</p>",
  },
];

import { Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
export default function ComposePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [subject, setSubject] = useState(templates[0].subject);
  const [body, setBody] = useState(templates[0].body);
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const template = templates.find((t) => t.id === value);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6  ">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Compose Urgent Notice
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">
          Create and customize your message for the selected audience
        </p>
      </div>
      {/* Tabs for Compose, Recipients, Review */}
      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="flex w-full md:w-full justify-between  mb-4">
          <TabsTrigger
            value="compose"
            className="md:flex-1 text-left md:text-center py-2 md:py-3  data-[state=active]:text-blue-500"
          >
            <Mail className="inline mr-2 mt-1   data-[state=active]:text-blue-500" />
            Email
          </TabsTrigger>
          <TabsTrigger
            value="recipients"
            className="md:flex-1 text-left md:text-center py-2 md:py-3  data-[state=active]:text-blue-500"
          >
            <MessageSquare className="inline mr-2 mt-1  data-[state=active]:text-blue-500" />
            SMS
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}

        <TabsContent value="compose" className="space-y-4">
          {/* Dropdown for Templates */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="template" className="font-semibold sm:w-32">
              Template
            </Label>

            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>

              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Line */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="subject" className="font-semibold sm:w-32">
              Subject Line
            </Label>

            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full sm:w-96"
            />
          </div>
        </TabsContent>

        {/* Recipients Tab */}
        <TabsContent value="recipients" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="template" className="font-semibold sm:w-32">
              Template SMS
            </Label>

            <Select defaultValue="maintenance">
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="maintenance">Template 1</SelectItem>
                <SelectItem value="update">Template 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="space-y-4">
          {/* Dropdown for Templates */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <Label htmlFor="template">Template</Label>
            <Select defaultValue="maintenance" name="template">
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Template 1</SelectItem>
                <SelectItem value="update">Template 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject Line */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              defaultValue="Urgent: Scheduled System Maintenance"
              className="w-full sm:w-96"
            />
          </div>
        </TabsContent>
      </Tabs>
      {/* Rich Text Editor */}
      <div className="mt-4">
        <MinimalTiptapEditor
          value={body}
          onChange={(val) => setBody(val)}
          className="w-full "
        />
      </div>
    </div>
  );
}
