// UI 顯示控制函數
function showHomePage() {
    hideAllPages();
    $('#homePage').show();
}

function showLoginForm() {
    hideAllPages();
    $('#loginForm').show();
}

function showRegisterForm() {
    hideAllPages();
    $('#registerForm').show();
}

function showReservationForm() {
    hideAllPages();
    $('#reservationForm').show();
    
    // 填入會員資訊
    $('#reservationName').text(sessionStorage.getItem('name'));
    $('#reservationPhone').text(sessionStorage.getItem('phoneNumber'));
}

function showReservationList() {
    hideAllPages();
    $('#reservationList').show();
    getReservationList();
}

function showUserNav() {
    $('#userNav').show();
    $('#homePage').hide();
}

function hideUserNav() {
    $('#userNav').hide();
}

function hideAllPages() {
    $('#homePage, #loginForm, #registerForm, #reservationForm, #reservationList').hide();
}

function showEditReservationModal(bookingId) {
    $('#editReservationId').val(bookingId);
    $('#editName').val(sessionStorage.getItem('name'));
    $('#editPhone').val(sessionStorage.getItem('phoneNumber'));
    $('#editReservationModal').modal('show');
}

function showEditMemberModal() {
    // 填入會員資訊
    $('#editMemberEmail').val(sessionStorage.getItem('email'));
    $('#editMemberName').val(sessionStorage.getItem('name'));
    $('#editMemberPhone').val(sessionStorage.getItem('phoneNumber'));
    
    // 清空密碼欄位
    $('#editMemberPassword').val('');
    $('#editMemberPasswordConfirm').val('');
    
    $('#editMemberModal').modal('show');
}

// 回首頁
function returnHome() {
    if (sessionStorage.getItem('memberId')) {
        showReservationForm();
    } else {
        showHomePage();
    }
}