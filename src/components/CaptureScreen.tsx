import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type CaptureScreenHandle = {
  captureFrame: () => string | null;
};

type CaptureScreenProps = {
  countdown: number | null;
  shot: number | null;
};

const CaptureScreen = forwardRef<CaptureScreenHandle, CaptureScreenProps>(
  function CaptureScreen({ countdown, shot }, ref) {
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

    useImperativeHandle(ref, () => ({
      captureFrame: () => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return null;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        return canvas.toDataURL("image/jpeg", 0.92);
      },
    }));

    return (
      <div className="flex w-full max-w-[360px] flex-col items-center justify-center">
        <img
          src="/frames/photobooth-header.png"
          alt="Photobooth Header"
          className="w-full"
        />
        <div className="relative h-[250px] w-full overflow-hidden border-2 border-t-0 border-dark-gray bg-light-cream">
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
          {countdown !== null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-gray/25">
              <span className="text-header text-[88px] leading-none opacity-50">
                {countdown}
              </span>
              {shot !== null && (
                <span className="text-header mt-2 text-[22px] leading-none opacity-50">
                  Photo {shot} of 3
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default CaptureScreen;
