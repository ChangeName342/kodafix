import { useParams, useNavigate } from "react-router-dom";

interface Entregable { icono: string; titulo: string; descripcion: string; }
interface Fase { numero: number; nombre: string; duracion: string; descripcion: string; }
interface PlanInfo {
  id: string; nombre: string; tagline: string; descripcionLarga: string;
  implementacion: number; mensualidad: number;
  color: string; colorOscuro: string;
  paraquien: string[]; entregables: Entregable[];
  fases: Fase[]; soporteMensual: string[]; garantias: string[];
}

const PLANES_DETALLE: Record<string, PlanInfo> = {
  "presencia-inicial": {
    id: "presencia-inicial", nombre: "Presencia Inicial",
    tagline: "Tu negocio existe en internet. Tus clientes te encuentran.",
    descripcionLarga: "El punto de partida para cualquier negocio que quiera ser encontrado en línea. Diseñamos una Landing Page profesional que representa tu marca, la conectamos con Google Mi Negocio para que aparezcas en los mapas, e instalamos un botón de WhatsApp para que tus clientes te contacten de inmediato. Todo en un solo paquete, gestionado por nosotros.",
    implementacion: 150_000, mensualidad: 30_000,
    color: "#22d3ee", colorOscuro: "#0891b2",
    paraquien: ["Negocios físicos que no tienen presencia en internet", "Emprendedores que están comenzando", "Comercios locales que quieren ser encontrados en Google Maps", "Profesionales independientes que necesitan una carta de presentación digital"],
    entregables: [
      { icono: "🌐", titulo: "Landing Page profesional", descripcion: "Página web de una sola pantalla con tu logo, servicios, galería, testimonios y datos de contacto. Diseño moderno y adaptado a tu identidad de marca." },
      { icono: "📍", titulo: "Google Mi Negocio configurado", descripcion: "Perfil completo en Google Maps: horarios, fotos, categoría, descripción y número de teléfono. Tus clientes te encontrarán cuando busquen tu tipo de negocio cerca." },
      { icono: "💬", titulo: "Botón WhatsApp integrado", descripcion: "Botón flotante que abre una conversación directa en WhatsApp con un mensaje predefinido. Aumenta la tasa de contacto inmediato desde tu sitio web." },
      { icono: "☁️", titulo: "Hosting gestionado", descripcion: "Tu sitio web alojado en servidores de alto rendimiento. Nos encargamos de la renovación, seguridad y disponibilidad. Sin complicaciones técnicas para ti." },
      { icono: "🛠️", titulo: "Soporte remoto básico", descripcion: "Canal de soporte por WhatsApp o email para resolver dudas y realizar actualizaciones menores de contenido dentro de la mensualidad." },
    ],
    fases: [
      { numero: 1, nombre: "Reunión de onboarding", duracion: "Día 1-2", descripcion: "Conversamos contigo para entender tu negocio, colores, logo, servicios y público objetivo." },
      { numero: 2, nombre: "Diseño y desarrollo", duracion: "Día 3-7", descripcion: "Construimos tu Landing Page y configuramos Google Mi Negocio. Te enviamos una vista previa para tu aprobación." },
      { numero: 3, nombre: "Revisión y ajustes", duracion: "Día 8-10", descripcion: "Incorporamos tus comentarios y realizamos los ajustes necesarios hasta que quedes 100% satisfecho." },
      { numero: 4, nombre: "Publicación y entrega", duracion: "Día 10-12", descripcion: "Publicamos tu sitio web, activamos Google Mi Negocio y te hacemos entrega oficial con tutorial de uso." },
    ],
    soporteMensual: ["Actualización de textos e imágenes (hasta 3 cambios al mes)", "Monitoreo de disponibilidad del sitio", "Respuesta a consultas en menos de 48 horas", "Informe mensual de visitas básico"],
    garantias: ["Sitio web entregado en máximo 12 días hábiles", "Revisiones ilimitadas durante el proceso de diseño", "30 días de soporte post-entrega sin costo adicional"],
  },
  "catalogo-organizacion": {
    id: "catalogo-organizacion", nombre: "Catálogo y Organización",
    tagline: "Muestra lo que vendes. Comunica con identidad profesional.",
    descripcionLarga: "Llevamos tu presencia digital al siguiente nivel con un catálogo digital interactivo accesible por código QR, correos corporativos con tu propio dominio y mantenimiento web incluido. Ideal para negocios que ya existen en internet pero necesitan verse más profesionales y organizados.",
    implementacion: 250_000, mensualidad: 50_000,
    color: "#34d399", colorOscuro: "#059669",
    paraquien: ["Restaurantes, tiendas o servicios que quieren mostrar su catálogo sin imprimir", "Empresas que necesitan correos profesionales (@tuempresa.cl)", "Negocios que quieren una imagen más seria y organizada", "Quien ya tiene presencia web básica y quiere dar el siguiente paso"],
    entregables: [
      { icono: "📱", titulo: "Catálogo Digital con código QR", descripcion: "Página web tipo catálogo con tus productos o servicios, precios, fotos y descripciones. Incluye código QR imprimible." },
      { icono: "📧", titulo: "Correos corporativos", descripcion: "Hasta 3 casillas de correo con tu dominio (ej: contacto@tunegocio.cl). Configuración en Gmail o cualquier cliente de correo." },
      { icono: "🔧", titulo: "Mantenimiento web mensual", descripcion: "Actualizamos tu catálogo con nuevos productos, cambios de precio o fotos dentro de los tiempos acordados." },
      { icono: "📞", titulo: "Asistencia telemática", descripcion: "Soporte remoto por videollamada, chat o email para resolver cualquier duda relacionada con tus herramientas digitales." },
    ],
    fases: [
      { numero: 1, nombre: "Levantamiento de información", duracion: "Día 1-3", descripcion: "Recopilamos fotos, descripciones, precios y categorías de tus productos o servicios." },
      { numero: 2, nombre: "Diseño del catálogo y correos", duracion: "Día 4-10", descripcion: "Construimos el catálogo digital y configuramos los correos corporativos con tu dominio." },
      { numero: 3, nombre: "Revisión y generación del QR", duracion: "Día 11-14", descripcion: "Validamos el catálogo contigo y generamos el código QR en alta resolución para impresión." },
      { numero: 4, nombre: "Entrega y capacitación", duracion: "Día 15", descripcion: "Te entregamos todos los accesos y te explicamos cómo solicitar actualizaciones de contenido." },
    ],
    soporteMensual: ["Actualización de hasta 10 productos o servicios al mes", "Soporte para correos corporativos", "Respuesta en menos de 24 horas hábiles", "Regeneración del QR si cambia la URL"],
    garantias: ["Catálogo entregado en máximo 15 días hábiles", "Correos funcionando antes de la entrega final", "Código QR en alta resolución incluido sin costo extra"],
  },
  "operacion-activa": {
    id: "operacion-activa", nombre: "Operación Activa",
    tagline: "Opera tu negocio de forma inteligente. Reservas, SEO y soporte prioritario.",
    descripcionLarga: "El plan más elegido por negocios que ya tienen clientes y quieren crecer de forma ordenada. Un sistema de reservas en línea para que tus clientes agenden sin llamarte, optimización SEO para aparecer primero en Google, respaldos automáticos y soporte prioritario cuando más lo necesitas.",
    implementacion: 380_000, mensualidad: 85_000,
    color: "#a855f7", colorOscuro: "#7c3aed",
    paraquien: ["Salones de belleza, clínicas, centros de estética o cualquier negocio que trabaje por citas", "Restaurantes o servicios que quieren gestionar reservas sin llamadas", "Negocios que quieren aparecer primero en Google", "Empresas que ya tienen web pero quieren más clientes orgánicos"],
    entregables: [
      { icono: "📅", titulo: "Sistema de Reservas / Agendamiento", descripcion: "Integración de un sistema de reservas en tu sitio web. Tus clientes pueden agendar 24/7, tú recibes notificaciones y tienes control total del calendario. Compatible con Google Calendar." },
      { icono: "🔍", titulo: "Optimización SEO", descripcion: "Auditoría y optimización para motores de búsqueda: palabras clave, velocidad, estructura, meta etiquetas, sitemap y Google Search Console configurado." },
      { icono: "💾", titulo: "Respaldos web automáticos", descripcion: "Copias de seguridad diarias de tu sitio web almacenadas en la nube. En caso de cualquier problema, restauramos tu sitio en minutos." },
      { icono: "⚡", titulo: "Soporte telemático prioritario", descripcion: "Canal de soporte dedicado con tiempo de respuesta garantizado de 4 horas hábiles. Videollamadas de soporte incluidas en la mensualidad." },
    ],
    fases: [
      { numero: 1, nombre: "Auditoría y planificación", duracion: "Día 1-4", descripcion: "Analizamos tu sitio actual, identificamos oportunidades SEO y planificamos la implementación del sistema de reservas." },
      { numero: 2, nombre: "Sistema de reservas", duracion: "Día 5-12", descripcion: "Configuramos e integramos el sistema de agendamiento con tu calendario y notificaciones automáticas." },
      { numero: 3, nombre: "Optimización SEO", duracion: "Día 10-18", descripcion: "Aplicamos todas las optimizaciones técnicas y de contenido. Configuramos Google Search Console." },
      { numero: 4, nombre: "Respaldos y entrega", duracion: "Día 18-22", descripcion: "Activamos los respaldos automáticos y realizamos capacitación en videollamada." },
    ],
    soporteMensual: ["Soporte prioritario con respuesta en máximo 4 horas hábiles", "Monitoreo mensual de posicionamiento SEO", "Informe mensual de reservas y visitas", "Actualizaciones de contenido ilimitadas", "1 videollamada de revisión al mes"],
    garantias: ["Sistema de reservas funcionando en máximo 22 días hábiles", "Resultados SEO visibles en los primeros 60 días", "Respaldos verificados mensualmente"],
  },
  "venta-automatica": {
    id: "venta-automatica", nombre: "Venta Automática",
    tagline: "Tu tienda vende sola, las 24 horas, los 7 días de la semana.",
    descripcionLarga: "Una tienda e-commerce completa conectada a una pasarela de pago para que tus clientes compren directamente desde tu sitio. Hosting de alto rendimiento para que la tienda cargue rápido incluso en momentos de alta demanda, y soporte extendido para que nunca pierdas una venta por un problema técnico.",
    implementacion: 550_000, mensualidad: 130_000,
    color: "#fb923c", colorOscuro: "#ea580c",
    paraquien: ["Tiendas que quieren vender por internet sin depender de marketplaces", "Negocios que ya venden por WhatsApp y quieren profesionalizar sus ventas", "Marcas que quieren control total sobre su tienda y sus datos", "Empresas que quieren escalar sus ventas sin aumentar su equipo"],
    entregables: [
      { icono: "🛒", titulo: "Tienda E-commerce completa", descripcion: "Tienda online con catálogo de productos, carrito de compras, gestión de stock, cupones de descuento y panel de administración para gestionar tus pedidos." },
      { icono: "💳", titulo: "Pasarela de pago integrada", descripcion: "Integración con Flow o Transbank para recibir pagos con tarjeta de crédito, débito y transferencia. Pagos seguros directo a tu cuenta." },
      { icono: "🚀", titulo: "Hosting de alto rendimiento", descripcion: "Servidor optimizado para e-commerce con alta velocidad de carga, certificado SSL y capacidad para manejar picos de visitas sin caídas." },
      { icono: "🔐", titulo: "Soporte remoto extendido", descripcion: "Soporte con tiempo de respuesta de 2 horas hábiles. Asistencia para pedidos, pagos y actualizaciones. Incluye 2 videollamadas mensuales." },
    ],
    fases: [
      { numero: 1, nombre: "Planificación de la tienda", duracion: "Día 1-5", descripcion: "Definimos la estructura de categorías, cargamos los primeros productos y configuramos métodos de envío y pago." },
      { numero: 2, nombre: "Diseño y desarrollo", duracion: "Día 6-18", descripcion: "Construimos la tienda con tu identidad de marca, optimizada para móviles y lista para convertir visitas en ventas." },
      { numero: 3, nombre: "Integración de pagos", duracion: "Día 16-22", descripcion: "Conectamos Flow o Transbank, realizamos pruebas en sandbox y verificamos todo el flujo de compra." },
      { numero: 4, nombre: "Lanzamiento", duracion: "Día 25-30", descripcion: "Pruebas completas del flujo de compra y lanzamiento oficial de tu tienda." },
    ],
    soporteMensual: ["Soporte con respuesta en máximo 2 horas hábiles", "Actualización ilimitada de productos y precios", "Monitoreo de disponibilidad 24/7", "2 videollamadas de revisión al mes", "Informe mensual de ventas"],
    garantias: ["Tienda lista para vender en máximo 30 días hábiles", "Pasarela de pago probada antes del lanzamiento", "Disponibilidad del servidor garantizada 99.9%"],
  },
  "ecosistema-digital": {
    id: "ecosistema-digital", nombre: "Ecosistema Digital",
    tagline: "Infraestructura digital completa. Tu Jefe de Sistemas Remoto.",
    descripcionLarga: "La solución más completa para empresas que necesitan una infraestructura digital robusta y segura. Web multisucursal, auditoría de ciberseguridad, monitoreo constante y un equipo de soporte que responde en menos de una hora ante cualquier emergencia.",
    implementacion: 850_000, mensualidad: 190_000,
    color: "#f472b6", colorOscuro: "#db2777",
    paraquien: ["Empresas con múltiples sucursales o franquicias", "Organizaciones que manejan datos sensibles de clientes", "Negocios que no pueden permitirse tiempo de inactividad digital", "Empresas que quieren externalizar su área de sistemas"],
    entregables: [
      { icono: "🏢", titulo: "Web multisucursal", descripcion: "Plataforma web centralizada con sub-sitios para cada sucursal. Gestión unificada desde un solo panel con roles y permisos por sede." },
      { icono: "🔒", titulo: "Auditoría de ciberseguridad web", descripcion: "Análisis completo de vulnerabilidades: código, permisos, contraseñas, SSL, configuración de servidor y protección contra ataques." },
      { icono: "👁️", titulo: "Monitoreo constante 24/7", descripcion: "Sistema de alertas que nos notifica de inmediato si tu sitio presenta caídas, lentitud o anomalías. Actuamos antes de que tus clientes lo noten." },
      { icono: "⚡", titulo: "Soporte emergencia < 1 hr", descripcion: "Canal de emergencias disponible todos los días del año. Tiempo de respuesta garantizado de menos de 1 hora para incidentes críticos." },
    ],
    fases: [
      { numero: 1, nombre: "Auditoría inicial completa", duracion: "Semana 1", descripcion: "Análisis exhaustivo de toda tu infraestructura digital actual: sitios web, correos, accesos, seguridad y rendimiento." },
      { numero: 2, nombre: "Plan de acción", duracion: "Semana 2", descripcion: "Presentamos un informe detallado con hallazgos y el plan de trabajo priorizado por impacto y urgencia." },
      { numero: 3, nombre: "Desarrollo multisucursal", duracion: "Semana 3-6", descripcion: "Construimos o migramos tu infraestructura web a la arquitectura multisucursal con panel centralizado." },
      { numero: 4, nombre: "Seguridad y monitoreo", duracion: "Semana 5-7", descripcion: "Aplicamos correcciones de seguridad y configuramos el monitoreo activo." },
      { numero: 5, nombre: "Canal de emergencias", duracion: "Semana 7-8", descripcion: "Activamos el protocolo de soporte de emergencia y capacitamos a tu equipo." },
    ],
    soporteMensual: ["Soporte de emergencia con respuesta garantizada < 1 hora", "Reunión mensual de revisión de estado digital", "Informe mensual de seguridad y rendimiento", "Actualizaciones y mejoras continuas", "Asesoría estratégica digital incluida"],
    garantias: ["Plataforma multisucursal entregada en máximo 8 semanas", "Informe de auditoría de seguridad en la primera semana", "SLA de respuesta de emergencia < 1 hora documentado y firmado"],
  },
};

