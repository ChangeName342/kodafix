const WHATSAPP_NUMBER  = "56953584105";
const WHATSAPP_MESSAGE = "Hola Koda Fix, quiero contarles mi proyecto 👋";
const WA_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const CSS = `
  /* ── Wrapper fijo en pantalla ── */
  .wa-fixed {
    position: fixed;
    bottom: 28px;
    right: 24px;
    z-index: 200;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    /* ← La flotación va AQUÍ: mueve nube + botón juntos */
    animation: waFloat 3.2s ease-in-out infinite;
  }

  @keyframes waFloat {
    0%,100% { transform: translateY(0px);  }
    30%      { transform: translateY(-7px); }
    60%      { transform: translateY(-3px); }
    80%      { transform: translateY(-9px); }
  }

  /* ── Nube ── */
  .wa-bubble {
    background: #13111f;
    border: 1px solid rgba(168,85,247,0.35);
    border-radius: 16px 16px 4px 16px;
    padding: 12px 16px;
    max-width: 210px;
    position: relative;
    box-shadow:
      0 8px 32px rgba(0,0,0,0.5),
      0 0 0 1px rgba(168,85,247,0.1),
      0 0 24px rgba(168,85,247,0.15);
    pointer-events: none;
    opacity: 0;
    transform: scale(0.9);
    transform-origin: bottom right;
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
  }
  .wa-bubble.visible {
    opacity: 1;
    transform: scale(1);
  }
  /* Cola — apunta hacia abajo-derecha donde está el botón */
  .wa-bubble::after {
    content: '';
    position: absolute;
    bottom: -7px;
    right: 26px;
    width: 12px;
    height: 12px;
    background: #13111f;
    border-right: 1px solid rgba(168,85,247,0.35);
    border-bottom: 1px solid rgba(168,85,247,0.35);
    transform: rotate(45deg);
    border-radius: 0 0 3px 0;
  }
  .wa-bubble-emoji {
    font-size: 15px;
    margin-bottom: 4px;
    display: block;
  }
  .wa-bubble-text {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #f1f0ff;
    line-height: 1.45;
    display: block;
  }
  .wa-bubble-sub {
    font-family: 'Outfit', sans-serif;
    font-size: 11.5px;
    font-weight: 400;
    color: rgba(168,85,247,0.75);
    line-height: 1.4;
    display: block;
    margin-top: 3px;
  }

  /* ── Botón ── */
  .wa-fab {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0 15px;
    gap: 0;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #0e0e1a;
    border: 1px solid rgba(168,85,247,0.35);
    box-shadow:
      0 0 0 1px rgba(168,85,247,0.1),
      0 6px 24px rgba(168,85,247,0.3),
      0 2px 8px rgba(0,0,0,0.5);
    text-decoration: none;
    overflow: hidden;
    white-space: nowrap;
    /* Pulso de glow — la flotación ya la hace el padre */
    animation: waPulseGlow 3s ease-in-out infinite;
    transition:
      width         0.35s cubic-bezier(0.34, 1.3, 0.64, 1),
      border-radius 0.35s cubic-bezier(0.34, 1.3, 0.64, 1),
      gap           0.35s cubic-bezier(0.34, 1.3, 0.64, 1),
      box-shadow    0.28s ease,
      border-color  0.28s ease,
      background    0.28s ease;
  }

  /* Al hacer hover: pausa la flotación del padre y expande el botón */
  .wa-fixed:hover {
    animation-play-state: paused;
  }
  .wa-fab:hover {
    width: 310px;
    border-radius: 20px;
    gap: 12px;
    padding-right: 20px;
    background: #130f20;
    border-color: rgba(168,85,247,0.6);
    box-shadow:
      0 0 0 1px rgba(168,85,247,0.25),
      0 10px 36px rgba(168,85,247,0.45),
      0 4px 12px rgba(0,0,0,0.5);
    animation-play-state: paused;
  }

  @keyframes waPulseGlow {
    0%,100% {
      box-shadow: 0 0 0 1px rgba(168,85,247,0.1),
                  0 6px 24px rgba(168,85,247,0.3),
                  0 2px 8px rgba(0,0,0,0.5);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(168,85,247,0.06),
                  0 8px 32px rgba(168,85,247,0.45),
                  0 2px 8px rgba(0,0,0,0.5);
    }
  }

  .wa-fab__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
  }

  .wa-fab__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }
  .wa-fab:hover .wa-fab__text {
    opacity: 1;
    pointer-events: auto;
    transition: opacity 0.2s ease 0.15s;
  }

  .wa-fab__title {
    font-family: 'Outfit', sans-serif;
    font-size: 14.5px;
    font-weight: 700;
    color: #f1f0ff;
    line-height: 1.2;
    letter-spacing: -0.2px;
  }
  .wa-fab__sub {
    font-family: 'Outfit', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    color: rgba(168,85,247,0.85);
    line-height: 1.3;
  }
`;

function BubbleScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function initBubble() {
              const bubble = document.getElementById('wa-bubble');
              if (!bubble) return;
              let shown = false;

              function showBubble() {
                if (shown) return;
                shown = true;
                bubble.classList.add('visible');
                setTimeout(() => {
                  bubble.classList.remove('visible');
                  shown = false;
                }, 5000);
              }

              setTimeout(showBubble, 4000);
              setInterval(showBubble, 18000);
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initBubble);
            } else {
              initBubble();
            }
          })();
        `,
      }}
    />
  );
}

export default function WhatsAppButton() {
  return (
    <>
      <style>{CSS}</style>
      <BubbleScript />

      {/* Un solo contenedor que flota — nube y botón se mueven juntos */}
      <div className="wa-fixed">

        {/* Nube */}
        <div id="wa-bubble" className="wa-bubble">
          <span className="wa-bubble-emoji">💬</span>
          <span className="wa-bubble-text">¿Tienes dudas?</span>
          <span className="wa-bubble-sub">Inicia un chat y resolvemos tus dudas al instante.</span>
        </div>

        {/* Botón */}
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contáctanos por WhatsApp"
          className="wa-fab"
        >
          <span className="wa-fab__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="42" height="42">
              <path
                fill="rgba(168,85,247,0.9)"
                d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.1 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-3.1 0-6.1-.8-8.7-2.4l-.6-.4-6.2 1.6 1.7-6-.4-.7C8.1 29.9 7.3 27 7.3 24 7.3 14.8 14.8 7.3 24 7.3S40.7 14.8 40.7 24 33.2 40 24 40z"
              />
              <path
                fill="#f1f0ff"
                d="M33.5 28.1c-.5-.2-2.9-1.4-3.3-1.6-.5-.2-.8-.2-1.1.2-.3.5-1.3 1.6-1.6 1.9-.3.3-.6.4-1.1.1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.8-2.6-3.2-.3-.5 0-.7.2-1 .2-.2.5-.6.7-.9.2-.3.3-.5.5-.8.2-.3.1-.6 0-.9-.1-.2-1.1-2.6-1.5-3.5-.4-.9-.8-.8-1.1-.8h-.9c-.3 0-.8.1-1.2.6-.4.5-1.6 1.6-1.6 3.8s1.6 4.4 1.9 4.7c.2.3 3.2 4.9 7.8 6.8 1.1.5 1.9.7 2.6.9 1.1.3 2.1.3 2.8.2.9-.1 2.9-1.2 3.3-2.3.4-1.1.4-2.1.3-2.3-.2-.2-.5-.3-1-.5z"
              />
            </svg>
          </span>

          <span className="wa-fab__text">
            <span className="wa-fab__title">Cuéntanos tu proyecto</span>
            <span className="wa-fab__sub">y lo hacemos a tu medida ✦</span>
          </span>
        </a>

      </div>
    </>
  );
}
