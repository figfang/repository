// 會員管理器
const MemberManager = {
    // API 封裝
    api: {
        baseURL: '/api/admin/members',
        
        // 獲取所有會員列表
        getAllMembers: async function() {
            try {
                const response = await fetch(`${this.baseURL}/list`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('獲取會員列表失敗:', error);
                throw error;
            }
        },

        // 獲取單個會員資訊
        getMemberById: async function(id) {
            try {
                const response = await fetch(`${this.baseURL}/${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('獲取會員資訊失敗:', error);
                throw error;
            }
        },

        // 刪除會員
        deleteMember: async function(id) {
            try {
                const response = await fetch(`${this.baseURL}/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.text();
            } catch (error) {
                console.error('刪除會員失敗:', error);
                throw error;
            }
        }
    },

    // 載入會員列表
    async loadMemberList() {
        try {
            const members = await this.api.getAllMembers();
            this.renderMemberList(members);
        } catch (error) {
            console.error('載入會員列表失敗:', error);
            alert('載入會員列表失敗');
        }
    },

    // 渲染會員列表
    renderMemberList(members) {
        const tbody = document.getElementById('memberTableBody');
        if (!tbody) {
            console.error('找不到會員列表表格');
            return;
        }

        tbody.innerHTML = '';
        
        members.forEach(member => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${this.escapeHtml(member.memberId)}</td>
                <td>${this.escapeHtml(member.name)}</td>
                <td>${this.escapeHtml(member.phoneNumber)}</td>
                <td>${this.escapeHtml(member.email)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="MemberManager.deleteMember(${member.memberId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    // 刪除會員
    async deleteMember(id) {
        if (!confirm('確定要刪除此會員嗎？')) {
            return;
        }
        
        try {
            await this.api.deleteMember(id);
            alert('刪除會員成功');
            this.loadMemberList();
        } catch (error) {
            console.error('刪除會員失敗:', error);
            alert('刪除會員失敗');
        }
    },

    // HTML 跳脫處理
    escapeHtml(unsafe) {
        return unsafe ? String(unsafe)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;") : '';
    },

    // 初始化會員管理
    init() {
        // 綁定搜尋按鈕事件
        const searchBtn = document.getElementById('memberSearchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                // TODO: 實作搜尋功能
                console.log('Search functionality to be implemented');
            });
        }

        // 載入初始資料
        this.loadMemberList();
    }
};

// 當 DOM 載入完成時初始化
document.addEventListener('DOMContentLoaded', () => {
    // 僅在會員管理頁面時初始化
    if (document.getElementById('memberManagement')) {
        MemberManager.init();
    }
});