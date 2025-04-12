
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

const Logo = ({ className, size = 40, showText = false }: LogoProps) => {
  return (
    <div className={cn("relative flex items-center", className)}>
      <img 
        src="/lovable-uploads/cb5343bd-322d-4d56-b035-40ca6be03e81.png" 
        alt="Esther Nyasuba Foundation Logo" 
        style={{ width: size, height: size }}
        className="object-contain"
      />
      {showText && (
        <span className="ml-2 font-semibold text-lg">
          Esther Nyasuba Foundation
        </span>
      )}
    </div>
  );
};

export default Logo;
