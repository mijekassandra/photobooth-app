import React from "react";

interface CaptureButtonProps {
  onClick: () => void;
}

const CaptureButton = ({ onClick }: CaptureButtonProps) => {
  return (
    <div className="capture-btn-wrap flex justify-center items-center relative bg-pink-500 mt-8 w-fit">
      <img
        src="./public/stickers/heart.png"
        alt="Capture Button"
        className="absolute top-[-30px] right-34 h-[100px]"
      ></img>
      <button type="button" onClick={onClick} className="capture-btn">
        Capture
      </button>
    </div>
  );
};

export default CaptureButton;
