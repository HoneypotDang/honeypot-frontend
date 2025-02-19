import { PeddingSvg } from "@/components/svg/Pedding";
import { PlusSvg } from "@/components/svg/plus";
import { TimelineSvg } from "@/components/svg/Timeline";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { use, useEffect } from "react";
import Draggable from "react-draggable";

interface NavigationWidgetProps {
  widgetName: string;
  widgetIcon?: StaticImageData;
  link: string;
  widgetData?: WidgetData;
}

export interface WidgetData {
  x: number;
  y: number;
}

export default function NavigationWidget({
  widgetName,
  widgetIcon,
  link,
  widgetData,
}: NavigationWidgetProps) {
  function saveWidgetData(data: WidgetData) {
    const wdata = widgetData ?? loadWidgetData() ?? {};

    localStorage.setItem(
      widgetName.trim(),
      JSON.stringify({
        ...wdata,
        ...data,
      })
    );
  }

  function loadWidgetData() {
    const data = localStorage.getItem(widgetName);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  return (
    <Draggable
      defaultClassName="nav-widget inline-block"
      defaultClassNameDragged=""
      defaultClassNameDragging=""
      axis="both"
      handle=".handle"
      defaultPosition={{
        x: loadWidgetData()?.x ?? 0,
        y: loadWidgetData()?.y ?? 0,
      }}
      bounds="parent"
      position={undefined}
      grid={[5, 5]}
      scale={1}
      allowAnyClick={true}
      onStop={(e, data) => {
        saveWidgetData({
          x: data.x,
          y: data.y,
        });
      }}
      // onStart={this.handleStart}
      // onDrag={this.handleDrag}
      // onStop={this.handleStop}
    >
      <div className="select-none w-[100px] transition-colors text-center bg-white/0 hover:bg-white/20 rounded-2xl overflow-hidden">
        <div className="handle w-[100px] h-[20px] flex justify-center items-center bg-black/50 opacity-0 hover:opacity-100 transition-all cursor-move"></div>
        <div className=" w-[100px] h-[120px]">
          <Link href={link ?? "/"} className="select-none">
            <div className="relative w-[100px] h-[70px]   hover:scale-110 transition-all">
              <Image
                className="object-contain w-full h-full pointer-events-none"
                src={widgetIcon ?? "/images/honey.png"}
                alt=""
                width={100}
                height={100}
              />
            </div>
          </Link>
          <div className="">{widgetName}</div>
        </div>
      </div>
    </Draggable>
  );
}
