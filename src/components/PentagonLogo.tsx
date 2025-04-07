
import { cn } from "@/lib/utils";

interface PentagonLogoProps {
  className?: string;
  size?: number;
}

const PentagonLogo = ({ className, size = 40 }: PentagonLogoProps) => {
  return (
    <div 
      className={cn("relative", className)} 
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
      >
        <polygon 
          points="50,0 100,38 81,100 19,100 0,38" 
          className="fill-enf-green dark:fill-enf-light-green stroke-white dark:stroke-gray-800" 
          strokeWidth="2"
        />
        <text 
          x="50" 
          y="62" 
          textAnchor="middle" 
          fontSize="40"
          className="fill-white dark:fill-gray-800 font-bold"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          E
        </text>
      </svg>
    </div>
  );
};

export default PentagonLogo;
