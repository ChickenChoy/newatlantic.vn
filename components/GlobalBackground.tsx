"use client";

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Top right glow - 50% width */}
      <div
        className="absolute -top-32 -right-32 w-1/2 h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0.1) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Bottom left glow - 50% width */}
      <div
        className="absolute -bottom-32 -left-32 w-1/2 h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
}
