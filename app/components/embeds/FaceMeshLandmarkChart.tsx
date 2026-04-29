"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

const CHART_DATA = [
  { label: "Eyes + Iris", count: 72, color: "#7c3aed" },
  { label: "Mouth + Lips", count: 52, color: "#dc2626" },
  { label: "Jawline + Oval", count: 36, color: "#0891b2" },
  { label: "Nose", count: 30, color: "#059669" },
  { label: "Cheeks", count: 28, color: "#db2777" },
  { label: "Eyebrows", count: 20, color: "#d97706" },
  { label: "Forehead", count: 12, color: "#4f46e5" },
  { label: "Tessellation", count: 228, color: "#94a3b8" },
];

const TOTAL = 478;

export default function FaceMeshLandmarkChart() {
  const t = useTranslations();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const textColor = isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)";
    const mutedText = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

    const paddingLeft = 110;
    const paddingRight = 60;
    const paddingTop = 16;
    const paddingBottom = 36;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const barHeight = Math.min(28, (chartHeight - 8 * 6) / 8);
    const gap = (chartHeight - barHeight * 8) / 7;

    const maxVal = Math.max(...CHART_DATA.map((d) => d.count));

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let v = 0; v <= maxVal; v += 50) {
      const x = paddingLeft + (v / maxVal) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, paddingTop);
      ctx.lineTo(x, paddingTop + chartHeight);
      ctx.stroke();

      ctx.fillStyle = mutedText;
      ctx.font = "11px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(v), x, height - 10);
    }

    // Bars
    CHART_DATA.forEach((item, i) => {
      const y = paddingTop + i * (barHeight + gap);
      const barWidth = (item.count / maxVal) * chartWidth;

      // Label
      ctx.fillStyle = textColor;
      ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(item.label, paddingLeft - 12, y + barHeight / 2);

      // Bar
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(paddingLeft + barWidth - radius, y);
      ctx.quadraticCurveTo(
        paddingLeft + barWidth,
        y,
        paddingLeft + barWidth,
        y + radius
      );
      ctx.lineTo(paddingLeft + barWidth, y + barHeight - radius);
      ctx.quadraticCurveTo(
        paddingLeft + barWidth,
        y + barHeight,
        paddingLeft + barWidth - radius,
        y + barHeight
      );
      ctx.lineTo(paddingLeft, y + barHeight);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      // Count label
      const pct = Math.round((item.count / TOTAL) * 100);
      ctx.fillStyle = textColor;
      ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        `${item.count} (${pct}%)`,
        paddingLeft + barWidth + 8,
        y + barHeight / 2
      );
    });
  }, []);

  return (
    <div className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t("embed.faceMeshChartHeading")}
      </h3>
      <canvas
        ref={canvasRef}
        className="h-[360px] w-full"
        role="img"
        aria-label={t("embed.faceMeshChartAriaLabel")}
      />
    </div>
  );
}
