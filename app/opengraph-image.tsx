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
          background: '#FFF1F2',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Ambient rose glows */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-100px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(225,29,72,0.14), transparent 72%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-60px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,113,133,0.14), transparent 72%)',
          }}
        />

        {/* Main card */}
        <div
          style={{
            position: 'relative',
            width: '1040px',
            height: '510px',
            borderRadius: '28px',
            border: '1px solid #FECDD3',
            background: 'rgba(255, 241, 242, 0.94)',
            boxShadow: '0 18px 48px rgba(31, 2, 8, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderLeft: '1px dashed #FDA4AF',
              borderRight: '1px dashed #FDA4AF',
              opacity: 0.35,
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '2.2px',
              color: '#6b7280',
              border: '1px solid #FECDD3',
              background: '#FFF1F2',
              borderRadius: '999px',
              padding: '8px 16px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
              }}
            />
            Open to opportunities
          </div>

          <div
            style={{
              fontSize: '74px',
              fontWeight: 800,
              color: '#1f0208',
              letterSpacing: '-3px',
              lineHeight: 1,
            }}
          >
            Yashvanth S
          </div>

          <div
            style={{
              fontSize: '24px',
              color: '#52525b',
              letterSpacing: '2.8px',
              textTransform: 'uppercase',
            }}
          >
            Full-Stack Developer & AI Engineer
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            {['React', 'Next.js', 'TypeScript', 'Python', 'AI/ML'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: '1px solid #FECDD3',
                  background: '#FFE4E6',
                  color: '#3f3f46',
                  fontSize: '16px',
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '22px',
              fontSize: '18px',
              color: '#71717a',
              letterSpacing: '0.8px',
            }}
          >
            yashvanth.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
