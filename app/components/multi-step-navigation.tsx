"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ComposePage from "../compose/compose-page";
import FileUploadAndTable from "./common/importFile";
import EmailLogsPage from "./emaillogs";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 3 ;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Progress width for blue line
  const progressWidth = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 shadow-2xl rounded-2xl dark:bg-gray-800 ">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="md:text-2xl text-xl font-bold">
          Compose Multi-Step Notice
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Complete all steps to submit your notice.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="relative mb-6 px-10">
        {/* Step container */}
        <div className="relative flex justify-between items-center">
          {/* Background line */}
          <div className="absolute top-5 left-5 right-5 h-1 bg-gray-300 dark:bg-gray-700   rounded-full" />

          {/* Progress line */}
          <div
            className="absolute top-5 left-5 h-1 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `calc(${progressWidth}% - 20px)` }} // subtract padding
          />

          {/* Step Circles */}
          {[...Array(totalSteps)].map((_, i) => {
            const stepNumber = i + 1;
            const isActive = step === stepNumber;
            const isCompleted = stepNumber < step;

            return (
              <div key={i} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-bold border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-blue-500  border-blue-500"
                      : isCompleted
                      ? "bg-blue-300  border-blue-300"
                      : "bg-gray-100 dark:bg-black border-gray-300  dark:border-gray-600"
                  }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <p className="text-center mt-2 text-sm font-medium">
                  Step {stepNumber}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stepNumber === 1 && "Import"}
                  {stepNumber === 2 && "Compose"}
                  {stepNumber === 3 && "Review"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className=" rounded-lg p-6 ">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-2">Step 1: Import</h2>
            <FileUploadAndTable />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-2">Step 2: Compose</h2>
            <ComposePage />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-2">Step 3: Review</h2>

            <EmailLogsPage />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className={step === 1 ? "opacity-50 cursor-not-allowed" : ""}
        >
          Previous
        </Button>
        {step < totalSteps && <Button onClick={nextStep}>Next</Button>}

      </div>
    </div>
  );
}
