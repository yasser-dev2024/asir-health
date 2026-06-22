# مراجعة أمنية ومعمارية للمشروع

تاريخ المراجعة: 2026-06-22

## 1. ملخص الوضع الحالي

المشروع تطبيق React/Vite/PWA يعمل حاليًا كتطبيق واجهة أمامية فقط. البيانات التشغيلية، إعدادات لوحة التحكم، إحصاءات QR، حالة الجواز، والسجلات تحفظ محليًا في `localStorage`، بينما أصبحت جلسة الأدمن بعد هذه المراجعة تحفظ مؤقتًا في `sessionStorage`.

الوضع مناسب كنموذج أولي أو نسخة عرض محدودة، لكنه غير كافٍ كحماية إنتاجية كاملة للوحة التحكم لأن أي مصادقة داخل Bundle الواجهة يمكن فحصها أو تجاوزها من المتصفح. لذلك تم تنفيذ إصلاحات صغيرة لا تغير تجربة المستخدم، مع توثيق ما يحتاج Backend في المرحلة القادمة.

## 2. الملفات التي تمت مراجعتها

- `package.json`
- `vite.config.ts`
- `index.html`
- `public/sw.js`
- `public/manifest.webmanifest`
- `src/routes/AppRoutes.tsx`
- `src/layouts/AdminLayout.tsx`
- `src/layouts/ClientLayout.tsx`
- `src/pages/admin/AdminLoginPage.tsx`
- `src/pages/admin/AdminDashboardPage.tsx`
- `src/pages/admin/QrLocationsAdminPage.tsx`
- `src/components/admin/DoctorAssistantAdminSection.tsx`
- `src/components/admin/SmartEntryAdminSection.tsx`
- `src/components/SmartHealthEntry.tsx`
- `src/hooks/useQrTracking.ts`
- `src/store/appStore.ts`
- `src/services/logger.ts`
- `src/services/qrAnalyticsService.ts`
- `src/services/qrLocationService.ts`
- `src/services/assistantService.ts`
- `src/utils/security.ts`
- `src/utils/privacy.ts`
- `src/utils/validation.ts`
- `src/data/mockData.ts`
- صفحات المستخدم: `HomePage`, `JourneyPage`, `PlanPage`, `EventsPage`, `DownloadsPage`, `NearbyPage`, `PassportPage`, `AssistantPage`

## 3. ملخص OWASP Top 10

| البند | الوضع الحالي | الخطورة | الإجراء |
|---|---|---:|---|
| Broken Access Control | لوحة الأدمن محمية بحالة Frontend فقط. | عالية | تم منع حفظ حالة الأدمن في `localStorage` وإضافة جلسة مؤقتة. يلزم Backend/RBAC قبل الإنتاج. |
| Cryptographic Failures | لا توجد بيانات شخصية حساسة ظاهرة، لكن كلمة مرور الأدمن داخل الواجهة ليست سرًا حقيقيًا. | عالية | تم تحسين عشوائية `visitorId`. يلزم نقل المصادقة إلى Backend مع Hashing. |
| Injection | React يهرب النصوص ولا يوجد `dangerouslySetInnerHTML`. | متوسطة | تم تشديد `sanitizeText`, `safeUrl`, و Zod validation. |
| Insecure Design | التصميم Frontend-only ولا يصلح وحده لصلاحيات حقيقية. | عالية | وثقت خطة Backend وتدرج الهجرة. |
| Security Misconfiguration | لا توجد Security Headers لأن النشر Static. | متوسطة | وثقت headers المقترحة، وشددت `APP_BASE_URL`. |
| Vulnerable Components | `npm audit` أعاد 0 ثغرات. | منخفضة | يلزم تشغيل audit دوريًا قبل كل نشر. |
| Auth Failures | كلمة مرور ثابتة داخل الواجهة، ولا يوجد Backend session. | عالية | تم حذف التعبئة الافتراضية، إضافة lockout محلي وجلسة 30 دقيقة. Backend مؤجل. |
| Software/Data Integrity | بيانات `localStorage` يمكن تعديلها من المستخدم. | متوسطة | تم تنظيف روابط وQR عند الحفظ والعرض. يلزم توقيع/تحقق Backend لاحقًا. |
| Logging/Monitoring | السجلات محلية فقط ولا توجد مراقبة مركزية. | متوسطة | تم منع تسجيل البريد عند فشل الدخول وجعل logging غير معطل للتطبيق. |
| SSRF | لا يوجد Backend يستدعي URLs من المستخدم. | منخفضة | تم تقييد Counter API و`APP_BASE_URL` وقيم QR. |

