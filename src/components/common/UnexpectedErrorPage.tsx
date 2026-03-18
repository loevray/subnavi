'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Bebas_Neue, Noto_Sans_KR, Share_Tech_Mono } from 'next/font/google';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

const particles = [
  { left: '4%', width: '2px', height: '2px', duration: '12s', delay: '0.5s', background: '#e67e00' },
  { left: '9%', width: '3px', height: '3px', duration: '16s', delay: '3.4s', background: '#d63031' },
  { left: '14%', width: '2px', height: '2px', duration: '11s', delay: '1.1s', background: '#e67e00' },
  { left: '19%', width: '2px', height: '2px', duration: '18s', delay: '5.2s', background: '#d63031' },
  { left: '24%', width: '3px', height: '3px', duration: '15s', delay: '2.6s', background: '#e67e00' },
  { left: '29%', width: '2px', height: '2px', duration: '20s', delay: '8.1s', background: '#d63031' },
  { left: '34%', width: '2px', height: '2px', duration: '10s', delay: '4.3s', background: '#e67e00' },
  { left: '39%', width: '3px', height: '3px', duration: '17s', delay: '7.5s', background: '#d63031' },
  { left: '44%', width: '2px', height: '2px', duration: '13s', delay: '6.2s', background: '#e67e00' },
  { left: '49%', width: '2px', height: '2px', duration: '19s', delay: '9.4s', background: '#d63031' },
  { left: '54%', width: '3px', height: '3px', duration: '14s', delay: '2.1s', background: '#e67e00' },
  { left: '59%', width: '2px', height: '2px', duration: '18s', delay: '10.2s', background: '#d63031' },
  { left: '64%', width: '2px', height: '2px', duration: '12s', delay: '1.8s', background: '#e67e00' },
  { left: '69%', width: '3px', height: '3px', duration: '21s', delay: '11.3s', background: '#d63031' },
  { left: '74%', width: '2px', height: '2px', duration: '15s', delay: '6.7s', background: '#e67e00' },
  { left: '79%', width: '2px', height: '2px', duration: '11s', delay: '3.9s', background: '#d63031' },
  { left: '84%', width: '3px', height: '3px', duration: '17s', delay: '7.1s', background: '#e67e00' },
  { left: '88%', width: '2px', height: '2px', duration: '14s', delay: '5.8s', background: '#d63031' },
  { left: '91%', width: '2px', height: '2px', duration: '19s', delay: '8.8s', background: '#e67e00' },
  { left: '94%', width: '3px', height: '3px', duration: '13s', delay: '2.9s', background: '#d63031' },
  { left: '97%', width: '2px', height: '2px', duration: '16s', delay: '9.9s', background: '#e67e00' },
  { left: '99%', width: '2px', height: '2px', duration: '22s', delay: '4.8s', background: '#d63031' },
];

const hideHeaderStyles = String.raw`
  body:has(.unexpected-error-shell.hide-layout-header) header {
    display: none !important;
  }
`;

