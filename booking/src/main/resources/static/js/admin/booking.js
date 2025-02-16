// 訂位管理器
const BookingManager = {
    // API 封裝
    api: {
        baseURL: '/api/admin/bookings',

        // 獲取所有訂位
        getAllBookings: async function() {
            try {
                const response = await fetch(this.baseURL);
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                return await response.json();
            } catch (error) {
                console.error('獲取訂位列表失敗:', error);
                throw error;
            }
        },

        // 獲取單一訂位
        getBookingById: async function(id) {
            try {
                const response = await fetch(`${this.baseURL}/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch booking details');
                }
                return await response.json();
            } catch (error) {
                console.error('獲取訂位詳情失敗:', error);
                throw error;
            }
        },

        // 取消訂位
        cancelBooking: async function(id) {
            try {
                const response = await fetch(`${this.baseURL}/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Failed to cancel booking');
                }
                return await response.json();
            } catch (error) {
                console.error('取消訂位失敗:', error);
                throw error;
            }
        }
    },

    // 載入訂位列表
    async loadBookingList() {
        try {
            const bookings = await this.api.getAllBookings();
            console.log("API 回傳的訂位資料:", bookings);
            this.renderBookingList(bookings);
        } catch (error) {
            console.error('載入訂位列表失敗:', error);
            alert('載入訂位列表失敗');
        }
    },

    // 渲染訂位列表
    renderBookingList(bookings) {
        const tbody = document.getElementById('bookingTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        bookings.forEach(booking => {
            const memberName = booking.member?.name || 'N/A';  // 取得會員姓名
            const timeSlot = booking.timeSlot 
                ? `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}` 
                : '未知時段';  // 取得時段
                        
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${this.escapeHtml(booking.bookingId)}</td>
                <td>${this.escapeHtml(memberName)}</td>
                <td>${this.escapeHtml(booking.bookingDate)}</td>
                <td>${this.escapeHtml(timeSlot)}</td>
                <td>${this.escapeHtml(booking.numberOfPeople)}</td>
                <td>${this.getStatusBadge(booking.status)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="BookingManager.cancelBooking('${booking.bookingId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    // 取消訂位
    async cancelBooking(id) {
        if (!confirm('確定要取消此訂位嗎？')) return;

        try {
            await this.api.cancelBooking(id);
            alert('訂位已成功取消');
            this.loadBookingList();
        } catch (error) {
            console.error('取消訂位失敗:', error);
            alert('取消訂位失敗');
        }
    },

    // 取得狀態標籤
    getStatusBadge(status) {
        const statusMap = {
            0: ['已確認', 'success'],
            1: ['已完成', 'danger'],
            2: ['已取消', 'info']
        };

        const [text, color] = statusMap[status] || ['未知', 'secondary'];
        return `<span class="badge bg-${color}">${text}</span>`;
    },

    // 取得狀態文字
    getStatusText(status) {
        const statusMap = {
            0: '已確認',
            1: '已完成',
            2: '已取消'
        };
        return statusMap[status] || '未知狀態';
    },

    // HTML 跳脫處理
    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    // 初始化
    init() {
        // 載入初始資料
        this.loadBookingList();
    }
};

// 當 DOM 載入完成時初始化
document.addEventListener('DOMContentLoaded', () => {
    // 僅在訂位管理頁面時初始化
    if (document.getElementById('bookingManagement')) {
        BookingManager.init();
    }
});