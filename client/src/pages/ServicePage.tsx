import { ArrowDownLeft, Check, MessageCircle, Phone } from "lucide-react";

const services = {
  "/services/glass": {
    title: "أعمال الزجاج والسكريت وكبائن الشاور في السعودية",
    shortTitle: "أعمال الزجاج والسكريت",
    description: "تنفيذ الواجهات الزجاجية، زجاج السيكوريت، كبائن الشاور، الدرابزينات والاستركشر بمواصفات واضحة للمنازل والمشاريع التجارية.",
    image: "/glass-facade_1281cb63_3c523186.jpg",
    points: ["واجهات زجاجية واستركشر", "كبائن شاور وزجاج سيكوريت", "درابزينات وقواطع زجاجية", "معاينة وتنسيق قبل التنفيذ"],
  },
  "/services/interior-decor": {
    title: "تصميم وتنفيذ الديكور الداخلي في السعودية | مؤسسة مثابة",
    shortTitle: "الديكور الداخلي",
    description: "حلول ديكور داخلي للمنازل والمكاتب والمساحات التجارية، من دراسة الاستخدام واختيار الخامات إلى التنفيذ والتركيب.",
    image: "/reception_32a5bffe_05c6fa3b.jpg",
    points: ["ديكورات داخلية للمنازل والمكاتب", "جدران وكسوات وبدائل الرخام", "تنسيق الخامات والإضاءة", "تنفيذ منظم وتسليم واضح"],
  },
  "/services/woodwork": {
    title: "الأعمال الخشبية والنجارة والديكور الخشبي في السعودية | مؤسسة مثابة",
    shortTitle: "الأعمال الخشبية",
    description: "تصميم وتنفيذ أعمال خشبية مخصصة تضيف الدفء والتنظيم للمكان، من الجدران الخشبية والكسوات إلى وحدات التلفاز والكونسولات والنجارة الداخلية.",
    image: "/built-in-lounge_7d8805b0_f1ed0f5e.jpg",
    points: ["كسوات وجدران خشبية", "وحدات تلفاز وكونسولات", "دواليب ووحدات تخزين مخصصة", "نجارة داخلية للمنازل والمكاتب"],
  },
  "/services/aluminum": {
    title: "أعمال الألمنيوم والواجهات الخارجية في السعودية | مؤسسة مثابة",
    shortTitle: "الألمنيوم والواجهات",
    description: "حلول الألمنيوم للنوافذ والأبواب والواجهات والتكسيات الخارجية، مع اختيار عملي للخامة والتفاصيل المناسبة للمشروع.",
    image: "/glass-office_ff88266f_aac6aeb9.jpg",
    points: ["أبواب ونوافذ ألمنيوم", "واجهات وتكسيات كلادينج", "قواطع وأعمال تفصيل", "تنسيق اللون والخامة مع الواجهة"],
  },
} as const;

type ServiceKey = keyof typeof services;

export default function ServicePage({ path }: { path: string }) {
  const service = services[path as ServiceKey] || services["/services/interior-decor"];
  const canonical = `https://mathabahksa.com${path}`;

  if (typeof document !== "undefined") {
    document.title = service.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", service.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
  }

  return <div className="service-page" dir="rtl">
    <header className="service-page-header">
      <a href="/" className="service-brand" aria-label="العودة إلى مؤسسة مثابة"><img src="/mathabah-logo-transparent_2365ed67.png" alt="مؤسسة مثابة" /></a>
      <nav aria-label="روابط الخدمة"><a href="/">الرئيسية</a><a href="#details">تفاصيل الخدمة</a><a href="#contact">تواصل معنا</a></nav>
      <a className="service-phone" href="tel:+966565173798"><Phone size={15} /> اتصل بنا</a>
    </header>
    <main>
      <section className="service-hero">
        <div className="service-hero-copy"><span className="eyebrow">مؤسسة مثابة · المملكة العربية السعودية</span><h1>{service.title}</h1><p>{service.description}</p><div className="service-actions"><a className="button button-copper" href="https://wa.me/966565173798?text=مرحبًا، أود طلب عرض لمشروع">اطلبوا عرضًا <MessageCircle size={17} /></a><a className="button button-ghost" href="/#work">شاهدوا الأعمال <ArrowDownLeft size={16} /></a></div></div>
        <div className="service-hero-image"><img src={service.image} alt={service.shortTitle} /></div>
      </section>
      <section id="details" className="service-details"><div><span className="eyebrow">ما نقدمه</span><h2>تفاصيل تُبنى<br /><em>على احتياج المكان.</em></h2><p>نبدأ بفهم المساحة والاستخدام والميزانية، ثم نساعدكم في اختيار الخامة والتفاصيل قبل التنفيذ. هدفنا نتيجة جميلة وعملية وواضحة في كل مرحلة.</p></div><div className="service-points">{service.points.map((point) => <div key={point}><Check size={17} /><span>{point}</span></div>)}</div></section>
      <section id="contact" className="service-contact"><span className="eyebrow">لنبدأ الحديث</span><h2>مشروعكم يستحق<br /><em>خطوة واضحة.</em></h2><p>أرسلوا المدينة ونوع العمل والمساحة التقريبية عبر واتساب، وسنعود إليكم بالتفاصيل الأولية.</p><a className="button button-dark" href="https://wa.me/966565173798?text=مرحبًا، أود مناقشة مشروع مع مؤسسة مثابة"><MessageCircle size={17} /> تواصلوا عبر واتساب</a></section>
    </main>
    <footer className="service-footer"><span>© 2026 مؤسسة مثابة</span><a href="/">العودة إلى الموقع الرئيسي</a></footer>
  </div>;
}

export { services };
