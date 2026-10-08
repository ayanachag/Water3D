import type { CSSProperties } from 'react'

const BUBBLES = [
  { cx: 34, r: 3.6, delay: '0s', dur: '3.8s', drift: '6px' },
  { cx: 48, r: 5.1, delay: '1.2s', dur: '4.6s', drift: '-7px' },
  { cx: 60, r: 3.1, delay: '0.5s', dur: '3.3s', drift: '4px' },
  { cx: 40, r: 4.2, delay: '2.1s', dur: '5s', drift: '-5px' },
  { cx: 54, r: 2.6, delay: '1.7s', dur: '3.6s', drift: '7px' },
  { cx: 28, r: 3.4, delay: '2.7s', dur: '4.2s', drift: '-4px' },
  { cx: 66, r: 4.4, delay: '0.9s', dur: '4.4s', drift: '5px' },
]

const WAVE =
  'M-48 0C-36 -8-24 8-12 0C0 -8 12 8 24 0C36 -8 48 8 60 0C72 -8 84 8 96 0C108 -8 120 8 132 0C144 -8 156 8 168 0V28H-48Z'

export function Art({
  markup,
  className,
  style,
}: {
  markup: string
  className?: string
  style?: CSSProperties
}) {
  const extra = style
    ? Object.entries(style)
        .filter((entry) => entry[1] != null && entry[1] !== '')
        .map(([key, value]) => {
          const prop = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
          const raw = typeof value === 'number' ? `${value}px` : String(value)
          return `${prop}:${raw}`
        })
        .join(';')
    : ''
  const html = markup
    .replace('<svg ', `<svg class="${className ?? ''}" `)
    .replace('style="display: block;"', `style="display: block;${extra ? `${extra};` : ''}"`)
  return <span className="art" dangerouslySetInnerHTML={{ __html: html }} />
}

