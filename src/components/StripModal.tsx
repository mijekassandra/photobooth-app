import { useRef } from "react";
import PhotoStrip from "./PhotoStrip";
import { downloadStrip } from "../lib/downloadStrip";

type StripModalProps = {
  photos: string[];
  onClose: () => void;
};

const StripModal = ({ photos, onClose }: StripModalProps) => {
  const stripRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-gray/55 p-6">
      <div className="relative flex shrink-0 flex-col items-center">
        <button
          type="button"
          className="close-btn absolute -top-4 -right-16 z-10"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
          <span className="sr-only">Close</span>
        </button>
        <PhotoStrip ref={stripRef} photos={photos} />
        <div className="capture-btn-wrap mt-8">
          <button
            type="button"
            className="download-btn"
            onClick={() => {
              if (stripRef.current) downloadStrip(stripRef.current);
            }}
          >
            Download strip
          </button>
        </div>
      </div>
    </div>
  );
};

export default StripModal;