const pageStyles = String.raw`
  .unexpected-error-shell {
    --bg: #f0eee8;
    --surface: #faf9f6;
    --red: #d63031;
    --amber: #e67e00;
    --cyan: #0984e3;
    --white: #1a1a2e;
    --muted: #888899;
    --border: rgba(0, 0, 0, 0.08);
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background: var(--bg);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .unexpected-error-shell .bg-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(230, 126, 0, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(230, 126, 0, 0.05) 1px, transparent 1px);
    background-size: 120px 120px;
    animation: unexpected-grid-shift 20s linear infinite;
    z-index: 0;
  }

  .unexpected-error-shell .glow-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(140px);
    pointer-events: none;
    z-index: 0;
  }

  .unexpected-error-shell .glow-blob.amber {
    width: 600px;
    height: 600px;
    background: rgba(230, 126, 0, 0.1);
    top: -150px;
    right: -100px;
    animation: unexpected-blob-pulse 7s ease-in-out infinite;
  }

  .unexpected-error-shell .glow-blob.red {
    width: 500px;
    height: 500px;
    background: rgba(214, 48, 49, 0.08);
    bottom: -100px;
    left: 5%;
    animation: unexpected-blob-pulse 9s ease-in-out infinite reverse;
  }

  .unexpected-error-shell .particles {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .unexpected-error-shell .particle {
    position: absolute;
    bottom: -10vh;
    border-radius: 50%;
    opacity: 0;
    animation: unexpected-float-up linear infinite;
  }

  .unexpected-error-shell .container {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1160px;
    width: 92%;
    align-items: center;
    min-height: 100vh;
    padding: 60px 0;
  }

  .unexpected-error-shell .left {
    padding: 0 56px 0 16px;
    position: relative;
  }

  .unexpected-error-shell .watermark {
    font-family: var(--font-bebas), sans-serif;
    font-size: 220px;
    line-height: 0.85;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.07);
    position: absolute;
    top: -20px;
    left: -30px;
    pointer-events: none;
    user-select: none;
    letter-spacing: -6px;
  }

  .unexpected-error-shell .left-inner {
    position: relative;
    z-index: 1;
  }

  .unexpected-error-shell .eyebrow {
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 11px;
    color: var(--amber);
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: unexpected-fade-up 0.6s ease both;
  }

  .unexpected-error-shell .eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: var(--amber);
  }

  .unexpected-error-shell h1 {
    font-size: clamp(30px, 3.8vw, 50px);
    font-weight: 700;
    line-height: 1.18;
    margin-bottom: 20px;
    animation: unexpected-fade-up 0.6s 0.12s ease both;
  }

  .unexpected-error-shell .desc {
    font-size: 14px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.9;
    max-width: 380px;
    margin-bottom: 44px;
    animation: unexpected-fade-up 0.6s 0.24s ease both;
  }

  .unexpected-error-shell .btn-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    animation: unexpected-fade-up 0.6s 0.36s ease both;
  }

  .unexpected-error-shell .btn {
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 13px 26px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    border: none;
  }

  .unexpected-error-shell .btn-primary {
    background: var(--amber);
    color: #0d0900;
    position: relative;
    overflow: hidden;
  }

  .unexpected-error-shell .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .unexpected-error-shell .btn-primary:hover::before {
    transform: translateX(0);
  }

  .unexpected-error-shell .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(255, 171, 0, 0.4);
  }

  .unexpected-error-shell .btn-ghost {
    background: transparent;
    color: var(--cyan);
    border: 1px solid rgba(9, 132, 227, 0.35);
  }

  .unexpected-error-shell .btn-ghost:hover {
    background: rgba(9, 132, 227, 0.07);
    border-color: var(--cyan);
    transform: translateY(-2px);
  }

  .unexpected-error-shell .error-info {
    margin-top: 40px;
    background: rgba(230, 126, 0, 0.06);
    border: 1px solid rgba(230, 126, 0, 0.2);
    border-radius: 4px;
    padding: 20px 24px;
    animation: unexpected-fade-up 0.6s 0.55s ease both;
  }

  .unexpected-error-shell .error-info-label {
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .unexpected-error-shell .error-info-code {
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 11px;
    color: rgba(26, 26, 46, 0.5);
    line-height: 1.7;
  }

  .unexpected-error-shell .highlight {
    color: var(--amber);
  }

  .unexpected-error-shell .terminal {
    margin-top: 48px;
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 11px;
    color: var(--muted);
    border-left: 2px solid rgba(230, 126, 0, 0.25);
    padding-left: 16px;
    animation: unexpected-fade-up 0.6s 0.48s ease both;
  }

  .unexpected-error-shell .line {
    margin-bottom: 4px;
    opacity: 0;
    animation: unexpected-type-line 0.3s ease forwards;
  }

  .unexpected-error-shell .line:nth-child(1) {
    animation-delay: 0.8s;
  }

  .unexpected-error-shell .line:nth-child(2) {
    animation-delay: 1.1s;
  }

  .unexpected-error-shell .line:nth-child(3) {
    animation-delay: 1.4s;
  }

  .unexpected-error-shell .line:nth-child(4) {
    animation-delay: 1.7s;
  }

  .unexpected-error-shell .line:nth-child(5) {
    animation-delay: 2s;
  }

  .unexpected-error-shell .ok {
    color: var(--cyan);
  }

  .unexpected-error-shell .warn {
    color: var(--amber);
  }

  .unexpected-error-shell .err {
    color: var(--red);
  }

  .unexpected-error-shell .cursor {
    display: inline-block;
    width: 7px;
    height: 11px;
    background: var(--amber);
    vertical-align: middle;
    opacity: 0;
    animation: unexpected-blink 1s step-end infinite;
    animation-delay: 2.3s;
    animation-fill-mode: forwards;
  }

  .unexpected-error-shell .right {
    padding: 0 16px 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: unexpected-fade-up 0.8s 0.15s ease both;
  }

  .unexpected-error-shell .img-frame {
    position: relative;
    width: 100%;
    max-width: 460px;
  }

  .unexpected-error-shell .hud-ring {
    position: absolute;
    inset: -18px;
    border: 1px solid rgba(230, 126, 0, 0.18);
    border-radius: 6px;
    pointer-events: none;
  }

  .unexpected-error-shell .hud-ring::before,
  .unexpected-error-shell .hud-ring::after {
    content: '';
    position: absolute;
    background: var(--amber);
  }

  .unexpected-error-shell .hud-ring::before {
    width: 40px;
    height: 1px;
    top: -1px;
    left: 20px;
  }

  .unexpected-error-shell .hud-ring::after {
    width: 1px;
    height: 40px;
    top: 20px;
    left: -1px;
  }

  .unexpected-error-shell .hud-ring-br {
    position: absolute;
    inset: -18px;
    pointer-events: none;
  }

  .unexpected-error-shell .hud-ring-br::before,
  .unexpected-error-shell .hud-ring-br::after {
    content: '';
    position: absolute;
    background: var(--red);
  }

  .unexpected-error-shell .hud-ring-br::before {
    width: 40px;
    height: 1px;
    bottom: -1px;
    right: 20px;
  }

  .unexpected-error-shell .hud-ring-br::after {
    width: 1px;
    height: 40px;
    bottom: 20px;
    right: -1px;
  }

  .unexpected-error-shell .img-badge {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    background: var(--amber);
    color: #0d0900;
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 9px;
    letter-spacing: 3px;
    padding: 4px 16px;
    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
    white-space: nowrap;
  }

  .unexpected-error-shell .char-img {
    width: 100%;
    display: block;
    border-radius: 4px;
    filter: contrast(1.05) saturate(1.1) hue-rotate(10deg);
    mask-image: linear-gradient(to bottom, transparent 0%, black 6%, black 88%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 6%, black 88%, transparent 100%);
    animation: unexpected-img-float 6s ease-in-out infinite;
  }

  .unexpected-error-shell .img-scan {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(230, 126, 0, 0.4), transparent);
    animation: unexpected-scan-sweep 4s linear infinite;
    z-index: 3;
    pointer-events: none;
  }

  .unexpected-error-shell .img-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;
    padding: 20px 20px 16px;
    background: linear-gradient(transparent, rgba(5, 5, 15, 0.9) 60%);
    border-radius: 0 0 4px 4px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .unexpected-error-shell .caption-code {
    font-family: var(--font-bebas), sans-serif;
    font-size: 52px;
    line-height: 1;
    color: var(--amber);
    text-shadow: 0 0 30px rgba(230, 126, 0, 0.4);
    letter-spacing: 2px;
  }

  .unexpected-error-shell .caption-meta {
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 9px;
    color: rgba(255, 255, 255, 0.72);
    letter-spacing: 2px;
    text-align: right;
    line-height: 1.8;
  }

  @keyframes unexpected-grid-shift {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(120px);
    }
  }

  @keyframes unexpected-blob-pulse {
    0%,
    100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  @keyframes unexpected-fade-up {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes unexpected-type-line {
    from {
      opacity: 0;
      transform: translateX(-6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes unexpected-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @keyframes unexpected-img-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes unexpected-scan-sweep {
    from {
      top: 0;
      opacity: 0.8;
    }
    to {
      top: 100%;
      opacity: 0;
    }
  }

  @keyframes unexpected-float-up {
    0% {
      transform: translateY(100vh);
      opacity: 0;
    }
    10% {
      opacity: 0.5;
    }
    90% {
      opacity: 0.1;
    }
    100% {
      transform: translateY(-10vh);
      opacity: 0;
    }
  }

  @media (max-width: 860px) {
    .unexpected-error-shell .container {
      grid-template-columns: 1fr;
      padding: 50px 0 40px;
      gap: 50px;
    }

    .unexpected-error-shell .left {
      padding: 0 16px;
      order: 2;
    }

    .unexpected-error-shell .watermark {
      font-size: 130px;
    }

    .unexpected-error-shell .right {
      padding: 0 16px;
      order: 1;
    }

    .unexpected-error-shell .img-frame {
      max-width: 340px;
    }
  }
`;

