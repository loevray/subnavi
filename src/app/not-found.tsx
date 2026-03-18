import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  { left: '4%', width: '2px', height: '2px', duration: '12s', delay: '0.5s', background: '#0984e3' },
  { left: '9%', width: '3px', height: '3px', duration: '16s', delay: '3.4s', background: '#d63031' },
  { left: '14%', width: '2px', height: '2px', duration: '11s', delay: '1.1s', background: '#0984e3' },
  { left: '19%', width: '2px', height: '2px', duration: '18s', delay: '5.2s', background: '#d63031' },
  { left: '24%', width: '3px', height: '3px', duration: '15s', delay: '2.6s', background: '#0984e3' },
  { left: '29%', width: '2px', height: '2px', duration: '20s', delay: '8.1s', background: '#d63031' },
  { left: '34%', width: '2px', height: '2px', duration: '10s', delay: '4.3s', background: '#0984e3' },
  { left: '39%', width: '3px', height: '3px', duration: '17s', delay: '7.5s', background: '#d63031' },
  { left: '44%', width: '2px', height: '2px', duration: '13s', delay: '6.2s', background: '#0984e3' },
  { left: '49%', width: '2px', height: '2px', duration: '19s', delay: '9.4s', background: '#d63031' },
  { left: '54%', width: '3px', height: '3px', duration: '14s', delay: '2.1s', background: '#0984e3' },
  { left: '59%', width: '2px', height: '2px', duration: '18s', delay: '10.2s', background: '#d63031' },
  { left: '64%', width: '2px', height: '2px', duration: '12s', delay: '1.8s', background: '#0984e3' },
  { left: '69%', width: '3px', height: '3px', duration: '21s', delay: '11.3s', background: '#d63031' },
  { left: '74%', width: '2px', height: '2px', duration: '15s', delay: '6.7s', background: '#0984e3' },
  { left: '79%', width: '2px', height: '2px', duration: '11s', delay: '3.9s', background: '#d63031' },
  { left: '84%', width: '3px', height: '3px', duration: '17s', delay: '7.1s', background: '#0984e3' },
  { left: '88%', width: '2px', height: '2px', duration: '14s', delay: '5.8s', background: '#d63031' },
  { left: '91%', width: '2px', height: '2px', duration: '19s', delay: '8.8s', background: '#0984e3' },
  { left: '94%', width: '3px', height: '3px', duration: '13s', delay: '2.9s', background: '#d63031' },
  { left: '97%', width: '2px', height: '2px', duration: '16s', delay: '9.9s', background: '#0984e3' },
  { left: '99%', width: '2px', height: '2px', duration: '22s', delay: '4.8s', background: '#d63031' },
];

