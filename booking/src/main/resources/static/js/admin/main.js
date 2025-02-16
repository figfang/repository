// 頁面管理器
const PageManager = {
    currentPage: null,
    pages: ['booking', 'timeslot', 'member', 'admin'],
    
    // 初始化頁面管理
    init() {
        // 綁定導航事件
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.switchPage(page);
            });
        });

        // 設置預設頁面
        const defaultPage = 'booking';
        this.switchPage(defaultPage);
    },

    // 切換頁面
    switchPage(pageName) {
        if (!this.pages.includes(pageName)) {
            console.error(`Invalid page name: ${pageName}`);
            return;
        }

        // 隱藏所有頁面
        this.pages.forEach(page => {
            const element = document.getElementById(`${page}Management`);
            if (element) {
                element.style.display = 'none';
            }
        });

        // 顯示選中的頁面
        const targetPage = document.getElementById(`${pageName}Management`);
        if (targetPage) {
            targetPage.style.display = 'block';
        }

        // 更新導航欄狀態
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            }
        });

        // 更新當前頁面
        this.currentPage = pageName;

        // 觸發頁面初始化
        this.initializePage(pageName);
    },

    // 初始化特定頁面
    initializePage(pageName) {
        switch(pageName) {
            case 'booking':
                if (typeof BookingManager !== 'undefined') {
                    BookingManager.loadBookingList();
                }
                break;
            case 'timeslot':
                if (typeof TimeslotManager !== 'undefined') {
                    TimeslotManager.loadTimeslotList();
                }
                break;
            case 'member':
                if (typeof MemberManager !== 'undefined') {
                    MemberManager.loadMemberList();
                }
                break;
            case 'admin':
                if (typeof AdminManager !== 'undefined') {
                    AdminManager.loadAdminList();
                }
                break;
        }
    }
};

function logout() {
    // 清除登入狀態（例如 localStorage 中的 token）
    localStorage.removeItem('adminToken');
    // 重定向到登入頁面
    window.location.href = 'login.html';
}

// 全域錯誤處理
window.handleError = function(message, error) {
    console.error(message, error);
    alert(message);
};

// 全域 HTML 轉義函數
window.escapeHtml = function(unsafe) {
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// DOMContentLoaded 事件處理
document.addEventListener('DOMContentLoaded', () => {
    // 初始化頁面管理
    PageManager.init();
});