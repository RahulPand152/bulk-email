"use client";
import MultiStepForm from "./components/multi-step-navigation";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pt-24 ">
      {/* Centered Welcome Button */}
      <div className="text-center mb-4 ">
        <MultiStepForm />
      </div>
    </div>
  );
}
