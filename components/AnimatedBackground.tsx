import FloatingEmojis from './FloatingEmojis';

export default function AnimatedBackground() {
  return (
    <div className="animated-grid-background">
      <FloatingEmojis />
      <div className="grid-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#6D3D14]/10 via-transparent to-[#B59DA4]/20"></div>
    </div>
  );
}
