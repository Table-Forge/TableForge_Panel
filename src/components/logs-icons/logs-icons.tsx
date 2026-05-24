import { LOG_ERROR_KEYS } from "@/src/constants/keyed-lists";
import { cleanStringForKey } from "@/src/utils/format";
import { BiErrorCircle } from "react-icons/bi";
import {
  GrStatusCritical,
  GrStatusInfo,
  GrStatusUnknown,
  GrStatusWarning,
} from "react-icons/gr";
import { Tooltip } from "../tooltip/tooltip";

export const LogIcon: React.FC<{ type?: string }> = ({ type = "-" }) => {
  const formattedLogType = cleanStringForKey(type);
  const logType = LOG_ERROR_KEYS[formattedLogType]
    ? formattedLogType
    : "unknown";
  const iconColor = LOG_ERROR_KEYS[logType].color;

  const renderIcon = () => {
    switch (logType) {
      case "information":
        return <GrStatusInfo size={24} color={iconColor} />;
      case "warning":
        return <GrStatusWarning size={24} color={iconColor} />;
      case "error":
        return <BiErrorCircle size={24} color={iconColor} />;
      case "critical":
        return <GrStatusCritical size={24} color={iconColor} />;
      case "unknown":
      default:
        return <GrStatusUnknown size={24} color={iconColor} />;
    }
  };

  return (
    <Tooltip text={LOG_ERROR_KEYS[logType].name} side="full-right">
      {renderIcon()}
    </Tooltip>
  );
};
