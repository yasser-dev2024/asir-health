# تقرير فحص الواجهة

## ملخص

تم فحص المستودع الحالي قبل تنفيذ أي تعديل كبير. النتيجة أن المشروع الحالي ليس Django SSR، بل React + Vite + TypeScript مع خادم Express. لذلك لم يتم إنشاء ملفات `templates/` أو `static/css/` الخاصة بـ Django داخل هذا المستودع.

## أدلة الفحص

- لا يوجد `manage.py` داخل المشروع الحالي.
- البحث في المجلد الأب القريب لم يجد `manage.py` أو `settings.py` أو `requirements.txt`.
- لا توجد مجلدات Django قياسية مثل `templates/` أو `static/`.
- يوجد `package.json` و`vite.config.ts` و`src/main.tsx`.
- المسارات تدار عبر React Router في `src/routes/AppRoutes.tsx`.
- الخادم الحالي Express في `server/`.

## بحث أوسع عن Django

تم البحث في `C:\Users\Test2\OneDrive\Desktop` عن مشاريع Django:

- تم العثور على مشروع Django في `C:\Users\Test2\OneDrive\Desktop\spoort`.
- يحتوي على `manage.py` و`config/settings.py` و`templates/` و`static/`.
- فحص سريع للمحتوى أظهر أنه مشروع رياضي/أكاديميات باسم مختلف، وليس منصة عسير الصحية الحالية.
- لم يتم تعديل مشروع `spoort` لأنه خارج مسار العمل الحالي ولا يظهر أنه المشروع المقصود لهوية تجمع عسير الصحي.

## مرجع الهوية والمتطلبات

تمت قراءة `123/yaser.md`. الملف يطلب تحويل النسخة الحالية إلى منصة "د. مساعد | مرشدك الصحي في صيف عسير" مع لوحة تحكم وقاعدة بيانات وQR وجواز صحي وهوية تجمع عسير الصحي.

ألوان الهوية المطلوبة:

- `#15508A`
- `#2FA9E0`
- `#1691D0`
- `#283A83`
- `#057590`
- `#A09EA9`
- `#FFFFFF`
- `#F4FAFC`

## ملاحظات على الحالة الحالية

- `src/index.css` يحتوي متغيرات هوية عسير الأساسية.
- توجد استخدامات كثيرة لألوان Tailwind غير رسمية مثل `teal` و`emerald` و`amber` و`green` و`orange`.
- `BrandLogo` موجود ويستخدم الشعارات من `assets/branding/logos/cropped/`.
- توجد صفحات ومكونات كبيرة تحتاج تقسيما تدريجيا:
  - `src/store/appStore.ts`
  - `src/pages/admin/AdminDashboardPage.tsx`
  - `src/pages/admin/QrLocationsAdminPage.tsx`
  - `src/index.css`
- توجد مخاطر أمنية يجب معالجتها قبل الإنتاج:
  - `server/auth.js` يحتوي `JWT_SECRET` وكلمة مرور افتراضية كـ fallback.
  - يوجد fallback credentials للواجهة في وضع التطوير.
  - الاعتماد على `localStorage` موجود في أجزاء من الحالة والتحليلات.

## القرار الحالي

لا يمكن تنفيذ خطة Django SSR حرفيا داخل هذا المسار بدون تغيير معماري غير صحيح، لأن ملفات Django غير موجودة. المسار الآمن هو أحد خيارين:

1. اعتماد هذا المستودع الحالي كمشروع React/Vite وتنفيذ إعادة تنظيم مناسبة له.
2. توفير مسار مشروع Django SSR الصحيح ثم تنفيذ خطة `templates/` و`static/` كما هي.
3. تأكيد صريح أن مشروع `spoort` هو المقصود، إذا كان هو الهدف رغم اختلاف المجال والاسم.

## الاختبارات

لم يتم تشغيل `python manage.py check` لأن `manage.py` غير موجود. عند اعتماد مسار React/Vite، يكون الاختبار المناسب:

- `npm run build`
- فحص الصفحات الأساسية على الجوال والكمبيوتر
- فحص النشر على GitHub Pages
- فحص أن الصفحات الداخلية لا تفشل عند التحديث
