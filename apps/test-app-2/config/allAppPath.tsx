import { StaticImageData } from "next/image";
import { ReactNode } from "react";
import Image from "next/image";

export type PathChatConfig = {
  autoPopUpQuestion: ReactNode;
  pageTrendingQuestions: ReactNode[];
};

export type Menu = {
  path:
    | string
    | {
        path: string;
        title: string;
        routePath: string;
        icon?: StaticImageData;
        footer?: ReactNode;
        chatConfig?: PathChatConfig;
      }[];
  title: string;
  routePath?: string;
  icon?: StaticImageData;
  chatConfig?: PathChatConfig;
};

export type flatMenu = {
  path: string;
  title: string;
  icon?: StaticImageData;
  chatConfig?: PathChatConfig;
};

export const footerData: Record<string, ReactNode> = {
  pot2pump: (
    <div className="flex justify-center items-center">
      <Image
        src="/images/pumping/toast-bear.png"
        width={1000}
        height={0}
        alt="toast bear"
        className="w-full"
      />
    </div>
  ),
};

export const appPathsList: Menu[] = [
  {
    path: "/",
    title: "Overview",
    routePath: "/",
  },
  {
    path: "/potting",
    title: "Potting",
    routePath: "/potting",
  },
  {
    path: "/pumping",
    title: "Pumping",
    routePath: "/pumping",
  },
  // {
  //   path: "/derbydashboard",
  //   title: "Derby Dashboard 🐎",
  // },
  // {
  //   path: "/memewar",
  //   title: "Meme War ⚔️",
  // },
  {
    path: "/leaderboard",
    title: "Leaderboard",
    routePath: "/leaderboard",
  },
];

const getFlatPaths = (paths: Menu[]): flatMenu[] => {
  let flatPaths: flatMenu[] = [];

  paths.forEach((path) => {
    if (typeof path.path === "string") {
      flatPaths.push({
        path: path.path,
        title: path.title,
      });
    }
    if (Array.isArray(path.path)) {
      flatPaths = [...flatPaths, ...getFlatPaths(path.path)];
    }
  });

  return flatPaths;
};

export const flatAppPath = getFlatPaths(appPathsList);
