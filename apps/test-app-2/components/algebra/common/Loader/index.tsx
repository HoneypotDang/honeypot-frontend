import { cn } from "@/lib/tailwindcss";
import { Loader2Icon } from "lucide-react";

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

const Loader = ({ size = 22, color = "white", className }: LoaderProps) => (
  <Loader2Icon
    size={size}
    color={color}
    className={cn("animate-spin", className)}
  />
);

export default Loader;
