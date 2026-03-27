import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Yashvanth S - Full-Stack Developer & AI Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            position: 'relative',
          }}
        >
          {/* Initials badge */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            YS
          </div>

          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-2px',
              lineHeight: 1.1,
            }}
          >
            Yashvanth S
          </div>

          <div
            style={{
              fontSize: '24px',
              color: '#a1a1aa',
              fontWeight: 400,
              letterSpacing: '0.5px',
            }}
          >
            Full-Stack Developer & AI Engineer
          </div>

          {/* Tech pills */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            {['React', 'Next.js', 'TypeScript', 'Python', 'AI/ML'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#d4d4d8',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '18px',
            color: '#71717a',
            letterSpacing: '1px',
          }}
        >
          yashvanth.com
        </div>
      </div>
    ),
    { ...size }
  );
}
