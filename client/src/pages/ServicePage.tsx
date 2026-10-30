// @ts-nocheck
import { useEffect, useState } from "react";
import { ArrowDownLeft, Check, MessageCircle, Phone } from "lucide-react";

const P = "https:" + "//";
const WA_BASE = P + "wa" + ".me/";

export const services: Record<string, any> = {
  "/services/glass": {
    title: "أعمال الزجاج المعماري والسيكوريت في الرياض", shortTitle: "أعمال الزجاج والسيكوريت",
    description: "تنفيذ أعمال الزجاج السيكوريت والواجهات الزجاجية والقواطع والدرابزينات في الرياض بأعلى معايير الجودة والسلامة.",
    localIntro: "نقدم في مؤسسة مثابة حلولاً متكاملة في أعمال الزجاج المعماري والسيكوريت داخل مدينة الرياض، مع التركيز على الدقة في التصنيع والتركيب لتلبية متطلبات المشاريع السكنية والتجارية.",
    image: "/glass-facade_1281cb63_3c523186.jpg",
    points: ["واجهات زجاجية استركشر ومزدوجة عازلة", "قواطع زجاجية للمكاتب والمنازل", "درابزينات زجاجية للسلالم والشرفات", "كبائن شاور زجاجية فاخرة"],
  },
  "/services/aluminum": {
    title: "أعمال الألمنيوم والواجهات الخارجية في الرياض", shortTitle: "أعمال الألمنيوم والواجهات",
    description: "تصنيع وتركيب أعمال الألمنيوم للنوافذ والأبواب والواجهات والكلادينج والقباب السماوية بأعلى مواصفات العزل والمتانة.",
    localIntro: "نقدم في مؤسسة مثابة حلولاً متكاملة في أعمال الألمنيوم والواجهات داخل مدينة الرياض، مع التركيز على جودة القطاعات والأكسسوارات لضمان أفضل أداء معماري.",
    image: "/glass-office_ff88266f_aac6aeb9.jpg",
    points: ["نوافذ وأبواب ألمنيوم دبل جلاس عازلة للحرارة والصوت", "واجهات وتكسيات كلادينج واستركشر للمباني", "قباب سماوية ومظلات لكسان", "قطاعات خاصة بمواصفات هندسية عالية"],
  },
  "/services/interior-decor": {
    title: "تصميم وتنفيذ الديكور الداخلي في الرياض", shortTitle: "التصميم والديكور الداخلي",
    description: "حلول ديكور داخلية وخارجية للمنازل والمكاتب والمساحات التجارية، من دراسة الاستخدام واختيار الخامات إلى التنفيذ والتركيب.",
    localIntro: "تقدم مؤسسة مثابة خدمات الديكور الداخلي في الرياض للمنازل والمكاتب، مع تنسيق الخامات والكسوات والإضاءة بما يناسب الاستخدام والميزانية.",
    image: "/mathabah-architectural-texture_423c537d_e9b373de.webp",
    points: ["ديكورات داخلية وخارجية للمنازل والمكاتب", "جدران وكسوات فاخرة وبديل خشب وبديل رخام", "تنسيق الخامات والأسقف المستعارة والإضاءة", "تنفيذ منظم وتسليم واضح في الموعد"],
  },
  "/services/woodwork": {
    title: "الأعمال الخشبية والنجارة المعمارية في الرياض", shortTitle: "الأعمال الخشبية والنجارة",
    description: "تنفيذ الأعمال الخشبية المخصصة والأبواب والخزائن والتكسيات الدافئة التي تمنح المكان هوية متوازنة وعملية.",
    localIntro: "ننفذ في مؤسسة مثابة بالرياض كافة أعمال النجارة والديكورات الخشبية المخصصة بتفصيل دقيق يناسب المساحات السكنية والتجارية.",
    image: "/built-in-lounge_7d8805b0_f1ed0f5e.jpg",
    points: ["تفصيل أبواب خشبية وتكسيات جدارية معاصرة", "جلسات داخلية وخزائن ومكتبات مدمجة", "دمج الخشب مع الزجاج والألمنيوم والإضاءة", "خامات عالية الجودة تدوم طويلاً"],
  },
};

export default function ServicePage({ path }: { path: string }) {
  const [cms, setCms] = useState<any>(null);
  useEffect(() => { fetch("/api/site-data").then(r => r.json()).then(d => { if (d?.ok && d?.data) setCms(d.data); }).catch(() => {}); }, []);
  const service = services[path] || services["/services/glass"];
  const wa = cms?.contact?.whatsappRaw || "966565173798";
  const phone = cms?.contact?.phoneRaw || "+966565173798";

  useEffect(() => { document.title = service.title; }, [service]);

  return (
    <div className="service-page" dir="rtl">
      <header className="service-page-header">
        <a href="/" className="service-brand" aria-label="الرئيسية مثابة"><img src={cms?.branding?.logoDark || "/mathabah-logo-dark-subtitle.png"} alt="مثابة" /></a>
        <nav aria-label="التنقل الرئيسي"><a href="/#services">خدماتنا</a><a href="#details">التفاصيل</a><a href="#contact">تواصل معنا</a></nav>
        <a className="service-phone" href={`tel:${phone}`}><Phone size={15} /> تواصل</a>
      </header>
      <main>
        <section className="service-hero">
          <div className="service-hero-copy"><span className="eyebrow">مؤسسة مثابة · الرياض</span><h1>{service.title}</h1><p>{service.description}</p><div className="service-actions"><a className="button button-copper" href={`${WA_BASE}${wa}?text=${encodeURIComponent(`السلام عليكم، أرغب في طلب عرض سعر لخدمة: ${service.shortTitle}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /></a><a className="button button-ghost" href="/#work">أعمالنا <ArrowDownLeft size={16} /></a></div></div>
          <div className="service-hero-image"><img src={service.image} alt={service.shortTitle} width={2000} height={1500} fetchPriority="high" decoding="async" /></div>
        </section>
        <section id="details" className="service-details"><div><span className="eyebrow">عن الخدمة</span><h2>الحلول المعمارية <br /><em>في الرياض.</em></h2><p>نقدم في مثابة حلولاً متكاملة تضمن أعلى معايير الجودة والدقة في التنفيذ. نعمل على تلبية احتياجات مشروعك بأعلى مواصفات.</p><p>{service.localIntro}</p></div><div className="service-points">{service.points.map((point: string) => <div key={point}><Check size={17} /><span>{point}</span></div>)}</div></section>
        <section id="contact" className="service-contact"><span className="eyebrow">تواصل معنا</span><h2>جاهز لبدء مشروعك؟ <br /><em>تواصل معنا.</em></h2><p>نحن هنا لمساعدتك في تحقيق رؤيتك المعمارية. تواصل معنا اليوم للحصول على استشارة مجانية وعرض سعر مخصص.</p><a className="button button-dark" href={`${WA_BASE}${wa}?text=${encodeURIComponent(`السلام عليكم، أرغب في طلب عرض سعر لخدمة: ${service.shortTitle}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> تواصل عبر واتسآب</a></section>
      </main>
      <footer className="service-footer"><span>© 2026 مؤسسة مثابة</span><a href="/">الرئيسية</a></footer>
    </div>
  );
}
