import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUp, Check, ChevronLeft, ChevronRight, ExternalLink, Instagram, Lock, Loader2, MapPin, Menu, MessageCircle, Moon, Phone, Sun, X } from "lucide-react";

const storage = import.meta.env.VITE_ASSET_BASE || "/manus-storage/";

// Promotional controls: edit these values to schedule or disable announcements without changing the page layout.
const PROMO_CONFIG = {
  announcementEnabled: true,
  popupEnabled: true,
  popupDelayMs: 5500,
  popupDurationMs: 5000,
  startAt: "2026-01-01T00:00:00+03:00",
  endAt: "2027-01-01T00:00:00+03:00",
};

const isPromoWindowActive = () => {
  const now = Date.now();
  return PROMO_CONFIG.announcementEnabled && now >= Date.parse(PROMO_CONFIG.startAt) && now <= Date.parse(PROMO_CONFIG.endAt);
};

const gallery = [
  { image: storage + "glass-facade_1281cb63_3c523186.jpg", kicker: "ضوء · خطوط · اتزان", title: "واجهات زجاجية واستركشر", category: "زجاج وواجهات", text: "حل واجهة يوازن بين حضور الزجاج وانضباط الخطوط؛ ليصل الضوء إلى الداخل ويحافظ على قراءة معمارية واضحة." },
  { image: storage + "mathabah-architectural-texture_423c537d_e9b373de.webp", kicker: "خامة · عمق · هدوء", title: "تفاصيل الديكور الداخلي", category: "ديكورات داخلية", text: "جدار داخلي بخامة دافئة وإضاءة موزعة بعناية؛ يمنح المساحة نقطة تركيز عملية." },
  { image: storage + "staircase-detail_36a86d04_67116930.jpg", kicker: "دقة · حركة · ضوء", title: "سلالم وتفاصيل إنشائية", category: "تفصيل وألمنيوم", text: "تفاصيل إنشائية تُعامل كجزء من التصميم، لتبقى الحركة آمنة وواضحة." },
  { image: storage + "reception_32a5bffe_05c6fa3b.jpg", kicker: "تصميم · تنفيذ · حضور", title: "استقبال ومساحات عمل", category: "ديكورات داخلية", text: "ترتيب استقبال يوجّه الحركة ويترك انطباعًا منظمًا منذ اللحظة الأولى." },
  { image: storage + "glass-office_ff88266f_aac6aeb9.jpg", kicker: "ظل · أداء · واجهة", title: "واجهات وخامات معاصرة", category: "زجاج وواجهات", text: "تكوين خارجي يوضح كيف يمكن للخامة والظل أن يقدما واجهة هادئة ذات حضور." },
  { image: storage + "built-in-lounge_7d8805b0_f1ed0f5e.jpg", kicker: "تفصيل · نجارة · دفء", title: "أعمال خشبية مخصصة", category: "تفصيل وألمنيوم", text: "تفصيل خشبي مخصص يضيف دفئًا وتنظيمًا إلى المكان." },
];

const services = [
  { no: "01", category: "زجاج وواجهات", image: gallery[0].image, title: "أعمال الزجاج والسكريت", label: "شفافية محسوبة", text: "واجهات زجاجية، كبائن شاور، درابزينات وواجهات استركشر تُنفذ بمواصفات واضحة." },
  { no: "02", category: "ديكورات داخلية", image: gallery[1].image, title: "التصميم والديكور الداخلي", label: "تفصيل يخصكم", text: "حلول داخلية للمنازل والمكاتب، من اختيار الخامة إلى تركيب التفاصيل." },
  { no: "03", category: "زجاج وواجهات", image: gallery[4].image, title: "الألمنيوم والواجهات الخارجية", label: "أداء يدوم", text: "نوافذ وأبواب وتكسيات ألمنيوم وكلادينج تُصمم لأداء معماري متوازن." },
];

const socialChannels = [
  { name: "Facebook", key: "facebook", glyph: "f" },
  { name: "Instagram", key: "instagram", glyph: "◎" },
  { name: "Snapchat", key: "snapchat", glyph: "◇" },
  { name: "TikTok", key: "tiktok", glyph: "♪" },
];

function SectionHeading({ eyebrow, children, accent }: { eyebrow: string; children: React.ReactNode; accent: string }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{children} <em>{accent}</em></h2></div>;
}

function BrandIcon({ name, label }: { name: string; label: string }) {
  return <img className="brand-icon" src={`https://cdn.simpleicons.org/${name}/ffffff`} alt={label} aria-hidden="true" />;
}

