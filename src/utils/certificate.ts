import { QuizResult } from '../types/quiz';

/**
 * Draws a high-resolution certificate on an HTMLCanvasElement
 */
export function drawCertificateToCanvas(canvas: HTMLCanvasElement, result: QuizResult): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1200;
  const height = 800;
  canvas.width = width;
  canvas.height = height;

  // Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0a192f');
  gradient.addColorStop(0.5, '#0d223f');
  gradient.addColorStop(1, '#071224');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Subtle cyber grid lines
  ctx.strokeStyle = 'rgba(14, 154, 167, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 40; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 40; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Outer border with double stroke
  ctx.strokeStyle = '#0e9aa7';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = 'rgba(218, 165, 32, 0.7)'; // gold inner border
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  // Corner tech ornaments
  const cornerSize = 25;
  const corners = [
    [42, 42],
    [width - 42 - cornerSize, 42],
    [42, height - 42 - cornerSize],
    [width - 42 - cornerSize, height - 42 - cornerSize],
  ];
  ctx.fillStyle = '#0e9aa7';
  for (const [cx, cy] of corners) {
    ctx.fillRect(cx, cy, cornerSize, 4);
    ctx.fillRect(cx, cy, 4, cornerSize);
  }

  // Header Eyebrow
  ctx.textAlign = 'center';
  ctx.font = '600 15px "Fira Code", monospace';
  ctx.fillStyle = '#4cc9d4';
  ctx.letterSpacing = '4px';
  ctx.fillText('CYBERSECURITY AWARENESS & DEFENSE ACADEMY', width / 2, 110);

  // Main Title
  ctx.font = '800 42px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', width / 2, 170);

  // Decorative divider
  ctx.strokeStyle = '#0e9aa7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 140, 195);
  ctx.lineTo(width / 2 + 140, 195);
  ctx.stroke();

  // Subtitle
  ctx.font = '400 18px "Inter", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('This certificate is proudly awarded to', width / 2, 245);

  // Recipient Name
  ctx.font = '800 40px "Inter", sans-serif';
  const nameGrad = ctx.createLinearGradient(width / 2 - 200, 0, width / 2 + 200, 0);
  nameGrad.addColorStop(0, '#38bdf8');
  nameGrad.addColorStop(0.5, '#f8fafc');
  nameGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = nameGrad;
  ctx.fillText(result.userName || 'Cyber Specialist', width / 2, 310);

  // Underline for name
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 220, 325);
  ctx.lineTo(width / 2 + 220, 325);
  ctx.stroke();

  // Completion statement
  ctx.font = '400 18px "Inter", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(
    'for successfully mastering the cybersecurity evaluation assessment in',
    width / 2,
    375
  );

  // Category Focus
  ctx.font = '700 30px "Inter", sans-serif';
  ctx.fillStyle = '#f59e0b'; // amber/gold
  ctx.fillText(`${result.categoryName} Defense`, width / 2, 425);

  // Score & Metrics Box
  const boxW = 540;
  const boxH = 90;
  const boxX = (width - boxW) / 2;
  const boxY = 465;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = 'rgba(14, 154, 167, 0.4)';
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Score stats inside box
  ctx.font = '600 16px "Inter", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('ASSESSMENT SCORE', boxX + 130, boxY + 36);
  ctx.fillText('ACCURACY RATING', boxX + 410, boxY + 36);

  ctx.font = '800 28px "Fira Code", monospace';
  ctx.fillStyle = '#34d399'; // emerald
  ctx.fillText(`${result.score} / ${result.totalQuestions}`, boxX + 130, boxY + 70);
  ctx.fillText(`${result.percentage}%`, boxX + 410, boxY + 70);

  // Divider inside box
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.moveTo(width / 2, boxY + 15);
  ctx.lineTo(width / 2, boxY + boxH - 15);
  ctx.stroke();

  // Footer Details: Date and Security Verification Stamp
  const formattedDate = new Date(result.attemptDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Left Sign-off
  ctx.textAlign = 'left';
  ctx.font = '500 13px "Inter", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('ISSUE DATE', 90, 680);
  ctx.font = '700 16px "Inter", sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(formattedDate, 90, 705);

  ctx.font = '500 12px "Fira Code", monospace';
  ctx.fillStyle = '#0e9aa7';
  ctx.fillText(`VERIFICATION ID: CQ-${result.id}-${Math.floor(result.percentage * 123)}`, 90, 730);

  // Right Signature Block
  ctx.textAlign = 'right';
  ctx.font = 'italic 22px "Georgia", serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('Dr. Julian Cross, CISSP', width - 90, 680);
  ctx.beginPath();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.moveTo(width - 320, 690);
  ctx.lineTo(width - 90, 690);
  ctx.stroke();

  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Chief Information Security Officer & Director of Training', width - 90, 712);
  ctx.font = '500 12px "Inter", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('CyberQuiz Security & Awareness Initiative', width - 90, 730);

  // Center Security Badge / Stamp
  const stampX = width / 2;
  const stampY = 690;
  ctx.beginPath();
  ctx.arc(stampX, stampY, 44, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(stampX, stampY, 38, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '800 10px "Inter", sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('OFFICIAL', stampX, stampY - 10);
  ctx.font = '800 13px "Inter", sans-serif';
  ctx.fillText('VERIFIED', stampX, stampY + 5);
  ctx.font = '700 9px "Fira Code", monospace';
  ctx.fillText('SECURITY PASS', stampX, stampY + 18);
}

/**
 * Downloads the canvas as high-resolution PNG
 */
export function downloadCertificateImage(canvas: HTMLCanvasElement, filename: string = 'CyberQuiz_Certificate.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