## 4. ما تم إصلاحه الآن

### حماية الأدمن

- إزالة التعبئة الافتراضية لحقول بريد وكلمة مرور الأدمن.
- منع حفظ `adminAuthenticated` في `localStorage`.
- إضافة جلسة أدمن مؤقتة في `sessionStorage` تنتهي بعد 30 دقيقة.
- تجاهل أي حالة أدمن قديمة محفوظة في `localStorage` أثناء دمج Zustand.
- إضافة حد محلي لمحاولات الدخول: 5 محاولات فاشلة ثم قفل 5 دقائق.
- منع تسجيل البريد المدخل عند فشل الدخول داخل السجل المحلي.

ملاحظة مهمة: هذه حماية واجهة فقط. لا تعد بديلًا عن مصادقة Backend.

### حماية المدخلات والروابط

- تشديد `sanitizeText` لإزالة محارف التحكم وأنماط XSS مثل `script`, `javascript:`, `vbscript:`, `data:`, وأحداث HTML.
- إضافة `safeUrl` موحدة لقبول الروابط الداخلية أو `https` فقط حسب السياق.
- إضافة Zod validation للروابط في:
  - الأسئلة والأجوبة.
  - الفعاليات وروابط الخرائط.
  - المحتوى وروابط الملفات.
  - أسئلة الدكتور مساعد.
  - مناطق QR.
- تقييد روابط الخرائط الخارجية إلى `https` فقط.
- تقييد روابط المحتوى إلى رابط داخلي أو `https`.
- تمرير روابط العرض من `DownloadsPage`, `EventsPage`, `NearbyPage`, و`SmartHealthEntry` عبر `safeUrl`.
- استخدام `rel="noopener noreferrer"` لكل رابط يفتح في تبويب جديد.

### حماية QR

- منع تسجيل QR عام بقيمة غير معروفة؛ القبول محصور في المصادر المعروفة:
  - `QR_AIRPORT`
  - `QR_WALKWAY`
  - `QR_EVENT`
  - `QR_BOOTH`
  - وأسماؤها المختصرة المعرفة في `privacy.ts`
- تم تعطيل نافذة منع التكرار مؤقتًا للتجربة، لذلك يتم احتساب كل مسح QR حتى من نفس الجوال.
- تنظيف slug مناطق QR وقصره على `a-z`, `0-9`, و`-`.
- عدم إرسال مزامنة العداد المركزي إلا إذا تم احتساب المسح محليًا.
- منع العداد المركزي من استخدام counter name فارغ بعد التنظيف.
- التحقق من أن QR المنطقة موجود ونشط قبل احتساب المسح.
- تحديث لاحق: QR الذي ينشئه الأدمن أصبح يضيف `qrName` ووسم `ql=1` داخل الرابط، ويحتسب من أي جهاز حتى لو لم تكن قائمة نقاط QR موجودة في `localStorage` لذلك الجهاز.
- تحديث لاحق: أي رابط نقطة أدمن مطبوع سابقًا بصيغة `?qr=slug` يمكن احتسابه مركزيًا كـ external QR location طالما أن `slug` لا يتعارض مع مصادر QR القديمة مثل `airport` أو `event`.
- تحديث لاحق: تم منع توليد slugs جديدة تتعارض مع أكواد QR القديمة مثل `airport`, `walkway`, `event`, و`booth`.
- تحديث لاحق: مصدر بيانات QR في لوحة التحكم أصبح يعتمد على `localStorage` المحفوظ كمصدر حاسم بعد أول تشغيل، ولا يتم دمج بيانات البداية تلقائيًا فوقه؛ هذا يمنع رجوع QR المحذوف بعد تحديث الصفحة أو إعادة فتح المتصفح.
- تحديث لاحق: تمت إضافة سجل مركزي مصغر لآخر مسحات QR باستخدام CounterAPI كقيم رقمية غير حساسة: رقم تسلسلي، وقت المسح، وبصمة visitor عشوائية مختصرة. يعرض الأدمن هذه السجلات في `QR Scan Log`.

