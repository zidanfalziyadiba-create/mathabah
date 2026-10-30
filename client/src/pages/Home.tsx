import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUp, Check, ChevronLeft, ChevronRight, Database, ExternalLink, Image as ImageIcon, KeyRound, Layers, Loader2, Lock, LogOut, MapPin, Menu, MessageCircle, Moon, Phone, Plus, RefreshCw, Save, Settings, Share2, ShieldCheck, Sun, Trash2, Upload, Users, X } from "lucide-react";
import { siteConfig } from "../siteConfig";

const P = "https:" + "//";
const WA_BASE = P + "wa" + ".me/";
const ICON_BASE = P + "cdn.simpleicons" + ".org/";
const CMS_KEY = "mathabah_cms_v1";

const DEF_GALLERY = [
  { image: "/glass-facade_1281cb63_3c523186.jpg", kicker: "ضوء · خطوط · اتساع", title: "واجهة زجاجية معمارية", category: "زجاج معماري", text: "حل واجهة حديث يعزز الضوء الطبيعي ويمنح المبنى هوية بصرية فاخرة تعكس الدقة في التنفيذ والجودة العالية." },
  { image: "/mathabah-architectural-texture_423c537d_e9b373de.webp", kicker: "ملمس · عمق · توازن", title: "تفاصيل معمارية فاخرة", category: "ديكور داخلي", text: "تركيبات هندسية دقيقة تجمع بين الأناقة والوظيفة لتخلق بيئة داخلية مريحة وراقية." },
  { image: "/staircase-detail_36a86d04_67116930.jpg", kicker: "انسيابية · دقة · أمان", title: "درابزين زجاجي ذكي", category: "ألمنيوم وستيل", text: "تصميم عصري يوفر أعلى درجات الأمان مع الحفاظ على الرؤية المفتوحة والمظهر البصري الخفيف." },
  { image: "/reception_32a5bffe_05c6fa3b.jpg", kicker: "استقبال · حضور · انطباع", title: "منطقة استقبال متكاملة", category: "أعمال متكاملة", text: "تنفيذ متكامل يشمل الزجاج والألمنيوم والديكور الداخلي لتقديم انطباع أول يعكس الاحترافية والتميز." },
  { image: "/glass-office_ff88266f_aac6aeb9.jpg", kicker: "شفافية · هدوء · إنتاجية", title: "قواطع زجاجية للمكاتب", category: "زجاج معماري", text: "حلول تقطيع ذكية توفر العزل الصوتي وتسمح بمرور الضوء لتعزيز بيئة العمل العملية والمعاصرة." },
  { image: "/built-in-lounge_7d8805b0_f1ed0f5e.jpg", kicker: "راحة · تناغم · جودة", title: "جلسات داخلية مخصصة", category: "ديكور داخلي", text: "أعمال خشبية وديكورية منفذة بدقة عالية لتلائم المساحات المعمارية وتلبي تطلعات العميل." },
];

const DEF_SERVICES = [
  { no: "01", category: "زجاج معماري", image: "/glass-facade_1281cb63_3c523186.jpg", title: "واجهات وقواطع زجاجية", label: "حلول زجاجية عازلة وعالية الشفافية", text: "تصاميم زجاجية متتقدمة تشمل الواجهات المستمرة، القواطع المكتبية، والمظلات الزجاجية مع عزل حراري وصوتي عالي.", href: "/services/glass" },
  { no: "02", category: "ديكور داخلي", image: "/mathabah-architectural-texture_423c537d_e9b373de.webp", title: "تكسيات وديكورات فاخرة", label: "لمسات معمارية تمنح المكان هوية", text: "تنفيذ التكسيات الخشبية والمعدنية، الأسقف المستعارة، والعناصر الديكورية المخصصة التي تجمع بين الجمال والعملية.", href: "/services/interior-decor" },
  { no: "03", category: "ألمنيوم وستيل", image: "/glass-office_ff88266f_aac6aeb9.jpg", title: "قطاعات ألمنيوم وهياكل ستيل", label: "أنظمة متينة بدقة تنفيذ عالية", text: "نوافذ وأبواب ألمنيوم بمواصفات خاصة، درابزينات ستيل وزجاج، وهياكل معدنية تدعم التصاميم المعمارية الحديثة.", href: "/services/aluminum" },
  { no: "04", category: "أعمال متكاملة", image: "/reception_32a5bffe_05c6fa3b.jpg", title: "تنفيذ مشاريع متكاملة", label: "إدارة وتنفيذ من الفكرة حتى التسليم", text: "خدمات تنفيذ شاملة تربط بين الزجاج، الألمنيوم، والخشب لضمان تناسق المشروع وجودته.", href: "/services/woodwork" },
];

const DEF_STATS = [{ value: "+12", label: "سنة خبرة في السوق" }, { value: "+250", label: "مشروعاً منفذاً بنجاح" }, { value: "100%", label: "التزام بالمواصفات والمواعيد" }, { value: "الرياض", label: "تغطية شاملة للمشاريع" }];