type UnexpectedErrorPageProps = {
  error: Error & { digest?: string };
  logLabel: string;
  title: ReactNode;
  description: ReactNode;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  hideHeader?: boolean;
};

function formatTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
}

export default function UnexpectedErrorPage({
  error,
  logLabel,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  hideHeader = false,
}: UnexpectedErrorPageProps) {
  const [capturedAt, setCapturedAt] = useState('');
  const resolvedPageStyles = hideHeader ? `${hideHeaderStyles}\n${pageStyles}` : pageStyles;

  useEffect(() => {
    console.error(logLabel, error);
    setCapturedAt(formatTimestamp(new Date()));
  }, [error, logLabel]);

  return (
    <main
      className={`${notoSansKr.className} ${bebas.variable} ${shareTechMono.variable} unexpected-error-shell${
        hideHeader ? ' hide-layout-header' : ''
      }`}
    >
      <div className="bg-grid" />
      <div className="glow-blob amber" />
      <div className="glow-blob red" />

      <div className="particles" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={`${particle.left}-${particle.delay}`}
            className="particle"
            style={{
              left: particle.left,
              width: particle.width,
              height: particle.height,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              background: particle.background,
            }}
          />
        ))}
      </div>

      <div className="container">
        <section className="left">
          <div className="watermark">500</div>

          <div className="left-inner">
            <div className="eyebrow">500 Internal Server Error</div>
            <h1>{title}</h1>
            <p className="desc">{description}</p>

            <div className="btn-group">
              <button type="button" className="btn btn-primary" onClick={onPrimaryAction}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-4.48" />
                </svg>
                {primaryActionLabel}
              </button>
              {secondaryActionLabel && onSecondaryAction ? (
                <button type="button" className="btn btn-ghost" onClick={onSecondaryAction}>
                  {secondaryActionLabel}
                </button>
              ) : null}
            </div>

            <div className="error-info">
              <div className="error-info-label">{'// Error Details'}</div>
              <div className="error-info-code">
                STATUS &nbsp;<span className="highlight">500 INTERNAL_SERVER_ERROR</span>
                <br />
                CODE &nbsp;&nbsp;&nbsp;<span className="highlight">UNEXPECTED_EXCEPTION</span>
                <br />
                TRACE &nbsp;&nbsp;<span className="highlight">{error.digest ?? 'UNAVAILABLE'}</span>
                <br />
                TIME &nbsp;&nbsp;&nbsp;<span className="highlight">{capturedAt || 'LOADING'}</span>
              </div>
            </div>

            <div className="terminal" aria-label="system log">
              <div className="line">
                <span className="ok">›</span> Receiving request...
              </div>
              <div className="line">
                <span className="warn">⚠</span> Unhandled exception in handler
              </div>
              <div className="line">
                <span className="err">✕</span> STATUS 500 - internal server error
              </div>
              <div className="line">
                <span className="warn">⚠</span> Incident logged automatically
              </div>
              <div className="line">
                <span className="ok">›</span> Retry or return home <span className="cursor" />
              </div>
            </div>
          </div>
        </section>

        <section className="right">
          <div className="img-frame">
            <div className="hud-ring" />
            <div className="hud-ring-br" />
            <div className="img-badge">{'// SYSTEM_CRASH.EXE //'}</div>
            <div className="img-scan" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="char-img" src="/404-not-found.png" alt="500 오류 일러스트" />
            <div className="img-caption">
              <div className="caption-code">500</div>
              <div className="caption-meta">
                INTERNAL_SERVER_ERROR
                <br />
                ERROR: UNEXPECTED EXCEPTION
              </div>
            </div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: resolvedPageStyles }} />
    </main>
  );
}
