import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Building2,
  CheckCircle2,
  Grid3X3,
  Menu,
  MessageCircle,
  PaintRoller,
  Phone,
  ShieldCheck,
  Trophy,
  X,
} from "lucide-react";

/**
 * توجه التصميم: عمارة دافئة — فحمي #1E1E1E، نحاسي #A66A3C،
 * رملي #C8B790، عاجي #F7F4EF. هذا الملف يضم الهوية والرأسية
 * والبطل وقسم الخدمات ضمن المرحلة الثانية.
 */

const PHONE_NUMBER = "966565173798";
const phoneHref = `tel:+${PHONE_NUMBER}`;
const whatsappMessage = encodeURIComponent("السلام عليكم، أرغب في التواصل مع مؤسسة مثابة للاستفسار عن خدماتكم.");
const whatsappHref = `https://wa.me/${PHONE_NUMBER}?text=${whatsappMessage}`;

const navItems = [
  { label: "الرئيسية", href: "#home" },
  { label: "خبرتنا", href: "#experience" },
  { label: "خدماتنا", href: "#services" },
  { label: "أعمالنا", href: "#work" },
];

const portfolioItems = [
  { number: "01", title: "واجهات زجاجية واستركشر", material: "زجاج · واجهات", category: "زجاج وواجهات", image: "./assets/glass-facade.jpg" },
  { number: "02", title: "تفاصيل الديكور الداخلي", material: "تكسيات · خامات", category: "ديكورات داخلية", image: "./assets/feature-wall.jpg" },
  { number: "03", title: "سلالم وتفاصيل إنشائية", material: "تنفيذ · تشطيبات", category: "تفصيل وألمنيوم", image: "./assets/staircase-detail.jpg" },
  { number: "04", title: "استقبال ومساحات عمل", material: "تصميم · تنفيذ", category: "ديكورات داخلية", image: "./assets/reception.jpg" },
  { number: "05", title: "واجهات وخامات معاصرة", material: "ألمنيوم · زجاج", category: "زجاج وواجهات", image: "./assets/glass-office.jpg" },
  { number: "06", title: "أعمال خشبية مخصصة", material: "تفصيل · نجارة", category: "تفصيل وألمنيوم", image: "./assets/built-in-lounge.jpg" },
];

const portfolioFilters = ["الكل", "زجاج وواجهات", "ديكورات داخلية", "تفصيل وألمنيوم"];

