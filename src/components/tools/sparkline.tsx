type Props = { data: number[]; positive: boolean; className?: string };

export function Sparkline({ data, positive, className }: Props) {
  if (!data || data.length < 2) return null;

  const w = 80;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const stroke = positive ? "var(--color-green, #40a02b)" : "var(--color-red, #d20f39)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
