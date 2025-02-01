import type { TextStyle } from '../../shared/types';

const CANVAS_MULTIPLIER = 2; // For higher resolution rendering

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (ctx == null) throw new Error('Failed to get canvas context');
    this.ctx = ctx;
    this.scale = 1;

    // Set up high-DPI canvas
    const dpr = window.devicePixelRatio;
    this.canvas.width = this.canvas.offsetWidth * dpr * CANVAS_MULTIPLIER;
    this.canvas.height = this.canvas.offsetHeight * dpr * CANVAS_MULTIPLIER;
    this.ctx.scale(dpr * CANVAS_MULTIPLIER, dpr * CANVAS_MULTIPLIER);

    // Set canvas CSS size
    this.canvas.style.width = `${this.canvas.offsetWidth}px`;
    this.canvas.style.height = `${this.canvas.offsetHeight}px`;
  }

  drawImage(img: HTMLImageElement) {
    // Calculate scaling to fit image while maintaining aspect ratio
    const imgAspect = img.width / img.height;
    const canvasAspect = this.canvas.width / this.canvas.height;
    let drawWidth = this.canvas.width;
    let drawHeight = this.canvas.height;

    if (imgAspect > canvasAspect) {
      drawHeight = drawWidth / imgAspect;
    } else {
      drawWidth = drawHeight * imgAspect;
    }

    // Center the image
    const x = (this.canvas.width - drawWidth) / 2;
    const y = (this.canvas.height - drawHeight) / 2;

    // Create blurred background
    this.ctx.save();
    this.ctx.filter = 'blur(20px)';
    this.ctx.drawImage(
      img,
      -10,
      -10,
      this.canvas.width + 20,
      this.canvas.height + 20,
    );
    this.ctx.filter = 'none';

    // Draw main image
    this.ctx.drawImage(img, x, y, drawWidth, drawHeight);
    this.ctx.restore();

    // Store scale for text positioning
    this.scale = drawWidth / img.width;
  }

  addText(text: string, x: number, y: number, style: TextStyle) {
    const scaledFontSize = style.fontSize * this.scale;
    this.ctx.font = `${scaledFontSize}px ${style.fontFamily}`;
    this.ctx.fillStyle = style.color;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Add text shadow
    this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;

    if (style.backgroundColor != null) {
      const metrics = this.ctx.measureText(text);
      const padding = scaledFontSize * 0.2;
      this.ctx.fillStyle = style.backgroundColor;
      this.ctx.fillRect(
        x - metrics.width / 2 - padding,
        y - scaledFontSize / 2 - padding,
        metrics.width + padding * 2,
        scaledFontSize + padding * 2,
      );
    }

    this.ctx.fillStyle = style.color;
    this.ctx.fillText(text, x, y);
    this.ctx.shadowColor = 'transparent';
  }

  getScale() {
    return this.scale;
  }
}
