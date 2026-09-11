# نسخة مثابة المحلية

هذه الحزمة تحافظ على التصميم الحالي وتعمل محليًا مع أصول الصور المضمنة.

## التشغيل في محرر محلي

```bash
pnpm install
python3 tools/prepare_local_assets.py
cp .env.example .env.local
python3 tools/verify_local_package.py
pnpm dev
```

للبناء:

```bash
pnpm check
pnpm build
```

يتضمن مجلد `tools/` سكربتات Python لتجهيز الأصول المحلية والتحقق من عدم وجود ملفات ناقصة قبل التشغيل.

## ما تم تضمينه

- Google Tag Manager بالمعرّف `GTM-56LSHDSS` عبر `client/public/gtm-loader.js`، مع نسخة `noscript` في HTML.
- سياسة Content Security Policy وملف `_headers` لرؤوس الحماية.
- زر الرجوع يغلق Lightbox وينظف حالة التاريخ، وEscape والخلفية وزر X تغلق النوافذ دون تجميد الصفحة.
- إعداد `VITE_ASSET_BASE` يسمح بتشغيل الصور محليًا من `/assets/` أو على Manus من `/manus-storage/`.
- لا توجد أرقام أو بيانات أداء غير موثقة في المحتوى.
