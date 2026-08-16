import { ExternalLink, ImageOff, LineChart } from "lucide-react";
import { useEffect, useState } from "react";

const FALLBACK_LINKS = [
  { label: "Dari luar kost", url: "http://117.121.207.223:2627/graphs/iface/ether1/daily.gif" },
  { label: "Dari dalam kost", url: "http://192.168.35.1/graphs/iface/ether1/daily.gif" },
];

/**
 * Grafik MRTG ether1 (harian). Gambar diambil lewat proxy internal agar bisa
 * tampil di halaman https, dengan failsafe dua sumber di sisi server.
 */
export function Ether1Graph({ refreshKey }: { refreshKey?: number }) {
  const [stamp, setStamp] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setStamp(Date.now());
    setFailed(false);
  }, [refreshKey]);


  return (
    <section className="card-elevated mt-6 rounded-2xl border border-border p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-display text-base font-semibold">
          <LineChart className="h-4 w-4 text-primary" /> Trafik Internet — Ether1 (Harian)
        </h3>
        <span className="text-xs text-muted-foreground">MRTG · pembaruan tiap 60 detik</span>
      </div>

      {failed ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-5 text-center">
          <ImageOff className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Grafik tidak tersedia dari kedua sumber saat ini.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {FALLBACK_LINKS.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
              >
                {l.label} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border/70 bg-card p-2">
          <img
            src={`/api/graph/ether1.gif?t=${stamp}`}
            alt="Grafik trafik harian interface ether1"
            loading="lazy"
            onError={() => setFailed(true)}
            className="mx-auto h-auto w-full min-w-[320px] max-w-[560px]"
          />
        </div>
      )}
    </section>
  );
}
