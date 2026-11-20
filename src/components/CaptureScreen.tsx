import { useEffect, useRef, useState } from "react";

const CaptureScreen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    let stream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((mediaStream) => {
        stream = mediaStream;
        if (!video) return;
        video.srcObject = mediaStream;
      })
      .catch(() => {
        setCameraError("Allow camera access to use the booth.");
      });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="w-[360px] flex flex-col items-center justify-center ">
      <img
        src="./public/frames/photobooth-header.png"
        alt="Photobooth Header"
        className="w-full"
      />
      <div className="bg-light-cream w-full h-[250px] border-2 border-t-0 border-dark-gray overflow-hidden">
        {cameraError ? (
          <p className="p-4 text-center text-sm">{cameraError}</p>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover -scale-x-100"
          />
        )}
      </div>
    </div>
  );
};

export default CaptureScreen;
