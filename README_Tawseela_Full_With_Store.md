# توصيلة | نظام توصيل متكامل (مستخدم + سائق + متجر + إدارة)

نظام توصيل بسيط واحترافي مكوّن من 5 أجزاء مترابطة:

- ✅ **تطبيق موبايل للمستخدم** – React Native (Expo)
- ✅ **تطبيق موبايل للسائق** – React Native (Expo)
- ✅ **لوحة تحكم للإدارة** – Next.js
- ✅ **تطبيق ويب أو لوحة للمتاجر** – Next.js أو Mobile
- ✅ **Backend API مركزي** – Node.js + Express + MongoDB

---

## 🧩 البنية العامة للمشروع

```
/tawseela-backend         ← API المركزي (Node.js/Express)
/tawseela-user-app        ← تطبيق المستخدم (Expo)
/tawseela-driver-app      ← تطبيق السائق (Expo)
/tawseela-admin-panel     ← لوحة التحكم (Next.js)
/tawseela-store-panel     ← لوحة أو تطبيق المتجر
```

---

## 📦 قاعدة البيانات (MongoDB Models)

### `User`

- `name`, `phone`, `email`, `password`
- `location {lat, lng}`
- `orders: [ObjectId]`
- `ratings: [ObjectId]`

### `Driver`

- `name`, `vehicleType`, `phone`
- `location {lat, lng}`, `isOnline`
- `orders: [ObjectId]`, `ratings: [ObjectId]`

### `Store`

- `name`, `phone`, `email`, `password`
- `location {lat, lng, address}`
- `isVerified: Boolean`
- `orders: [ObjectId]`
- `createdAt: Date`

### `Order`

- `userId`, `driverId`, `storeId`
- `status` (pending, accepted, on_the_way, delivered)
- `pickupLocation`, `dropoffLocation`
- `price`, `paymentStatus`
- `createdAt`

### `Rating`

- `fromId`, `toId`, `type` ("user" or "driver")
- `score`, `comment`

---

## 🧪 REST API - مسارات موحدة لكل التطبيقات

### 🔐 المصادقة (Auth)

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | -----------------   |
| POST   | `/api/auth/register`        | تسجيل مستخدم       |
| POST   | `/api/auth/login`           | تسجيل دخول مستخدم |
| POST   | `/api/auth/driver/register` | تسجيل سائق         |
| POST   | `/api/auth/driver/login`    | دخول السائق        |
| POST   | `/api/auth/store/register`  | تسجيل متجر جديد    |
| POST   | `/api/auth/store/login`     | دخول المتجر        |

### 📦 الطلبات (Orders)

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ----------------------------   |
| GET    | `/api/orders`                  | استعراض الطلبات (حسب الدور)  |
| POST   | `/api/orders`                  | إنشاء طلب جديد                |
| PATCH  | `/api/orders/:id/status`       | تغيير حالة الطلب              |
| GET    | `/api/store/orders`            | طلبات المتجر                  |
| POST   | `/api/store/orders/:id/status` | تحديث حالة طلب من طرف المتجر |

### ✉️ أخرى

| Method | Endpoint                  | Description  |
| ------ | ------------------------- | -----------  |
| POST   | `/api/ratings`            | إرسال تقييم |
| POST   | `/api/notifications/send` | إرسال تنبيه |
| POST   | `/api/payments/initiate`  | بدء الدفع   |

> ⚠️ جميع المسارات محمية بـ JWT ويجب إرسال Header: `Authorization: Bearer <token>`

---

## 📲 التطبيقات

### ✅ User App

- تسجيل دخول وتسجيل حساب
- تحديد موقع على الخريطة
- إنشاء طلب جديد
- تتبع حالة الطلب
- دفع إلكتروني
- تقييم السائق

### ✅ Driver App

- تسجيل دخول
- استقبال الطلبات الجديدة
- قبول وبدء التوصيل
- تغيير الحالة (وصل – في الطريق – تم التوصيل)
- تقييم المستخدم

### ✅ Store Panel / App

- تسجيل حساب وتسجيل دخول
- إدارة الطلبات المرتبطة بالمتجر
- عرض الطلبات الواردة وتحديث حالتها
- تحديد موقع المتجر

### ✅ Admin Panel

- Dashboard للإحصائيات
- إدارة المستخدمين والسائقين والمتاجر
- عرض وتتبع الطلبات
- إرسال تنبيهات
- مراجعة التقييمات

---

## 🚀 التشغيل المحلي

```bash
# Backend API
cd tawseelah-backend
npm install
npm run dev

# User App
cd tawseela-user-app
npm install
npx expo start

# Driver App
cd tawseela-driver-app
npm install
npx expo start

# Admin Panel
cd tawseela-admin-panel
npm install
npm run dev

# Store Panel
cd tawseela-store-panel
npm install
npm run dev
```

---

## 🌍 دعم اللغة العربية

- استخدام `i18next` أو `expo-localization`
- RTL مفعل تلقائيًا عند اختيار العربية

---

## 🛡️ الأمان

- توثيق JWT
- تشفير كلمات السر بـ `bcrypt`
- اقتراح: توثيق API عبر Swagger

---

## 💳 الدفع الإلكتروني

- دعم Stripe أو Tap أو Paymob
- Webhook لتأكيد الدفع وتحديث حالة الطلب

---

## ✅ جاهز للتوسع

- طلبات من متاجر متعددة (multi-vendor)
- الدردشة الحية بين المستخدم والمتجر والسائق
- نظام العروض والخصومات
- اشتراكات مميزة للمتاجر أو السائقين
