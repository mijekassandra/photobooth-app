import React from "react";

//components
import CaptureScreen from "../components/CaptureScreen";
import CaptureButton from "../components/CaptureButton";
import PhotoStrip from "../components/PhotoStrip";

const Booth = () => {
  return (
    <>
      <div
        className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-cover bg-center bg-no-repeat px-4 py-8"
        style={{ backgroundImage: "url('./public/frames/background.png')" }}
      >
        <h1 className="text-header mb-6">Photobooth App</h1>
        <div className="flex items-start gap-12">
          <div className="flex flex-col items-center">
            <CaptureScreen />
            <CaptureButton onClick={() => {}} />
          </div>
          <PhotoStrip />
        </div>
      </div>
    </>
  );
};

export default Booth;
