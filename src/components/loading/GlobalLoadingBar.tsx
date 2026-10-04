import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function GlobalLoadingBar() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Trigger on route transition
    setActive(true);
    setProgress(25);

    const t1 = setTimeout(() => setProgress(70), 80);
    const t2 = setTimeout(() => setProgress(100), 220);
    const t3 = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.pathname, location.search]);

  if (!active && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 shadow-[0_0_12px_rgba(16,185,129,0.6)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: active ? 1 : 0,
          transition: "width 200ms ease-out, opacity 250ms ease-in"
        }}
      />
    </div>
  );
}
