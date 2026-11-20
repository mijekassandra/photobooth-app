import { forwardRef } from "react";

const slots = [0, 1, 2];

type PhotoStripProps = {
  photos?: string[];
};

const PhotoStrip = forwardRef<HTMLDivElement, PhotoStripProps>(
  function PhotoStrip({ photos = [] }, ref) {
    return (
      <div ref={ref} className="photo-strip">
        <img
          src="/stickers/pacman.svg"
          alt=""
          className="absolute top-[3px] left-[90px] w-[86px] h-auto"
        />
        {slots.map((slot) => (
          <div key={slot} className="photo-slot">
            {photos[slot] && (
              <img
                src={photos[slot]}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>
        ))}
        <img
          src="/stickers/star.svg"
          alt=""
          className="absolute left-[-14px] bottom-[-10px] z-10 w-[124px] h-auto"
        />
        <img
          src="/stickers/star.svg"
          alt=""
          className="absolute left-[80px] bottom-[14px] z-10 w-[54px] h-auto rotate-[38deg]"
        />
        <img
          src="/stickers/star.svg"
          alt=""
          className="absolute left-[86px] bottom-[56px] z-10 w-[26px] h-auto rotate-[-12deg]"
        />
      </div>
    );
  },
);

export default PhotoStrip;