const services = [
  {
    number: "01",
    title: "أعمال الزجاج والسكريت",
    description: "واجهات زجاجية معزولة، كبائن شاور، درابزينات، وواجهات استركشر للمباني والمحلات وفق مواصفات الأمان المطلوبة للمشروع.",
    icon: Grid3X3,
  },
  {
    number: "02",
    title: "التصميم والديكور الداخلي",
    description: "تنفيذ ديكورات المكاتب والمنازل، التكسيات الخشبية، بديل الرخام، والبدائل الحديثة بتفاصيل معمارية متناسقة.",
    icon: PaintRoller,
  },
  {
    number: "03",
    title: "الألمنيوم والواجهات الخارجية",
    description: "نوافذ وأبواب ألمنيوم بخيارات عزل حراري وصوتي حسب مواصفة المشروع، وتكسيات كلادينج للواجهات مع تركيب منظم.",
    icon: Building2,
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedProject, setSelectedProject] = useState<(typeof portfolioItems)[number] | null>(null);
  const [activeFilter, setActiveFilter] = useState("الكل");
  const visiblePortfolio = activeFilter === "الكل" ? portfolioItems : portfolioItems.filter((item) => item.category === activeFilter);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 560);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const welcomeTimer = window.setTimeout(() => setShowWelcome(false), 5200);
    return () => window.clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-ivory text-charcoal" dir="rtl">
      <div className="page-loader" data-loading={isLoading} aria-hidden={!isLoading}><span className="page-loader-mark">م</span><span className="page-loader-line" /></div>
      <header className="site-header" aria-label="رأسية الموقع">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="العودة إلى الصفحة الرئيسية" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true"><img src="./assets/mathabah-mark.png" alt="" /></span>
            <span className="brand-copy"><strong>مثابة</strong><small>نبني ما يُعتمد عليه</small></span>
          </a>

          <nav className="main-nav" aria-label="التنقل الرئيسي">
            {navItems.map((item, index) => <a key={item.href} href={item.href} className={index === 0 ? "nav-link active" : "nav-link"}>{item.label}</a>)}
          </nav>

          <div className="header-actions">
            <a className="header-phone" href={phoneHref} aria-label="اتصل بنا" data-conversion="phone_click" data-gtm-event="contact_phone" data-cta-location="header"><Phone size={15} aria-hidden="true" /><span>اتصل بنا</span></a>
            <a className="header-cta" href="#contact" onClick={closeMenu}><span>تواصل معنا</span><ArrowLeft size={16} aria-hidden="true" /></a>
          </div>

          <button type="button" className="menu-toggle" aria-label={menuOpen ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} strokeWidth={1.7} /> : <Menu size={22} strokeWidth={1.7} />}
          </button>
        </div>

        <div id="mobile-navigation" className={menuOpen ? "mobile-nav is-open" : "mobile-nav"}>
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
          <a className="mobile-nav-cta" href="#contact" onClick={closeMenu}>تواصل معنا</a>
        </div>
      </header>

      <main>
        <section id="home" className="hero-section" aria-labelledby="hero-title">
          <div className="hero-texture" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(270deg,rgba(30,30,30,.52),rgba(30,30,30,.94) 58%),url("./assets/mathabah-architectural-texture.jpg")' }} />
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="official-badge"><span className="badge-dot" /> مؤسسة مثابة <b>|</b> نبني ما يُعتمد عليه</div>
              <h1 id="hero-title">نُجسّد رؤيتكم<br /><span>بصلابة واحترافية.</span></h1>
              <p>متخصصون في تنفيذ أعمال زجاج السكريت، واجهات الاستركشر، الديكورات الداخلية الحديثة، وتكسيات الألمنيوم وفق المواصفات المتفق عليها واحتياج كل مشروع.</p>
              <div className="hero-actions">
                <a className="action-primary" href={phoneHref} data-conversion="phone_click" data-gtm-event="contact_phone" data-cta-location="hero"><Phone size={19} aria-hidden="true" /><span>اتصل بنا الآن</span></a>
                <a className="action-secondary" href={whatsappHref} target={"_blank"} rel="noopener noreferrer" data-conversion="whatsapp_click" data-gtm-event="contact_whatsapp" data-cta-location="hero"><span className="whatsapp-symbol">◌</span><span>محادثة واتساب</span></a>
              </div>
            </div>

            <div className="hero-aside" aria-label="قيم مؤسسة مثابة">
              <div className="hero-aside-image"><img src="./assets/mathabah-architectural-texture.jpg" alt="تفاصيل معمارية من خامات الزجاج والحجر والنحاس" /></div>
              <div className="hero-aside-label"><span>01</span><span>معمارية · مدروسة · عملية</span></div>
            </div>
          </div>
          <div className="proof-row">
            <div><CheckCircle2 size={18} /><span>عناية واضحة بالتفاصيل</span></div>
            <div><ShieldCheck size={18} /><span>متابعة واضحة بعد التنفيذ</span></div>
            <div><Trophy size={18} /><span>خامات ومواصفات مناسبة</span></div>
          </div>
        </section>

        <section id="services" className="services-section" aria-labelledby="services-title">
          <div className="section-watermark" aria-hidden="true">م</div>
          <div className="section-heading"><p className="section-kicker"><span /> 02 / مجالات الخبرة</p><h2 id="services-title">حلول تُبنى<br /><em>على معرفة.</em></h2><p className="section-lead">حلول هندسية وديكورية متكاملة توازن بين الوظيفة والجمال المعماري، من الفكرة الأولى حتى اللمسة الأخيرة.</p></div>
          <div className="services-list">
            {services.map(({ number, title, description, icon: Icon }) => <article className="service-card" key={number}><div className="service-top"><span className="service-number">{number}</span><span className="service-icon"><Icon size={23} strokeWidth={1.5} /></span></div><div className="service-rule" aria-hidden="true"><span /><span /><span /></div><h3>{title}</h3><p>{description}</p><div className="service-footer"><div className="material-swatches" aria-label="خامات مرتبطة بالخدمة"><i /><i /><i /></div><a href={whatsappHref} target={"_blank"} rel="noopener noreferrer" className="service-link" data-conversion="whatsapp_click" data-gtm-event="consultation_whatsapp" data-cta-location="service">طلب استشارة <ArrowLeft size={16} /></a></div></article>)}
          </div>
        </section>

        <section id="work" className="portfolio-section" aria-labelledby="portfolio-title">
          <div className="portfolio-heading"><div><p className="section-kicker light"><span /> 03 / سجل الأعمال</p><h2 id="portfolio-title">المكان يبدأ<br /><em>من الصورة.</em></h2></div><p>مساحات مخصصة لصور مشاريعكم الحقيقية. سنحوّل كل مشروع إلى دراسة بصرية متكاملة عند تزويدنا بالصور المعتمدة.</p></div>
          <div className="portfolio-filters" role="group" aria-label="تصفية معرض الأعمال">{portfolioFilters.map((filter) => <button type="button" key={filter} className={activeFilter === filter ? "portfolio-filter is-active" : "portfolio-filter"} aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><div className="portfolio-grid">
            {visiblePortfolio.map((item) => <article className="portfolio-item" key={item.number} role="button" tabIndex={0} aria-label={`تكبير صورة ${item.title}`} onClick={() => setSelectedProject(item)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedProject(item); } }}><div className="portfolio-image"><img src={item.image} alt={item.title} loading="lazy" /><span className="portfolio-number">{item.number}</span><span className="portfolio-zoom-hint">انقر للتكبير</span></div><div className="portfolio-item-copy"><h3>{item.title}</h3><p>{item.material}</p></div></article>)}
          </div>
        </section>

        <section id="experience" className="experience-section" aria-labelledby="experience-title"><div className="experience-heading"><p className="section-kicker"><span /> 04 / خبرة عملية</p><h2 id="experience-title">خبرة تُرى<br /><em>في التفاصيل.</em></h2><p>نستعرض نماذج من الأعمال المصورة المتاحة، مع وصف واضح لنوع التنفيذ والخامة. يمكنكم معاينة الأعمال ومناقشة احتياج مشروعكم مباشرة.</p></div><div className="experience-panel"><div className="experience-mark" aria-hidden="true">م</div><div className="experience-copy"><h3>الأعمال تتحدث عن طريقة التنفيذ</h3><p>لا نضع تقييمات أو شهادات غير منشورة. نترك التفاصيل المرئية والخدمات المحددة أساسًا للتعرّف على أسلوبنا، ثم نكمل الحوار معكم حول مشروعكم.</p></div><div className="experience-actions"><a href="#work" className="experience-primary">معاينة الأعمال <ArrowLeft size={16} /></a><a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="experience-secondary" data-conversion="whatsapp_click" data-gtm-event="consultation_whatsapp" data-cta-location="experience">اطلبوا استشارة <ArrowLeft size={16} /></a></div></div><div className="experience-metrics"><div><strong>06</strong><span>نماذج مصورة</span></div><div><strong>03</strong><span>مجالات تنفيذ</span></div><div><strong>01</strong><span>قناة تواصل مباشرة</span></div></div></section>

        <section id="contact" className="contact-banner" aria-labelledby="contact-title"><div className="contact-motif" aria-hidden="true">م</div><div className="contact-content"><p className="section-kicker light"><span /> 04 / الخطوة التالية</p><h2 id="contact-title">جاهزون لبناء<br /><em>مشروعكم القادم؟</em></h2><p>تواصلوا مع فريقنا الهندسي للحصول على استشارة واستعراض العينات والحلول المناسبة لمساحتكم.</p><div className="contact-actions"><a href={phoneHref} className="contact-primary" data-conversion="phone_click" data-gtm-event="contact_phone" data-cta-location="contact_banner"><Phone size={18} /> اتصل بنا الآن</a><a href={whatsappHref} target={"_blank"} rel="noopener noreferrer" className="contact-dark" data-conversion="whatsapp_click" data-gtm-event="contact_whatsapp" data-cta-location="contact_banner"><span className="whatsapp-symbol">◌</span> تواصل عبر الواتساب</a></div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-inner"><div className="footer-brand"><span className="brand-mark small"><img src="./assets/mathabah-mark.png" alt="" /></span><div><strong>مثابة</strong><p>نبني ما يُعتمد عليه</p></div></div><p className="footer-note">نبني ما يُعتمد عليه<br /><span>جميع الحقوق محفوظة © 2026</span></p><div className="footer-links"><a href={phoneHref} aria-label="اتصال هاتفي" data-conversion="phone_click" data-gtm-event="contact_phone" data-cta-location="footer"><Phone size={17} /></a><a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="واتساب" data-conversion="whatsapp_click" data-gtm-event="contact_whatsapp" data-cta-location="footer"><span className="whatsapp-symbol">◌</span></a></div></div></footer>

      {selectedProject && <div className="lightbox-backdrop" role="presentation" onClick={() => setSelectedProject(null)}><div className="lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" onClick={(event) => event.stopPropagation()}><button type="button" className="lightbox-close" aria-label="إغلاق الصورة المكبرة" onClick={() => setSelectedProject(null)}><X size={21} /></button><img src={selectedProject.image} alt={selectedProject.title} /><div className="lightbox-caption"><span>{selectedProject.number}</span><div><h2 id="lightbox-title">{selectedProject.title}</h2><p>{selectedProject.material}</p></div></div></div></div>}
      <div id="about" className="anchor-marker" aria-hidden="true" />
      {showWelcome && <div className="floating-welcome" aria-hidden="true">مرحبًا، كيف نساعدكم؟</div>}
      <button type="button" className={showBackToTop ? "back-to-top is-visible" : "back-to-top"} aria-label="العودة إلى أعلى الصفحة" tabIndex={showBackToTop ? 0 : -1} onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}><ArrowUp size={18} aria-hidden="true" /><span>للأعلى</span></button>
      <div className="floating-actions" aria-label="خيارات التواصل السريعة"><a className="floating-whatsapp" data-tooltip="ابدأ محادثة واتساب الآن" href={whatsappHref} target="_blank" rel="noopener noreferrer" data-conversion="whatsapp_click" data-gtm-event="contact_whatsapp" data-cta-location="floating"><MessageCircle size={19} aria-hidden="true" /><span>واتساب</span></a><a className="floating-call" data-tooltip="اتصل بمؤسسة مثابة مباشرة" href={phoneHref} data-conversion="phone_click" data-gtm-event="contact_phone" data-cta-location="floating"><Phone size={18} aria-hidden="true" /><span>اتصال مباشر</span></a></div>
    </div>
  );
}
