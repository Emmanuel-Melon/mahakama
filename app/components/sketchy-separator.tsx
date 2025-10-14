import { cn } from '~/lib/utils';

interface SketchySeparatorProps {
  className?: string;
  /** 
   * The color of the separator line
   * @default '#d1d5db' (gray-300)
   */
  color?: string;
  /** 
   * The thickness of the line
   * @default '1px'
   */
  thickness?: string;
  /** 
   * The amount of waviness in the line (higher = more wavy)
   * @default 2
   */
  waviness?: number;
}

export function SketchySeparator({ 
  className,
  color = '#d1d5db',
  thickness = '1px',
  waviness = 2,
}: SketchySeparatorProps) {
  // Generate a wavy line using SVG
  const waveHeight = waviness * 2; // Controls the amplitude of the wave
  const wavelength = 20; // Controls the length of each wave
  const points = [];
  
  // Generate points for the wavy line
  for (let i = 0; i <= 100; i += 2) {
    const x = i;
    // Add some randomness to the y position for a hand-drawn effect
    const randomOffset = (Math.random() - 0.5) * waviness;
    const y = 50 + Math.sin(i / wavelength * Math.PI * 2) * waveHeight + randomOffset;
    points.push(`${x}% ${y}%`);
  }

  const pathData = `M 0,50 Q ${points.join(' ')} 100,50`;

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <svg 
        width="100%" 
        height={thickness} 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="block"
      >
        <path 
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
