### BookingSystem

### 專案簡介

使用pring Boot開發的訂位管理系統，支援 **CRUD** 操作，包含 客戶管理、訂位管理、座位時段管理

## API 說明

### 1. 客戶管理

- **註冊客戶** `POST /members`
- **修改客戶資料** `PUT /memmers/{id}`
- **查詢客戶資料** `GET /memmers/{id}`

### 2. 訂位管理

- **新增訂位** `POST /bookings`
- **修改訂位** `PUT /booking/{id}`
- **取消訂位** `DELETE /booking/{id}`
- **查詢訂位** `GET /booking/{id}`

### 3. 時段表

- **新增空時段** `POST /timeslots`
- **修改時段狀態** `PUT /timeslots/{id}`

### 4. 管理員管理

- **新增管理員** `POST /admins`
- **查詢管理員** `GET /admins/{id}`
- 5. SQL 資料庫
- 一個會員可以有多筆預約
一個時段可以包含多筆預約

預約狀態(status)：0-待確認、1-已確認、2-已取消

member (會員表) 註冊、新增查詢修改刪除訂位

```
member_id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(12) NOT NULL,
name VARCHAR(20) NOT NULL,
phone_number VARCHAR(10) NOT NULL,
create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL

```

booking (訂位表) 連結 會員與時間表

```
booking_id INT AUTO_INCREMENT PRIMARY KEY,
member_id INT NOT NULL,
time_slot_id INT NOT NULL,
booking_date DATE NOT NULL,
status TINYINT DEFAULT 0 NOT NULL COMMENT '0: Pending, 1: Confirmed, 2: Canceled',
create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE,
FOREIGN KEY (time_slot_id) REFERENCES time_slot(time_slot_id) ON DELETE CASCADE

```

time_slot (時間表) 記錄空位狀況，是否可訂位

```
time_slot_id INT AUTO_INCREMENT PRIMARY KEY,
start_time DATETIME NOT NULL,
end_time DATETIME NOT NULL,
max_capacity INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

```

admin (管理員) 查看訂單
admin_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL,
name VARCHAR(20) NOT NULL,
role VARCHAR(20) DEFAULT 'ADMIN' NOT NULL,
create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
