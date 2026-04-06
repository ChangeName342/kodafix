import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Terminos() {
  const navigate = useNavigate();
  const updated  = "6 de abril de 2025";
  const { c } = useTheme();

  const TEXT_HI  = c.textHi;
  const TEXT_MID = c.textMid;
  const TEXT_LOW = c.textLow;
  const BG       = c.bg;
  const BG_CARD  = c.bgCard;

  function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
    return (
      <section id={id} style={{ marginBottom: 52 }}>
        <h2 style={{
          fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800,
          color: TEXT_HI, letterSpacing: -0.5, marginBottom: 16,
          paddingBottom: 12, borderBottom: `1px solid ${c.border}`,
        }}>
          {title}
        </h2>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: TEXT_MID, lineHeight: 1.85 }}>
          {children}
        </div>
      </section>
    );
  }

  function P({ children }: { children: React.ReactNode }) {
    return <p style={{ margin: "0 0 12px" }}>{children}</p>;
  }

  function Li({ children }: { children: React.ReactNode }) {
    return (
      <li style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{children}</span>
      </li>
    );
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Outfit',sans-serif", color: TEXT_HI, transition: "background 0.3s, color 0.3s" }}>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: `1px solid ${c.border}`,
        background: c.navBg, backdropFilter: "blur(12px)",
        padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Outfit',sans-serif", fontSize: 14, color: TEXT_MID }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a855f7")}
          onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MID)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver
        </button>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          <span style={{ color: "#a855f7" }}>Koda </span><span style={{ color: TEXT_HI }}>Fix</span>
        </span>
        <div style={{ width: 80 }} />
      </nav>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px 96px" }}>

        {/* Encabezado */}
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a855f7", marginBottom: 12 }}>
            Legal
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, margin: "0 0 14px" }}>
            Términos y Condiciones
          </h1>
          <p style={{ fontSize: 14, color: TEXT_LOW }}>Última actualización: {updated}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
            {[
              ["#servicios",    "Servicios"],
              ["#contratacion", "Contratación y pago"],
              ["#entrega",      "Tiempos de entrega"],
              ["#mensualidad",  "Mensualidad"],
              ["#cancelacion",  "Cancelación"],
              ["#privacidad",   "Privacidad"],
              ["#limitaciones", "Limitaciones"],
              ["#contacto",     "Contacto"],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{
                fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600,
                padding: "5px 14px", borderRadius: 100,
                background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.22)",
                color: "#a855f7", textDecoration: "none",
              }}>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Introducción */}
        <div style={{ background: BG_CARD, border: "1px solid rgba(168,85,247,0.2)", borderRadius: 16, padding: "22px 24px", marginBottom: 48 }}>
          <P>
            Al contratar cualquier plan de <strong style={{ color: TEXT_HI }}>Koda Fix</strong>, aceptas los presentes Términos y Condiciones en su totalidad. Te pedimos leerlos con atención antes de proceder con el pago. Si tienes dudas, escríbenos a <strong style={{ color: TEXT_HI }}>contacto@kodafix.cl</strong> o por WhatsApp antes de contratar.
          </P>
          <P>
            Koda Fix es una empresa de servicios digitales con operación en Chile. Nuestros precios están expresados en pesos chilenos (CLP) e incluyen IVA.
          </P>
        </div>

        <Section id="servicios" title="1. Descripción de los servicios">
          <P>Koda Fix ofrece servicios de presencia digital, desarrollo web, e-commerce, optimización SEO y soporte telemático, organizados en planes descritos en detalle en nuestro sitio web.</P>
          <P>Cada plan incluye una <strong style={{ color: TEXT_HI }}>implementación única</strong> (pago inicial) y una <strong style={{ color: TEXT_HI }}>mensualidad de soporte</strong>. El detalle exacto de lo que incluye cada plan está disponible en la página de descripción correspondiente.</P>
          <P>Nos reservamos el derecho de actualizar o mejorar los servicios ofrecidos, comunicando los cambios con al menos 15 días de anticipación.</P>
        </Section>

        <Section id="contratacion" title="2. Contratación y pago">
          <P>El proceso de contratación se realiza a través de nuestro sitio web mediante la plataforma de pago <strong style={{ color: TEXT_HI }}>Flow</strong>, que procesa las transacciones de forma segura. Koda Fix no almacena datos de tarjetas de crédito o débito.</P>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
            <Li>El pago de implementación es <strong style={{ color: TEXT_HI }}>único y no reembolsable</strong> una vez iniciado el trabajo.</Li>
            <Li>La mensualidad se cobra mes a mes a partir de la entrega del servicio.</Li>
            <Li>Los precios publicados incluyen IVA y pueden cambiar con previo aviso de 30 días.</Li>
            <Li>El comprobante de pago es enviado por Flow al correo electrónico indicado.</Li>
          </ul>
        </Section>

        <Section id="entrega" title="3. Tiempos de entrega">
          <P>Los plazos de entrega indicados en cada plan son estimaciones en días hábiles y comienzan a contar desde que Koda Fix recibe toda la información necesaria del cliente (textos, logos, imágenes, accesos, etc.).</P>
          <P>Si el cliente demora en entregar la información requerida, los plazos se ajustarán proporcionalmente. Koda Fix no se hace responsable por retrasos atribuibles al cliente.</P>
        </Section>

        <Section id="mensualidad" title="4. Mensualidad y continuidad del servicio">
          <P>La mensualidad cubre el soporte telemático, mantenimiento y los servicios recurrentes descritos en cada plan. Para mantener el servicio activo, la mensualidad debe estar al día.</P>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
            <Li>En caso de no pago por más de 15 días corridos, el servicio puede ser suspendido.</Li>
            <Li>La reactivación del servicio puede tener un cobro administrativo.</Li>
            <Li>El hosting y dominio solo se mantienen activos mientras la mensualidad esté vigente.</Li>
          </ul>
        </Section>

        <Section id="cancelacion" title="5. Cancelación y término del contrato">
          <P>El cliente puede cancelar la mensualidad en cualquier momento con <strong style={{ color: TEXT_HI }}>15 días de aviso previo</strong> por escrito (correo electrónico o WhatsApp).</P>
          <P>Al cancelar, Koda Fix entregará los archivos y accesos del sitio web al cliente dentro de los siguientes 7 días hábiles. El pago de implementación no es reembolsable bajo ninguna circunstancia.</P>
          <P>Koda Fix puede dar término al contrato en caso de incumplimiento grave de estos términos, con aviso de 7 días.</P>
        </Section>

        <Section id="privacidad" title="6. Política de Privacidad">
          <P>Koda Fix recopila únicamente los datos necesarios para prestar el servicio contratado: nombre, correo electrónico y datos de la empresa. No vendemos ni compartimos esta información con terceros, salvo las plataformas de pago (Flow) necesarias para procesar la transacción.</P>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px" }}>
            <Li>Los datos personales se almacenan en servidores seguros de Firebase (Google Cloud).</Li>
            <Li>Puedes solicitar la eliminación de tus datos en cualquier momento escribiéndonos.</Li>
            <Li>No enviamos correos no solicitados ni compartimos tu información con fines publicitarios.</Li>
          </ul>
          <P>Cumplimos con la <strong style={{ color: TEXT_HI }}>Ley N° 19.628</strong> sobre Protección de la Vida Privada de Chile.</P>
        </Section>

        <Section id="limitaciones" title="7. Limitaciones de responsabilidad">
          <P>Koda Fix no se hace responsable por pérdidas indirectas, lucro cesante o daños derivados del uso o imposibilidad de uso del servicio por causas ajenas a nuestra operación (fuerza mayor, fallas de terceros, etc.).</P>
          <P>La responsabilidad máxima de Koda Fix en cualquier caso se limita al monto pagado por el cliente en los últimos 3 meses de servicio.</P>
        </Section>

        <Section id="contacto" title="8. Contacto">
          <P>Para cualquier consulta sobre estos Términos y Condiciones, puedes contactarnos por:</P>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <Li>WhatsApp: <strong style={{ color: TEXT_HI }}>+56 9 5358 4105</strong></Li>
            <Li>Correo: <strong style={{ color: TEXT_HI }}>contacto@kodafix.cl</strong></Li>
            <Li>Instagram: <strong style={{ color: TEXT_HI }}>kodafix.cl</strong></Li>
          </ul>
        </Section>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 32, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: TEXT_LOW, lineHeight: 1.7 }}>
            © {new Date().getFullYear()} Koda Fix · Todos los derechos reservados<br />
            Estos términos están sujetos a la legislación vigente de la República de Chile.
          </p>
        </div>

      </div>
    </div>
  );
}
