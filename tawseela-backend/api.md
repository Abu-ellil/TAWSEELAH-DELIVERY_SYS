# توصيلة | واجهة برمجة التطبيقات (API) - tawseelah-backend

هذا المستند يوضح جميع نقاط النهاية (endpoints) المتاحة في واجهة برمجة التطبيقات الخاصة بنظام توصيلة.

## 🔐 المصادقة (Auth)

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| POST   | `/api/auth/register`        | تسجيل مستخدم      |
| POST   | `/api/auth/login`           | تسجيل دخول مستخدم |
| POST   | `/api/auth/driver/register` | تسجيل سائق        |
| POST   | `/api/auth/driver/login`    | دخول السائق       |
| POST   | `/api/auth/store/register`  | تسجيل متجر جديد   |
| POST   | `/api/auth/store/login`     | دخول المتجر       |

## 📦 الطلبات (Orders)

| Method | Endpoint                       | Description                  |
| ------ | ------------------------------ | ---------------------------- |
| GET    | `/api/orders`                  | استعراض الطلبات (حسب الدور)  |
| POST   | `/api/orders`                  | إنشاء طلب جديد               |
| PATCH  | `/api/orders/:id/status`       | تغيير حالة الطلب             |
| GET    | `/api/store/orders`            | طلبات المتجر                 |
| POST   | `/api/store/orders/:id/status` | تحديث حالة طلب من طرف المتجر |

## ⭐ التقييمات (Ratings)

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| POST   | `/api/ratings`            | إرسال تقييم               |
| GET    | `/api/ratings/my-ratings` | الحصول على تقييماتي       |
| GET    | `/api/ratings/:userId`    | الحصول على تقييمات مستخدم |
| PATCH  | `/api/ratings/:id`        | تحديث تقييم               |
| DELETE | `/api/ratings/:id`        | حذف تقييم                 |

## 👤 المستخدمين (Users)

| Method | Endpoint                         | Description                |
| ------ | -------------------------------- | -------------------------- |
| GET    | `/api/users/profile`             | الحصول على الملف الشخصي    |
| PATCH  | `/api/users/profile`             | تحديث الملف الشخصي         |
| POST   | `/api/users/addresses`           | إضافة عنوان                |
| PATCH  | `/api/users/addresses/:id`       | تحديث عنوان                |
| DELETE | `/api/users/addresses/:id`       | حذف عنوان                  |
| GET    | `/api/users/favorite-stores`     | الحصول على المتاجر المفضلة |
| POST   | `/api/users/favorite-stores/:id` | إضافة متجر إلى المفضلة     |
| DELETE | `/api/users/favorite-stores/:id` | إزالة متجر من المفضلة      |

## 🏪 المتاجر (Stores)

| Method | Endpoint                       | Description                |
| ------ | ------------------------------ | -------------------------- |
| GET    | `/api/stores`                  | الحصول على جميع المتاجر    |
| GET    | `/api/stores/:id`              | الحصول على متجر محدد       |
| POST   | `/api/stores`                  | إنشاء متجر جديد            |
| PATCH  | `/api/stores/:id`              | تحديث متجر                 |
| DELETE | `/api/stores/:id`              | حذف متجر                   |
| GET    | `/api/stores/:id/products`     | الحصول على منتجات متجر     |
| GET    | `/api/stores/nearby/:lat/:lng` | الحصول على المتاجر القريبة |

## 🚗 السائقين (Drivers)

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| PATCH  | `/api/drivers/status`        | تحديث حالة السائق              |
| PATCH  | `/api/drivers/location`      | تحديث موقع السائق              |
| GET    | `/api/drivers/current-order` | الحصول على الطلب الحالي للسائق |
| GET    | `/api/drivers/statistics`    | الحصول على إحصائيات السائق     |
| GET    | `/api/drivers/nearby`        | الحصول على السائقين القريبين   |

## 🏷️ العروض (Promotions)

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/promotions`          | الحصول على جميع العروض      |
| GET    | `/api/promotions/:id`      | الحصول على عرض محدد         |
| POST   | `/api/promotions`          | إنشاء عرض جديد              |
| PATCH  | `/api/promotions/:id`      | تحديث عرض                   |
| DELETE | `/api/promotions/:id`      | حذف عرض                     |
| POST   | `/api/promotions/validate` | التحقق من صلاحية رمز ترويجي |

## 💳 المدفوعات (Payments)

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| POST   | `/api/payments/initiate`        | بدء الدفع             |
| GET    | `/api/payments/status/:orderId` | الحصول على حالة الدفع |
| POST   | `/api/payments/webhook`         | معالجة إشعارات الدفع  |

## 💬 الدردشة (Chat)

| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/api/chat/messages`          | إرسال رسالة                     |
| GET    | `/api/chat/messages/:orderId` | الحصول على رسائل طلب            |
| GET    | `/api/chat/messages/unread`   | الحصول على الرسائل غير المقروءة |
| PATCH  | `/api/chat/messages/:id/read` | تحديد رسالة كمقروءة             |

## ✉️ أخرى

| Method | Endpoint                  | Description |
| ------ | ------------------------- | ----------- |
| POST   | `/api/notifications/send` | إرسال تنبيه |

> ⚠️ جميع المسارات محمية بـ JWT ويجب إرسال Header: `Authorization: Bearer <token>`

## Socket.IO Events

### الأحداث المرسلة من الخادم

- `new-order` - طلب جديد
- `order-status-updated` - تحديث حالة الطلب
- `store-order-status-updated` - تحديث حالة طلب متجر
- `driver-assigned` - تعيين سائق
- `driver-location-updated` - تحديث موقع السائق
- `new-message` - رسالة جديدة
- `new-rating` - تقييم جديد

### الأحداث المرسلة من العميل

- `update-location` - تحديث موقع السائق
- `read-message` - قراءة رسالة
