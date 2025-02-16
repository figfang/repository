// ========== 全域變數 ==========
let currentBookingId = null;

// ========== 頁面初始化 ==========
$(document).ready(function() {
    checkLoginStatus();

    // 處理管理員登入
    $('#adminLoginForm').on('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
});

// ========== 登入相關功能 ==========
function checkLoginStatus() {
    $('#loginPage').show();
    $('#mainContent').hide();
}

function handleLogin() {
    const loginData = {
        email: $('#adminEmail').val(),
        password: $('#adminPassword').val()
    };

    $.ajax({
        url: '/api/admin/login',
        method: 'POST',
        data: JSON.stringify(loginData),
        contentType: 'application/json',
        success: function(response) {
            $('#loginPage').hide();
            $('#mainContent').show();
            loadAllBookings();
        },
        error: function(xhr) {
            alert('登入失敗：' + (xhr.responseText || '請檢查帳號密碼'));
        }
    });
}

// ========== 訂位管理功能 ==========
function loadAllBookings() {
    $.ajax({
        url: '/api/admin/bookings',
        method: 'GET',
        success: function(bookings) {
            updateBookingTable(bookings);
        },
        error: function(xhr) {
            alert('載入訂位資料失敗');
        }
    });
}

function updateBookingTable(bookings) {
    const tbody = $('#bookingTableBody');
    tbody.empty();

    bookings.forEach(booking => {
        const statusText = getStatusText(booking.status);
        const statusClass = getStatusClass(booking.status);

        const row = $('<tr>');
        row.html(`
            <td>${booking.bookingId}</td>
            <td>
                ${booking.member.name}<br>
                <small class="text-muted">${booking.member.phoneNumber}</small>
            </td>
            <td>${booking.bookingDate}</td>
            <td>${formatTimeSlot(booking.timeSlot)}</td>
            <td>${booking.numberOfPeople}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td>${formatDateTime(booking.createTime)}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="showBookingDetail(${booking.bookingId})">
                    <i class="fas fa-info-circle"></i>
                </button>
                ${booking.status === 0 ? `
                    <button class="btn btn-sm btn-success me-1" onclick="confirmBooking(${booking.bookingId})">
                        <i class="fas fa-check"></i>
                    </button>
                ` : ''}
                ${booking.status !== 2 ? `
                    <button class="btn btn-sm btn-danger" onclick="cancelBooking(${booking.bookingId})">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        `);
        tbody.append(row);
    });
}

function showBookingDetail(bookingId) {
    currentBookingId = bookingId;
    $.ajax({
        url: `/api/admin/bookings/${bookingId}`,
        method: 'GET',
        success: function(booking) {
            $('#detailBookingId').text(booking.bookingId);
            $('#detailDate').text(booking.bookingDate);
            $('#detailTime').text(formatTimeSlot(booking.timeSlot));
            $('#detailPeople').text(booking.numberOfPeople);
            $('#detailStatus').text(getStatusText(booking.status));
            $('#detailName').text(booking.member.name);
            $('#detailPhone').text(booking.member.phoneNumber);
            $('#detailEmail').text(booking.member.email);
            
            new bootstrap.Modal('#bookingDetailModal').show();
        },
        error: function(xhr) {
            alert('載入訂位詳情失敗');
        }
    });
}

function confirmBooking(bookingId) {
    if (confirm('確定要確認這筆訂位嗎？')) {
        $.ajax({
            url: `/api/admin/bookings/${bookingId}/status?status=1`,
            method: 'PUT',
            success: function(response) {
                alert('訂位已確認');
                loadAllBookings();
                if(bootstrap.Modal.getInstance('#bookingDetailModal')) {
                    bootstrap.Modal.getInstance('#bookingDetailModal').hide();
                }
            },
            error: function(xhr) {
                alert('確認訂位失敗');
            }
        });
    }
}

function cancelBooking(bookingId) {
    if (confirm('確定要取消這筆訂位嗎？')) {
        $.ajax({
            url: `/api/admin/bookings/${bookingId}`,
            method: 'DELETE',
            success: function(response) {
                alert('訂位已取消');
                loadAllBookings();
                if(bootstrap.Modal.getInstance('#bookingDetailModal')) {
                    bootstrap.Modal.getInstance('#bookingDetailModal').hide();
                }
            },
            error: function(xhr) {
                alert('取消訂位失敗');
            }
        });
    }
}

function refreshBookings() {
    loadAllBookings();
}

function filterBookings(status) {
    let url = '/api/admin/bookings';
    if (status !== 'all') {
        url += `?status=${status}`;
    }
    $.ajax({
        url: url,
        method: 'GET',
        success: function(bookings) {
            updateBookingTable(bookings);
        },
        error: function(xhr) {
            alert('篩選訂位失敗');
        }
    });
}

// ========== 工具函數 ==========
function formatTimeSlot(timeSlot) {
    return `${timeSlot.startTime.substring(11, 16)}-${timeSlot.endTime.substring(11, 16)}`;
}

function formatDateTime(datetime) {
    return new Date(datetime).toLocaleString('zh-TW');
}

function getStatusText(status) {
    const statusMap = {
        0: '待確認',
        1: '已確認',
        2: '已取消'
    };
    return statusMap[status] || '未知狀態';
}

function getStatusClass(status) {
    const classMap = {
        0: 'bg-warning',
        1: 'bg-success',
        2: 'bg-danger'
    };
    return classMap[status] || 'bg-secondary';
}