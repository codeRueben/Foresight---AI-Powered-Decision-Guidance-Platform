export function GradientMesh() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-foresight-bg via-[#0a0d14] to-foresight-bg-secondary" />
      
      {/* Animated mesh gradients */}
      <div className="absolute inset-0 mesh-bg">
        {/* Primary glow blob - top right */}
        <div
          className="absolute w-[100vw] h-[100vw] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(79, 109, 255, 0.2) 0%, rgba(79, 109, 255, 0.05) 40%, transparent 70%)',
            top: '-40%',
            right: '-30%',
            filter: 'blur(80px)',
          }}
        />
        
        {/* Secondary glow blob - bottom left */}
        <div
          className="absolute w-[80vw] h-[80vw] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 70% 70%, rgba(79, 109, 255, 0.15) 0%, rgba(123, 159, 255, 0.05) 40%, transparent 70%)',
            bottom: '-30%',
            left: '-20%',
            filter: 'blur(100px)',
          }}
        />
        
        {/* Accent glow - center */}
        <div
          className="absolute w-[60vw] h-[60vw] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(167, 177, 216, 0.1) 0%, transparent 60%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(120px)',
          }}
        />
        
        {/* Moving accent lines */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-1/4 left-0 w-full h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(79, 109, 255, 0.3), transparent)',
            }}
          />
          <div 
            className="absolute top-3/4 left-0 w-full h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(79, 109, 255, 0.2), transparent)',
            }}
          />
        </div>
        
        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </div>
  );
}
