type MetasDonutProps = {
  carbs: number;
  protein: number;
  fat: number;
  className?: string;
};

function getPosition(angleDeg: number, radiusPct: number = 35) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  const x = 50 + radiusPct * Math.cos(angleRad);
  const y = 50 + radiusPct * Math.sin(angleRad);
  return { x, y };
}

export function MetasDonut({ carbs, protein, fat, className = "" }: MetasDonutProps) {
  const c1 = carbs;
  const c2 = carbs + protein;
  const gradient = `conic-gradient(
    #FC6C00 0 ${c1}%,
    #1B5B0F ${c1}% ${c2}%,
    #FFDE21 ${c2}% 100%
  )`;

  const carbsCenter = c1 / 2;
  const proteinCenter = (c1 + c2) / 2;
  const fatCenter = (100 + c2) / 2;

  const carbsPos = getPosition((carbsCenter / 100) * 360);
  const proteinPos = getPosition((proteinCenter / 100) * 360);
  const fatPos = getPosition((fatCenter / 100) * 360);

  return (
    <div className={`relative h-52 w-52 ${className}`}>
      <div className="h-full w-full rounded-full border-2 border-white/70" style={{ background: gradient }} />
      <div className="absolute inset-[34%] rounded-full bg-[#f8f8fb]" />

      <span
        className="absolute text-2xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
        style={{
          left: `${carbsPos.x}%`,
          top: `${carbsPos.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {Math.round(carbs)}
      </span>
      <span
        className="absolute text-2xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
        style={{
          left: `${proteinPos.x}%`,
          top: `${proteinPos.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {Math.round(protein)}
      </span>
      <span
        className="absolute text-2xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
        style={{
          left: `${fatPos.x}%`,
          top: `${fatPos.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {Math.round(fat)}
      </span>
    </div>
  );
}