interface CaptureButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const CaptureButton = ({ onClick, disabled = false }: CaptureButtonProps) => {
  return (
    <div className="capture-btn-wrap relative mt-8 flex w-fit items-center justify-center">
      <img
        src="/stickers/heart.png"
        alt=""
        className="absolute top-[-30px] right-34 h-[100px]"
      />
      <button type="button" onClick={onClick} disabled={disabled} className="capture-btn">
        Capture
      </button>
    </div>
  );
};

export default CaptureButton;
