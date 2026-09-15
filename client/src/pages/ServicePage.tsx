import { useEffect } from "react";
import { ArrowDownLeft, Check, MessageCircle, Phone } from "lucide-react";

const services = {
  "/services/glass": {
    title: "أعمال الزجاج والسكريت وكبائن الشاور في السعودية",
    shortTitle: "أعمال الزجاج والسكريت",
    description: "تنفيذ الواجهات الزجاجية، زجاج السيكوريت، كبائن الشاور، الدرابزينات والاستركشر بمواصفات واضحة للمنازل والمشاريع التجارية.",
    localIntro: "تنفذ مؤسسة مثابة أعمال الزجاج السيكوريت والواجهات الزجاجية في الرياض، مع معاينة واضحة واختيار السماكة والتفاصيل المناسبة للمكان.",
    image: "/glass-facade_1281cb63_3c523186.jpg",
    points: ["واجهات زجاجية واستركشر", "كبائن شاور وزجاج سيكوريت", "درابزينات وقواطع زجاجية", "معاينة وتنسيق قبل التنفيذ"],
  },
  "/services/interior-decor": {
    title: "تصميم وتنفيذ الديكور الداخلي في السعودية | مؤسسة مثابة",
    shortTitle: "الديكور الداخلي",
    description: "حلول ديكور داخلي للمنازل والمكاتب والمساحات التجارية، من دراسة الاستخدام واختيار الخامات إلى التنفيذ والتركيب.",
    localIntro: "تقدم مؤسسة مثابة خدمات الديكور الداخلي في الرياض للمنازل والمكاتب، مع تنسيق الخامات والكسوات والإضاءة بما يناسب الاستخدام والميزانية.",
    image: "/reception_32a5bffe_05c6fa3b.jpg",
    points: ["ديكورات داخلية للمنازل والمكاتب", "جدران وكسوات وبدائل خشبية", "تنسيق الخامات والإضاءة", "تنفيذ منظم وتسليم واضح"],
  },
  "/services/woodwork": {
    title: "أعمال النجارة والديكورات الخشبية في السعودية | مؤسسة مثابة",
    shortTitle: "الأعمال الخشبية",
    description: "تنفيذ كل ما يخص النجارة والديكورات الخشبية، من الشيبورد وMDF والمودرن إلى غرف النوم والدولايب ووحدات التلفاز والكسوات والأثاث الخشبي المخصص.",
    localIntro: "تنفذ مؤسسة مثابة أعمال النجارة والديكورات الخشبية في الرياض، بما يشمل الدواليب والكسوات ووحدات التلفاز والأثاث المصمم حسب المساحة.",
    image: "/built-in-lounge_7d8805b0_f1ed0f5e.jpg",
    points: ["مطابخ ووحدات شيبورد وMDF", "غرف نوم ودواليب وملابس", "أثاث مودرن ووحدات تلفاز وكونسولات", "كسوات وجدران وأعمال نجارة مخصصة"],
  },
  "/services/aluminum": {
    title: "أعمال الألمنيوم والواجهات الخارجية في السعودية | مؤسسة مثابة",
    shortTitle: "الألمنيوم والواجهات",
    description: "حلول الألمنيوم للنوافذ والأبواب والواجهات والتكسيات الخارجية، مع اختيار عملي للخامة والتفاصيل المناسبة للمشروع.",
    localIntro: "توفر مؤسسة مثابة أعمال الألمنيوم والواجهات الخارجية في الرياض، من النوافذ والأبواب إلى التكسيات والكلادينج للمشاريع السكنية والتجارية.",
    image: "/glass-office_ff88266f_aac6aeb9.jpg",
    points: ["أبواب ونوافذ ألمنيوم", "واجهات وتكسيات كلادينج", "قواطع وأعمال تفصيل", "تنسيق اللون والخامة مع الواجهة"],
  },
} as const;

type ServiceKey = keyof typeof services;

export default function ServicePage({ path }: { path: string }) {
  const service = services[path as ServiceKey] || services["/services/interior-decor"];
  const canonical = `https://mathabahksa.com${path}`;

  useEffect(() => {
    document.title = service.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", service.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);

    const meta = (selector: string, attribute: "name" | "property", key: string, value: string) => {
      let tag = document.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };
    meta('meta[property="og:title"]', "property", "og:title", service.title);
    meta('meta[property="og:description"]', "property", "og:description", service.description);
    meta('meta[property="og:url"]', "property", "og:url", canonical);
    meta('meta[property="og:image"]', "property", "og:image", `https://mathabahksa.com${service.image}`);
    meta('meta[name="twitter:title"]', "name", "twitter:title", service.title);
    meta('meta[name="twitter:description"]', "name", "twitter:description", service.description);
    meta('meta[name="twitter:image"]', "name", "twitter:image", `https://mathabahksa.com${service.image}`);

    const schemaId = "service-page-schema";
    let schema = document.getElementById(schemaId);
    if (!schema) {
      schema = document.createElement("script");
      schema.id = schemaId;
      schema.setAttribute("type", "application/ld+json");
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.description,
      url: canonical,
      image: `https://mathabahksa.com${service.image}`,
      provider: {
        "@type": "LocalBusiness",
        name: "مؤسسة مثابة",
        url: "https://mathabahksa.com/",
        telephone: "+966565173798",
        address: { "@type": "PostalAddress", addressLocality: "الرياض", addressCountry: "SA" },
      },
      areaServed: { "@type": "Country", name: "المملكة العربية السعودية" },
    });
    return () => document.getElementById(schemaId)?.remove();
  }, [canonical, service]);

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
      <section id="details" className="service-details"><div><span className="eyebrow">ما نقدمه</span><h2>تفاصيل تُبنى<br /><em>على احتياج المكان.</em></h2><p>نبدأ بفهم المساحة والاستخدام والميزانية، ثم نساعدكم في اختيار الخامة والتفاصيل قبل التنفيذ. هدفنا نتيجة جميلة وعملية وواضحة في كل مرحلة.</p><p>{service.localIntro}</p></div><div className="service-points">{service.points.map((point) => <div key={point}><Check size={17} /><span>{point}</span></div>)}</div></section>
      <section id="contact" className="service-contact"><span className="eyebrow">لنبدأ الحديث</span><h2>مشروعكم يستحق<br /><em>خطوة واضحة.</em></h2><p>أرسلوا المدينة ونوع العمل والمساحة التقريبية عبر واتساب، وسنعود إليكم بالتفاصيل الأولية.</p><a className="button button-dark" href="https://wa.me/966565173798?text=مرحبًا، أود مناقشة مشروع مع مؤسسة مثابة"><MessageCircle size={17} /> تواصلوا عبر واتساب</a></section>
    </main>
    <footer className="service-footer"><span>© 2026 مؤسسة مثابة</span><a href="/">العودة إلى الموقع الرئيسي</a></footer>
  </div>;
}

export { services };