const pageStyles = String.raw`
  body:has(.page-shell) header {
    display: none !important;
  }

  .page-shell {
    --bg: #f0eee8;
    --red: #d63031;
    --cyan: #0984e3;
    --white: #1a1a2e;
    --muted: #888899;
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background: var(--bg);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .scanlines {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
  }

  .bg-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(9, 132, 227, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(9, 132, 227, 0.07) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridShift 20s linear infinite;
  }

  .glow-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(130px);
    pointer-events: none;
  }

  .glow-blob.red {
    width: 600px;
    height: 600px;
    background: rgba(214, 48, 49, 0.12);
    top: -150px;
    right: -100px;
    animation: blobPulse 7s ease-in-out infinite;
  }

  .glow-blob.cyan {
    width: 500px;
    height: 500px;
    background: rgba(9, 132, 227, 0.1);
    bottom: -100px;
    left: 30%;
    animation: blobPulse 9s ease-in-out infinite reverse;
  }

  .particles {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  .particle {
    position: absolute;
    bottom: -10vh;
    border-radius: 50%;
    opacity: 0;
    animation-name: floatUp;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .container {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1160px;
    width: 92%;
    min-height: 100vh;
    align-items: center;
    gap: 0;
    padding: 60px 0;
  }

  .left {
    padding: 0 56px 0 16px;
    position: relative;
  }

  .watermark {
    position: absolute;
    top: -20px;
    left: -30px;
    pointer-events: none;
    user-select: none;
    color: transparent;
    font-family: var(--font-bebas), sans-serif;
    font-size: 220px;
    line-height: 0.85;
    letter-spacing: -6px;
    -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.08);
    animation: wmGlitch 5s infinite;
  }

  .left-inner {
    position: relative;
    z-index: 1;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
    color: var(--red);
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    animation: fadeUp 0.6s ease both;
  }

  .eyebrow::before {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: var(--red);
  }

  h1 {
    margin-bottom: 20px;
    font-size: clamp(30px, 3.8vw, 50px);
    font-weight: 700;
    line-height: 1.18;
    animation: fadeUp 0.6s 0.12s ease both;
  }

  .desc {
    max-width: 380px;
    margin-bottom: 44px;
    color: var(--muted);
    font-size: 14px;
    font-weight: 300;
    line-height: 1.9;
    animation: fadeUp 0.6s 0.24s ease both;
  }

  .btn-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    animation: fadeUp 0.6s 0.36s ease both;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    padding: 13px 26px;
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }

  .btn-primary {
    position: relative;
    z-index: 0;
    overflow: hidden;
    background: var(--red);
    color: #fff;
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .btn-primary:hover::before {
    transform: translateX(0);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(255, 23, 68, 0.45);
  }

  .btn-primary svg {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }

  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  .btn-ghost {
    background: transparent;
    color: var(--cyan);
    border: 1px solid rgba(9, 132, 227, 0.35);
  }

  .btn-ghost:hover {
    background: rgba(9, 132, 227, 0.07);
    border-color: var(--cyan);
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(9, 132, 227, 0.2);
  }

  .terminal {
    margin-top: 48px;
    border-left: 2px solid rgba(9, 132, 227, 0.25);
    padding-left: 16px;
    color: var(--muted);
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 11px;
    animation: fadeUp 0.6s 0.48s ease both;
  }

  .line {
    margin-bottom: 4px;
    opacity: 0;
    animation: typeLine 0.3s ease forwards;
  }

  .line:nth-child(1) {
    animation-delay: 0.8s;
  }

  .line:nth-child(2) {
    animation-delay: 1.1s;
  }

  .line:nth-child(3) {
    animation-delay: 1.4s;
  }

  .line:nth-child(4) {
    animation-delay: 1.7s;
  }

  .ok {
    color: var(--cyan);
  }

  .err {
    color: var(--red);
  }

  .cursor {
    display: inline-block;
    width: 7px;
    height: 11px;
    background: var(--cyan);
    vertical-align: middle;
    opacity: 0;
    animation: blink 1s step-end infinite;
    animation-delay: 2s;
    animation-fill-mode: forwards;
  }

  .right {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px 0 40px;
    animation: fadeUp 0.8s 0.15s ease both;
  }

  .img-frame {
    position: relative;
    width: 100%;
    max-width: 460px;
  }

  .hud-ring {
    position: absolute;
    inset: -18px;
    border: 1px solid rgba(9, 132, 227, 0.18);
    border-radius: 6px;
    pointer-events: none;
  }

  .hud-ring::before,
  .hud-ring::after {
    content: '';
    position: absolute;
    background: var(--cyan);
  }

  .hud-ring::before {
    width: 40px;
    height: 1px;
    top: -1px;
    left: 20px;
  }

  .hud-ring::after {
    width: 1px;
    height: 40px;
    top: 20px;
    left: -1px;
  }

  .hud-ring-br {
    position: absolute;
    inset: -18px;
    pointer-events: none;
  }

  .hud-ring-br::before,
  .hud-ring-br::after {
    content: '';
    position: absolute;
    background: var(--red);
  }

  .hud-ring-br::before {
    width: 40px;
    height: 1px;
    bottom: -1px;
    right: 20px;
  }

  .hud-ring-br::after {
    width: 1px;
    height: 40px;
    bottom: 20px;
    right: -1px;
  }

  .char-img {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: auto;
    border-radius: 4px;
    filter: contrast(1.05) saturate(1.1);
    mask-image: linear-gradient(to bottom, transparent 0%, black 6%, black 88%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 6%, black 88%, transparent 100%);
    animation: imgFloat 6s ease-in-out infinite;
  }

  .img-glitch {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    border-radius: 4px;
    opacity: 0;
    background: linear-gradient(
      transparent 30%,
      rgba(9, 132, 227, 0.06) 30%,
      rgba(9, 132, 227, 0.06) 32%,
      transparent 32%
    );
    animation: imgGlitch 6s 3s infinite;
  }

  .img-scan {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(9, 132, 227, 0.4), transparent);
    pointer-events: none;
    animation: scanSweep 4s linear infinite;
  }

  .img-badge {
    position: absolute;
    top: -14px;
    left: 50%;
    z-index: 4;
    transform: translateX(-50%);
    background: var(--red);
    padding: 4px 16px;
    color: #fff;
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 9px;
    letter-spacing: 3px;
    white-space: nowrap;
    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
  }

  .img-caption {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 20px 20px 16px;
    background: linear-gradient(transparent, rgba(240, 238, 232, 0.95) 60%);
    border-radius: 0 0 4px 4px;
  }

  .caption-code {
    color: var(--white);
    text-shadow: 0 0 30px rgba(214, 48, 49, 0.35);
    font-family: var(--font-bebas), sans-serif;
    font-size: 52px;
    line-height: 1;
    letter-spacing: 2px;
  }

  .caption-meta {
    color: rgba(26, 26, 46, 0.5);
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 9px;
    letter-spacing: 2px;
    line-height: 1.8;
    text-align: right;
  }

  .side-label {
    position: absolute;
    color: rgba(9, 132, 227, 0.25);
    font-family: var(--font-share-tech-mono), monospace;
    font-size: 9px;
    letter-spacing: 3px;
    white-space: nowrap;
    text-transform: uppercase;
  }

  .left-side {
    left: -4px;
    top: 50%;
    transform: translateX(-100%) translateY(-50%) rotate(-90deg);
  }

  .right-side {
    right: -4px;
    top: 50%;
    transform: translateX(100%) translateY(-50%) rotate(90deg);
  }

  @keyframes gridShift {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(60px);
    }
  }

  @keyframes blobPulse {
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

  @keyframes wmGlitch {
    0%,
    90%,
    100% {
      -webkit-text-stroke-color: rgba(255, 255, 255, 0.06);
      transform: none;
    }
    91% {
      -webkit-text-stroke-color: rgba(255, 23, 68, 0.15);
      transform: translate(-3px, 0);
    }
    92% {
      -webkit-text-stroke-color: rgba(9, 132, 227, 0.2);
      transform: translate(3px, 0);
    }
    93% {
      -webkit-text-stroke-color: rgba(255, 255, 255, 0.06);
      transform: none;
    }
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes typeLine {
    from {
      opacity: 0;
      transform: translateX(-6px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @keyframes imgFloat {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes imgGlitch {
    0%,
    90%,
    100% {
      opacity: 0;
    }
    91% {
      opacity: 1;
      background-position: -4px 0;
    }
    92% {
      opacity: 1;
      background-position: 4px 0;
    }
    93% {
      opacity: 0;
    }
  }

  @keyframes scanSweep {
    from {
      top: 0%;
      opacity: 0.8;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 0.6;
    }
    to {
      top: 100%;
      opacity: 0;
    }
  }

  @keyframes floatUp {
    0% {
      transform: translateY(100vh);
      opacity: 0;
    }
    10% {
      opacity: 0.7;
    }
    90% {
      opacity: 0.2;
    }
    100% {
      transform: translateY(-10vh);
      opacity: 0;
    }
  }

  @media (max-width: 860px) {
    .page-shell {
      padding: 32px 0 24px;
    }

    .container {
      grid-template-columns: 1fr;
      min-height: auto;
      gap: 50px;
      padding: 50px 0 40px;
    }

    .left {
      order: 2;
      padding: 0 16px;
    }

    .watermark {
      font-size: 130px;
    }

    .right {
      order: 1;
      padding: 0 16px;
    }

    .img-frame {
      max-width: 340px;
    }
  }
`;

