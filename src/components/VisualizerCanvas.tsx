import React, { useEffect, useRef } from 'react';
import { VisualizerMode } from '../types';

interface VisualizerCanvasProps {
  isPlaying: boolean;
  mode: VisualizerMode;
  analyser: AnalyserNode | null;
  className?: string;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  isPlaying,
  mode,
  analyser,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : new Uint8Array(64);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      tick += 0.03;

      // Populate dataArray: either real WebAudio data or fluid organic live generator when CORS restricts direct node tapping
      let hasRealAudio = false;
      if (analyser && isPlaying) {
        try {
          analyser.getByteFrequencyData(dataArray);
          // Check if we actually got non-zero values
          for (let i = 0; i < 16; i++) {
            if (dataArray[i] > 0) {
              hasRealAudio = true;
              break;
            }
          }
        } catch {
          hasRealAudio = false;
        }
      }

      // If no audio playing, render quiet idle baseline
      if (!isPlaying) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.fillRect(0, height / 2 - 1, width, 2);
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // If playing but no CORS WebAudio data, generate synthetic frequency response
      if (!hasRealAudio && isPlaying) {
        for (let i = 0; i < dataArray.length; i++) {
          const bassBoost = i < 12 ? Math.sin(tick * 2.8 + i * 0.2) * 55 + 90 : 0;
          const midRhythm = Math.sin(tick * 3.5 + i * 0.4) * 40;
          const wave = Math.sin(tick * 1.5 + i * 0.15) * 50 + 60;
          dataArray[i] = Math.max(10, Math.min(240, wave + bassBoost + midRhythm));
        }
      }

      if (mode === 'bars') {
        const barCount = 48;
        const totalGap = width * 0.08;
        const barWidth = (width - totalGap) / barCount;
        const gap = totalGap / (barCount - 1);

        for (let i = 0; i < barCount; i++) {
          const index = Math.floor((i / barCount) * (dataArray.length * 0.7));
          const val = dataArray[index] || 15;
          const percent = val / 255;
          const barHeight = Math.max(4, percent * (height * 0.85));
          const x = i * (barWidth + gap);
          const y = height - barHeight;

          // Gradient color: Cyan to Violet to Amber
          const grad = ctx.createLinearGradient(0, height, 0, y);
          grad.addColorStop(0, '#06b6d4'); // cyan
          grad.addColorStop(0.6, '#6366f1'); // indigo
          grad.addColorStop(1, '#f43f5e'); // rose

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
          ctx.fill();

          // Peak cap
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, Math.max(0, y - 4), barWidth, 2);
        }
      } else if (mode === 'wave') {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const sliceWidth = width / (dataArray.length - 1);
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;

        // Second subtle harmonic wave
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[dataArray.length - 1 - i] / 128.0) * 0.9;
          const y = (v * height) / 2 + Math.sin(tick + i * 0.1) * 8;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      } else if (mode === 'circle') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.28;
        const points = 64;

        ctx.beginPath();
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const dataIdx = Math.floor((i / points) * (dataArray.length * 0.6));
          const val = dataArray[dataIdx] || 10;
          const offset = (val / 255) * (radius * 0.65);
          const r = radius + offset;

          const px = centerX + Math.cos(angle) * r;
          const py = centerY + Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const radialGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius * 1.5);
        radialGrad.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
        radialGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.3)');
        radialGrad.addColorStop(1, 'rgba(244, 63, 94, 0.6)');

        ctx.fillStyle = radialGrad;
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.5 + Math.sin(tick * 3) * 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(165, 180, 252, 0.5)';
        ctx.stroke();
      } else if (mode === 'spectrum') {
        // Multi-layer mountain soundscape
        const slices = 32;
        const sliceWidth = width / slices;

        // Base gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, 'rgba(30, 27, 75, 0.4)');
        bgGrad.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Layer 1
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let i = 0; i <= slices; i++) {
          const val = dataArray[Math.floor((i / slices) * 32)] || 20;
          const h = (val / 255) * (height * 0.75);
          ctx.lineTo(i * sliceWidth, height - h);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.35)';
        ctx.fill();

        // Layer 2
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let i = 0; i <= slices; i++) {
          const val = dataArray[Math.floor(((slices - i) / slices) * 32)] || 10;
          const h = (val / 255) * (height * 0.55);
          ctx.lineTo(i * sliceWidth, height - h);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(236, 72, 153, 0.3)';
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, mode, analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={220}
      className={`w-full h-full block ${className}`}
    />
  );
};
