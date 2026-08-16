import { useEffect, useState } from "react";

/**
 * Splash screen hi-tech sederhana, tampil sekali saat aplikasi dibuka.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage.getItem("splash-shown")) {
      setVisible(false);
      return;
    }
    const fade = setTimeout(() => setFading(true), 1200);
    const hide = setTimeout(() => {
      setVisible(false);
      try {
        window.sessionStorage.setItem("splash-shown", "1");
      } catch {
        /* ignore */
      }
    }, 1700);
    return () => {
      clearTimeout(fade);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <svg
        viewBox="0 0 120 120"
        className="h-24 w-24 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="60" cy="60" r="52" className="opacity-20" />
        <circle
          cx="60"
          cy="60"
          r="52"
          strokeDasharray="60 260"
          strokeLinecap="round"
          className="origin-center animate-spin [animation-duration:1.4s]"
        />
        <circle cx="60" cy="60" r="34" className="opacity-30" />
        <path d="M60 26v14M60 80v14M26 60h14M80 60h14" strokeLinecap="round" className="opacity-60" />
        <circle cx="60" cy="60" r="10" className="animate-pulse" fill="currentColor" stroke="none" />
      </svg>

      <p className="mt-6 font-display text-lg font-semibold tracking-wide">
        Griya <span className="text-gradient-brand">Arca Putri</span>
      </p>
      <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
        Network Monitor
      </p>

      <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/3 animate-[splash-bar_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
    </div>
  );
}
