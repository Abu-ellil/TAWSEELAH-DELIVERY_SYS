# هيكل تطبيق السائقين (Tawseela Driver App)

## 1. هيكل المجلدات والملفات

```
tawseela-driver-app/
├── assets/                  # الصور والأيقونات والخطوط
├── src/
│   ├── api/                 # واجهات برمجة التطبيقات والاتصال بالخادم
│   │   ├── auth.js          # وظائف المصادقة
│   │   ├── orders.js        # وظائف إدارة الطلبات
│   │   ├── driver.js        # وظائف خاصة بالسائق
│   │   ├── chat.js          # وظائف الدردشة
│   │   ├── ratings.js       # وظائف التقييمات
│   │   └── socket.js        # إعداد Socket.IO
│   ├── components/          # المكونات القابلة لإعادة الاستخدام
│   │   ├── common/          # مكونات عامة (أزرار، حقول إدخال، إلخ)
│   │   ├── orders/          # مكونات خاصة بالطلبات
│   │   ├── maps/            # مكونات الخرائط
│   │   └── chat/            # مكونات الدردشة
│   ├── contexts/            # سياقات React (إذا تم استخدام Context API)
│   ├── navigation/          # إعداد وتكوين التنقل
│   ├── redux/               # إدارة الحالة باستخدام Redux
│   │   ├── slices/          # شرائح Redux
│   │   └── store.js         # تكوين المتجر
│   ├── screens/             # شاشات التطبيق
│   │   ├── auth/            # شاشات المصادقة
│   │   ├── dashboard/       # الشاشة الرئيسية
│   │   ├── orders/          # شاشات الطلبات
│   │   ├── profile/         # شاشات الملف الشخصي
│   │   ├── chat/            # شاشات الدردشة
│   │   └── settings/        # شاشات الإعدادات
│   ├── services/            # خدمات مختلفة
│   │   ├── location.js      # خدمة تتبع الموقع
│   │   ├── notifications.js # خدمة الإشعارات
│   │   └── storage.js       # خدمة التخزين المحلي
│   ├── utils/               # وظائف مساعدة
│   │   ├── formatters.js    # تنسيق البيانات
│   │   ├── validators.js    # التحقق من صحة البيانات
│   │   └── helpers.js       # وظائف مساعدة أخرى
│   ├── constants/           # ثوابت التطبيق
│   │   ├── colors.js        # ألوان التطبيق
│   │   ├── config.js        # إعدادات التطبيق
│   │   └── api.js           # ثوابت API
│   ├── hooks/               # خطافات React المخصصة
│   └── App.js               # نقطة الدخول الرئيسية
├── app.json                 # إعدادات Expo
└── package.json             # تبعيات المشروع
```

## 2. شاشات التطبيق الرئيسية

### أ. شاشات المصادقة (Auth Screens)
- `LoginScreen.js` - شاشة تسجيل الدخول
- `RegisterScreen.js` - شاشة إنشاء حساب سائق جديد
- `ForgotPasswordScreen.js` - شاشة استعادة كلمة المرور
- `OTPVerificationScreen.js` - شاشة التحقق من رمز OTP

### ب. الشاشة الرئيسية (Dashboard Screens)
- `HomeScreen.js` - الشاشة الرئيسية مع ملخص الإحصائيات
- `StatusToggleScreen.js` - شاشة تغيير حالة السائق

### ج. شاشات الطلبات (Order Screens)
- `NewOrderScreen.js` - شاشة عرض تفاصيل الطلب الجديد
- `CurrentOrderScreen.js` - شاشة تفاصيل الطلب الحالي
- `OrderHistoryScreen.js` - شاشة سجل الطلبات السابقة
- `OrderDetailsScreen.js` - شاشة تفاصيل طلب محدد

### د. شاشات الدردشة (Chat Screens)
- `ChatListScreen.js` - قائمة المحادثات
- `ChatScreen.js` - شاشة المحادثة مع العميل

### هـ. شاشات الملف الشخصي (Profile Screens)
- `ProfileScreen.js` - عرض وتعديل الملف الشخصي
- `RatingsScreen.js` - عرض التقييمات
- `StatisticsScreen.js` - عرض إحصائيات مفصلة

### و. شاشات الإعدادات (Settings Screens)
- `SettingsScreen.js` - الإعدادات العامة
- `ChangePasswordScreen.js` - تغيير كلمة المرور
- `NotificationSettingsScreen.js` - إعدادات الإشعارات
- `LanguageScreen.js` - تغيير لغة التطبيق

## 3. المكونات الرئيسية (Components)

### أ. مكونات عامة (Common Components)
- `Button.js` - زر مخصص
- `Input.js` - حقل إدخال مخصص
- `Card.js` - بطاقة معلومات
- `Loading.js` - مؤشر التحميل
- `ErrorMessage.js` - عرض رسائل الخطأ
- `Header.js` - رأس الشاشة

