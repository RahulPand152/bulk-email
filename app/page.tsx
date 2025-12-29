

import MultiStepForm from "./components/multi-step-navigation";


export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pt-24">
      {/* Centered Welcome Button */}
      <div className="text-center mb-4">
        <MultiStepForm />
        
      </div>

      {/* Description Text */}
      <div className="text-sm md:text-lg text-center px-2 py-2 mb-6">
        Bulk email / message send internal project - Rahul
      </div>

      {/* File Upload Component */}
      <div className="flex flex-col  gap-6 w-full">
        {/* File Upload Panel */}

        {/* <FileUploadAndTable /> */}
      </div>
    </div>
  );
}