### الخصوصية والسجلات

- لا يوجد استخدام لـ `navigator.geolocation`.
- لا يوجد جمع رقم جوال، هوية، IMEI، أو بصمة جهاز.
- `visitorId` عشوائي فقط، وتم تحسين توليده عبر Web Crypto عند توفره.
- `navigator.share` يشارك رابط الصفحة الحالي فقط ولا يحفظ موقعًا دقيقًا.
- السجلات المحلية أصبحت لا تكسر التطبيق عند امتلاء التخزين.

### النشر وBase URL

- تشديد `APP_BASE_URL`/`VITE_APP_BASE_URL`: يقبل `https` فقط، مع السماح بـ `http` محليًا لـ `localhost` و`127.0.0.1`.
- في حال ضبط Base URL غير آمن، يرجع التطبيق إلى أصل التطبيق الحالي بدل إنتاج QR لرابط غير آمن.

## 5. المخاطر المتبقية

| الخطر | الخطورة | السبب | التوصية |
|---|---:|---|---|
| مصادقة الأدمن Frontend-only | عالية جدًا | كلمة المرور والقواعد داخل Bundle ويمكن فحصها. | نقل المصادقة إلى Backend مع HttpOnly secure cookies وRBAC. |
| بيانات `localStorage` قابلة للتعديل | عالية | المستخدم يستطيع تغيير المحتوى والإحصاءات محليًا. | قاعدة بيانات Backend ومزامنة API مع تحقق صلاحيات. |
| سجلات ومراقبة غير مركزية | متوسطة | لا توجد Alerting أو Audit trail حقيقي. | إضافة جدول `AnalyticsEvents` و`AuditLogs`. |
| لا توجد Security Headers من التطبيق نفسه | متوسطة | تحتاج إعدادات استضافة. | ضبط headers على Netlify/Vercel/Nginx/Cloudflare. |
| خدمة CounterAPI خارجية | متوسطة | اعتماد طرف ثالث للإحصاءات. | نقل عد QR إلى Backend داخلي. |
| الصور كبيرة | متوسطة | عدة صور بين 1.3MB و2.8MB. | ضغط WebP/AVIF وresponsive images. |
| تعطيل QR لا ينتشر لكل الأجهزة بدون Backend | متوسطة | إذا تم تعطيل نقطة محليًا في جهاز الأدمن، الأجهزة الأخرى لا تملك سجلًا مركزيًا للحالة. | Backend لـ `QRLocations.active` قبل التشغيل الرسمي واسع النطاق. |

## 6. تقييم لوحة التحكم

المسارات الحالية:

- `/admin/login`
- `/admin`
- `/admin/qr-locations`

ما تحسن:

- المستخدم العادي لا يرى لوحة الأدمن من التنقل.
- مسار `/admin` يعيد إلى `/admin/login` عند عدم وجود جلسة صالحة.
- الجلسة لم تعد مخزنة دائمًا.
- يوجد انتهاء جلسة وفحص دوري.
- توجد مقاومة تخمين محلية محدودة.

