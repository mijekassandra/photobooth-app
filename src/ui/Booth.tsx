import { useRef, useState } from "react";
import CaptureScreen, {
  type CaptureScreenHandle,
} from "../components/CaptureScreen";
import CaptureButton from "../components/CaptureButton";
import PhotoStrip from "../components/PhotoStrip";
import StripModal from "../components/StripModal";

const SHOTS = 3;
const COUNTDOWN_SECONDS = 5;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Booth = () => {
  const cameraRef = useRef<CaptureScreenHandle>(null);
  const runningRef = useRef(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [shot, setShot] = useState<number | null>(null);
  const [phase, setPhase] = useState<
    "idle" | "countdown" | "processing" | "done"
  >("idle");
  const [photos, setPhotos] = useState<string[]>([]);

  const startSession = async () => {
    if (phase !== "idle" || runningRef.current) return;

    runningRef.current = true;
    const taken: string[] = [];
    setPhase("countdown");

    for (let index = 0; index < SHOTS; index += 1) {
      setShot(index + 1);
      for (let seconds = COUNTDOWN_SECONDS; seconds >= 1; seconds -= 1) {
        setCountdown(seconds);
        await wait(1000);
      }
      setCountdown(null);
      const frame = cameraRef.current?.captureFrame();
      if (!frame) {
        setPhotos([]);
        setShot(null);
        setCountdown(null);
        setPhase("idle");
        runningRef.current = false;
        return;
      }
      taken.push(frame);
      setPhotos([...taken]);
      await wait(400);
    }

    setShot(null);
    setPhase("processing");
    await wait(1400);
    setPhase("done");
  };

  const closeModal = () => {
    setPhotos([]);
    setPhase("idle");
    runningRef.current = false;
  };

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8"
      style={{ backgroundImage: "url('/frames/background.png')" }}
    >
      <h1 className="text-header mb-6">Photobooth App 1</h1>
      <div className="flex items-start gap-12">
        <div className="flex flex-col items-center">
          <CaptureScreen ref={cameraRef} countdown={countdown} shot={shot} />
          <CaptureButton onClick={startSession} disabled={phase !== "idle"} />
        </div>
        <PhotoStrip photos={photos} />
      </div>

      {phase === "processing" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-dark-gray/45">
          <p className="text-header">Processing...</p>
        </div>
      )}

      {phase === "done" && <StripModal photos={photos} onClose={closeModal} />}
    </div>
  );
};

export default Booth;
