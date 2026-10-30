// ==========================================
// لوحة التحكم المركزية - مؤسسة مثابة
// ==========================================
// @ts-nocheck
const WA_PREFIX = "https:" + "//wa.me/";
const MAPS_DEFAULT = "https:" + "//maps.google.com";

export const siteConfig = {
  branding: {
    logoLight: "/mathabah-logo-transparent_2365ed67.png",
    logoDark: "/mathabah-logo-dark-subtitle.png",
    replaceWatermarkMWithLogo: true,
    watermarkSubtitle: "GLASS · ALUMINUM · WOODWORK",
  },
  hero: {
    miniLabel: "مؤسسة مثابة — زجاج · ألمنيوم · نجارة",
    title: "نحوّل رؤيتكم إلى تفاصيل تُعتمد.",
    description: "مثابة شريككم في صناعة الفرق، حيث تلتقي دقة التفاصيل ببراعة التنفيذ لنبني مساحات تعكس ذوقكم وتلائم ميزانيتكم.",
    heroImage: "/mathabah-architectural-texture_423c537d_e9b373de.webp",
    captionTitle: "المكان يبدأ من الصورة",
    captionSubtitle: "خامات تُختار لتخدم المكان",
  },
  marquee: {
    enabled: true,
    startHour: 0,
    endHour: 24,
    speedSeconds: 12,
    text: "حلول تُبنى على معرفة ◆ من الفكرة حتى التسليم — تفاصيل محسوبة ◆ تواصلوا معنا لمناقشة مشروعكم",
    items: [
      "حلول تُبنى على معرفة",
      "من الفكرة حتى التسليم — تفاصيل محسوبة",
      "تواصلوا معنا لمناقشة مشروعكم",
      "مؤسسة مثابة — زجاج · ألمنيوم · نجارة",
    ],
  },
  promotionalPopup: {
    enabled: true,
    durationSeconds: 5,
    title: "استشارة مجانية ومعاينة لمشروعكم في الرياض",
    description: "تواصلوا معنا عبر واتساب لمناقشة تفاصيل أعمال الزجاج والسيكوريت، الألمنيوم والواجهات، أو النجارة والديكور الداخلي.",
    buttonText: "تواصلوا عبر واتساب الآن",
    image: "/mathabah-architectural-texture_423c537d_e9b373de.webp",
    startHour: 0,
    endHour: 24,
  },
  contact: {
    whatsappNumber: "966565173798",
    whatsappRaw: "966565173798",
    phoneDisplay: "0565173798",
    phoneIntl: "+966 56 517 3798",
    phoneRaw: "+966565173798",
    phoneNav: "056 517 3798",
    cityText: "الرياض، المملكة العربية السعودية",
    mapEnabled: false,
    mapUrl: MAPS_DEFAULT,
    mapsUrl: MAPS_DEFAULT,
  },
  socialLinks: {
    whatsapp: { show: true, url: WA_PREFIX + "966565173798" },
    googleMaps: { show: true, url: MAPS_DEFAULT },
    facebook: { show: true, url: "" },
    instagram: { show: true, url: "" },
    tiktok: { show: true, url: "" },
    snapchat: { show: true, url: "" },
  },
  galleryImages: [
    "/glass-facade_1281cb63_3c523186.jpg",
    "/mathabah-architectural-texture_423c537d_e9b373de.webp",
    "/staircase-detail_36a86d04_67116930.jpg",
    "/reception_32a5bffe_05c6fa3b.jpg",
    "/glass-office_ff88266f_aac6aeb9.jpg",
    "/built-in-lounge_7d8805b0_f1ed0f5e.jpg",
  ],
  gallery: [
    { id: "work-1", image: "/glass-facade_1281cb63_3c523186.jpg", kicker: "ضوء · خطوط · اتزان", title: "واجهات زجاجية واستركشر", category: "زجاج وواجهات", text: "حل واجهة يوازن بين حضور الزجاج وانضباط الخطوط؛ ليصل الضوء إلى الداخل ويحافظ على قراءة معمارية واضحة." },
    { id: "work-2", image: "/mathabah-architectural-texture_423c537d_e9b373de.webp", kicker: "خامة · عمق · هدوء", title: "تفاصيل الديكور الداخلي", category: "ديكورات داخلية", text: "جدار داخلي بخامة دافئة وإضاءة موزعة بعناية؛ يمنح المساحة نقطة تركيز عملية." },
    { id: "work-3", image: "/staircase-detail_36a86d04_67116930.jpg", kicker: "دقة · حركة · ضوء", title: "سلالم وتفاصيل إنشائية", category: "تفصيل وألمنيوم", text: "تفاصيل إنشائية تُعامل كجزء من التصميم، لتبقى الحركة آمنة وواضحة." },
    { id: "work-4", image: "/reception_32a5bffe_05c6fa3b.jpg", kicker: "تصميم · تنفيذ · حضور", title: "استقبال ومساحات عمل", category: "ديكورات داخلية", text: "ترتيب استقبال يوجّه الحركة ويترك انطباعًا منظمًا منذ اللحظة الأولى." },
    { id: "work-5", image: "/glass-office_ff88266f_aac6aeb9.jpg", kicker: "ظل · أداء · واجهة", title: "واجهات وخامات معاصرة", category: "زجاج وواجهات", text: "تكوين خارجي يوضح كيف يمكن للخامة والظل أن يقدما واجهة هادئة ذات حضور." },
    { id: "work-6", image: "/built-in-lounge_7d8805b0_f1ed0f5e.jpg", kicker: "تفصيل · نجارة · دفء", title: "أعمال خشبية مخصصة", category: "تفصيل وألمنيوم", text: "تفصيل خشبي مخصص يضيف دفئًا وتنظيمًا إلى المكان." },
  ],
  services: [
    { no: "01", category: "زجاج وواجهات", image: "/glass-facade_1281cb63_3c523186.jpg", title: "أعمال الزجاج والسيكوريت", label: "شفافية محسوبة", text: "واجهات زجاجية، كبائن شاور، درابزينات وواجهات استركشر تُنفذ بمواصفات واضحة.", href: "/services/glass" },
    { no: "02", category: "ديكورات داخلية", image: "/mathabah-architectural-texture_423c537d_e9b373de.webp", title: "التصميم والديكور الداخلي", label: "تفاصيل تخصكم", text: "حلول داخلية للمنازل والمكاتب، من اختيار الخامة إلى تركيب التفاصيل.", href: "/services/interior-decor" },
    { no: "03", category: "تفصيل وألمنيوم", image: "/glass-office_ff88266f_aac6aeb9.jpg", title: "الألمنيوم والواجهات الخارجية", label: "أداء يدوم", text: "نوافذ وأبواب وتكسيات ألمنيوم وكلادينج تُصمم لأداء معماري متوازن.", href: "/services/aluminum" },
  ],
  servicePages: {},
};

