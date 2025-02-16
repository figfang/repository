// 時段管理器
const TimeslotManager = {
    // API 封裝
    api: {
        baseURL: '/api/timeslot',

        // 獲取所有時段
        getAllTimeslots: async function() {
            try {
                const response = await fetch(`${this.baseURL}/list`);
                const data = await response.json();
                console.log("API 回傳的時段列表:", data);
                return data;
            } catch (error) {
                console.error('獲取時段列表失敗:', error);
                throw error;
            }
        },

        // 新增時段
        addTimeslot: async function(timeslotData) {
            try {
                const response = await fetch(`${this.baseURL}/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(timeslotData)
                });
                return await response.json();
            } catch (error) {
                console.error('新增時段失敗:', error);
                throw error;
            }
        },

        // 更新時段
        updateTimeslot: async function(id, timeslotData) {
            try {
                const response = await fetch(`${this.baseURL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(timeslotData)
                });
                return await response.json();
            } catch (error) {
                console.error('更新時段失敗:', error);
                throw error;
            }
        },

        // 更新時段狀態
        updateTimeslotStatus: async function(id, status) {
            try {
                const response = await fetch(`${this.baseURL}/${id}/status?status=${status}`, {
                    method: 'PUT'
                });
                return await response.json();
            } catch (error) {
                console.error('更新時段狀態失敗:', error);
                throw error;
            }
        },

        // 刪除時段
        deleteTimeslot: async function(id) {
            try {
                const response = await fetch(`${this.baseURL}/${id}`, {
                    method: 'DELETE'
                });
                return await response.json();
            } catch (error) {
                console.error('刪除時段失敗:', error);
                throw error;
            }
        }
    },

    // 渲染時段列表
    renderTimeslotList(timeslots) {
        const tbody = document.getElementById('timeslotTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        timeslots.forEach(timeslot => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${this.escapeHtml(timeslot.timeSlotId)}</td>
                <td>${this.escapeHtml(timeslot.startTime)}</td>
                <td>${this.escapeHtml(timeslot.endTime)}</td>
                <td>${this.escapeHtml(timeslot.maxCapacity)}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <select class="form-select form-select-sm me-2" onchange="TimeslotManager.updateStatus(${timeslot.timeSlotId}, this.value)">
                            <option value="0" ${timeslot.status === 0 ? 'selected' : ''}>啟用</option>
                            <option value="1" ${timeslot.status === 1 ? 'selected' : ''}>停用</option>
                        </select>
                        <small class="text-muted">若要刪除請選停用</small>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${timeslot.timeSlotId}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    // 更新時段狀態
    async updateStatus(id, status) {
        try {
            await this.api.updateTimeslotStatus(id, status);
            alert('更新狀態成功');
            this.loadTimeslotList();
        } catch (error) {
            console.error('更新狀態失敗:', error);
            alert('更新狀態失敗');
        }
    },

    // 載入時段列表
    async loadTimeslotList() {
        try {
            const timeslots = await this.api.getAllTimeslots();
            this.renderTimeslotList(timeslots);
        } catch (error) {
            console.error('載入時段列表失敗:', error);
            alert('載入時段列表失敗');
        }
    },

    // 編輯時段
    async editTimeslot(id) {
        try {
            const timeslot = await this.api.getAllTimeslots().then(slots => 
                slots.find(slot => slot.timeSlotId === id)
            );
            
            if (!timeslot) throw new Error('找不到時段資料');

            const modalElement = document.getElementById('addTimeslotModal');
            const modal = new bootstrap.Modal(modalElement);
            const form = document.getElementById('addTimeslotForm');
            
            if (!form) return;
            
            const startTimeInput = form.querySelector('[name="startTime"]');
            const endTimeInput = form.querySelector('[name="endTime"]');
            const maxCapacityInput = form.querySelector('[name="maxCapacity"]');
            
            if (startTimeInput) startTimeInput.value = timeslot.startTime;
            if (endTimeInput) endTimeInput.value = timeslot.endTime;
            if (maxCapacityInput) maxCapacityInput.value = timeslot.maxCapacity;
            
            const titleElement = document.querySelector('#addTimeslotModal .modal-title');
            if (titleElement) titleElement.textContent = '編輯時段';
            
            const submitButton = document.querySelector('#addTimeslotModal .btn-primary');
            if (submitButton) {
                const newButton = submitButton.cloneNode(true);
                submitButton.parentNode.replaceChild(newButton, submitButton);
                newButton.textContent = '確認修改';
                newButton.onclick = () => this.updateTimeslotData(id);
            }
            
            modal.show();
        } catch (error) {
            console.error('獲取時段資料失敗:', error);
            alert('獲取時段資料失敗');
        }
    },

    // 更新時段資料
    async updateTimeslotData(id) {
        const form = document.getElementById('addTimeslotForm');
        if (!form) return;

        const formData = new FormData(form);
        const maxCapacity = formData.get('maxCapacity');
        if (!maxCapacity) {
            alert('請輸入容納人數');
            return;
        }
        
        const timeslotData = {
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            maxCapacity: parseInt(maxCapacity),
            status: 0
        };

        try {
            await this.api.updateTimeslot(id, timeslotData);
            alert('更新時段成功');
            
            const modalElement = document.getElementById('addTimeslotModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            
            this.loadTimeslotList();
        } catch (error) {
            console.error('更新時段失敗:', error);
            alert('更新時段失敗');
        }
    },

    // 新增時段
    async addTimeslot() {
        const form = document.getElementById('addTimeslotForm');
        if (!form) return;

        const formData = new FormData(form);
        const timeslotData = {
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            maxCapacity: parseInt(formData.get('maxCapacity')),
            status: 0
        };

        try {
            await this.api.addTimeslot(timeslotData);
            alert('新增時段成功');
            
            const modalElement = document.getElementById('addTimeslotModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            
            this.loadTimeslotList();
            form.reset();
        } catch (error) {
            console.error('新增時段失敗:', error);
            alert('新增時段失敗');
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
        // 將 TimeslotManager 添加到 window 對象
        window.TimeslotManager = this;
        
        // 綁定新增按鈕事件
        const addTimeslotButton = document.querySelector('[data-bs-target="#addTimeslotModal"]');
        if (addTimeslotButton) {
            addTimeslotButton.addEventListener('click', (e) => {
                e.preventDefault();
                const modalElement = document.getElementById('addTimeslotModal');
                const modal = new bootstrap.Modal(modalElement);
                const form = document.getElementById('addTimeslotForm');
                
                if (form) form.reset();
                
                const titleElement = document.querySelector('#addTimeslotModal .modal-title');
                if (titleElement) titleElement.textContent = '新增時段';
                
                const submitButton = document.querySelector('#addTimeslotModal .btn-primary');
                if (submitButton) {
                    const newButton = submitButton.cloneNode(true);
                    submitButton.parentNode.replaceChild(newButton, submitButton);
                    newButton.textContent = '確認新增';
                    newButton.onclick = () => this.addTimeslot();
                }
                
                modal.show();
            });
        }

        // 載入初始資料
        this.loadTimeslotList();
    }
};

// 當 DOM 載入完成時初始化
document.addEventListener('DOMContentLoaded', () => {
    // 僅在時段管理頁面時初始化
    if (document.getElementById('timeslotManagement')) {
        TimeslotManager.init();
    }
});