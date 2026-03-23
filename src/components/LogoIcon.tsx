export default function LogoIcon() {
  return (
    <div
      className="flex items-center justify-center rounded-[10px] border flex-shrink-0"
      style={{
        width: 38, height: 38,
        background: "linear-gradient(135deg,#1a0a2e,#2d1557)",
        borderColor: "rgba(168,85,247,0.3)",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 3 Q2 3 2 5.5 L2 8 Q2 10 0.5 10 Q2 10 2 12.5 L2 15 Q2 17 4 17" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M18 3 Q20 3 20 5.5 L20 8 Q20 10 21.5 10 Q20 10 20 12.5 L20 15 Q20 17 18 17" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <line x1="7" y1="4" x2="7" y2="16" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="7" y1="10" x2="15" y2="4" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="7" y1="10" x2="15" y2="16" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="7" cy="4" r="1.2" fill="#e9d5ff" />
        <circle cx="15" cy="4" r="1.2" fill="#e9d5ff" />
        <circle cx="7" cy="10" r="1.2" fill="#e9d5ff" />
        <circle cx="15" cy="16" r="1.2" fill="#e9d5ff" />
      </svg>
    </div>
  );
}
