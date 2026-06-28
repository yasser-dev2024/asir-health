# صيف وصحة - مساعد

منصة صحية سياحية ذكية لمنطقة عسير مبنية كتطبيق ويب تقدمي PWA، موجهة للجوال أولاً، وتحتوي على بوابتين منفصلتين:

- بوابة المستخدم: الرحلة الذكية، الخطة الصحية، الفعاليات، جواز صحة عسير، المواد الصحية، الدكتور مساعد، وميزة "أنا الآن".
- بوابة الإدارة: مؤشرات، إدارة الكلمات المفتاحية، إدارة الفعاليات، إدارة المحتوى التوعوي، إدارة نقاط الجواز، وتقارير QR.

## التشغيل

```bash
npm install
npm run dev
```

ثم افتح الرابط الذي يظهر في الطرفية.

## البناء للإنتاج

```bash
npm run build
npm run preview
```

## التشغيل عبر Docker

يبني Docker الواجهة باستخدام Node 20 Alpine ثم يشغل ملفات `dist` عبر Nginx على المنفذ `80` داخل الحاوية، مع فتح المنفذ `8080` على الجهاز.

```bash
docker compose up --build
```

ثم افتح:

```text
http://localhost:8080
```

لإيقاف الحاويات:

```bash
docker compose down
```

لإعادة البناء بعد أي تعديل:

```bash
docker compose up --build --force-recreate
```

## بيانات لوحة التحكم

المسار:

```text
/admin/login
```

في التشغيل المحلي أو نشر الخادم، اضبط بيانات الدخول عبر متغيرات البيئة:

```text
ADMIN_EMAIL
ADMIN_PASSWORD
JWT_SECRET
```

لا تستخدم بيانات افتراضية في الإنتاج. عند الحاجة لتجربة static demo فقط، فعّل `VITE_ENABLE_LOCAL_ADMIN_FALLBACK=true` واضبط `VITE_ADMIN_EMAIL` و`VITE_ADMIN_PASSWORD` في ملف `.env.local`.

## المسارات

- `/` الواجهة الرئيسية.
- `/journey` بداية الرحلة الصحية.
- `/plan` الخطة الصحية.
- `/events` الفعاليات.
- `/passport` جواز صحة عسير.
- `/downloads` المواد الصحية.
- `/assistant` الدكتور مساعد.
- `/nearby` أنا الآن.
- `/admin` لوحة التحكم.
- `/admin/login` تسجيل الدخول.

## البنية

```text
src/
  assets/
  components/
  data/
  hooks/
  layouts/
  pages/
  routes/
  services/
  store/
  types/
  utils/
```

## ملاحظات تقنية

- React + Vite + TypeScript.
- Tailwind CSS عبر إضافة Vite الرسمية.
- React Router للمسارات.
- Zustand للحالة مع LocalStorage.
- Manifest وService Worker ودعم Install Prompt.
- محرك الدكتور مساعد الحالي يعتمد على الكلمات المفتاحية من لوحة التحكم، والبنية جاهزة لإضافة مزود AI عبر `AssistantProvider`.
- جميع بيانات الإصدار الأول Mock وقابلة للتعديل من لوحة التحكم داخل المتصفح.