### ب. مكونات الطلبات (Order Components)
- `OrderCard.js` - بطاقة عرض ملخص الطلب
- `OrderStatusBadge.js` - شارة حالة الطلب
- `OrderTimeline.js` - خط زمني لمراحل الطلب
- `CustomerInfo.js` - معلومات العميل

### ج. مكونات الخرائط (Map Components)
- `MapView.js` - عرض الخريطة
- `RouteView.js` - عرض المسار
- `LocationMarker.js` - علامة الموقع
- `DistanceInfo.js` - معلومات المسافة والوقت

### د. مكونات الدردشة (Chat Components)
- `ChatBubble.js` - فقاعة الرسالة
- `MessageInput.js` - حقل إدخال الرسالة
- `ChatHeader.js` - رأس شاشة الدردشة

## 4. واجهات برمجة التطبيقات (APIs)

### أ. المصادقة (auth.js)
- `register(userData)` - تسجيل سائق جديد
- `login(credentials)` - تسجيل دخول
- `forgotPassword(email)` - طلب استعادة كلمة المرور
- `resetPassword(token, newPassword)` - إعادة تعيين كلمة المرور
- `updatePassword(oldPassword, newPassword)` - تحديث كلمة المرور

### ب. الطلبات (orders.js)
- `getOrders(status)` - الحصول على قائمة الطلبات
- `getOrderDetails(orderId)` - الحصول على تفاصيل طلب محدد
- `updateOrderStatus(orderId, status)` - تحديث حالة الطلب
- `getCurrentOrder()` - الحصول على الطلب الحالي
- `acceptOrder(orderId)` - قبول طلب جديد
- `rejectOrder(orderId, reason)` - رفض طلب

### ج. السائق (driver.js)
- `updateStatus(status)` - تحديث حالة السائق
- `updateLocation(location)` - تحديث موقع السائق
- `getStatistics(period)` - الحصول على إحصائيات السائق
- `updateProfile(profileData)` - تحديث بيانات الملف الشخصي

### د. الدردشة (chat.js)
- `getMessages(orderId)` - الحصول على رسائل طلب محدد
- `sendMessage(orderId, message)` - إرسال رسالة
- `getUnreadCount()` - الحصول على عدد الرسائل غير المقروءة
- `markAsRead(messageId)` - تحديد رسالة كمقروءة

### هـ. التقييمات (ratings.js)
- `getRatings()` - الحصول على التقييمات الخاصة بالسائق
- `rateCustomer(orderId, rating, comment)` - تقييم العميل

## 5. المكتبات المقترحة

- **إطار العمل**: React Native مع Expo
- **إدارة الحالة**: Redux Toolkit
- **التنقل**: React Navigation v6
- **الشبكة**: Axios
- **الخرائط**: React Native Maps
- **الموقع**: Expo Location
- **الدردشة**: Socket.IO Client
- **التخزين المحلي**: Expo SecureStore
- **الإشعارات**: Expo Notifications
- **واجهة المستخدم**: React Native Paper
- **الأيقونات**: React Native Vector Icons
- **التواريخ**: Moment.js أو date-fns
- **الترجمة**: i18next

## 6. خطة التنفيذ

### المرحلة 1: الإعداد والهيكلة
- إنشاء مشروع Expo جديد
- إعداد هيكل المجلدات والملفات
- تثبيت المكتبات الأساسية
- إعداد نظام التنقل بين الشاشات

### المرحلة 2: المصادقة وإدارة الحساب
- تنفيذ شاشات تسجيل الدخول والتسجيل
- إعداد نظام إدارة الرموز المميزة (JWT)
- تنفيذ شاشة الملف الشخصي والإعدادات

### المرحلة 3: الشاشة الرئيسية وإدارة الحالة
- تنفيذ الشاشة الرئيسية مع لوحة المعلومات
- إعداد نظام تتبع حالة السائق
- تنفيذ عرض الإحصائيات الأساسية

### المرحلة 4: إدارة الطلبات
- تنفيذ شاشة عرض الطلبات الجديدة
- تنفيذ شاشة تفاصيل الطلب الحالي
- تنفيذ نظام تحديث حالة الطلب

### المرحلة 5: الخرائط وتتبع الموقع
- إعداد نظام تتبع الموقع في الخلفية
- تنفيذ عرض الخرائط والمسارات
- تنفيذ نظام تحديث الموقع على الخادم

### المرحلة 6: الدردشة والإشعارات
- تنفيذ نظام الدردشة في الوقت الحقيقي
- إعداد نظام الإشعارات
- تنفيذ شاشة الدردشة

### المرحلة 7: التقييمات وسجل الطلبات
- تنفيذ نظام التقييمات
- تنفيذ شاشة سجل الطلبات
- إضافة إمكانية تقييم العملاء

### المرحلة 8: الاختبار والتحسين
- اختبار جميع وظائف التطبيق
- تحسين الأداء والاستجابة
- معالجة الأخطاء والمشكلات
