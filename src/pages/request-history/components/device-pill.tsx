import { Bot, Globe, Monitor, Smartphone } from "lucide-react";

export type TDeviceCategory =
  | "desktop-browser"
  | "mobile-browser"
  | "mobile-app"
  | "other";

interface IDeviceConfig {
  classes: string;
  icon: typeof Monitor;
}

const DEVICE_CONFIG: Record<TDeviceCategory, IDeviceConfig> = {
  "desktop-browser": {
    classes: "border-sky-500/30 bg-sky-500/15 text-sky-300",
    icon: Monitor,
  },
  "mobile-browser": {
    classes: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
    icon: Globe,
  },
  "mobile-app": {
    classes: "border-purple-500/30 bg-purple-500/15 text-purple-300",
    icon: Smartphone,
  },
  other: {
    classes: "border-white/15 bg-white/10 text-grays-200",
    icon: Bot,
  },
};

function getDeviceInfo(userAgent?: string | null): {
  category: TDeviceCategory;
  label: string;
} {
  if (!userAgent) {
    return { category: "other", label: "Desconhecido" };
  }

  const ua = userAgent.toLowerCase();

  const isNativeApp =
    ua.includes("okhttp") ||
    ua.includes("cfnetwork") ||
    ua.includes("darwin") ||
    ua.includes("tableforge") ||
    ua.includes("expo") ||
    ua.includes("alamofire") ||
    ua.includes("reactnative");

  if (isNativeApp) {
    return { category: "mobile-app", label: "App Mobile" };
  }

  const isBrowser =
    ua.includes("mozilla") ||
    ua.includes("chrome") ||
    ua.includes("safari") ||
    ua.includes("firefox") ||
    ua.includes("edg");

  if (isBrowser) {
    const isMobileBrowser =
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone") ||
      ua.includes("ipad") ||
      ua.includes("ipod");

    if (isMobileBrowser) {
      return { category: "mobile-browser", label: "Navegador Mobile" };
    }

    return { category: "desktop-browser", label: "Desktop" };
  }

  if (
    ua.includes("postman") ||
    ua.includes("insomnia") ||
    ua.includes("curl") ||
    ua.includes("wget")
  ) {
    return { category: "other", label: "API / Ferramenta" };
  }

  return { category: "other", label: "Outro" };
}

export interface IDevicePill {
  userAgent?: string | null;
  className?: string;
}

export function DevicePill({ userAgent, className = "" }: IDevicePill) {
  const { category, label } = getDeviceInfo(userAgent);
  const config = DEVICE_CONFIG[category];
  const Icon = config.icon;

  return (
    <span
      title={userAgent ?? undefined}
      className={`inline-flex items-center gap-1.5 chamfer-sm border px-2.5 py-0.5 text-xs font-semibold tracking-wide whitespace-nowrap ${config.classes} ${className}`}
    >
      <Icon size={13} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
}
