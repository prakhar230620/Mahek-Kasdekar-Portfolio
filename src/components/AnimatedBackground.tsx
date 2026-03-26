export default function AnimatedBackground() {
  return (
    <>
      {/* Gradient mesh */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(201,184,245,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 10%, rgba(244,167,180,0.35) 0%, transparent 45%),
            radial-gradient(ellipse at 60% 80%, rgba(249,203,167,0.35) 0%, transparent 50%),
            radial-gradient(ellipse at 10% 70%, rgba(181,232,216,0.3) 0%, transparent 45%),
            radial-gradient(ellipse at 90% 60%, rgba(201,184,245,0.25) 0%, transparent 40%),
            #fdf8f5
          `,
          backgroundSize: '400% 400%',
          animation: 'gradientShift 20s ease-in-out infinite',
        }}
      />
      {/* Noise texture */}
      <div className="noise-overlay" />
    </>
  )
}
