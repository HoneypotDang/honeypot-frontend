"use client";
import styles from "./TVChartContainer.module.css";
import { useEffect, useRef, useState } from "react";
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  widget,
} from "@/public/static/charting_library/charting_library";
import { getBaseUrl } from "@/lib/trpc";
import { observable } from "mobx";
import { ParseTicker } from "@/lib/advancedChart.util";
import { chart } from "@/services/chart";
import { wallet } from "@/services/wallet";

export const TVChartContainer = (
  props: Partial<ChartingLibraryWidgetOptions>
) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        `${getBaseUrl()}/api/udf-data-feed`,
        undefined,
        {
          maxResponseLength: 1000,
          expectedOrder: "latestFirst",
        }
      ),
      interval: props.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: props.library_path,
      locale: props.locale as LanguageCode,
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates", "hide_left_toolbar_by_default"],
      charts_storage_url: props.charts_storage_url,
      charts_storage_api_version: props.charts_storage_api_version,
      client_id: props.client_id,
      user_id: props.user_id,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      theme: props.theme,
      symbol_search_complete: props.symbol_search_complete,
      overrides: {
        "paneProperties.background": "#271A0C",
        "paneProperties.backgroundType": "solid",
        "paneProperties.separatorColor": "#F7931A",
      },
      custom_css_url: "./TVChartContainer.module.css",
    };

    const tvWidget = new widget(widgetOptions);
    // tvWidget.onChartReady(() => {
    //   tvWidget.headerReady().then(() => {
    //     const button = tvWidget.createButton();
    //     button.setAttribute("title", "Click to show a notification popup");
    //     button.classList.add("apply-common-tooltip");
    //     button.addEventListener("click", () =>
    //       tvWidget.showNoticeDialog({
    //         title: "Notification",
    //         body: "TradingView Charting Library API works correctly",
    //         callback: () => {
    //           console.log("Noticed!");
    //         },
    //       })
    //     );

    //     button.innerHTML = "Check API";
    //   });
    // });

    return () => {
      tvWidget.remove();
    };
  }, [props]);

  return (
    <>
      <div ref={chartContainerRef} className={`relative w-full h-full`} />
    </>
  );
};
