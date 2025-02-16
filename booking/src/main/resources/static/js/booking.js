// 會員註冊
function register() {
    $('#registerFormSubmit').on('submit', function(e) {
        e.preventDefault();
        
        // 確認密碼驗證
        if ($('#registerPassword').val() !== $('#registerPasswordConfirm').val()) {
            alert('確認密碼不符');
            return;
        }

        const data = {
            name: $('#registerName').val(),
            email: $('#registerEmail').val(),
            phoneNumber: $('#registerPhone').val(),
            password: $('#registerPassword').val()
        };

        $.ajax({
            url: '/api/member/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                alert('註冊成功！請登入');
                showLoginForm();
            },
            error: function(xhr) {
                alert('註冊失敗：' + xhr.responseJSON.message);
            }
        });
    });
}

// 會員登入
function login() {
    $('#loginFormSubmit').on('submit', function(e) {
        e.preventDefault();
        
        const data = {
            email: $('#email').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: '/api/member/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                // 儲存會員資訊到 sessionStorage
                sessionStorage.setItem('memberId', response.memberId);
                sessionStorage.setItem('name', response.name);
                sessionStorage.setItem('email', response.email);
                sessionStorage.setItem('phoneNumber', response.phoneNumber);
                
                // 更新UI顯示
                $('#userDisplayName').text(response.name);
                showUserNav();
                showReservationForm();
            },
            error: function(xhr) {
                alert('登入失敗：' + xhr.responseJSON.message);
            }
        });
    });
}

