# 餐廳訂位管理系統

基於 Spring Boot 開發的餐廳訂位管理系統，支援客戶管理、訂位管理和時段管理等 CRUD 操作。

## 功能特色

- 會員管理
- 會員可查看/刪除/修改訂位資訊 並以簡訊通知
- 訂位管理
- 時段管理
- 管理員後台
- 使用者認證

## 技術架構

- Spring Boot
- MySQL 資料庫
- RESTful API 架構

## 環境需求

- Java 8 或以上
- MySQL 5.7 或以上
- Maven

## 快速開始

### 安裝步驟

1. 下載專案
2. 在 `application.properties` 中配置 MySQL 資料庫設定
3. 執行 SQL 腳本建立所需資料表
4. 建置專案：`mvn clean install`
5. 在 IDE 中點選 `src/main/java/com` 資料夾下的 `BookingApplication.java` 執行專案
   - 或使用 Maven 命令運行：`mvn spring-boot:run`

應用程式將在 `http://localhost:8080` 運行

## API 文件

### 管理員相關 API (`/api/admin`)

#### 管理員功能
- `POST /api/admin/register` - 註冊管理員
- `POST /api/admin/login` - 管理員登入
- `GET /api/admin/list` - 查詢所有管理員
- `GET /api/admin/{id}` - 查詢單個管理員
- `PUT /api/admin/{id}` - 更新管理員資料
- `DELETE /api/admin/{id}` - 刪除管理員
- `PUT /api/admin/{adminId}/status` - 修改管理員帳號狀態

#### 會員管理
- `GET /api/admin/members/list` - 查看所有會員
- `GET /api/admin/members/{id}` - 查詢特定會員
- `DELETE /api/admin/members/{id}` - 刪除會員

#### 訂位管理
- `GET /api/admin/bookings` - 查看所有訂位
- `GET /api/admin/bookings/{bookingId}` - 查看單一訂位
- `DELETE /api/admin/bookings/{bookingId}` - 取消特定訂位

### 會員相關 API (`/api/member`)

- `POST /api/member/register` - 會員註冊
- `POST /api/member/login` - 會員登入
- `GET /api/member/profile/{memberId}` - 查看個人資料
- `PUT /api/member/profile/{memberId}` - 更新個人資料
- `PUT /api/member/password/{memberId}` - 更改密碼

### 訂位相關 API (`/api/bookings`)

- `POST /api/bookings` - 新增訂位
- `DELETE /api/bookings/{bookingId}` - 取消訂位(若狀態已完成/當天的訂位 無法取消)
- `GET /api/bookings/member/{memberId}` - 查看會員的訂位記錄
- `PUT /api/bookings/{bookingId}` - 修改訂位

### 時段管理 API (`/api/timeslot`)

- `GET /api/timeslot/list` - 獲取所有時段列表
- `POST /api/timeslot/add` - 新增時段
- `DELETE /api/timeslot/{id}` - 刪除時段
- `PUT /api/timeslot/{id}/status` - 啟用/停用時段
- `PUT /api/timeslot/{id}` - 修改時段

## 資料庫結構

### 會員資料表 (member)
```sql
CREATE TABLE member (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(12) NOT NULL,
    name VARCHAR(20) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO member (email, password, name, phone_number) VALUES 
('fang@example.com', 'pass1234', '方大同', '0912345678');

```

### 訂位資料表 (booking)
```sql
CREATE TABLE booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    time_slot_id INT NOT NULL,
    booking_date DATE NOT NULL,
    number_of_people INT NOT NULL,
    status TINYINT DEFAULT 0 NOT NULL COMMENT '0: 已確認, 1: 已完成, 2: 已刪除',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE,
    FOREIGN KEY (time_slot_id) REFERENCES time_slot(time_slot_id) ON DELETE CASCADE
);
```

### 時段資料表 (time_slot)
```sql
CREATE TABLE time_slot (
    time_slot_id INT AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INT NOT NULL,
    status TINYINT DEFAULT 0 NOT NULL COMMENT '0:啟用, 1:停用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO time_slot (start_time, end_time, max_capacity) VALUES 
('11:00:00', '11:30:00', 10),
('12:00:00', '12:30:00', 10),
('13:00:00', '13:30:00', 10),
('18:00:00', '18:30:00', 10),
('19:00:00', '19:30:00', 10);
```

### 管理員資料表 (admin)
```sql
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(20) NOT NULL,
    status TINYINT DEFAULT 0 NOT NULL COMMENT '0:啟用, 1:停用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO admin (email, password, status) VALUES 
('admin01@example.com', 'pass1234', 0);