const clp = (n: number) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function PlanDetalle() {
  const { planId } = useParams<{ planId: string }>();
  const navigate   = useNavigate();
  const plan       = planId ? PLANES_DETALLE[planId] : null;

  if (!plan) {
    return (
      <div style={{ minHeight: "100vh", background: "#070710", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <p style={{ fontFamily: "'Outfit',sans-serif", color: "rgba(241,240,255,0.5)", fontSize: 18 }}>Plan no encontrado.</p>
        <button
          // ← navega a /#planes para que ScrollToTop lleve a esa sección
          onClick={() => navigate("/#planes")}
          style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "#fff", padding: "11px 24px", borderRadius: 10, fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
        >
          Ver todos los planes
        </button>
      </div>
    );
  }

  const TEXT_HI  = "#f1f0ff";
  const TEXT_MID = "rgba(241,240,255,0.55)";
  const TEXT_LOW = "rgba(241,240,255,0.28)";
  const BG       = "#070710";
  const BG_CARD  = "#0d0d1a";

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Outfit',sans-serif", color: TEXT_HI }}>
      <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, zIndex: 0, pointerEvents: "none", background: `radial-gradient(ellipse,${plan.color}18 0%,transparent 70%)` }} />

      {/* Navbar mínimo */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(168,85,247,0.12)", background: "rgba(7,7,16,0.85)", backdropFilter: "blur(12px)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "rgba(241,240,255,0.5)", transition: "color .2s" }}
          onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#a855f7"}
          onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = "rgba(241,240,255,0.5)"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver
        </button>
        <span onClick={() => navigate("/")} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          <span style={{ color: "#a855f7" }}>Koda </span><span style={{ color: TEXT_HI }}>Fix</span>
        </span>
        <button
          onClick={() => navigate("/contacto")}
          style={{ background: `linear-gradient(135deg,${plan.colorOscuro},${plan.color})`, border: "none", color: "#fff", padding: "9px 20px", borderRadius: 9, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          Me interesa
        </button>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 24px 96px", position: "relative", zIndex: 1 }}>

        {/* Hero del plan */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: plan.color, marginBottom: 14 }}>Plan</p>
          <h1 style={{ fontSize: "clamp(32px,6vw,54px)", fontWeight: 900, letterSpacing: -2, lineHeight: 1.06, margin: "0 0 16px" }}>{plan.nombre}</h1>
          <p style={{ fontSize: "clamp(17px,2.5vw,21px)", color: plan.color, fontWeight: 600, marginBottom: 20, letterSpacing: -0.3 }}>{plan.tagline}</p>
          <p style={{ fontSize: 16, color: TEXT_MID, lineHeight: 1.75, maxWidth: 680 }}>{plan.descripcionLarga}</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 32 }}>
            <div style={{ background: BG_CARD, border: `1px solid ${plan.color}30`, borderRadius: 14, padding: "20px 28px" }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: plan.color, marginBottom: 6 }}>Pago único · Implementación</p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(26px,4vw,34px)", fontWeight: 700, color: TEXT_HI, letterSpacing: -1, margin: 0 }}>{clp(plan.implementacion)}</p>
            </div>
            <div style={{ background: BG_CARD, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 28px" }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: TEXT_LOW, marginBottom: 6 }}>Mensualidad</p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "rgba(241,240,255,0.8)", letterSpacing: -1, margin: 0 }}>
                {clp(plan.mensualidad)} <span style={{ fontSize: 14, color: TEXT_LOW, fontWeight: 400 }}>/ mes</span>
              </p>
            </div>
          </div>
        </div>

        {/* ¿Para quién es? */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, marginBottom: 24 }}>¿Para quién es este plan?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
            {plan.paraquien.map((item, i) => (
              <div key={i} style={{ background: BG_CARD, border: `1px solid ${plan.color}20`, borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 8, background: `${plan.color}18`, border: `1px solid ${plan.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p style={{ fontSize: 14, color: "rgba(241,240,255,0.72)", lineHeight: 1.55, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Entregables */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, marginBottom: 8 }}>¿Qué obtienes exactamente?</h2>
          <p style={{ fontSize: 14, color: TEXT_LOW, marginBottom: 28 }}>Todo lo que incluye la implementación, explicado en detalle.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {plan.entregables.map((e, i) => (
              <div key={i} style={{ background: BG_CARD, border: "1px solid rgba(255,255,255,0.055)", borderRadius: 14, padding: "22px 24px", display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ fontSize: 28, flexShrink: 0, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: `${plan.color}12`, borderRadius: 12, border: `1px solid ${plan.color}25` }}>{e.icono}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT_HI, marginBottom: 6, letterSpacing: -0.3 }}>{e.titulo}</h3>
                  <p style={{ fontSize: 13.5, color: TEXT_MID, lineHeight: 1.65, margin: 0 }}>{e.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proceso */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, marginBottom: 8 }}>Proceso de implementación</h2>
          <p style={{ fontSize: 14, color: TEXT_LOW, marginBottom: 28 }}>Cómo trabajamos juntos desde el día 1 hasta la entrega.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {plan.fases.map((fase, i) => (
              <div key={i} style={{ display: "flex", gap: 20, paddingBottom: i < plan.fases.length - 1 ? 28 : 0, position: "relative" }}>
                {i < plan.fases.length - 1 && (
                  <div style={{ position: "absolute", left: 19, top: 44, width: 2, height: "calc(100% - 16px)", background: `linear-gradient(${plan.color}40,transparent)` }} />
                )}
                <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: "50%", background: `linear-gradient(135deg,${plan.colorOscuro},${plan.color})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, color: "#fff", zIndex: 1 }}>
                  {fase.numero}
                </div>
                <div style={{ paddingTop: 8, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT_HI, margin: 0 }}>{fase.nombre}</h3>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: plan.color, background: `${plan.color}14`, border: `1px solid ${plan.color}30`, padding: "2px 8px", borderRadius: 100 }}>{fase.duracion}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: TEXT_MID, lineHeight: 1.6, margin: 0 }}>{fase.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mensualidad */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, marginBottom: 8 }}>¿Qué incluye la mensualidad?</h2>
          <p style={{ fontSize: 14, color: TEXT_LOW, marginBottom: 24 }}>Lo que recibes cada mes por {clp(plan.mensualidad)}.</p>
          <div style={{ background: BG_CARD, border: `1px solid ${plan.color}25`, borderRadius: 16, padding: "24px 28px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {plan.soporteMensual.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize: 14, color: "rgba(241,240,255,0.72)", lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Garantías */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, marginBottom: 24 }}>Nuestras garantías</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            {plan.garantias.map((g, i) => (
              <div key={i} style={{ background: BG_CARD, border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <p style={{ fontSize: 13.5, color: "rgba(241,240,255,0.7)", lineHeight: 1.5, margin: 0 }}>{g}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div style={{ background: `linear-gradient(135deg,${plan.color}12,${plan.colorOscuro}08)`, border: `1px solid ${plan.color}30`, borderRadius: 20, padding: "40px 36px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>¿Listo para comenzar?</h2>
          <p style={{ fontSize: 15, color: TEXT_MID, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.65 }}>
            Escríbenos y coordinamos una reunión sin costo para confirmar que este plan es el ideal para ti.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/contacto")}
              style={{ background: `linear-gradient(135deg,${plan.colorOscuro},${plan.color})`, border: "none", color: "#fff", fontWeight: 700, padding: "14px 32px", borderRadius: 12, fontFamily: "'Outfit',sans-serif", fontSize: 15, cursor: "pointer", boxShadow: `0 8px 28px ${plan.color}35` }}
            >
              Quiero este plan →
            </button>

            {/* ← Navega a /#planes: ScrollToTop detecta el hash y hace scroll a #planes */}
            <button
              onClick={() => navigate("/#planes")}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(241,240,255,0.6)", padding: "14px 24px", borderRadius: 12, fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
            >
              Ver otros planes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