// 新增訂位
function createReservation() {
    $('#reservationFormSubmit').on('submit', function(e) {
        e.preventDefault();

        const memberId = sessionStorage.getItem('memberId');
        if (!memberId) {
            alert('會員資訊未找到，請重新登入');
            showLoginForm();
            return;
        }

        const date = $('#date').val();
        const timeSlot = $('#time').val();
        const numberOfPeople = $('#people').val();

        // 確保所有必要欄位都有值且格式正確
        const data = {
            memberId: parseInt(memberId, 10),
            timeSlotId: parseInt(timeSlot, 10),
            bookingDate: date,
            numberOfPeople: parseInt(numberOfPeople, 10),
            name: sessionStorage.getItem('name'),
            phoneNumber: sessionStorage.getItem('phoneNumber')
        };

        // 驗證資料完整性
        if (!data.memberId || !data.timeSlotId || !data.bookingDate || !data.numberOfPeople) {
            alert('請填寫所有必要欄位');
            return;
        }

        // 驗證日期格式
        const selectedDate = new Date(data.bookingDate);
        const today = new Date();
        if (selectedDate < today) {
            alert('請選擇未來的日期');
            return;
        }

        $.ajax({
            url: '/api/bookings',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                $('#successAlert').addClass('show');
                setTimeout(() => {
                    $('#successAlert').removeClass('show');
                    showReservationList();
                }, 3000);
            },
            error: function(xhr) {
                let errorMessage = '訂位失敗';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage += '：' + xhr.responseJSON.message;
                }
                alert(errorMessage);
            }
        });
    });
}
// 取得會員訂位列表
function getReservationList() {
    const memberId = sessionStorage.getItem('memberId');
    
    if (!memberId) {
        console.error('找不到會員ID');
        showLoginForm();
        return;
    }
    
    $.ajax({
        url: `/api/bookings/member/${memberId}`,
        type: 'GET',
        success: function(response) {
            const tbody = $('#reservationTableBody');
            tbody.empty();
            
            if (!response || response.length === 0) {
                tbody.append('<tr><td colspan="7" class="text-center">尚無訂位記錄</td></tr>');
                return;
            }

            console.log('Retrieved bookings:', response); // 調試用
            
            response.forEach(booking => {
                if (!booking) return;
                
                // 從 timeSlot 物件中獲取時段信息
                const timeSlotObj = booking.timeSlot || {};
                const timeSlotValue = timeSlotObj.id || timeSlotObj.timeSlotId || null;
                
                // 從 member 物件中獲取會員信息
                const memberObj = booking.member || {};
                
                const row = `
                    <tr>
                        <td>${booking.bookingDate || '未設定'}</td>
                        <td>${getTimeSlotText(timeSlotValue)}</td>
                        <td>${booking.numberOfPeople || 0}人</td>
                        <td>${memberObj.name || booking.name || '未設定'}</td>
                        <td>${memberObj.phoneNumber || booking.phoneNumber || '未設定'}</td>
                        <td>${getStatusText(booking.status)}</td>
                        <td>
                            ${booking.status === 1 ? `
                                <button class="btn btn-sm btn-primary me-2" onclick="showEditReservationModal(${booking.bookingId})">
                                    修改
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="cancelReservation(${booking.bookingId})">
                                    取消
                                </button>
                            ` : ''}
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
        },
        error: function(xhr) {
            const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : '系統錯誤，請稍後再試';
            console.error('獲取訂位列表失敗：', errorMessage);
            alert('獲取訂位列表失敗：' + errorMessage);
        }
    });
}

// 修改訂位
function updateReservation() {
    const bookingId = $('#editReservationId').val();
    
    // 修改資料格式，將 timeSlot 包裝成物件
    const data = {
        bookingDate: $('#editDate').val(),
        timeSlot: {
            id: parseInt($('#editTime').val())
        },
        numberOfPeople: parseInt($('#editPeople').val()),
        name: $('#editName').val(),
        phoneNumber: $('#editPhone').val()
    };

    // 資料驗證
    if (!data.bookingDate || !data.timeSlot.id || !data.numberOfPeople) {
        alert('請填寫所有必要欄位');
        return;
    }

    $.ajax({
        url: `/api/bookings/${bookingId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            $('#editReservationModal').modal('hide');
            alert('修改成功');
            getReservationList();
        },
        error: function(xhr) {
            const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : '系統錯誤，請稍後再試';
            alert('修改失敗：' + errorMessage);
        }
    });
}

// 顯示編輯訂位 Modal 時的資料填充函數
function showEditReservationModal(bookingId) {
    $.ajax({
        url: `/api/bookings/${bookingId}`,
        type: 'GET',
        success: function(booking) {
            $('#editReservationId').val(bookingId);
            $('#editDate').val(booking.bookingDate);
            // 從 timeSlot 物件中獲取 id
            $('#editTime').val(booking.timeSlot ? booking.timeSlot.id : '');
            $('#editPeople').val(booking.numberOfPeople);
            $('#editName').val(booking.name);
            $('#editPhone').val(booking.phoneNumber);
            
            $('#editReservationModal').modal('show');
        },
        error: function(xhr) {
            alert('獲取訂位資料失敗：' + (xhr.responseJSON ? xhr.responseJSON.message : '系統錯誤'));
        }
    });
}


// 取消訂位
function cancelReservation(bookingId) {
    if (!confirm('確定要取消此訂位嗎？')) {
        return;
    }

    const memberId = sessionStorage.getItem('memberId');

    $.ajax({
        url: `/api/bookings/${bookingId}/?memberId=${memberId}`,
        type: 'DELETE',
        success: function(response) {
            alert('取消成功');
            getReservationList();
        },
        error: function(xhr) {
            alert('取消失敗：' + xhr.responseJSON.message);
        }
    });
}

// 更新會員資料
function updateMemberInfo() {
    const memberId = sessionStorage.getItem('memberId');
	const currentPassword = $('#currentPassword').val();
    const newPassword = $('#editMemberPassword').val();
    const confirmPassword = $('#editMemberPasswordConfirm').val();

	// 確認新密碼是否一致
	    if (newPassword && newPassword !== confirmPassword) {
	        alert('確認密碼不符');
	        return;
	    }

	    // 檢查是否輸入舊密碼
	    if (!currentPassword) {
	        alert('請輸入舊密碼');
	        return;
	    }

        // 更新密碼
        $.ajax({
            url: `/api/member/password/${memberId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
				currentPassword: currentPassword, // 傳遞舊密碼
                newPassword: newPassword
            }),
            success: function(response) {
                alert('密碼更新成功');
                $('#editMemberModal').modal('hide');
            },
            error: function(xhr) {
                alert('密碼更新失敗：' + xhr.responseJSON.message);
            }
        });
    }

// 登出處理
function handleLogout() {
    // 清除 sessionStorage
    sessionStorage.clear();
    
    // 重置UI
    hideUserNav();
    showHomePage();
}

// 工具函數：時段文字轉換
function getTimeSlotText(timeSlot) {
    const timeSlots = {
        1: '11:00-11:30',
        2: '12:00-12:30',
        3: '13:00-13:30',
        4: '18:00-18:30',
        5: '19:00-19:30'
    };
    return timeSlots[timeSlot] || '未知時段';
}

// 工具函數：狀態文字轉換
function getStatusText(status) {
    const statusMap = {
        0: '已取消',
        1: '已確認',
        2: '已完成'
    };
    return statusMap[status] || '未知狀態';
}

// 初始化頁面事件監聽
$(document).ready(function() {
    register();
    login();
    createReservation();
	
	// 設定日期最小值為今天
	            const today = new Date().toISOString().split('T')[0];
	            $('#date').attr('min', today);
	            $('#editDate').attr('min', today);
    
    // 載入使用者資訊
    const memberId = sessionStorage.getItem('memberId');
    if (memberId) {
        $('#userDisplayName').text(sessionStorage.getItem('name'));
        showUserNav();
        showReservationForm();
    }
});