'use client';
import MultiStepForm from "./components/multi-step-navigation";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pt-24 ">
      {/* Centered Welcome Button */}
      <div className="text-center mb-4 ">
        <MultiStepForm />
      </div>
      

      {/* Description Text */}
      {/* <div className="text-sm md:text-lg text-center px-2 py-2 mb-6">
        <button
          onClick={async () => {
            await fetch("/api/send-email", { method: "POST" });
            alert("Email sent!");
          }}
        >
          Send Email
        </button>
        
      </div> */}
    </div>
  );
}
