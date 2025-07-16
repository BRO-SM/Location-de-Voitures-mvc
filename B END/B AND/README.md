# Hotel Management System API

نظام إدارة الفنادق - واجهة برمجة التطبيقات

## المتطلبات

- Node.js (الإصدار 14 أو أحدث)
- MySQL Server
- npm أو yarn

## التثبيت

1. تثبيت المتطلبات:
```bash
npm install
```

2. إعداد قاعدة البيانات:
   - تشغيل MySQL Server
   - تنفيذ ملف `database/schema.sql` لإنشاء قاعدة البيانات والجداول

3. إعداد متغيرات البيئة:
   - نسخ ملف `.env` وتعديل إعدادات قاعدة البيانات حسب الحاجة

4. تشغيل الخادم:
```bash
npm start
```

## نقاط النهاية (API Endpoints)

### الضيوف (Guests)
- `GET /api/guests` - جلب جميع الضيوف
- `GET /api/guests/:id` - جلب ضيف محدد
- `POST /api/guests` - إضافة ضيف جديد
- `PUT /api/guests/:id` - تحديث بيانات ضيف
- `DELETE /api/guests/:id` - حذف ضيف

### الغرف (Rooms)
- `GET /api/rooms` - جلب جميع الغرف
- `GET /api/rooms/available` - جلب الغرف المتاحة
- `GET /api/rooms/:id` - جلب غرفة محددة
- `POST /api/rooms` - إضافة غرفة جديدة
- `PUT /api/rooms/:id` - تحديث بيانات غرفة
- `PATCH /api/rooms/:id/status` - تحديث حالة غرفة
- `DELETE /api/rooms/:id` - حذف غرفة

### الحجوزات (Reservations)
- `GET /api/reservations` - جلب جميع الحجوزات
- `GET /api/reservations/:id` - جلب حجز محدد
- `GET /api/reservations/guest/:guestId` - جلب حجوزات ضيف محدد
- `POST /api/reservations` - إضافة حجز جديد
- `PUT /api/reservations/:id` - تحديث بيانات حجز
- `PATCH /api/reservations/:id/status` - تحديث حالة حجز
- `DELETE /api/reservations/:id` - حذف حجز

## أمثلة على الاستخدام

### إضافة ضيف جديد
```json
POST /api/guests
{
  "full_name": "أحمد محمد",
  "phone": "+966501234567",
  "email": "ahmed@example.com",
  "passport_number": "A123456789",
  "nationality": "السعودية",
  "date_of_birth": "1990-01-15"
}
```

### إضافة غرفة جديدة
```json
POST /api/rooms
{
  "room_number": "101",
  "type": "Single",
  "price_per_night": 250.00,
  "status": "Available"
}
```

### إنشاء حجز جديد
```json
POST /api/reservations
{
  "guest_id": 1,
  "room_id": 1,
  "check_in_date": "2024-01-15",
  "check_out_date": "2024-01-20",
  "total_price": 1250.00,
  "status": "Confirmed"
}
```

## هيكل قاعدة البيانات

يحتوي النظام على الجداول التالية:
- **Guests**: بيانات الضيوف
- **Rooms**: بيانات الغرف
- **Reservations**: بيانات الحجوزات
- **Employees**: بيانات الموظفين
- **Services**: الخدمات المتاحة
- **Guest_Services**: خدمات الضيوف

## الحالات المدعومة

### حالات الغرف:
- Available (متاحة)
- Occupied (مشغولة)
- Maintenance (صيانة)

### حالات الحجوزات:
- Confirmed (مؤكدة)
- Cancelled (ملغية)
- Completed (مكتملة)