ما يجب تنفيذه لاحقًا:

- Backend authentication.
- تخزين كلمات المرور باستخدام Argon2id أو bcrypt.
- حسابات أدمن منفصلة وصلاحيات Role-Based Access Control.
- Rate limiting من الخادم وليس المتصفح.
- Audit trail لتغييرات الأدمن.
- تدوير كلمات المرور وإلغاء الجلسات.

## 7. حماية النماذج

النماذج التي تمت مراجعتها:

- إضافة سؤال وجواب.
- إضافة محتوى توعوي.
- إضافة فعالية ورابط خريطة.
- إضافة وتعديل QR منطقة.
- إضافة وتعديل أسئلة الدكتور مساعد.
- إعدادات شاشة البداية الذكية.

المطبق الآن:

- أطوال قصوى للنصوص الحساسة.
- Whitelisting للروابط حسب السياق.
- رفض `javascript:`, `data:`, `vbscript:`.
- منع HTML tags الأساسية من النصوص.
- رسائل خطأ عبر Zod للنماذج الرئيسية.

المؤجل:

- فصل validation لكل إعدادات Smart Entry في Schemas مستقلة بدل الاكتفاء بتنظيفها في Store.
- رسائل تحقق تفصيلية لكل حقل داخل إعدادات Smart Entry.

## 8. حماية الروابط الخارجية

تمت مراجعة:

- خرائط Google في الفعاليات.
- خرائط Google في صفحة القريب.
- روابط المواد الصحية.
- روابط Smart Entry.

السياسة الحالية:

- الخرائط الخارجية: `https` فقط.
- الملفات: رابط داخلي أو `https`.
- التبويب الجديد: `rel="noopener noreferrer"`.
- الروابط غير الصالحة تتحول إلى `#` عند العرض ولا تمرر `javascript:` أو `data:`.

## 9. ملاحظات الخصوصية

لا يجمع المشروع حاليًا:

- رقم الجوال.
- الهوية.
- IMEI.
- بيانات جهاز حساسة.
- موقعًا جغرافيًا دقيقًا.

لا يوجد طلب إذن موقع جغرافي من المتصفح. إذا أضيفت ميزة الموقع لاحقًا، يجب:

- طلب إذن واضح قبل التشغيل.
- شرح الغرض للمستخدم.
- عدم حفظ الإحداثيات الدقيقة إلا عند ضرورة تشغيلية واضحة.
- تخزين موقع تقريبي أو منطقة بدل الإحداثيات متى أمكن.

## 10. التخزين وقابلية التوسع

### هل localStorage مناسب الآن؟

مناسب فقط للنسخة التجريبية أو التشغيل المحلي لأنه:

- محدود غالبًا بحوالي 5MB لكل origin حسب المتصفح.
- قابل للتعديل من المستخدم.
- لا يدعم صلاحيات أو تزامنًا موثوقًا بين الأجهزة.
- لا يصلح كسجل رسمي للإحصاءات أو المحتوى.

يمكن تخزين مؤقتًا:

- `visitorId` العشوائي.
- حالة splash/smart entry.
- تفضيلات بسيطة غير حساسة.
- Cache UI مؤقت.

لا يجب الاعتماد عليه إنتاجيًا في:

- صلاحيات الأدمن.
- المحتوى الرسمي.
- QR scans الرسمية.
- سجلات التدقيق.
- أي بيانات شخصية.

### متى يجب الانتقال إلى Backend؟

قبل أي نشر عام يعتمد على لوحة التحكم أو تقارير QR الحقيقية. الحد الأدنى:

- API للمحتوى.
- API لتسجيل QR scans.
- Auth للأدمن.
- قاعدة بيانات.
- Logging مركزي.

### الجداول المقترحة

#### Users

- `id`
- `display_name`
- `anonymous_visitor_id`
- `created_at`
- `last_seen_at`

#### Admins

