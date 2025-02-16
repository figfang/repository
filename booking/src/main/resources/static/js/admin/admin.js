window.AdminManager = {
    // 管理員狀態常量
    STATUS: {
        ACTIVE: 0,    // 啟用
        SUSPENDED: 1   // 停用
    },

    // 狀態顯示文字
    STATUS_TEXT: {
        0: '啟用',
        1: '停用'
    },

    // 狀態樣式類別
    STATUS_CLASSES: {
        0: 'text-success',
        1: 'text-danger'
    },

    // API 封裝
    api: {
        baseURL: '/api/admin',

        // 獲取所有管理員列表
        getAllAdmins: async function() {
            try {
                const response = await fetch(`${this.baseURL}/list`);
                return await response.json();
            } catch (error) {
                console.error('獲取管理員列表失敗:', error);
                throw error;
            }
        },

        // 獲取單個管理員資訊
        getAdminById: async function(id) {
            try {
                const response = await fetch(`${this.baseURL}/${id}`);
                return await response.json();
            } catch (error) {
                console.error('獲取管理員資訊失敗:', error);
                throw error;
            }
        },

        // 新增管理員
        register: async function(adminData) {
            try {
                const response = await fetch(`${this.baseURL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(adminData)
                });
                return await response.text();
            } catch (error) {
                console.error('註冊失敗:', error);
                throw error;
            }
        },

        // 更新管理員資訊
        updateAdmin: async function(id, adminData) {
            try {
                const response = await fetch(`${this.baseURL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(adminData)
                });
                return await response.text();
            } catch (error) {
                console.error('更新管理員資訊失敗:', error);
                throw error;
            }
        },

        // 更新管理員狀態
        updateStatus: async function(id, status) {
            try {
                const response = await fetch(`${this.baseURL}/${id}/status?status=${status}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.text();
            } catch (error) {
                console.error('更新管理員狀態失敗:', error);
                throw error;
            }
        },

        // 刪除管理員
        deleteAdmin: async function(id) {
            try {
                const response = await fetch(`${this.baseURL}/${id}`, {
                    method: 'DELETE'
                });
                return await response.text();
            } catch (error) {
                console.error('刪除管理員失敗:', error);
                throw error;
            }
        }
    },

    // 載入管理員列表
    async loadAdminList() {
        try {
            const admins = await this.api.getAllAdmins();
            this.renderAdminList(admins);
        } catch (error) {
            console.error('載入管理員列表失敗:', error);
            alert('載入管理員列表失敗');
        }
    },

    // 渲染管理員列表
    renderAdminList(admins) {
        const tbody = document.getElementById('adminTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        admins.forEach(admin => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${this.escapeHtml(admin.adminId)}</td>
                <td>${this.escapeHtml(admin.name)}</td>
                <td>${this.escapeHtml(admin.email)}</td>
                <td>
                    <span class="${this.STATUS_CLASSES[admin.status] || ''}">${this.escapeHtml(this.STATUS_TEXT[admin.status])}</span>
                    <button class="btn btn-sm ms-2 ${admin.status === this.STATUS.ACTIVE ? 'btn-warning' : 'btn-success'}" 
                            onclick="AdminManager.toggleStatus(${admin.adminId}, ${admin.status})">
                        ${admin.status === this.STATUS.ACTIVE ? '停用' : '啟用'}
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="AdminManager.editAdmin(${admin.adminId})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="AdminManager.deleteAdmin(${admin.adminId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    // 編輯管理員
    async editAdmin(id) {
        try {
            const admin = await this.api.getAdminById(id);
            const modalElement = document.getElementById('addAdminModal');
            const modal = new bootstrap.Modal(modalElement);
            const form = document.getElementById('addAdminForm');
            
            if (!form) return;
            
            const nameInput = form.querySelector('[name="name"]');
            const emailInput = form.querySelector('[name="email"]');
            const passwordInput = form.querySelector('[name="password"]');
            
            if (nameInput) nameInput.value = admin.name;
            if (emailInput) emailInput.value = admin.email;
            if (passwordInput) passwordInput.value = '';
            
            document.querySelector('#addAdminModal .modal-title').textContent = '編輯管理員';
            const submitButton = document.querySelector('#addAdminModal .btn-primary');
            
            if (submitButton) {
                const newButton = submitButton.cloneNode(true);
                submitButton.parentNode.replaceChild(newButton, submitButton);
                newButton.textContent = '確認修改';
                newButton.onclick = () => this.updateAdminData(id);
            }
            
            modal.show();
        } catch (error) {
            console.error('獲取管理員資料失敗:', error);
            alert('獲取管理員資料失敗');
        }
    },

    // 更新管理員資料
    async updateAdminData(id) {
        const form = document.getElementById('addAdminForm');
        if (!form) return;

        const formData = new FormData(form);
        const adminData = {
            name: formData.get('name'),
            email: formData.get('email')
        };
        
        const password = formData.get('password');
        if (password) {
            adminData.password = password;
        }
        
        try {
            await this.api.updateAdmin(id, adminData);
            alert('更新管理員成功');
            
            const modalElement = document.getElementById('addAdminModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            
            this.loadAdminList();
        } catch (error) {
            console.error('更新管理員失敗:', error);
            alert('更新管理員失敗');
        }
    },

    // 切換管理員狀態
    async toggleStatus(id, currentStatus) {
        const newStatus = currentStatus === this.STATUS.ACTIVE ? this.STATUS.SUSPENDED : this.STATUS.ACTIVE;
        const statusText = this.STATUS_TEXT[newStatus];
        
        const confirmMessage = currentStatus === this.STATUS.ACTIVE ? 
            '確定要停用此管理員嗎？' : 
            '確定要啟用此管理員嗎？';
            
        if (!confirm(confirmMessage)) {
            return;
        }
        
        try {
            await this.api.updateStatus(id, newStatus);
            const successMessage = currentStatus === this.STATUS.ACTIVE ? 
                '已停用管理員' : 
                '已啟用管理員';
            alert(successMessage);
            this.loadAdminList();
        } catch (error) {
            console.error('更改管理員狀態失敗:', error);
            alert('更改管理員狀態失敗');
        }
    },

    // 新增管理員
    async addAdmin() {
        const form = document.getElementById('addAdminForm');
        if (!form) return;

        const formData = new FormData(form);
        const adminData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: document.getElementById('registerPassword')?.value
        };

        try {
            await this.api.register(adminData);
            alert('新增管理員成功');
            
            const modalElement = document.getElementById('addAdminModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            
            this.loadAdminList();
            form.reset();
        } catch (error) {
            console.error('新增管理員失敗:', error);
            alert('新增管理員失敗');
        }
    },

    // 刪除管理員
    async deleteAdmin(id) {
        if (!confirm('確定要刪除此管理員嗎？')) {
            return;
        }
        
        try {
            await this.api.deleteAdmin(id);
            alert('刪除管理員成功');
            this.loadAdminList();
        } catch (error) {
            console.error('刪除管理員失敗:', error);
            alert('刪除管理員失敗');
        }
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
        // 綁定新增按鈕事件
        const addAdminButton = document.querySelector('[data-bs-target="#addAdminModal"]');
        if (addAdminButton) {
            addAdminButton.addEventListener('click', (e) => {
                e.preventDefault();
                const modalElement = document.getElementById('addAdminModal');
                const modal = new bootstrap.Modal(modalElement);
                const form = document.getElementById('addAdminForm');
                
                if (form) form.reset();
                
                const titleElement = document.querySelector('#addAdminModal .modal-title');
                if (titleElement) titleElement.textContent = '新增管理員';
                
                const submitButton = document.querySelector('#addAdminModal .btn-primary');
                if (submitButton) {
                    const newButton = submitButton.cloneNode(true);
                    submitButton.parentNode.replaceChild(newButton, submitButton);
                    newButton.textContent = '確認新增';
                    newButton.onclick = () => this.addAdmin();
                }
                
                modal.show();
            });
        }

        // 載入初始資料
        this.loadAdminList();
    }
};

// 當 DOM 載入完成時初始化
document.addEventListener('DOMContentLoaded', () => {
    // 僅在管理員管理頁面時初始化
    if (document.getElementById('adminManagement')) {
        window.AdminManager.init();
    }
});