const LOCAL_STORAGE_KEY = "mathabah_cms_cached_db_v1";

export function mergeWithDefaultSiteConfig(partial?: any) {
  if (!partial || typeof partial !== "object") return siteConfig;
  return {
    ...siteConfig,
    ...partial,
    branding: { ...siteConfig.branding, ...(partial.branding || {}) },
    hero: { ...siteConfig.hero, ...(partial.hero || {}) },
    marquee: { ...siteConfig.marquee, ...(partial.marquee || {}) },
    promotionalPopup: { ...siteConfig.promotionalPopup, ...(partial.promotionalPopup || {}) },
    contact: { ...siteConfig.contact, ...(partial.contact || {}) },
    socialLinks: {
      whatsapp: { ...siteConfig.socialLinks.whatsapp, ...(partial.socialLinks?.whatsapp || {}) },
      googleMaps: { ...siteConfig.socialLinks.googleMaps, ...(partial.socialLinks?.googleMaps || {}) },
      facebook: { ...siteConfig.socialLinks.facebook, ...(partial.socialLinks?.facebook || {}) },
      instagram: { ...siteConfig.socialLinks.instagram, ...(partial.socialLinks?.instagram || {}) },
      tiktok: { ...siteConfig.socialLinks.tiktok, ...(partial.socialLinks?.tiktok || {}) },
      snapchat: { ...siteConfig.socialLinks.snapchat, ...(partial.socialLinks?.snapchat || {}) },
    },
    gallery: Array.isArray(partial.gallery) && partial.gallery.length > 0 ? partial.gallery : siteConfig.gallery,
    services: Array.isArray(partial.services) && partial.services.length > 0 ? partial.services : siteConfig.services,
  };
}

export function getCachedSiteConfig() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return mergeWithDefaultSiteConfig(JSON.parse(raw));
  } catch {}
  return siteConfig;
}

export async function fetchSiteConfigFromDatabase() {
  try {
    const response = await fetch("/api/site-data", { method: "GET", cache: "no-store" });
    if (response.ok) {
      const json = await response.json();
      if (json && json.ok && json.data) {
        const merged = mergeWithDefaultSiteConfig(json.data);
        try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged)); } catch {}
        return { config: merged, hasCustomRemoteData: true };
      }
    }
  } catch {}
  return { config: getCachedSiteConfig(), hasCustomRemoteData: false };
}

export async function saveSiteConfigToDatabase(config: any, username: string, password: string) {
  try {
    const cleanWa = (config.contact?.whatsappNumber || "966565173798").replace(/[^0-9]/g, "");
    const normalized = {
      ...config,
      contact: { ...config.contact, whatsappNumber: cleanWa },
      galleryImages: (config.gallery || []).map((g: any) => g.image),
    };
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized)); } catch {}
    const response = await fetch("/api/site-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username || "admin", password, data: normalized }),
    });
    const json = await response.json();
    if (!response.ok || !json.ok) return { ok: false, error: json.error || "تعذر الحفظ" };
    const saved = mergeWithDefaultSiteConfig(json.data || normalized);
    window.dispatchEvent(new CustomEvent("mathabah-db-updated", { detail: saved }));
    return { ok: true, config: saved };
  } catch {
    return { ok: false, error: "تعذر الاتصال بالخادم" };
  }
}

export async function compressImageToDataUrl(file: File, maxWidth = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", quality));
      };
      img.onerror = () => reject(new Error("خطأ في الصورة"));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("خطأ في الملف"));
    reader.readAsDataURL(file);
  });
}
