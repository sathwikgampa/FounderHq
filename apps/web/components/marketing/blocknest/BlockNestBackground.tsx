'use client';

export function BlockNestBackground() {
  return (
    <>
      {/* Spline 3D background */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '900px',
          zIndex: -10,
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
        }}
      >
        <iframe
          src="https://my.spline.design/glowingplanetparticles-HmCVKutonlFn3Oqqe6DI9nWi/"
          style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
          loading="lazy"
          title="BlockNest 3D background"
        />
      </div>

      {/* Ambient blurs + star dots — fixed so they stay while scrolling */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
        {/* Indigo top bloom */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: 800,
            height: 500,
            background:
              'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(79,70,229,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Purple right */}
        <div
          className="absolute top-[200px] right-0"
          style={{
            width: 600,
            height: 600,
            background:
              'radial-gradient(ellipse 60% 60% at 100% 30%, rgba(147,51,234,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Bottom purple */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: 1000,
            height: 400,
            background:
              'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(147,51,234,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Star dots */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            opacity: 0.12,
          }}
        />
      </div>

      {/* Curved horizon line */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 650,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200%',
          height: 1000,
          borderTop: '1px solid rgba(168,85,247,0.2)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </>
  );
}
