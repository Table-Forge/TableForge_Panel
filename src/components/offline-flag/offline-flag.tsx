import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export const OfflineFlag = () => {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-2 bg-tertiary/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
      <WifiOff size={16} />
      <span>Modo Offline: visualizando dados locais</span>
    </div>
  );
};