- `id`
- `email`
- `password_hash`
- `role`
- `active`
- `last_login_at`
- `created_at`

#### QRLocations

- `id`
- `slug`
- `name`
- `description`
- `active`
- `created_by`
- `created_at`
- `updated_at`

#### QRScans

- `id`
- `qr_location_id`
- `qr_source`
- `visitor_id_hash`
- `route`
- `scanned_at`
- `user_agent_family` اختياري وغير دقيق

#### AssistantQuestions

- `id`
- `question`
- `answer`
- `keywords`
- `active`
- `sort_order`
- `updated_by`
- `updated_at`

#### HealthTips

- `id`
- `title`
- `summary`
- `content_url`
- `category_id`
- `active`
- `updated_at`

#### Categories

- `id`
- `name`
- `type`
- `active`

#### AnalyticsEvents

- `id`
- `event_name`
- `metadata_json`
- `visitor_id_hash`
- `created_at`

### خطة نقل البيانات بدون كسر المشروع

1. إنشاء API بنفس أسماء الكيانات الحالية قدر الإمكان.
2. إضافة Repository layer بين `appStore` والبيانات.
3. تحميل البيانات من Backend عند بدء التطبيق مع fallback للبيانات المحلية عند فشل الشبكة.
4. بناء Migration script يقرأ `saif-seha-musaed-store` من `localStorage` ويصدر JSON.
5. استيراد JSON إلى الجداول الجديدة.
6. جعل `localStorage` Cache فقط بعد نجاح المزامنة.
7. إيقاف حفظ صلاحيات أو محتوى رسمي محليًا.

## 11. الأداء

الملاحظات:

- حجم JavaScript بعد البناء: حوالي 485KB قبل gzip و141KB بعد gzip.
- توجد صور كبيرة:
  - `asir-home-feature.png`: حوالي 2.85MB
  - `asir-splash-view.png`: حوالي 2.85MB
  - `asir-heritage-splash.png`: حوالي 2.39MB
  - `asir-hero.png`: حوالي 2.23MB
  - `doctor.png`: حوالي 1.39MB
- لا يوجد تقسيم واضح للصفحات بـ lazy loading.
- PWA service worker يخزن أصول same-origin، وهذا جيد للاستخدام اللاحق لكنه يحتاج سياسة Cache مدروسة عند الإصدارات.

التوصيات:

- تحويل الصور الكبيرة إلى WebP/AVIF مع fallback.
- استخدام responsive images لأحجام الجوال.
- تطبيق `React.lazy`/route-level code splitting للوحة الأدمن والصفحات الأقل زيارة.
- تجنب تحميل لوحة الأدمن ضمن الحزمة الأساسية إن أمكن.
- مراجعة Cache version عند كل نشر.
- مراقبة Memory على أجهزة Android منخفضة المواصفات.

## 12. الجاهزية للنشر

### متغيرات البيئة

الموجود أو المدعوم:

- `APP_BASE_URL`
- `VITE_APP_BASE_URL`
- `APP_QR_COUNTER_NAMESPACE`
- `VITE_QR_COUNTER_NAMESPACE`
- `APP_ADMIN_EMAIL`
- `VITE_ADMIN_EMAIL`
- `APP_ADMIN_PASSWORD`
- `VITE_ADMIN_PASSWORD`

ملاحظة: أي متغير Vite/Frontend يظهر في bundle الإنتاج. لذلك لا تعتبر `APP_ADMIN_PASSWORD` أو `VITE_ADMIN_PASSWORD` سرًا حقيقيًا. هي فقط خطوة انتقالية حتى توفر Backend.

### Security Headers المقترحة

ينصح بضبطها في منصة الاستضافة:

```txt
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.counterapi.dev; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
Cross-Origin-Opener-Policy: same-origin
```

قبل تفعيل CSP يجب اختبار التطبيق لأن Tailwind/Vite قد يحتاجان ضبطًا حسب منصة النشر.

