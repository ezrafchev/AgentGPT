import React from "react";
import {
  TooltipPrimitiveProvider,
  TooltipPrimitiveRoot,
  TooltipPrimitiveTrigger,
  TooltipPrimitivePortal,
  TooltipPrimitiveContent,
  TooltipPrimitiveArrow,
} from "@radix-ui/react-tooltip";
import type { TooltipContentProps, TooltipProviderProps, TooltipTriggerProps } from "@radix-ui/react-tooltip";
import type { CSSProperties } from "styled-components";

type TooltipProps = {
  child: React.ReactNode;
  toolTipProperties?: {
    message?: string;
    disabled?: boolean;
    html?: string;
  };
  style?: {
    container?: CSSProperties;
  };
  sideOffset: number;
};

const TooltipContent = (props: TooltipContentProps) => {
  return (
    <TooltipPrimitiveContent
      className="will-change animation-transform user-select-none z-40 w-3/5 rounded-sm bg-black px-3.5 py-2.5 text-white shadow-lg "
      sideOffset={props.sideOffset}
      side={props.side}
      {...props}
    >
      {props.html ? <div dangerouslySetInnerHTML={{ __html: props.html }} /> : props.children}
      <TooltipPrimitiveArrow className="fill-black" />
    </TooltipPrimitiveContent>
  );
};

const Tooltip = ({
  child,
  toolTip