const DEF_DATA = {
  announcement: { enabled: true, text1: "مؤسسة مثابة بالرياض — حلول الزجاج والألمنيوم والديكور", text2: "من الفكرة حتى التسليم — تفاصيل هندسية محسوبة" },
  branding: { logoLight: "/mathabah-logo-transparent_2365ed67.png", logoDark: "/mathabah-logo-dark-subtitle.png", watermarkLogo: "/mathabah-original-logo.png", useLogoInsteadOfM: true, watermarkText: "GLASS · ALUMINUM · WOODWORK" },
  hero: { badgeMain: "مؤسسة مثابة", badgeSub: "· زجاج · ألمنيوم · نجارة — الرياض", titleMain: "دقة التشكيل وتكامل", titleAccent: "التنفيذ المعماري", description: "مؤسسة مثابة للخدمات المعمارية في الرياض - متخصصون في تنفيذ الواجهات الزجاجية، أعمال الألمنيوم والستيل، والتكسيات والديكورات الداخلية بأعلى معايير الجودة.", image: "/mathabah-architectural-texture_423c537d_e9b373de.webp", captionTitle: "واجهات زجاجية وديكورات فاخرة", captionSub: "دقة متناهية في اختيار المواد والتنفيذ" },
  contact: { phoneDisplay: siteConfig?.contact?.phoneDisplay || "+966 56 517 3798", phoneNav: "056 517 3798", phoneRaw: siteConfig?.contact?.phoneRaw || "+966565173798", whatsappRaw: siteConfig?.contact?.whatsappRaw || "966565173798", cityTitle: "المملكة العربية السعودية", cityAccent: "الرياض", locationDesc: "نقدم خدماتنا المعمارية المتكاملة في كافة أحياء مدينة الرياض مع إمكانية تنفيذ المشاريع النوعية في مختلف مناطق المملكة.", mapEnabled: false, mapsUrl: "" },
  socials: { facebook: "", instagram: "", snapchat: "", tiktok: "" },
  gallery: DEF_GALLERY, services: DEF_SERVICES, stats: DEF_STATS,
};

const socialChannels = [{ name: "Facebook", key: "facebook" }, { name: "Instagram", key: "instagram" }, { name: "Snapchat", key: "snapchat" }, { name: "TikTok", key: "tiktok" }];
const SectionHeading = ({ eyebrow, children, accent }: any) => <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{children} <em>{accent}</em></h2></div>;
const BrandIcon = ({ name, label }: any) => <img className="brand-icon" src={`${ICON_BASE}${name}/ffffff`} alt={label} aria-hidden="true" />;
const SocialGlyph = ({ type }: any) => <BrandIcon name={type} label={type} />;

async function compressImg(file: File, maxW = 1300): Promise<string> {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new window.Image();
      img.onerror = () => res(String(r.result));
      img.onload = () => {
        const s = img.width > maxW ? maxW / img.width : 1;
        const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        const ctx = c.getContext("2d"); if (!ctx) return res(String(r.result));
        ctx.drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL(file.type === "image/png" ? "image/png" : "image/webp", 0.82));
      };
      img.src = String(r.result);
    };
    r.readAsDataURL(file);
  });
}

function mergeData(inc: any) {
  if (!inc || typeof inc !== "object") return DEF_DATA;
  return { ...DEF_DATA, ...inc, announcement: { ...DEF_DATA.announcement, ...(inc.announcement || {}) }, branding: { ...DEF_DATA.branding, ...(inc.branding || {}) }, hero: { ...DEF_DATA.hero, ...(inc.hero || {}) }, contact: { ...DEF_DATA.contact, ...(inc.contact || {}) }, socials: { ...DEF_DATA.socials, ...(inc.socials || {}) }, gallery: Array.isArray(inc.gallery) && inc.gallery.length ? inc.gallery : DEF_GALLERY, services: Array.isArray(inc.services) && inc.services.length ? inc.services : DEF_SERVICES, stats: Array.isArray(inc.stats) && inc.stats.length ? inc.stats : DEF_STATS };
}

function isValidMapUrl(value: unknown): boolean {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" && (url.hostname === "maps.app.goo.gl" || url.hostname === "goo.gl" || /(^|\.)google\.[a-z.]+$/i.test(url.hostname));
  } catch { return false; }
}

const inCss: any = { width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "0.85rem" };
const lbCss: any = { display: "grid", gap: "4px", fontSize: "0.78rem", color: "#d8d2c7" };
const btCss: any = { display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 11px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)", color: "#f5f2eb", fontSize: "0.8rem", cursor: "pointer" };