export default function NotFound() {
  return (
    <main
      className={`${notoSansKr.className} ${bebas.variable} ${shareTechMono.variable} page-shell`}
    >
      <div className="scanlines" />
      <div className="bg-grid" />
      <div className="glow-blob red" />
      <div className="glow-blob cyan" />

      <div className="particles" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={`${particle.left}-${particle.delay}`}
            className="particle"
            style={
              {
                left: particle.left,
                width: particle.width,
                height: particle.height,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
                background: particle.background,
              } satisfies CSSProperties
            }
          />
        ))}
      </div>

      <div className="container">
        <section className="left">
          <div className="watermark">404</div>

          <div className="left-inner">
            <div className="eyebrow">404 Not Found</div>

            <h1>
              찾으시는 페이지를
              <br />
              발견하지 못했어요.
            </h1>

            <p className="desc">
              주소가 바뀌었거나 이미 내려간 페이지일 수 있어요.
              <br />
              메인으로 돌아가서 행사 목록이나 검색으로 다시 찾아보세요.
            </p>

            <div className="btn-group">
              <Link href="/" className="btn btn-primary">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                홈으로 돌아가기
              </Link>

              <Link href="/?page=1" className="btn btn-ghost">
                행사 목록 보기 →
              </Link>
            </div>

            <div className="terminal" aria-label="system log">
              <div className="line">
                <span className="ok">›</span> GET /page/requested
              </div>
              <div className="line">
                <span className="err">✕</span> STATUS 404 — resource not found
              </div>
              <div className="line">
                <span className="ok">›</span> Redirecting available paths...
              </div>
              <div className="line">
                <span className="ok">✓</span> Home route available <span className="cursor" />
              </div>
            </div>
          </div>
        </section>

        <section className="right">
          <div className="img-frame">
            <div className="hud-ring" />
            <div className="hud-ring-br" />
            <div className="img-badge">// ERROR_MAID.EXE //</div>
            <div className="img-scan" />

            <Image
              className="char-img"
              src="/404-not-found.png"
              alt="404 페이지 일러스트"
              width={848}
              height={1199}
              priority
            />

            <div className="img-glitch" />

            <div className="img-caption">
              <div className="caption-code">404</div>
              <div className="caption-meta">
                PAGE_NOT_FOUND
                <br />
                ERROR: RESOURCE MISSING
              </div>
            </div>

            <div className="side-label left-side">system // error // 0x404</div>
            <div className="side-label right-side">page not found // http 404</div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
    </main>
  );
}
