// ==========================================
// لوحة التحكم المركزية - مؤسسة مثابة
// ==========================================

export const siteConfig = {
  // 1. شريط الإعلانات المتحرك
  marquee: {
    enabled: true,              // ضع false لإيقافه نهائياً، أو true لتشغيله
    startHour: 0,               // ساعة البدء (0 تعني 12 منتصف الليل)
    endHour: 24,                // ساعة الانتهاء (24 تعني يعمل طوال اليوم)
    speedSeconds: 12,           // سرعة الحركة بالثواني
    text: "أعمال الزجاج والسكريت | الألمنيوم والواجهات | النجارة والديكورات الخشبية المخصصة"
  },

  // 2. النافذة المنبثقة الترويجية (Popup Modal)
  promotionalPopup: {
    enabled: true,              // تشغيل النافذة المنبثقة أو إيقافها
    durationSeconds: 5,         // عدد ثواني ظهور الإعلان قبل أن يختفي تلقائياً
    title: "عرض خاص على الزجاج والنجارة والديكورات الخشبية",
    description: "اطلبوا عرضكم لأعمال الزجاج والسكريت، الألمنيوم، أو النجارة والديكورات الخشبية المخصصة.",
    buttonText: "تواصل معنا للاستفادة من العرض",
    startHour: 0,
    endHour: 24
  },

  // 3. أزرار التواصل والخريطة (التحكم بالظهور والروابط)
  socialLinks: {
    whatsapp: { show: true, url: "https://wa.me/966500000000" },
    googleMaps: { show: true, url: "https://maps.google.com" },
    facebook: { show: true, url: "https://facebook.com" },
    instagram: { show: true, url: "https://instagram.com" },
    tiktok: { show: true, url: "https://tiktok.com" },
    snapchat: { show: false, url: "https://snapchat.com" }
  },

  // 4. معرض الصور الأساسي (تغيير أو إضافة صور)
  galleryImages: [
    "/glass-facade_1281cb63_3c523186.jpg",
    "/mathabah-architectural-texture_423c537d_e9b4cb0e.jpg",
    "/staircase-detail_36a86d04_67116930.jpg",
    "/reception_32a5bffe_05c6fa3b.jpg",
    "/glass-office_ff88266f_aac6aeb9.jpg",
    "/built-in-lounge_7d8805b0_f1ed0f5e.jpg"
  ]
};
