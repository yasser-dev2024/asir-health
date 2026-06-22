import { z } from 'zod';
import { safeUrl } from './security';

const optionalSafeUrl = z
  .string()
  .trim()
  .max(250)
  .refine((value) => !value || Boolean(safeUrl(value)), 'الرابط يجب أن يكون داخليًا أو يبدأ بـ https فقط.');

const requiredSafeUrl = z
  .string()
  .trim()
  .min(1, 'أضف رابطًا صحيحًا.')
  .max(250)
  .refine((value) => Boolean(safeUrl(value)), 'الرابط يجب أن يكون داخليًا أو يبدأ بـ https فقط.');

const requiredHttpsUrl = z
  .string()
  .trim()
  .min(1, 'أضف رابط https صحيحًا.')
  .max(250)
  .refine(
    (value) => Boolean(safeUrl(value, { allowRelative: false, allowedProtocols: ['https:'] })),
    'الروابط الخارجية يجب أن تبدأ بـ https فقط.'
  );

export const keywordSchema = z.object({
  question: z.string().trim().min(3, 'اكتب عنواناً واضحاً للسؤال.').max(90),
  keywords: z.array(z.string().trim().min(2)).min(1, 'أضف كلمة مفتاحية واحدة على الأقل.'),
  answer: z.string().trim().min(12, 'الإجابة قصيرة جداً.').max(700),
  linkLabel: z.string().trim().max(40).default(''),
  linkUrl: optionalSafeUrl.default(''),
  imageUrl: optionalSafeUrl.default(''),
  ctaLabel: z.string().trim().max(40).default(''),
  ctaUrl: optionalSafeUrl.default(''),
});

export const eventSchema = z.object({
  title: z.string().trim().min(3, 'اكتب اسم الفعالية.').max(90),
  description: z.string().trim().min(12, 'اكتب وصفاً مناسباً للفعالية.').max(400),
  location: z.string().trim().min(3, 'حدد الموقع.').max(90),
  date: z.string().trim().min(8, 'حدد التاريخ.'),
  time: z.string().trim().min(3, 'حدد الوقت.').max(20),
  audience: z.string().trim().min(3, 'حدد الفئة المستهدفة.').max(70),
  category: z.string().trim().min(3, 'حدد الفئة.').max(50),
  mapUrl: requiredHttpsUrl,
});

export const contentSchema = z.object({
  title: z.string().trim().min(3, 'اكتب عنوان المادة.').max(90),
  type: z.enum(['post', 'card', 'pdf']),
  summary: z.string().trim().min(12, 'اكتب ملخصاً مناسباً.').max(420),
  category: z.string().trim().min(3, 'حدد التصنيف.').max(50),
  actionLabel: z.string().trim().min(3, 'اكتب اسم الزر.').max(40),
  fileUrl: requiredSafeUrl,
});

export const doctorAssistantSchema = z.object({
  question: z.string().trim().min(3, 'أضف سؤالًا واضحًا.').max(120),
  answer: z.string().trim().min(6, 'أضف إجابة واضحة.').max(900),
  keywords: z.array(z.string().trim().min(2).max(50)).min(1, 'أضف كلمة مفتاحية واحدة على الأقل.').max(20),
  active: z.boolean(),
  order: z.number().int().min(0).max(999),
});

export const qrLocationSchema = z.object({
  name: z.string().trim().min(2, 'أدخل اسم المنطقة أولًا.').max(80),
  description: z.string().trim().max(220),
  active: z.boolean(),
});

export function validationMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => issue.message).join(' ');
  }

  return 'تعذر حفظ البيانات. راجع المدخلات وحاول مرة أخرى.';
}
