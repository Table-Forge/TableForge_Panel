import { InfoIcon } from "lucide-react";
import type { Property } from "csstype";
import { Tooltip } from "@/src/components/tooltip/tooltip";

export type TSide =
  | "top"
  | "bottom"
  | "left"
  | "center"
  | "right"
  | "full-right"
  | "full-left";

export interface IInfo {
  text: string;
  whiteSpace?: Property.WhiteSpace;
  side?: TSide;
}

export const Info: React.FC<IInfo> = ({ text, whiteSpace, side }) => {
  return (
    <div className="relative inline-flex" style={{ whiteSpace }}>
      <Tooltip side={side} text={text}>
        <InfoIcon size={14} className="text-grays-100" />
      </Tooltip>
    </div>
  );
};