### قائمة ما قبل النشر

- تفعيل HTTPS إجباري.
- ضبط `APP_BASE_URL` على رابط الإنتاج HTTPS.
- تغيير namespace عداد QR للإنتاج.
- عدم الاعتماد على كلمة مرور Frontend للإنتاج.
- تشغيل `npm audit`.
- تشغيل `npm run lint`.
- تشغيل `npm run build`.
- اختبار `/admin/login`, `/admin`, `/admin/qr-locations`.
- اختبار QR معروف، QR منطقة نشطة، QR منطقة غير نشطة، وQR مجهول.
- تفريغ بيانات demo غير المرغوبة من المتصفح قبل العرض النهائي.

## 13. نتائج الفحص

تم تشغيل:

- `npm audit --json`: لا توجد ثغرات معروفة.
- `npm run lint`: نجح.
- `npm run build`: نجح.

## 14. الملفات التي تم تعديلها وسبب التعديل

| الملف | السبب |
|---|---|
| `src/utils/security.ts` | تشديد تنظيف النصوص والروابط وتوليد IDs عشوائية أقوى. |
| `src/utils/privacy.ts` | تحسين `visitorId` وإضافة قائمة بيضاء لمصادر QR المعروفة. |
| `src/utils/validation.ts` | إضافة تحقق Zod للروابط ونماذج الدكتور وQR. |
| `src/store/appStore.ts` | جلسة أدمن مؤقتة، منع حفظ الأدمن في `localStorage`, lockout محلي، تنظيف روابط، رفض QR مجهول. |
| `src/layouts/AdminLayout.tsx` | فحص انتهاء جلسة الأدمن دوريًا. |
| `src/pages/admin/AdminLoginPage.tsx` | إزالة بيانات الدخول الافتراضية وإظهار رسائل قفل المحاولات. |
| `src/pages/admin/QrLocationsAdminPage.tsx` | تطبيق validation على نموذج QR. |
| `src/components/admin/DoctorAssistantAdminSection.tsx` | تطبيق validation على نموذج الدكتور مساعد. |
| `src/hooks/useQrTracking.ts` | منع مزامنة QR غير المحتسب أو غير المعروف. |
| `src/services/qrAnalyticsService.ts` | منع إرسال counter name فارغ. |
| `src/services/qrLocationService.ts` | حماية `APP_BASE_URL` عند إنشاء روابط QR. |
| `src/services/logger.ts` | منع السجلات من تعطيل التطبيق عند فشل التخزين. |
| `src/pages/DownloadsPage.tsx` | حماية روابط الملفات وإضافة `noopener noreferrer`. |
| `src/pages/EventsPage.tsx` | حماية روابط الخرائط وإضافة `noopener noreferrer`. |
| `src/pages/NearbyPage.tsx` | حماية رابط الخريطة وإضافة `noopener noreferrer`. |
| `src/components/SmartHealthEntry.tsx` | تمرير الروابط عبر `safeUrl` قبل الانتقال. |

## 15. ما يجب تأجيله للمرحلة القادمة

- بناء Backend حقيقي للمصادقة والصلاحيات.
- نقل المحتوى والإحصاءات من `localStorage` إلى قاعدة بيانات.
- إضافة AuditLogs مركزية.
- حماية API بـ rate limiting وCSRF أو SameSite cookies.
- إضافة اختبارات وحدات للـ validation وQR tracking.
- ضغط الصور وتقسيم الحزمة.
- إعداد Security Headers على الاستضافة.

## 16. خلاصة

تم رفع مستوى الحماية بدون تغيير التصميم أو إضافة صفحات أو حذف ملفات. بقيت المخاطر الكبرى مرتبطة بطبيعة المشروع كواجهة أمامية فقط، وأهم قرار قبل الإنتاج هو نقل الأدمن وبيانات QR والمحتوى الرسمي إلى Backend آمن.
