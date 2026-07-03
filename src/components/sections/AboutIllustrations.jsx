import styles from "./AboutIllustrations.module.css";

export function AboutCardVisual({ variant }) {
  if (variant === "web") return <WebVisual />;
  if (variant === "mobile") return <MobileVisual />;
  return <RealtimeVisual />;
}

function WebVisual() {
  return (
    <svg viewBox="0 0 160 120" className={styles.cardSvg} aria-hidden="true">
      <rect x="20" y="16" width="120" height="88" rx="8" className={styles.frame} />
      <rect x="20" y="16" width="120" height="16" rx="8" className={styles.frameBar} />
      <circle cx="32" cy="24" r="3" className={styles.dot} />
      <circle cx="42" cy="24" r="3" className={styles.dot} />
      <circle cx="52" cy="24" r="3" className={styles.dot} />
      <rect x="32" y="44" width="48" height="6" rx="2" className={styles.bar} />
      <rect x="32" y="56" width="72" height="4" rx="2" className={styles.barMuted} />
      <rect x="32" y="66" width="60" height="4" rx="2" className={styles.barMuted} />
      <rect x="88" y="44" width="40" height="44" rx="4" className={styles.panel} />
      <rect x="94" y="52" width="28" height="4" rx="2" className={styles.barAccent} />
      <rect x="94" y="62" width="20" height="4" rx="2" className={styles.barMuted} />
      <rect x="94" y="72" width="24" height="4" rx="2" className={styles.barMuted} />
      <rect x="32" y="80" width="48" height="16" rx="3" className={styles.chart}>
        <animate attributeName="height" values="16;22;14;16" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y" values="80;74;82;80" dur="3s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function MobileVisual() {
  return (
    <svg viewBox="0 0 160 120" className={styles.cardSvg} aria-hidden="true">
      <rect x="58" y="12" width="44" height="88" rx="8" className={styles.frame} />
      <rect x="72" y="18" width="16" height="4" rx="2" className={styles.barMuted} />
      <rect x="66" y="30" width="28" height="4" rx="2" className={styles.bar} />
      <rect x="66" y="40" width="22" height="3" rx="1.5" className={styles.barMuted} />
      <rect x="66" y="48" width="26" height="3" rx="1.5" className={styles.barMuted} />
      <rect x="66" y="58" width="28" height="14" rx="3" className={styles.panel} />
      <circle cx="80" cy="82" r="10" className={styles.pingRing} />
      <circle cx="80" cy="82" r="4" className={styles.pingCore} />
      <path d="M30 82 L52 82" className={styles.routeLine} strokeDasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="0;-16" dur="1.2s" repeatCount="indefinite" />
      </path>
      <circle cx="28" cy="82" r="5" className={styles.routeDot} />
    </svg>
  );
}

function RealtimeVisual() {
  return (
    <svg viewBox="0 0 160 120" className={styles.cardSvg} aria-hidden="true">
      <circle cx="80" cy="60" r="8" className={styles.hubDot} />
      <circle cx="80" cy="60" r="16" className={styles.pingRing} />
      <circle cx="36" cy="40" r="6" className={styles.nodeDot} />
      <circle cx="124" cy="40" r="6" className={styles.nodeDot} />
      <circle cx="48" cy="88" r="6" className={styles.nodeDot} />
      <circle cx="112" cy="88" r="6" className={styles.nodeDot} />
      <line x1="80" y1="60" x2="36" y2="40" className={styles.linkLine} />
      <line x1="80" y1="60" x2="124" y2="40" className={styles.linkLine} />
      <line x1="80" y1="60" x2="48" y2="88" className={styles.linkLine} />
      <line x1="80" y1="60" x2="112" y2="88" className={styles.linkLine} />
      <circle cx="124" cy="40" r="10" className={styles.pingRingSlow} />
      <path d="M118 36 L124 40 L118 44" className={styles.spark} />
    </svg>
  );
}
