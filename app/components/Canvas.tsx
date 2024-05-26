"use client";

import { useEffect, useRef } from 'react';

interface BBox {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface Prediction {
  label: string;
  score: number;
  bbox: BBox;
}

interface CanvasProps {
  imgSrc: string;
  predictions: Prediction[];
}

const Canvas: React.FC<CanvasProps> = ({ imgSrc, predictions }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const img = imgRef.current;

    if (context && img) {
      img.onload = () => {
        if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        predictions.forEach((prediction) => {
          const { x1, x2, y1, y2 } = prediction.bbox;
          const width = x2 - x1;
          const height = y2 - y1;

          // Draw blue transparent rectangle
          context.fillStyle = 'rgba(0, 0, 255, 0.1)'; // Blue with 10% opacity
          context.fillRect(x1, y1, width, height);

          // Draw blue border
          context.strokeStyle = 'blue';
          context.lineWidth = 2;
          context.strokeRect(x1, y1, width, height);

          // // Draw label background
          // context.fillStyle = 'white';
          // context.fillRect(x1, y2 - 20, context.measureText(`${prediction.label} (${(prediction.score * 100).toFixed(2)}%)`).width + 10, 20);

          // Draw label text
          context.fillStyle = 'blue';
          context.font = '40px Arial';
          context.fillText(
            `${prediction.label} (${(prediction.score * 100).toFixed(2)}%)`,
            x1 + 5,
            y2 - 5
          );
        });
      };
    }
  }
  }, [imgSrc, predictions]);

  return (
    <div className="border border-gray-300 p-2">
      <img ref={imgRef} src={imgSrc} alt="Prediction" style={{ display: 'none' }} />
      <canvas ref={canvasRef} className="max-w-full h-auto" />
    </div>
  );
};

export default Canvas;
