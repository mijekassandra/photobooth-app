function cssMatrix(element: HTMLElement) {
  const transform = getComputedStyle(element).transform;
  if (transform === "none") return [1, 0, 0, 1];
  const match = transform.match(/matrix\(([^)]+)\)/);
  if (!match) return [1, 0, 0, 1];
  const [a, b, c, d] = match[1].split(",").map((value) => Number(value.trim()));
  return [a, b, c, d];
}

function stickerCorners(sticker: HTMLElement) {
  const x = sticker.offsetLeft;
  const y = sticker.offsetTop;
  const w = sticker.offsetWidth;
  const h = sticker.offsetHeight;
  const [a, b, c, d] = cssMatrix(sticker);
  const cx = x + w / 2;
  const cy = y + h / 2;
  return [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ].map(([px, py]) => ({
    x: cx + a * px + c * py,
    y: cy + b * px + d * py,
  }));
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;

  if (sourceRatio > targetRatio) {
    sw = image.naturalHeight * targetRatio;
    sx = (image.naturalWidth - sw) / 2;
  } else {
    sh = image.naturalWidth / targetRatio;
    sy = (image.naturalHeight - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function drawSticker(
  ctx: CanvasRenderingContext2D,
  sticker: HTMLImageElement,
  originX: number,
  originY: number,
) {
  const w = sticker.offsetWidth;
  const h = sticker.offsetHeight;
  const [a, b, c, d] = cssMatrix(sticker);
  ctx.save();
  ctx.translate(originX + sticker.offsetLeft + w / 2, originY + sticker.offsetTop + h / 2);
  ctx.transform(a, b, c, d, 0, 0);
  ctx.drawImage(sticker, -w / 2, -h / 2, w, h);
  ctx.restore();
}

export async function downloadStrip(strip: HTMLElement) {
  const stickers = [...strip.querySelectorAll<HTMLImageElement>(":scope > img")];
  const photos = [...strip.querySelectorAll<HTMLImageElement>(".photo-slot img")];
  const slots = [...strip.querySelectorAll<HTMLElement>(".photo-slot")];

  await Promise.all(
    [...stickers, ...photos].map((img) =>
      img.complete ? Promise.resolve() : img.decode().catch(() => undefined),
    ),
  );

  const style = getComputedStyle(strip);
  const borderLeft = Number.parseFloat(style.borderLeftWidth) || 0;
  const borderTop = Number.parseFloat(style.borderTopWidth) || 0;
  const borderRight = Number.parseFloat(style.borderRightWidth) || 0;
  const borderBottom = Number.parseFloat(style.borderBottomWidth) || 0;

  let minX = -borderLeft;
  let minY = -borderTop;
  let maxX = strip.clientWidth + borderRight;
  let maxY = strip.clientHeight + borderBottom;

  stickers.forEach((sticker) => {
    stickerCorners(sticker).forEach((corner) => {
      minX = Math.min(minX, corner.x);
      minY = Math.min(minY, corner.y);
      maxX = Math.max(maxX, corner.x);
      maxY = Math.max(maxY, corner.y);
    });
  });

  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil((maxX - minX) * scale);
  canvas.height = Math.ceil((maxY - minY) * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.scale(scale, scale);
  const originX = -minX;
  const originY = -minY;

  ctx.fillStyle = style.backgroundColor;
  ctx.fillRect(originX - borderLeft, originY - borderTop, strip.offsetWidth, strip.offsetHeight);
  ctx.strokeStyle = style.borderTopColor;
  ctx.lineWidth = borderTop || 2;
  ctx.strokeRect(
    originX - borderLeft + ctx.lineWidth / 2,
    originY - borderTop + ctx.lineWidth / 2,
    strip.offsetWidth - ctx.lineWidth,
    strip.offsetHeight - ctx.lineWidth,
  );

  slots.forEach((slot) => {
    const slotStyle = getComputedStyle(slot);
    const x = originX + slot.offsetLeft;
    const y = originY + slot.offsetTop;
    const frame = Number.parseFloat(slotStyle.borderTopWidth) || 2;
    ctx.fillStyle = slotStyle.backgroundColor;
    ctx.fillRect(x, y, slot.offsetWidth, slot.offsetHeight);

    const photo = slot.querySelector("img");
    if (photo) {
      const innerX = x + frame;
      const innerY = y + frame;
      const innerWidth = slot.offsetWidth - frame * 2;
      const innerHeight = slot.offsetHeight - frame * 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(innerX, innerY, innerWidth, innerHeight);
      ctx.clip();
      drawCover(ctx, photo, innerX, innerY, innerWidth, innerHeight);
      ctx.restore();
    }

    ctx.strokeStyle = slotStyle.borderTopColor;
    ctx.lineWidth = frame;
    ctx.strokeRect(
      x + frame / 2,
      y + frame / 2,
      slot.offsetWidth - frame,
      slot.offsetHeight - frame,
    );
  });

  stickers.forEach((sticker) => drawSticker(ctx, sticker, originX, originY));

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "tinyshots-strip.png";
  link.click();
}
