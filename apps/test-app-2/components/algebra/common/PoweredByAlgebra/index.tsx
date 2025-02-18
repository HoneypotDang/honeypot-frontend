import AlgebraLogo from "@/public/images/partners/algebra.png";
import WasabeeLogo from "@/public/images/partners/wasabee.png";
import { cn } from "@/lib/tailwindcss";
import AlphaKekLogo from "@/public/images/partners/alphakek-logo.png";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
const PoweredByAlgebra = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn("flex items-center justify-center gap-2 p-2", className)}
    >
      <span className="text-sm font-semibold">Powered by</span>
      <div className="flex items-center gap-1">
        <Link
          href={"https://algebra.finance"}
          target="_blank"
          className="flex items-center gap-1"
        >
          <Tooltip content="Algebra Integral">
            <Image
              src={AlgebraLogo}
              width={120}
              height={20}
              alt="Algebra Logo"
            />
          </Tooltip>
        </Link>
        <span>X</span>
        <Link
          href={"https://x.com/WasabeeFi"}
          target="_blank"
          className="flex items-center gap-1"
        >
          {/* <span>Wasabee</span> */}
          <Tooltip content="Wasabee Finance">
            <Image
              src={WasabeeLogo}
              width={24}
              height={24}
              alt="Wasabee Logo"
            />
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export const PoweredByAlphaKek = ({ className }: { className?: string }) => {
  return (
    <a
      href={"https://alphakek.ai"}
      className={cn("flex items-center gap-2 p-2 text-black", className)}
      target="_blank"
    >
      <span className="text-sm font-semibold">Powered by</span>
      <Tooltip content="AlphaKek">
        <Image src={AlphaKekLogo} alt="AlphaKek Logo" width={24} height={24} />
      </Tooltip>
    </a>
  );
};

export default PoweredByAlgebra;