export default function Home({ initialAdminOpen = false }: { initialAdminOpen?: boolean }) {
  const [siteData, setSiteData] = useState(() => { try { const l = localStorage.getItem(CMS_KEY); if (l) { const cached = JSON.parse(l); if (cached?.adminAuth) { delete cached.adminAuth; localStorage.setItem(CMS_KEY, JSON.stringify(cached)); } return mergeData(cached); } } catch {} return DEF_DATA; });
  const [draft, setDraft] = useState(siteData);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("الكل");
  const [isFiltering, setIsFiltering] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("mathabah_theme") as "dark" | "light") || "light");
  const [adminUser, setAdminUser] = useState("admin");
  const [adminPass, setAdminPass] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminTab, setAdminTab] = useState("gallery");
  const [isSaving, setIsSaving] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [newPass, setNewPass] = useState("");

  const gallery = siteData.gallery || DEF_GALLERY;
  const services = siteData.services || DEF_SERVICES;
  const stats = siteData.stats || DEF_STATS;
  const logoSrc = theme === "dark" ? (siteData.branding?.logoDark || "/mathabah-logo-dark-subtitle.png") : (siteData.branding?.logoLight || "/mathabah-logo-transparent_2365ed67.png");

  useEffect(() => {
    fetch("/api/site-data", { cache: "no-store" }).then(r => r.json()).then(res => { if (res?.ok && res?.data) { const m = mergeData(res.data); setSiteData(m); setDraft(m); try { localStorage.setItem(CMS_KEY, JSON.stringify(m)); } catch {} } }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialAdminOpen) return;
    fetch("/api/admin/session", { cache: "no-store", credentials: "same-origin" }).then(async (r) => ({ ok: r.ok, data: await r.json() })).then(({ ok, data }) => {
      if (ok && data?.ok) { setAdminUser(data.username || "admin"); setAdminUnlocked(true); fetchLeads(); }
    }).catch(() => {});
  }, [initialAdminOpen]);

  useEffect(() => {
    if (!initialAdminOpen) return;
    const previousTitle = document.title;
    const existing = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const previousRobots = existing?.content;
    const robots = existing || document.createElement("meta");
    robots.name = "robots"; robots.content = "noindex,nofollow";
    if (!existing) document.head.appendChild(robots);
    document.title = "إدارة الموقع | مثابة";
    return () => { document.title = previousTitle; if (existing && previousRobots !== undefined) existing.content = previousRobots; else robots.remove(); };
  }, [initialAdminOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setLightbox(null); setMenuOpen(false); } };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 300); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(""), 3300); return () => window.clearTimeout(t); }, [toast]);

  useEffect(() => {
    if (initialAdminOpen) return;
    try {
      if (sessionStorage.getItem("mathabah_welcome_seen_v1")) return;
      sessionStorage.setItem("mathabah_welcome_seen_v1", "1");
    } catch {}
    const show = window.setTimeout(() => setWelcomeVisible(true), 700);
    const hide = window.setTimeout(() => setWelcomeVisible(false), 5700);
    return () => { window.clearTimeout(show); window.clearTimeout(hide); };
  }, [initialAdminOpen]);

  const fetchLeads = async () => { try { const r = await fetch("/api/admin/leads", { cache: "no-store", credentials: "same-origin" }); const d = await r.json(); if (r.ok && d?.ok) setLeads(d.leads || []); else if (r.status === 401) setAdminUnlocked(false); } catch {} };

  const loginAdmin = async (e: any) => {
    e.preventDefault();
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: adminUser.trim() || "admin", password: adminPass }) });
      const d = await r.json();
      if (r.ok && d?.ok) { setAdminUser(d.username || adminUser.trim() || "admin"); setAdminUnlocked(true); setAdminPass(""); setDraft(siteData); setToast("تم الدخول إلى لوحة الأدمن"); fetchLeads(); return; }
      setToast(d?.error || "بيانات الدخول غير صحيحة");
    } catch { setToast("تعذر الاتصال بالخادم؛ لم يتم تسجيل الدخول"); }
  };

  const saveDb = async () => {
    setIsSaving(true);
    const payload = { ...draft, adminAuth: { username: adminUser.trim() || "admin", ...(newPass.trim() ? { newPassword: newPass.trim() } : {}) } };
    try {
      const r = await fetch("/api/site-data", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: payload }) });
      const res = await r.json();
      if (r.ok && res?.ok) { const m = mergeData(res.data || payload); setSiteData(m); setDraft(m); if (newPass.trim()) setNewPass(""); setToast("تم حفظ التعديلات في قاعدة البيانات بنجاح"); }
      else { if (r.status === 401) setAdminUnlocked(false); setToast(res?.error || "تعذر حفظ التعديلات في قاعدة البيانات"); }
    } catch { setToast("تعذر الاتصال بالخادم؛ لم يتم حفظ التعديلات"); }
    setIsSaving(false);
  };

  const delLead = async (id: string) => { try { const r = await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, { method: "DELETE", credentials: "same-origin" }); const d = await r.json(); if (r.ok && d?.ok) setLeads(d.leads || []); else if (r.status === 401) setAdminUnlocked(false); } catch {} };
  const logoutAdmin = async () => { try { await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }); } catch {} setAdminUnlocked(false); setAdminPass(""); setNewPass(""); setLeads([]); };
  const filteredGallery = useMemo(() => filter === "الكل" ? gallery : gallery.filter((i: any) => i.category === filter), [filter, gallery]);
  const selectFilter = (next: string) => { if (next === filter) return; setIsFiltering(true); window.setTimeout(() => { setFilter(next); window.setTimeout(() => setIsFiltering(false), 40); }, 150); };
  const toggleTheme = () => { const next = theme === "dark" ? "light" : "dark"; setTheme(next); localStorage.setItem("mathabah_theme", next); document.documentElement.dataset.theme = next; document.body.dataset.theme = next; };
  const openSocial = (k: string, n: string) => { const u = siteData.socials?.[k]?.trim(); if (u) window.open(u.startsWith("http") ? u : `${P}${u}`, "_blank", "noopener,noreferrer"); else setToast(`أدخل رابط ${n} من لوحة تحكم الأدمن`); };
  const openMap = () => { const u = siteData.contact?.mapsUrl?.trim(); if (siteData.contact?.mapEnabled && isValidMapUrl(u)) window.open(u, "_blank", "noopener,noreferrer"); else setToast("الخريطة متوقفة حتى يضيف المدير رابطاً صالحاً ويفعّلها"); };

  const submitBrief = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (isSubmitting) return;
    const form = event.currentTarget; const data = new FormData(form); const errors: Record<string, string> = {};
    const name = String(data.get("name") || "").trim(); const project = String(data.get("project") || "").trim(); const location = String(data.get("location") || "").trim(); const details = String(data.get("details") || "").trim();
    if (name.length < 2) errors.name = "يرجى كتابة الاسم."; if (project.length < 2) errors.project = "يرجى كتابة المشروع."; if (details.length < 10) errors.details = "يرجى كتابة تفاصيل المشروع.";
    setFormErrors(errors); setSubmitSuccess(false); if (Object.keys(errors).length) { setToast("يرجى مراجعة الحقول المطلوبة."); return; }
    setIsSubmitting(true);
    const saveLead = fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, project, location, details }) }).then(async (response) => { const result = await response.json(); return response.ok && result?.ok; }).catch(() => false);
    const wa = siteData.contact?.whatsappRaw || "966565173798";
    const waUrl = `${WA_BASE}${wa}?text=${encodeURIComponent([`الاسم: ${name}`, `المشروع: ${project}`, `الموقع: ${location || "الرياض"}`, `التفاصيل: ${details}`].join("\n\n"))}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    const leadSaved = await saveLead;
    if (!leadSaved) setToast("تعذر حفظ الطلب في قاعدة البيانات؛ يمكنك متابعة التواصل عبر واتساب.");
    window.setTimeout(() => { setIsSubmitting(false); setSubmitSuccess(leadSaved); if (leadSaved) form.reset(); }, 650);
  };

  return (
    <div dir="rtl" className={`site-shell theme-${theme} ${initialAdminOpen ? "admin-standalone" : ""}`} id="home">
      {!initialAdminOpen && announcementVisible && siteData.announcement?.enabled && <div className="announcement" role="status"><div><div className="marquee"><span>{siteData.announcement.text1}</span><i>◆</i><span>{siteData.announcement.text2}</span><i>◆</i><span>{siteData.announcement.text1}</span><i>◆</i><span>{siteData.announcement.text2}</span></div></div><button onClick={() => setAnnouncementVisible(false)}><X size={14} /></button></div>}
      {!initialAdminOpen && welcomeVisible && <div className="welcome-popover" role="status" aria-live="polite"><span className="welcome-mark"><Check size={17} /></span><span className="welcome-copy"><strong>أهلاً بك في مثابة</strong><small>حلول معمارية متكاملة، من الفكرة حتى التسليم.</small></span><button type="button" aria-label="إغلاق رسالة الترحيب" onClick={() => setWelcomeVisible(false)}><X size={16} /></button></div>}
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}><a href="#home" className="brand"><img src={logoSrc} alt="مثابة" /></a><nav className={menuOpen ? "nav-open" : ""}><a href="#home">الرئيسية</a><a href="#work">أعمالنا</a><a href="#services">خدماتنا</a><a href="#identity">عن مثابة</a><a href="#contact" onClick={() => setMenuOpen(false)}>تواصل معنا</a><a className="nav-phone" href={`tel:${siteData.contact?.phoneRaw || "+966565173798"}`}><Phone size={15} /> {siteData.contact?.phoneNav || "056 517 3798"}</a></nav><div className="header-tools"><button className="theme-toggle" onClick={toggleTheme}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></header>
      <main>
        <section className="hero section-grid"><div className="hero-copy"><div className="mini-label">{siteData.hero?.badgeMain} <span>{siteData.hero?.badgeSub}</span></div><h1>{siteData.hero?.titleMain} <em>{siteData.hero?.titleAccent}</em></h1><p>{siteData.hero?.description}</p><div className="hero-actions"><a className="button button-copper" href="#contact">طلب استشارة <ArrowDownLeft size={16} /></a><a className="button button-ghost" href="#work">استعراض أعمالنا <ArrowDownLeft size={16} /></a></div><div className="hero-note"><Check size={15} /> تنفيذ مطابق للمواصفات المعمارية</div></div><div className="hero-visual"><img src={siteData.hero?.image || gallery[1]?.image} alt="أعمال مثابة" width={1920} height={1080} fetchPriority="high" decoding="async" /><div className="image-caption"><span>01</span><strong>{siteData.hero?.captionTitle}</strong><small>{siteData.hero?.captionSub}</small></div><div className="watermark" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>{siteData.branding?.useLogoInsteadOfM !== false ? <img src={siteData.branding?.watermarkLogo || "/mathabah-original-logo.png"} alt="شعار مثابة" style={{ width: "52px", height: "52px", objectFit: "contain", borderRadius: "10px" }} /> : <span>M</span>}<span style={{ fontSize: "0.72rem" }}>{siteData.branding?.watermarkText || "GLASS · ALUMINUM · WOODWORK"}</span></div></div></section>
        <section id="expertise" className="section dark-section"><div className="section-grid intro-grid"><div><SectionHeading eyebrow="01 الخبرة والتكامل" accent="معمارية متكاملة">خبرات تنفذ بأحدث التقنيات</SectionHeading><p className="lead">نعمل على تحويل الرؤى المعمارية إلى واقع ملموس من خلال خدمات متخصصة تشمل الزجاج والألمنيوم والديكورات الداخلية وفق أعلى المواصفات.</p></div><div className="process-list"><div><b>01</b><span>دقة عالية في التصنيع والتركيب</span></div><div><b>02</b><span>فريق استشاري وهندسي متخصص</span></div><div><b>03</b><span>حلول معمارية مبتكرة ومستدامة</span></div></div></div></section>
        <section id="services" className="section services-section"><SectionHeading eyebrow="02 خدماتنا الرئيسية" accent="خدمات معمارية متخصصة">حلول تنفذ وفق أعلى معايير الجودة</SectionHeading><p className="section-intro">نقدم باقة شاملة من الخدمات المعمارية التي تلبي تطلعات المشاريع السكنية والتجارية بمختلف أحجامها.</p><div className="services-grid">{services.map((s: any, idx: number) => <a className="service-card" key={s.no || idx} href={s.href || "/services/glass"}><img src={s.image} alt={s.title} loading="lazy" /><div className="service-overlay" /><span className="service-number">{s.no || `0${idx + 1}`}</span><div className="service-content"><span>{s.label}</span><h3>{s.title}</h3><p>{s.text}</p><b>تفاصيل الخدمة <ArrowDownLeft size={16} /></b></div></a>)}</div><div className="service-directory"><span>دليل الخدمات المباشر:</span><a href="/services/glass">الزجاج المعماري</a><a href="/services/interior-decor">التكسيات والديكور</a><a href="/services/woodwork">الأعمال المتكاملة</a><a href="/services/aluminum">الألمنيوم والستيل</a></div></section>
        <section id="work" className="section work-section"><div className="work-head"><SectionHeading eyebrow="03 معرض الأعمال" accent="مشاريع منتقاة">معرض الأعمال والتنفيذ</SectionHeading><p>نماذج من مشاريعنا المنفذة في مجالات الزجاج المعماري والديكور الداخلي والألمنيوم.</p></div><div className="work-counter"><button onClick={() => setLightbox(lightbox === null ? 0 : (lightbox + gallery.length - 1) % gallery.length)}><ChevronRight size={16} /></button><span>01 / {String(gallery.length).padStart(2, "0")}</span><button onClick={() => setLightbox(lightbox === null ? 0 : (lightbox + 1) % gallery.length)}><ChevronLeft size={16} /></button></div><div className="filters" role="tablist">{["الكل", "زجاج معماري", "ديكور داخلي", "ألمنيوم وستيل", "أعمال متكاملة"].map((item) => <button key={item} role="tab" aria-selected={filter === item} className={`filter ${filter === item ? "selected" : ""}`} onClick={() => selectFilter(item)}>{item}</button>)}</div><div className={`gallery-grid ${isFiltering ? "is-filtering" : ""}`}>{filteredGallery.map((item: any, idx: number) => { const oi = gallery.indexOf(item); return <article className="gallery-card" key={`${item.title}-${idx}`}><button className="gallery-image" onClick={() => setLightbox(oi >= 0 ? oi : idx)}><img src={item.image} alt={item.title} loading="lazy" /><span className="zoom-badge"><ExternalLink size={18} /></span><small>{item.category}</small></button><div className="gallery-meta"><span>{item.category}</span><h3>{item.title}</h3><small>{item.kicker}</small><p>{item.text}</p></div></article>; })}</div><blockquote><p>الإتقان في التفاصيل المعمارية هو ما يحول المساحة من مجرد بناء إلى تحفة معمارية تعيش لأجيال.</p><cite>مؤسسة مثابة للخدمات المعمارية</cite></blockquote></section>
        <section id="identity" className="section identity-section"><div className="section-grid"><div><SectionHeading eyebrow="04 هويتنا" accent="رؤيتنا ورسالتنا">تاريخ من الدقة والالتزام</SectionHeading><p className="lead">تأسست مثابة لتكون الشريك المعماري الموثوق في تنفيذ الواجهات والديكورات الفاخرة، معتمدين على كوادر مؤهلة وأحدث معايير الجودة.</p></div><div className="stats">{stats.map((st: any, i: number) => <div key={i}><b>{st.value}</b><span>{st.label}</span></div>)}</div></div></section>
        {siteData.contact?.mapEnabled === true && isValidMapUrl(siteData.contact?.mapsUrl) && <section className="location-section section"><div className="location-card"><div><span className="eyebrow">05 موقعنا المباشر</span><h2>{siteData.contact?.cityTitle || "المملكة العربية السعودية"}<br /><em>{siteData.contact?.cityAccent || "الرياض"}</em></h2><p>{siteData.contact?.locationDesc}</p><button className="button button-outline" onClick={openMap}><MapPin size={16} /> عرض الخريطة التفاعلية <ArrowDownLeft size={13} /></button></div><div className="map-placeholder" style={{ cursor: "pointer" }} onClick={openMap}><MapPin size={32} /><span>{siteData.contact?.cityAccent || "الرياض"} - {siteData.contact?.cityTitle || "المملكة العربية السعودية"}</span><small>اضغط لفتح الموقع على الخريطة</small></div></div></section>}
        <section id="contact" className="section contact-section"><div className="contact-inner"><span className="eyebrow">05 تواصل معنا</span><h2>ابدأ مشروعك القادم<br /><em>مع فريق مثابة</em></h2><p>تواصل معنا للحصول على استشارة معمارية أو طلب عرض سعر مفصل لمشروعك.</p><div className="hero-actions"><a className="button button-copper" href={`${WA_BASE}${siteData.contact?.whatsappRaw || "966565173798"}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> التواصل عبر الواتساب <ArrowDownLeft size={15} /></a><a className="button button-ghost" href={`tel:${siteData.contact?.phoneRaw || "+966565173798"}`}><Phone size={17} /> {siteData.contact?.phoneDisplay || "+966 56 517 3798"}</a></div></div></section>
        <section className="quick-brief-section"><div className="quick-brief-card"><div className="quick-brief-copy"><span className="eyebrow">06 نموذج طلب مشروع</span><h2>أرسل تفاصيل مشروعك<br /><em>للحصول على عرض سعر</em></h2><p>قم بتعبئة النموذج وسيقوم فريقنا الهندسي بالتواصل معك في أقرب وقت.</p></div><form className="brief-form" onSubmit={submitBrief}><label>اسم العميل<input required name="name" placeholder="اسمك الكامل" />{formErrors.name && <small className="field-error">{formErrors.name}</small>}</label><label>نوع/اسم المشروع<input required name="project" placeholder="مثال: فيلا سكنية / برج تجاري" />{formErrors.project && <small className="field-error">{formErrors.project}</small>}</label><label>الموقع / المدينة<input name="location" placeholder="الرياض، حي الملقا، النرجس..." /></label><label>تفاصيل المشروع<textarea required name="details" rows={3} placeholder="اكتب تفاصيل وأبعاد المشروع أو المتطلبات الخاصة" />{formErrors.details && <small className="field-error">{formErrors.details}</small>}</label><button className="button button-copper" type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 size={17} className="spin" /> جاري إرسال الطلب...</> : <><MessageCircle size={17} /> إرسال عبر الواتساب</>}</button>{submitSuccess && <p className="form-feedback" role="status">تم حفظ طلبك بنجاح. إذا لم يفتح واتساب تلقائياً، استخدم زر التواصل للمتابعة.</p>}</form></div></section>
      </main>
      <footer><div className="footer-top"><img src={logoSrc} alt="مثابة" /><p>مؤسسة معمارية متخصصة في تنفيذ الواجهات الزجاجية والألمنيوم والديكورات الداخلية بأعلى معايير الجودة.</p><div className="footer-links"><span>روابط سريعة:</span><a href="#expertise">الخبرة والتكامل</a><a href="#work">معرض الأعمال</a><a href="#services">الخدمات</a><a href="#identity">هويتنا</a><span className="footer-service-label">خدماتنا المباشرة:</span><a href="/services/glass">الزجاج المعماري</a><a href="/services/interior-decor">التكسيات والديكور</a><a href="/services/woodwork">الأعمال المتكاملة</a><a href="/services/aluminum">الألمنيوم والستيل</a></div><div className="socials"><span>تابعنا:</span>{socialChannels.map((c) => <button key={c.key} onClick={() => openSocial(c.key, c.name)}><SocialGlyph type={c.key} /> {c.name}</button>)}</div></div><div className="footer-bottom"><span>© 2026 جميع الحقوق محفوظة لمؤسسة مثابة للخدمات المعمارية</span></div></footer>
      <div className="floating-actions"><a href={`${WA_BASE}${siteData.contact?.whatsappRaw || "966565173798"}`} target="_blank" rel="noreferrer" className="float-whatsapp"><BrandIcon name="whatsapp" label="WhatsApp" /></a><a href={`tel:${siteData.contact?.phoneRaw || "+966565173798"}`} className="float-phone"><Phone /></a>{socialChannels.map((c) => <button key={c.key} className="float-social" onClick={() => openSocial(c.key, c.name)}><SocialGlyph type={c.key} /></button>)}{scrolled && <button id="backToTop" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="floating-btn scroll-top-btn float-top"><ArrowUp /></button>}</div>
      <div className="call-callout"><span>استفسار مباشر حول الخدمات؟</span><a href={`${WA_BASE}${siteData.contact?.whatsappRaw || "966565173798"}`} target="_blank" rel="noreferrer">تواصل معنا</a></div>
      {toast && <div className="toast" role="status"><Lock size={15} /> {toast}</div>}

      {initialAdminOpen && (
        <div className="admin-modal" role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(8,10,14,0.85)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", overflowY: "auto" }}>
          <div className="admin-box" style={{ width: "100%", maxWidth: adminUnlocked ? "960px" : "420px", maxHeight: "92vh", overflowY: "auto", background: "#12151c", color: "#f5f2eb", border: "1px solid rgba(184,122,61,0.4)", borderRadius: "18px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><img src={siteData.branding?.watermarkLogo || "/mathabah-original-logo.png"} alt="مثابة" style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "8px" }} /><div><h3 style={{ margin: 0, fontSize: "1.05rem" }}>لوحة تحكم وإعدادات مؤسسة مثابة</h3><small style={{ color: "#c9965c", display: "flex", alignItems: "center", gap: "5px" }}><ShieldCheck size={12} /> بوابة دخول خاصة بالمدير</small></div></div>
              <button type="button" onClick={() => window.location.assign("/")} style={btCss} aria-label="العودة إلى الموقع"><X size={16} /></button>
            </div>
            {!adminUnlocked ? (
              <form onSubmit={loginAdmin} style={{ display: "grid", gap: "12px" }}>
                <p style={{ margin: 0, fontSize: "0.88rem", opacity: 0.85 }}>سجّل الدخول بحساب الأدمن لتغيير صور المعرض، الشعار، وروابط فيسبوك وواتساب وإنستغرام وسناب شات وتيك توك بدون تعديل الأكواد:</p>
                <label style={lbCss}>اسم المستخدم<input value={adminUser} onChange={(e) => setAdminUser(e.target.value)} style={inCss} /></label>
                <label style={lbCss}>كلمة المرور<input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="أدخل كلمة المرور المؤقتة التي زُودت بها" style={inCss} /></label>
                <button type="submit" className="button button-copper" style={{ width: "100%", justifyContent: "center" }}><ShieldCheck size={16} /> دخول إلى لوحة الإعدادات</button>
              </form>
            ) : (
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {[{ id: "gallery", l: "صور ومعرض الأعمال", ic: <ImageIcon size={14} /> }, { id: "social", l: "روابط فيسبوك وواتساب والسوشيال", ic: <Share2 size={14} /> }, { id: "hero", l: "الشعار والواجهة", ic: <Settings size={14} /> }, { id: "services", l: "الخدمات", ic: <Layers size={14} /> }, { id: "leads", l: `طلبات العملاء (${leads.length})`, ic: <Users size={14} /> }, { id: "security", l: "حساب الأدمن", ic: <KeyRound size={14} /> }].map((t: any) => <button key={t.id} type="button" onClick={() => { setAdminTab(t.id); if (t.id === "leads") fetchLeads(); }} style={{ ...btCss, borderColor: adminTab === t.id ? "#c9965c" : "rgba(255,255,255,0.12)", background: adminTab === t.id ? "rgba(201,150,92,0.22)" : "rgba(255,255,255,0.04)" }}>{t.ic} {t.l}</button>)}
                </div>
                {adminTab === "gallery" && (
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong>إدارة صور سجل الأعمال:</strong><button type="button" onClick={() => setDraft({ ...draft, gallery: [{ image: "/glass-facade_1281cb63_3c523186.jpg", kicker: "تنفيذ · دقة · جودة", title: "مشروع جديد لمؤسسة مثابة", category: "زجاج معماري", text: "وصف المشروع." }, ...(draft.gallery || [])] })} style={btCss}><Plus size={14} /> إضافة صورة / عمل جديد</button></div>
                    {(draft.gallery || []).map((it: any, idx: number) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "10px", background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "10px" }}>
                        <div style={{ display: "grid", gap: "6px" }}><img src={it.image} alt={it.title} style={{ width: "120px", height: "88px", objectFit: "cover", borderRadius: "8px" }} /><label style={{ ...btCss, justifyContent: "center", fontSize: "0.74rem" }}><Upload size={12} /> رفع صورة<input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const u = await compressImg(f); const n = [...draft.gallery]; n[idx] = { ...n[idx], image: u }; setDraft({ ...draft, gallery: n }); }} /></label></div>
                        <div style={{ display: "grid", gap: "6px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}><input value={it.title || ""} onChange={(e) => { const n = [...draft.gallery]; n[idx] = { ...n[idx], title: e.target.value }; setDraft({ ...draft, gallery: n }); }} style={inCss} placeholder="العنوان" /><select value={it.category || "زجاج معماري"} onChange={(e) => { const n = [...draft.gallery]; n[idx] = { ...n[idx], category: e.target.value }; setDraft({ ...draft, gallery: n }); }} style={inCss}><option value="زجاج معماري">زجاج معماري</option><option value="ديكور داخلي">ديكور داخلي</option><option value="ألمنيوم وستيل">ألمنيوم وستيل</option><option value="أعمال متكاملة">أعمال متكاملة</option></select><input value={it.kicker || ""} onChange={(e) => { const n = [...draft.gallery]; n[idx] = { ...n[idx], kicker: e.target.value }; setDraft({ ...draft, gallery: n }); }} style={inCss} placeholder="الكلمات المفتاحية" /></div>
                          <textarea rows={2} value={it.text || ""} onChange={(e) => { const n = [...draft.gallery]; n[idx] = { ...n[idx], text: e.target.value }; setDraft({ ...draft, gallery: n }); }} style={inCss} />
                          <div style={{ display: "flex", gap: "6px" }}><input value={it.image || ""} onChange={(e) => { const n = [...draft.gallery]; n[idx] = { ...n[idx], image: e.target.value }; setDraft({ ...draft, gallery: n }); }} style={{ ...inCss, flex: 1 }} placeholder="مسار الصورة" /><button type="button" onClick={() => setDraft({ ...draft, gallery: draft.gallery.filter((_: any, i: number) => i !== idx) })} style={{ ...btCss, color: "#ff8b8b" }}><Trash2 size={13} /> حذف</button></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {adminTab === "social" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                    <label style={lbCss}>رقم الواتساب (مثال: 966565173798)<input value={draft.contact?.whatsappRaw || ""} onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, whatsappRaw: e.target.value } })} style={inCss} /></label>
                    <label style={lbCss}>رقم الهاتف المعروض<input value={draft.contact?.phoneDisplay || ""} onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, phoneDisplay: e.target.value, phoneRaw: e.target.value.replace(/\s+/g, "") } })} style={inCss} /></label>
                    <label style={lbCss}>رابط فيسبوك (Facebook)<input placeholder="أدخل رابط فيسبوك" value={draft.socials?.facebook || ""} onChange={(e) => setDraft({ ...draft, socials: { ...draft.socials, facebook: e.target.value } })} style={inCss} /></label>
                    <label style={lbCss}>رابط إنستغرام (Instagram)<input placeholder="أدخل رابط إنستغرام" value={draft.socials?.instagram || ""} onChange={(e) => setDraft({ ...draft, socials: { ...draft.socials, instagram: e.target.value } })} style={inCss} /></label>
                    <label style={lbCss}>رابط سناب شات (Snapchat)<input placeholder="أدخل رابط سناب شات" value={draft.socials?.snapchat || ""} onChange={(e) => setDraft({ ...draft, socials: { ...draft.socials, snapchat: e.target.value } })} style={inCss} /></label>
                    <label style={lbCss}>رابط تيك توك (TikTok)<input placeholder="أدخل رابط تيك توك" value={draft.socials?.tiktok || ""} onChange={(e) => setDraft({ ...draft, socials: { ...draft.socials, tiktok: e.target.value } })} style={inCss} /></label>
                    <label style={lbCss}>المدينة / المنطقة<input value={draft.contact?.cityAccent || ""} onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, cityAccent: e.target.value } })} style={inCss} /></label>
                    <label style={lbCss}>رابط موقع Google Maps (يبقى مخفياً حتى التفعيل)<input placeholder="https://maps.app.goo.gl/..." value={draft.contact?.mapsUrl || ""} onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, mapsUrl: e.target.value } })} style={inCss} /></label><label style={{ ...lbCss, display: "flex", alignItems: "center", gap: "8px" }}><input type="checkbox" checked={draft.contact?.mapEnabled === true && isValidMapUrl(draft.contact?.mapsUrl)} disabled={!isValidMapUrl(draft.contact?.mapsUrl)} onChange={(e) => setDraft({ ...draft, contact: { ...draft.contact, mapEnabled: e.target.checked } })} /> تفعيل رابط الخريطة للزوار</label>
                  </div>
                )}
                {adminTab === "hero" && (
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><img src={draft.branding?.watermarkLogo || "/mathabah-original-logo.png"} alt="Logo" style={{ width: "50px", height: "50px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "3px" }} /><label style={btCss}><Upload size={13} /> تغيير الشعار الرسمي<input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const u = await compressImg(f, 500); setDraft({ ...draft, branding: { ...draft.branding, watermarkLogo: u, useLogoInsteadOfM: true } }); }} /></label></div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><img src={draft.hero?.image} alt="Hero" style={{ width: "75px", height: "50px", objectFit: "cover", borderRadius: "8px" }} /><label style={btCss}><Upload size={13} /> تغيير صورة الواجهة<input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const u = await compressImg(f, 1500); setDraft({ ...draft, hero: { ...draft.hero, image: u } }); }} /></label></div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}><label style={lbCss}>العنوان الرئيسي<input value={draft.hero?.titleMain || ""} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, titleMain: e.target.value } })} style={inCss} /></label><label style={lbCss}>العنوان الملون<input value={draft.hero?.titleAccent || ""} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, titleAccent: e.target.value } })} style={inCss} /></label></div>
                    <label style={lbCss}>وصف الواجهة الرئيسية<textarea rows={2} value={draft.hero?.description || ""} onChange={(e) => setDraft({ ...draft, hero: { ...draft.hero, description: e.target.value } })} style={inCss} /></label>
                    <label style={{ ...lbCss, display: "flex", alignItems: "center", gap: "8px" }}><input type="checkbox" checked={draft.announcement?.enabled !== false} onChange={(e) => setDraft({ ...draft, announcement: { ...draft.announcement, enabled: e.target.checked } })} /> إظهار شريط العروض للزوار</label><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}><label style={lbCss}>العرض أو الخصم الأول<input placeholder="اكتب العرض كما سيظهر للزوار" value={draft.announcement?.text1 || ""} onChange={(e) => setDraft({ ...draft, announcement: { ...draft.announcement, text1: e.target.value } })} style={inCss} /></label><label style={lbCss}>العرض أو الخصم الثاني<input placeholder="مثال: لفترة محدودة — تواصل لمعرفة التفاصيل" value={draft.announcement?.text2 || ""} onChange={(e) => setDraft({ ...draft, announcement: { ...draft.announcement, text2: e.target.value } })} style={inCss} /></label></div>
                  </div>
                )}
                {adminTab === "services" && (
                  <div style={{ display: "grid", gap: "10px" }}>
                    {(draft.services || []).map((s: any, idx: number) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "95px 1fr", gap: "10px", background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "10px" }}>
                        <div><img src={s.image} alt={s.title} style={{ width: "95px", height: "65px", objectFit: "cover", borderRadius: "6px" }} /><label style={{ ...btCss, fontSize: "0.7rem", padding: "4px", marginTop: "4px", width: "100%", justifyContent: "center" }}><Upload size={11} /> صورة<input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const u = await compressImg(f); const n = [...draft.services]; n[idx] = { ...n[idx], image: u }; setDraft({ ...draft, services: n }); }} /></label></div>
                        <div style={{ display: "grid", gap: "5px" }}><input value={s.title || ""} onChange={(e) => { const n = [...draft.services]; n[idx] = { ...n[idx], title: e.target.value }; setDraft({ ...draft, services: n }); }} style={inCss} /><textarea rows={2} value={s.text || ""} onChange={(e) => { const n = [...draft.services]; n[idx] = { ...n[idx], text: e.target.value }; setDraft({ ...draft, services: n }); }} style={inCss} /></div>
                      </div>
                    ))}
                  </div>
                )}
                {adminTab === "leads" && (
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><strong>سجل طلبات العملاء:</strong><button type="button" onClick={() => fetchLeads()} style={btCss}><RefreshCw size={13} /> تحديث</button></div>
                    {leads.length === 0 ? <p style={{ opacity: 0.75 }}>لا توجد طلبات مسجلة حالياً.</p> : leads.map((l: any) => <div key={l.id} style={{ background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><strong>{l.name}</strong> — {l.project} ({l.location || "الرياض"})<p style={{ margin: "3px 0 0", fontSize: "0.84rem", opacity: 0.85 }}>{l.details}</p></div><button type="button" onClick={() => delLead(l.id)} style={{ ...btCss, color: "#ff8b8b" }}><Trash2 size={13} /></button></div>)}
                  </div>
                )}
                {adminTab === "security" && (
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={lbCss}>اسم المستخدم الحالي<div style={{ ...inCss, boxSizing: "border-box" }}>{adminUser}</div></div>
                    <label style={lbCss}>كلمة مرور جديدة للأدمن<input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="12 حرفاً على الأقل؛ اتركه فارغاً للإبقاء على الحالية" style={inCss} /></label>
                    <button type="button" onClick={logoutAdmin} style={{ ...btCss, color: "#ff9e9e", width: "fit-content" }}><LogOut size={14} /> تسجيل الخروج</button>
                  </div>
                )}
                <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <small style={{ opacity: 0.75 }}>تُحفظ التعديلات في قاعدة البيانات وتظهر على الموقع فوراً.</small>
                  <button type="button" onClick={saveDb} disabled={isSaving} className="button button-copper">{isSaving ? <><Loader2 size={15} className="spin" /> جاري إرسال الطلب...</> : <><Save size={15} /> حفظ التعديلات ونشرها فوراً</>}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