export function Bottle({ ratio, splash }: { ratio: number; splash: number }) {
  const level = Math.max(0, Math.min(1, ratio))
  const surface = 8 + (1 - level) * 140

  return (
    <svg className="bottle" width="96.9263" height="154" viewBox="0 0 96.9263 154" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="wb-clip">
          <path d="M53.5 22H25.5C13 22 2.6 32.6 2.6 45V128.8C2.6 141.2 13 151.6 25.5 151.6H53.5C66 151.6 76.4 141.2 76.4 128.8V45C76.4 32.6 66 22 53.5 22Z" />
        </clipPath>
        <linearGradient id="wb-glass" x1="1" y1="21" x2="115.902" y2="88.0259" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.92" />
          <stop offset="0.45" stopColor="#C9F0FF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#69CFFF" stopOpacity="0.82" />
          <animateTransform attributeName="gradientTransform" type="translate" values="0 0; -14 8; 0 0" dur="7s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="wb-fill" x1="40" y1="22" x2="40" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ED4FF" />
          <stop offset="1" stopColor="#2AA6EE" />
        </linearGradient>
        <linearGradient id="wb-strap" x1="78" y1="30" x2="100" y2="72.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#11409C" />
          <stop offset="0.942308" stopColor="#041F44" />
          <animateTransform attributeName="gradientTransform" type="translate" values="0 0; 4 6; 0 0" dur="6.5s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <path d="M54 21H25C11.7452 21 1 31.7452 1 45V129C1 142.255 11.7452 153 25 153H54C67.2548 153 78 142.255 78 129V45C78 31.7452 67.2548 21 54 21Z" fill="url(#wb-glass)" stroke="#30A9ED" strokeWidth="2" />
      <g clipPath="url(#wb-clip)">
        <g className="water-level" style={{ transform: `translateY(${surface}px)` }}>
          <rect x="-8" y="0" width="120" height="190" fill="url(#wb-fill)" />
          <g className={splash > 0 ? 'waves splash' : 'waves'} key={splash}>
            <path className="wave wave-back" d={WAVE} fill="#7AD8FF" opacity="0.55" />
            <path className="wave wave-front" d={WAVE} fill="#E7F8FF" opacity="0.55" />
          </g>
          <g className="bubbles" style={{ opacity: level < 0.04 ? 0 : 0.95 }}>
            {BUBBLES.map((bubble) => (
              <g
                key={`${bubble.cx}-${bubble.delay}`}
                className="bubble"
                style={{
                  animationDelay: bubble.delay,
                  animationDuration: bubble.dur,
                  ['--drift' as string]: bubble.drift,
                }}
              >
                <circle cx={bubble.cx} cy={8} r={bubble.r} />
                <circle
                  cx={bubble.cx - bubble.r * 0.32}
                  cy={8 - bubble.r * 0.35}
                  r={bubble.r * 0.28}
                  fill="#ffffff"
                  stroke="none"
                />
              </g>
            ))}
          </g>
        </g>
      </g>
      <path opacity="0.5" d="M13 34C19 28.6667 24 28 28 32V132C22.6667 134.667 18 134 14 130L13 34Z" fill="white" />
      <path opacity="0.16" d="M51 77C56.5228 77 61 68.9411 61 59C61 49.0589 56.5228 41 51 41C45.4772 41 41 49.0589 41 59C41 68.9411 45.4772 77 51 77Z" fill="white" />
      <path d="M57 17C82 17 92.4048 38.8333 94 50C95.5952 61.1667 92.6667 66.3333 86 71C81.3333 73.6667 75.1526 71.2812 78 66C80.8474 60.7188 85.3399 59.8052 84 50C82.6601 40.1948 74.5 27.5 61.5 19" stroke="url(#wb-strap)" strokeWidth="5" strokeLinecap="round" />
      <path d="M59 0H23C20.2386 0 18 2.23858 18 5V16C18 18.7614 20.2386 21 23 21H59C61.7614 21 64 18.7614 64 16V5C64 2.23858 61.7614 0 59 0Z" fill="#0757A7" />
      <path d="M23 2V18M29 2V18M35 2V18M41 2V18M47 2V18M53 2V18M59 2V18" stroke="#0A3D82" strokeWidth="2" />
    </svg>
  )
}

export function Glass250() {
  return (
    <svg className="sip" width="22.3333" height="32.9998" viewBox="0 0 22.3333 32.9998" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="clip-glass-250">
          <path d="M2.7 6.1L4.15 27.5C4.65 30.5 7 32 11.17 32C15.3 32 17.7 30.5 18.2 27.5L19.65 6.1Z" />
        </clipPath>
        <linearGradient id="grad-glass-250" x1="2.14" y1="5.42" x2="27.13" y2="22.09" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.92" />
          <stop offset="0.45" stopColor="#C9F0FF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#69CFFF" stopOpacity="0.82" />
          <animateTransform attributeName="gradientTransform" type="translate" values="0 0; 4 2; 0 0" dur="4.4s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="grad-water-250" x1="4" y1="18" x2="18" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B7EFFF" />
          <stop offset="1" stopColor="#2BB4F5" />
          <animateTransform attributeName="gradientTransform" type="translate" values="0 0; 0 4; 0 0" dur="2.2s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <path d="M2.14062 5.42285L3.78165 27.7215C4.32866 30.907 6.7902 32.4998 11.1663 32.4998C15.5423 32.4998 18.0039 30.907 18.5509 27.7215L20.1919 5.42285" fill="url(#grad-glass-250)" stroke="#2BAEFF" />
      <g clipPath="url(#clip-glass-250)">
        <g className="sip-water sip-a">
          <path d="M0 19.6C3.2 18.1 6.4 21 11.2 19.6C16 18.2 18.4 20.8 23 19.6V33H0Z" fill="url(#grad-water-250)" opacity="0.92" />
          <path className="sip-wave" d="M-8 19.4C-2 17.6 2 21.2 8 19.4C14 17.6 18 21 24 19.4C28 18.2 32 20 36 19.4V23H-8Z" fill="#F4FCFF" opacity="0.75" />
        </g>
      </g>
      <path d="M11.1667 7.0641C17.0577 7.0641 21.8333 5.59468 21.8333 3.78205C21.8333 1.96942 17.0577 0.5 11.1667 0.5C5.27563 0.5 0.5 1.96942 0.5 3.78205C0.5 5.59468 5.27563 7.0641 11.1667 7.0641Z" fill="#D8F5FF" stroke="#2BAEFF" />
    </svg>
  )
}

export function Glass500() {
  return (
    <svg className="sip" width="22.3333" height="32.9998" viewBox="0 0 22.3333 32.9998" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="clip-glass-500">
          <path d="M2.7 6.1L4.15 27.5C4.65 30.5 7 32 11.17 32C15.3 32 17.7 30.5 18.2 27.5L19.65 6.1Z" />
        </clipPath>
        <linearGradient id="grad-glass-500" x1="2.14" y1="5.42" x2="27.13" y2="22.09" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.92" />
          <stop offset="0.45" stopColor="#C9F0FF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#69CFFF" stopOpacity="0.82" />
          <animateTransform attributeName="gradientTransform" type="translate" values="0 0; -3 3; 0 0" dur="5s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="grad-water-500" x1="3" y1="6" x2="18" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D7F6FF" />
          <stop offset="0.4" stopColor="#45C7FF" />
          <stop offset="1" stopColor="#1496E8" />
          <animateTransform attributeName="gradientTransform" type="translate" values="0 0; 0 5; 0 0" dur="2.8s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <path d="M2.14062 5.42285L3.78165 27.7215C4.32866 30.907 6.7902 32.4998 11.1663 32.4998C15.5423 32.4998 18.0039 30.907 18.5509 27.7215L20.1919 5.42285" fill="url(#grad-glass-500)" stroke="#2BAEFF" />
      <g clipPath="url(#clip-glass-500)">
        <g className="sip-water sip-b">
          <path d="M0 8.2C3.4 6.6 7 9.6 11.2 8.2C15.4 6.8 18.2 9.4 23 8.2V33H0Z" fill="url(#grad-water-500)" opacity="0.9" />
          <path className="sip-wave" d="M-10 8C-4 6.2 1 9.8 7 8C13 6.2 17 9.6 23 8C29 6.4 33 8.8 39 8V12H-10Z" fill="#F4FCFF" opacity="0.7" />
        </g>
      </g>
      <path d="M11.1667 7.0641C17.0577 7.0641 21.8333 5.59468 21.8333 3.78205C21.8333 1.96942 17.0577 0.5 11.1667 0.5C5.27563 0.5 0.5 1.96942 0.5 3.78205C0.5 5.59468 5.27563 7.0641 11.1667 7.0641Z" fill="#D8F5FF" stroke="#2BAEFF" />
    </svg>
  )
}

export function Bottle750() {
  return (
    <svg className="sip" width="19.8804" height="32.51" viewBox="0 0 19.8804 32.51" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="clip-bottle-750">
          <path d="M13.7 5.2H6.2C3.4 5.2 1.2 7.6 1.2 10.5V25.8C1.2 28.8 3.4 31.2 6.2 31.2H13.7C16.5 31.2 18.7 28.8 18.7 25.8V10.5C18.7 7.6 16.5 5.2 13.7 5.2Z" />
        </clipPath>
        <linearGradient id="grad-glass-750" x1="0.51" y1="4.5" x2="26.17" y2="22.09" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.92" />
          <stop offset="0.45" stopColor="#C9F0FF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#69CFFF" stopOpacity="0.82" />
          <animateTransform attributeName="gradientTransform" type="translate" values="0 0; 3 -2; 0 0" dur="4.8s" repeatCount="indefinite" />
        </linearGradient>
        <linearGradient id="grad-water-750" x1="2" y1="10" x2="2" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8ADFFF" />
          <stop offset="1" stopColor="#0C91E8" />
          <animateTransform attributeName="gradientTransform" type="translate" values="0 0; 0 5; 0 0" dur="3.1s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <path d="M13.9108 4.49523H5.96959C2.95434 4.49523 0.51 7.10018 0.51 10.3135V26.1817C0.51 29.3951 2.95434 32 5.96959 32H13.9108C16.9261 32 19.3704 29.3951 19.3704 26.1817V10.3135C19.3704 7.10018 16.9261 4.49523 13.9108 4.49523Z" fill="url(#grad-glass-750)" stroke="#30A9ED" strokeWidth="1.02" />
      <g clipPath="url(#clip-bottle-750)">
        <g className="sip-water sip-c">
          <path d="M0 12.2C3 10.6 6.2 13.4 10 12.2C13.8 11 16.2 13.6 20.4 12.2V33H0Z" fill="url(#grad-water-750)" opacity="0.92" />
          <path className="sip-wave" d="M-8 12C-2 10.2 2 13.8 8 12C14 10.2 18 13.6 24 12C28 10.6 32 12.8 36 12V15.2H-8Z" fill="#E7F8FF" opacity="0.7" />
        </g>
      </g>
      <path opacity="0.52" d="M2.86937 7.94405C4.29438 6.69717 5.54127 6.51904 6.61002 7.40967V27.716C5.36314 28.4286 4.20532 28.3395 3.13656 27.4489L2.86937 7.94405Z" fill="white" />
      <path opacity="0.18" d="M15.662 14.426C16.9142 13.9837 17.3317 11.9332 16.5945 9.84612C15.8573 7.75903 14.2445 6.42569 12.9922 6.86803C11.74 7.31036 11.3225 9.36086 12.0597 11.448C12.7969 13.535 14.4097 14.8684 15.662 14.426Z" fill="white" />
      <path d="M14.4812 0H5.39673C4.6589 0 4.06078 0.598123 4.06078 1.33595V4.00784C4.06078 4.74566 4.6589 5.34378 5.39673 5.34378H14.4812C15.219 5.34378 15.8171 4.74566 15.8171 4.00784V1.33595C15.8171 0.598123 15.219 0 14.4812 0Z" fill="#0757A7" />
      <path d="M5.39672 0.534668V4.80969M6.99985 0.534668V4.80969M8.60299 0.534668V4.80969M10.2061 0.534668V4.80969M11.8093 0.534668V4.80969M13.4124 0.534668V4.80969M15.0155 0.534668V4.80969" stroke="#0A3D82" strokeWidth="0.68" />
    </svg>
  )
}