function SocialGlyph({ type }: { type: string }) {
  const names: Record<string, string> = { facebook: "facebook", instagram: "instagram", snapchat: "snapchat", tiktok: "tiktok" };
  return <BrandIcon name={names[type]} label={type} />;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [filter, setFilter] = useState("الكل");
  const [isFiltering, setIsFiltering] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [promoOpen, setPromoOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(isPromoWindowActive());
  const [promoClosing, setPromoClosing] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("mathabah_theme") as "dark" | "light") || "light");

  useEffect(() => {
    const onPopState = () => { setLightbox(null); setPromoOpen(false); setPromoClosing(false); };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    if (lightbox !== null && !window.history.state?.mathabahLightbox) window.history.pushState({ mathabahLightbox: true }, "", window.location.pathname + window.location.search);
  }, [lightbox]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { closeLightbox(); setPromoOpen(false); setMenuOpen(false); } };
    window.addEventListener("scroll", onScroll); window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => {
    if (!PROMO_CONFIG.popupEnabled || !isPromoWindowActive() || sessionStorage.getItem("mathabah_promo_seen") === "true") return;
    const openTimer = window.setTimeout(() => setPromoOpen(true), PROMO_CONFIG.popupDelayMs);
    const closeTimer = window.setTimeout(() => closePromo(), PROMO_CONFIG.popupDelayMs + PROMO_CONFIG.popupDurationMs);
    return () => { window.clearTimeout(openTimer); window.clearTimeout(closeTimer); };
  }, []);
  useEffect(() => { document.body.style.overflow = lightbox ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [lightbox, promoOpen]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 3200); return () => window.clearTimeout(timer); }, [toast]);

  const filteredGallery = useMemo(() => filter === "الكل" ? gallery : gallery.filter((item) => item.category === filter), [filter]);
  const selectFilter = (nextFilter: string) => { if (nextFilter === filter) return; setIsFiltering(true); window.setTimeout(() => { setFilter(nextFilter); window.setTimeout(() => setIsFiltering(false), 40); }, 150); };
  const closeLightbox = () => { if (window.history.state?.mathabahLightbox) window.history.back(); else setLightbox(null); };
  const closePromo = () => { setPromoClosing(true); window.setTimeout(() => { setPromoOpen(false); setPromoClosing(false); sessionStorage.setItem("mathabah_promo_seen", "true"); }, 260); };
  const toggleTheme = () => { const next = theme === "dark" ? "light" : "dark"; setTheme(next); localStorage.setItem("mathabah_theme", next); document.documentElement.dataset.theme = next; document.body.dataset.theme = next; };
  const submitBrief = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const errors: Record<string, string> = {};
    const name = String(data.get("name") || "").trim();
    const project = String(data.get("project") || "").trim();
    const location = String(data.get("location") || "").trim();
    const details = String(data.get("details") || "").trim();
    if (name.length < 2) errors.name = "اكتبوا الاسم بشكل صحيح.";
    if (project.length < 2) errors.project = "اذكروا نوع المشروع.";
    if (location && location.length < 2) errors.location = "اكتبوا اسم المدينة أو الحي بشكل صحيح.";
    if (details.length < 10) errors.details = "أضيفوا تفاصيل مختصرة لا تقل عن 10 أحرف.";
    setFormErrors(errors);
    setSubmitSuccess(false);
    if (Object.keys(errors).length) { setToast("يرجى مراجعة الحقول المظللة قبل الإرسال."); return; }
    setIsSubmitting(true);
    const message = ["مرحبًا، أود مناقشة مشروع مع مؤسسة مثابة.", `الاسم: ${name}`, `نوع المشروع: ${project}`, `الموقع: ${location || "غير محدد"}`, `التفاصيل: ${details}`].join("\n");
    window.open(`https://wa.me/966565173798?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    window.setTimeout(() => { setIsSubmitting(false); setSubmitSuccess(true); form.reset(); }, 650);
  };
  const comingSoon = (name: string) => setToast(`ستتوفر قناة ${name} قريبًا`);

  return <div dir="rtl" className={`site-shell theme-${theme}`} id="home">
    {announcementVisible && <div className="announcement" role="status" aria-live="polite"><div className="marquee"><span>حلول تُبنى على معرفة</span><i>◆</i><span>من الفكرة حتى التسليم — تفاصيل محسوبة</span><i>◆</i><span>تواصلوا معنا لمناقشة مشروعكم</span><i>◆</i><span>حلول تُبنى على معرفة</span></div><button aria-label="إيقاف شريط الإعلان" onClick={() => setAnnouncementVisible(false)}><X size={14} /></button></div>}
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#home" className="brand" aria-label="مثابة، العودة إلى الرئيسية"><img src={storage + "mathabah-logo-transparent_2365ed67.png"} alt="مثابة — نبني ما يُعتمد عليه" /></a>
      <nav className={menuOpen ? "nav-open" : ""} aria-label="التنقل الرئيسي"><a href="#expertise" onClick={() => setMenuOpen(false)}>خبرتنا</a><a href="#work" onClick={() => setMenuOpen(false)}>سجل الأعمال</a><a href="#identity" onClick={() => setMenuOpen(false)}>هويتنا</a><a href="#contact" onClick={() => setMenuOpen(false)}>تواصل معنا</a><a className="nav-phone" href="tel:+966565173798"><Phone size={15} /> اتصل بنا</a></nav>
      <div className="header-tools"><button className="theme-toggle" aria-label={theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"} onClick={toggleTheme}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button><button className="menu-button" aria-label="فتح القائمة" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
    </header>

    <main>
      <section className="hero section-grid"><div className="hero-copy"><div className="mini-label">مؤسسة مثابة <span>منذ البداية · إلى التفاصيل</span></div><h1>نحوّل رؤيتكم إلى<br /><em>تفاصيل</em> تُعتمد.</h1><p>حلول زجاجية ومعمارية وداخلية تُصمّم وفق احتياج المكان، وتُنفّذ بمواصفة واضحة من الفكرة حتى التسليم.</p><div className="hero-actions"><a className="button button-copper" href="#contact">ابدأوا الحديث <ArrowDownLeft size={16} /></a><a className="button button-ghost" href="#work">شاهدوا أعمالنا <ArrowDownLeft size={16} /></a></div><div className="hero-note"><Check size={15} /> مواصفة واضحة · تنفيذ منظم · تفاصيل محسوبة</div></div><div className="hero-visual"><img src={gallery[1].image} alt="تفاصيل داخلية معاصرة بلمسات نحاسية" /><div className="image-caption"><span>01</span><strong>المكان يبدأ من الصورة</strong><small>تصميمات تتنفس مع الضوء</small></div><div className="watermark">M<br /><small>ARCHITECTURAL<br />SYSTEMS</small></div></div></section>

      <section id="expertise" className="section dark-section"><div className="section-grid intro-grid"><div><SectionHeading eyebrow="01  منهج مثابة" accent="ونتيجة واضحة.">قرارات مدروسة</SectionHeading><p className="lead">نبدأ بفهم الاستخدام والميزانية وشخصية المكان، ثم نترجمها إلى خامات وتفاصيل قابلة للتنفيذ. هدفنا مساحة متوازنة في شكلها، عملية في أدائها، وواضحة في كل مرحلة.</p></div><div className="process-list"><div><b>01</b><span>فهم الاحتياج</span></div><div><b>02</b><span>اختيار الخامة</span></div><div><b>03</b><span>ضبط التنفيذ</span></div></div></div></section>

      <section className="section services-section"><SectionHeading eyebrow="02  مجالات الخبرة" accent="على معرفة.">حلول تُبنى</SectionHeading><p className="section-intro">من الفكرة الأولى حتى اللمسة الأخيرة، نضع الخبرة في مكانها الصحيح: خلف التفاصيل، لا فوقها.</p><div className="services-grid">{services.map((service, index) => <button className={`service-card ${activeService === index ? "active" : ""}`} key={service.no} onClick={() => { setActiveService(index); selectFilter(service.category); window.setTimeout(() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40); }}><img src={service.image} alt={service.title} /><div className="service-overlay" /><span className="service-number">{service.no}</span><div className="service-content"><span>{service.label}</span><h3>{service.title}</h3><p>{service.text}</p><b>استكشف المجال <ArrowDownLeft size={16} /></b></div></button>)}</div></section>

      <section id="work" className="section work-section"><div className="work-head"><SectionHeading eyebrow="03  سجل الأعمال" accent="عن التفاصيل.">أعمال تتحدث</SectionHeading><p>نماذج من أعمال نفذناها بلغة هادئة، توازن بين الخامة والاستخدام وحضور المكان.</p></div><div className="work-counter"><button onClick={() => setLightbox((lightbox === null ? 0 : (lightbox + gallery.length - 1) % gallery.length))} aria-label="المشروع السابق"><ChevronRight size={16} /></button><span>01 / 06</span><button onClick={() => setLightbox((lightbox === null ? 0 : (lightbox + 1) % gallery.length))} aria-label="المشروع التالي"><ChevronLeft size={16} /></button></div><div className="filters" role="tablist" aria-label="تصنيف الأعمال">{["الكل", "زجاج وواجهات", "ديكورات داخلية", "تفصيل وألمنيوم"].map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? "selected" : ""} onClick={() => selectFilter(item)}>{item}</button>)}</div><div className={`gallery-grid ${isFiltering ? "is-filtering" : ""}`}>{filteredGallery.map((item) => { const originalIndex = gallery.indexOf(item); return <article className="gallery-card" key={item.title}><button className="gallery-image" aria-label={`معاينة ${item.title}`} onClick={() => setLightbox(originalIndex)}><img src={item.image} alt={item.title} /><span className="zoom-badge"><ExternalLink size={18} /><small>تكبير</small></span></button><div className="gallery-meta"><span>{item.category}</span><h3>{item.title}</h3><small>{item.kicker}</small><p>{item.text}</p></div></article>; })}</div><blockquote>«الجودة ليست في أن يظهر العمل، بل في أن يبقى واضحًا بعد سنوات.»<cite>— فلسفة العمل</cite></blockquote></section>

      <section id="identity" className="section identity-section"><div className="section-grid"><div><SectionHeading eyebrow="04  هويتنا" accent="يُعتمد عليه.">نبني ما</SectionHeading><p className="lead">مثابة شريك في التفاصيل التي تصنع الفرق. نعمل بوضوح، نُصغي جيدًا، ونُسلّم ما يمكن الاعتماد عليه.</p></div><div className="stats"><div><b>01</b><span>نطاق واضح للعمل</span></div><div><b>02</b><span>عناية بالخامة والتفاصيل</span></div><div><b>03</b><span>قنوات تواصل مباشرة</span></div></div></div></section>

      <section className="location-section section" aria-labelledby="location-title"><div className="location-card"><div><span className="eyebrow">05  نقطة البداية</span><h2 id="location-title">المكان مهم.<br /><em>والتفاصيل أهم.</em></h2><p>نعمل على تفعيل خريطة الوصول قريبًا. إلى ذلك الحين، يسعدنا أن نسمع عن موقع مشروعكم واحتياجه.</p><button className="button button-outline" onClick={() => comingSoon("الخريطة التفاعلية")}><MapPin size={16} /> الخريطة التفاعلية <Lock size={13} /></button></div><div className="map-placeholder"><MapPin size={32} /><span>الخريطة التفاعلية</span><small>سيفتح قريبًا</small></div></div></section>

      <section id="contact" className="section contact-section"><div className="contact-inner"><span className="eyebrow">05  لنبدأ الحديث</span><h2>تفصيلكم<br /><em>يستحق الإصغاء.</em></h2><p>أخبرونا عن المكان، الفكرة، أو حتى السؤال الأول. سنعود إليكم بخطوة واضحة.</p><div className="hero-actions"><a className="button button-copper" href="https://wa.me/966565173798" target="_blank" rel="noreferrer"><MessageCircle size={17} /> تواصلوا عبر واتساب <ArrowDownLeft size={15} /></a><a className="button button-ghost" href="tel:+966565173798"><Phone size={17} /> +966 56 517 3798</a></div></div></section>

      <section className="quick-brief section" aria-labelledby="brief-title"><div className="quick-brief-card"><div className="quick-brief-copy"><span className="eyebrow">06  بداية واضحة</span><h2 id="brief-title">أرسلوا تفاصيل<br /><em>المشروع كما هو.</em></h2><p>أسئلة بسيطة تساعدنا على فهم المكان والاحتياج، ثم نعود إليكم بخطوة عملية عبر واتساب.</p></div><form className="brief-form" onSubmit={submitBrief} aria-describedby="brief-feedback"><label>الاسم الكامل<input required name="name" placeholder="اكتبوا الاسم" aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? "name-error" : undefined} />{formErrors.name && <small id="name-error" className="field-error">{formErrors.name}</small>}</label><label>نوع المشروع<input required name="project" placeholder="مثال: واجهة أو ديكور داخلي" aria-invalid={Boolean(formErrors.project)} aria-describedby={formErrors.project ? "project-error" : undefined} />{formErrors.project && <small id="project-error" className="field-error">{formErrors.project}</small>}</label><label>الموقع أو المدينة<input name="location" placeholder="المدينة / الحي" aria-invalid={Boolean(formErrors.location)} aria-describedby={formErrors.location ? "location-error" : undefined} />{formErrors.location && <small id="location-error" className="field-error">{formErrors.location}</small>}</label><label className="brief-details">ملاحظات مختصرة<textarea required name="details" rows={3} placeholder="ما الذي تحتاجونه؟" aria-invalid={Boolean(formErrors.details)} aria-describedby={formErrors.details ? "details-error" : undefined} />{formErrors.details && <small id="details-error" className="field-error">{formErrors.details}</small>}</label><button className="button button-copper" type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 size={17} className="spin" /> جارٍ تجهيز الرسالة...</> : <><MessageCircle size={17} /> إرسال التفاصيل عبر واتساب</>}</button>{submitSuccess && <p id="brief-feedback" className="form-feedback" role="status">تم تجهيز رسالتكم بنجاح، وستفتح نافذة واتساب لمتابعة التواصل.</p>}</form></div></section>
    </main>

    <footer><div className="footer-top"><img src={storage + "mathabah-logo-transparent_2365ed67.png"} alt="مثابة" /><p>حلول زجاجية ومعمارية وداخلية<br />تُبنى على معرفة.</p><div className="footer-links"><span>روابط سريعة</span><a href="#expertise">خبرتنا</a><a href="#work">سجل الأعمال</a><a href="#identity">هويتنا</a></div><div className="socials"><span>قنوات التواصل</span>{socialChannels.map((channel) => <button key={channel.key} onClick={() => comingSoon(channel.name)} aria-label={`${channel.name} — ستتوفر القناة قريبًا`}><SocialGlyph type={channel.key} /> {channel.name}</button>)}</div></div><div className="footer-bottom"><span>© 2026 مؤسسة مثابة</span><span>نبني ما يُعتمد عليه</span></div></footer>

    <div className="floating-actions"><a href="https://wa.me/966565173798" target="_blank" rel="noreferrer" aria-label="التواصل عبر واتساب" className="float-whatsapp"><BrandIcon name="whatsapp" label="WhatsApp" /></a><a href="tel:+966565173798" aria-label="الاتصال بمؤسسة مثابة" className="float-phone"><Phone /></a>{socialChannels.map((channel) => <button key={channel.key} className={`float-social float-${channel.key}`} onClick={() => comingSoon(channel.name)} aria-label={`${channel.name} — ستتوفر القناة قريبًا`}><SocialGlyph type={channel.key} /></button>)}{scrolled && <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="العودة إلى أعلى الصفحة" title="العودة إلى أعلى الصفحة" data-tooltip="العودة إلى أعلى الصفحة" className="float-top"><ArrowUp /></button>}</div>
    <div className="chat-callout"><span>مرحبًا، كيف يمكننا مساعدتك في مشروعكم؟</span><a href="https://wa.me/966565173798" target="_blank" rel="noreferrer">تحدث معنا</a></div>
    {toast && <div className="toast" role="status"><Lock size={15} /> {toast}</div>}
    {promoOpen && <div className={`modal-backdrop promo-fade ${promoClosing ? "is-closing" : ""}`} data-overlay-dismiss="true" onMouseDown={(event) => { if (event.target === event.currentTarget) closePromo(); }}><div className="notice-modal" role="dialog" aria-modal="true" aria-labelledby="promo-title"><img className="notice-image" src={gallery[1].image} alt="تفاصيل معمارية من أعمال مثابة" /><button className="modal-close" data-dismiss="modal" aria-label="إغلاق الرسالة" onClick={closePromo}><X /></button><span className="eyebrow">رسالة مثابة</span><h2 id="promo-title">تفصيلكم<br /><em>يستحق الإصغاء.</em></h2><p>أرسلوا موقع المشروع ونوع الأعمال المطلوبة، وسنعود إليكم بخطوة واضحة.</p><a className="button button-copper" href="#contact" onClick={closePromo}>تواصلوا معنا <ArrowDownLeft size={16} /></a></div></div>}
    {lightbox !== null && <div className="modal-backdrop lightbox-backdrop" data-overlay-dismiss="true" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}><div className="lightbox" role="dialog" aria-modal="true" aria-label={gallery[lightbox].title}><button className="modal-close" aria-label="إغلاق المعاينة" onClick={closeLightbox}><X /></button><img src={gallery[lightbox].image} alt={gallery[lightbox].title} /><div className="lightbox-caption"><span>{gallery[lightbox].kicker}</span><h2>{gallery[lightbox].title}</h2><p>{gallery[lightbox].text}</p></div><button className="lightbox-prev" aria-label="السابق" onClick={() => setLightbox((lightbox + gallery.length - 1) % gallery.length)}><ChevronRight /></button><button className="lightbox-next" aria-label="التالي" onClick={() => setLightbox((lightbox + 1) % gallery.length)}><ChevronLeft /></button></div></div>}
  </div>;
}
