# 📊 Hướng dẫn chi tiết cấu hình Google Analytics 4 cho Admin Dashboard

## Mục lục
1. [Tạo Google Analytics 4 Property](#1-tạo-google-analytics-4-property)
2. [Lấy Property ID](#2-lấy-property-id)
3. [Tạo Service Account](#3-tạo-service-account)
4. [Cấp quyền cho Service Account](#4-cấp-quyền-cho-service-account)
5. [Cấu hình Environment Variables](#5-cấu-hình-environment-variables)
6. [Kiểm tra và xác nhận](#6-kiểm-tra-và-xác-nhận)

---

## 1. Tạo Google Analytics 4 Property

### Bước 1.1: Truy cập Google Analytics
1. Mở trình duyệt, truy cập: **https://analytics.google.com**
2. Đăng nhập bằng tài khoản Google của bạn

### Bước 1.2: Tạo Property mới
1. Click vào **Admin** (biểu tượng bánh răng ⚙️) ở góc dưới bên trái
2. Trong cột **Property**, click **+ Create Property**
3. Điền thông tin:
   - **Property name**: `New Atlantic Website`
   - **Reporting time zone**: `Vietnam (GMT+7)`
   - **Currency**: `Vietnamese Dong (VND)`
4. Click **Next**
5. Chọn ngành nghề: **Business & Industrial** hoặc **Other**
6. Chọn Business size
7. Click **Create**

### Bước 1.3: Thiết lập Data Stream
1. Chọn **Web**
2. Nhập:
   - **Website URL**: `https://newatlantic.vn`
   - **Stream name**: `New Atlantic Web`
3. Click **Create stream**
4. **Quan trọng**: Sao chép **Measurement ID** (dạng `G-XXXXXXXXXX`)

```
📝 GHI LẠI:
Measurement ID: G-_______________
```

---

## 2. Lấy Property ID

### Bước 2.1: Tìm Property ID
1. Trong Google Analytics, click **Admin** (⚙️)
2. Trong cột **Property**, click **Property Settings**
3. Ở phần **Property details**, tìm và copy **Property ID** (chỉ là số, ví dụ: `405123456`)

```
📝 GHI LẠI:
Property ID: _______________
```

⚠️ **Lưu ý**: Property ID là SỐ (ví dụ: `405123456`), KHÔNG phải Measurement ID (`G-XXXXXXXX`)

---

## 3. Tạo Service Account

### Bước 3.1: Truy cập Google Cloud Console
1. Mở tab mới, truy cập: **https://console.cloud.google.com**
2. Đăng nhập cùng tài khoản Google đã dùng ở GA4

### Bước 3.2: Tạo hoặc chọn Project
1. Click vào tên project ở thanh trên cùng (hoặc "Select a project")
2. Click **NEW PROJECT**
3. Điền:
   - **Project name**: `New Atlantic Analytics`
   - **Organization**: để trống nếu không có
4. Click **Create**
5. Đợi 10-20 giây, sau đó chọn project vừa tạo

### Bước 3.3: Bật Google Analytics API
1. Trong menu bên trái, chọn **APIs & Services** → **Library**
2. Tìm kiếm: `Google Analytics Data API`
3. Click vào **Google Analytics Data API**
4. Click **ENABLE**

### Bước 3.4: Tạo Service Account
1. Trong menu bên trái, chọn **IAM & Admin** → **Service Accounts**
2. Click **+ CREATE SERVICE ACCOUNT**
3. Điền thông tin:
   - **Service account name**: `analytics-reader`
   - **Service account ID**: tự động tạo (ví dụ: `analytics-reader@project.iam.gserviceaccount.com`)
   - **Description**: `Read Google Analytics data`
4. Click **CREATE AND CONTINUE**
5. Ở phần **Grant this service account access to project**:
   - Bỏ qua (không cần chọn role)
6. Click **CONTINUE**
7. Click **DONE**

### Bước 3.5: Tạo JSON Key
1. Trong danh sách Service Accounts, click vào service account vừa tạo
2. Chọn tab **KEYS**
3. Click **ADD KEY** → **Create new key**
4. Chọn **JSON**
5. Click **CREATE**
6. File JSON sẽ tự động download về máy

```
📝 GHI LẠI:
Service Account Email: _______________@_______________.iam.gserviceaccount.com
File JSON đã download: _______________
```

---

## 4. Cấp quyền cho Service Account

### Bước 4.1: Quay lại Google Analytics
1. Truy cập lại **https://analytics.google.com**
2. Click **Admin** (⚙️)

### Bước 4.2: Thêm User Access
1. Trong cột **Property**, click **Property Access Management**
2. Click **+** (Add users)
3. Nhập **Email address**: paste email của service account 
   (ví dụ: `analytics-reader@project-name.iam.gserviceaccount.com`)
4. Chọn quyền: ✅ **Viewer**
5. Click **Add**

⚠️ **Lưu ý**: Đảm bảo đã copy đúng email của service account từ Google Cloud Console

---

## 5. Cấu hình Environment Variables

### Bước 5.1: Mở file .env.local
Mở file `.env.local` trong thư mục project (nếu chưa có, tạo mới)

### Bước 5.2: Thêm các biến môi trường

```env
# ========== GOOGLE ANALYTICS 4 ==========

# Property ID (chỉ là số, KHÔNG có "G-")
GA4_PROPERTY_ID=405123456

# Measurement ID (có "G-" ở đầu) - để tracking frontend
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Credentials JSON (copy NỘI DUNG file JSON, nén thành 1 dòng)
GOOGLE_ANALYTICS_CREDENTIALS='{"type":"service_account","project_id":"new-atlantic-analytics","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n","client_email":"analytics-reader@new-atlantic-analytics.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/analytics-reader%40new-atlantic-analytics.iam.gserviceaccount.com"}'
```

### Bước 5.3: Cách nén file JSON thành 1 dòng

**Cách 1: Dùng công cụ online**
1. Mở file JSON đã download bằng Notepad
2. Copy toàn bộ nội dung
3. Truy cập: https://jsoncompressor.com/
4. Paste nội dung → Click **Compress**
5. Copy kết quả và paste vào `GOOGLE_ANALYTICS_CREDENTIALS`

**Cách 2: Dùng PowerShell**
```powershell
# Chạy lệnh này (thay đường dẫn file)
(Get-Content "C:\Users\ADMIN\Downloads\service-account-key.json" -Raw) -replace '\s+', ' '
```

**Cách 3: Dùng Node.js**
```javascript
const fs = require('fs');
const key = JSON.parse(fs.readFileSync('service-account-key.json'));
console.log(JSON.stringify(key));
```

---

## 6. Kiểm tra và xác nhận

### Bước 6.1: Restart Development Server
```bash
# Dừng server (Ctrl+C)
# Chạy lại
npm run dev
```

### Bước 6.2: Kiểm tra trong Admin
1. Truy cập: http://localhost:3000/admin
2. Đăng nhập
3. Vào tab **Thống kê lưu lượng** hoặc **Dashboard**
4. Kiểm tra:
   - ✅ Nếu thấy **"Đã kết nối Google Analytics 4"** → Thành công!
   - ⚠️ Nếu thấy **"Đang hiển thị dữ liệu mô phỏng"** → Có lỗi, xem console

### Bước 6.3: Debug nếu có lỗi
Mở Developer Tools (F12) → Console để xem lỗi chi tiết

**Các lỗi thường gặp:**

| Lỗi | Nguyên nhân | Cách fix |
|-----|-------------|----------|
| `Invalid credentials` | JSON không đúng định dạng | Kiểm tra lại quotes và escape |
| `Permission denied` | Service account chưa có quyền | Thêm user trong GA4 Property Access |
| `Property not found` | Property ID sai | Kiểm tra lại Property ID (chỉ số) |
| `API not enabled` | Chưa bật API | Vào Google Cloud → Enable Google Analytics Data API |

---

## 📋 Checklist tổng kết

- [ ] Tạo GA4 Property
- [ ] Lấy được **Property ID** (số)
- [ ] Lấy được **Measurement ID** (G-XXXXXXXX)
- [ ] Tạo Google Cloud Project
- [ ] Bật **Google Analytics Data API**
- [ ] Tạo Service Account
- [ ] Download file JSON key
- [ ] Thêm Service Account vào GA4 với quyền **Viewer**
- [ ] Thêm `GA4_PROPERTY_ID` vào .env.local
- [ ] Thêm `NEXT_PUBLIC_GA_MEASUREMENT_ID` vào .env.local
- [ ] Thêm `GOOGLE_ANALYTICS_CREDENTIALS` vào .env.local
- [ ] Restart server
- [ ] Xác nhận dashboard hiển thị dữ liệu thực

---

## ❓ Cần hỗ trợ?

Nếu gặp vấn đề, hãy cung cấp:
1. Screenshot lỗi (nếu có)
2. Nội dung console log
3. Các giá trị đã cấu hình (ẩn private_key)

---

*Tài liệu này được tạo tự động bởi Antigravity AI*
