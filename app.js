// ระบบหลักสำหรับพนักงานและเจ้าหน้าที่
document.addEventListener('DOMContentLoaded', function() {
    // ตรวจสอบการล็อคอิน
    checkLoginStatus();
    
    // ตั้งค่าผู้ใช้
    setupUser();
    
    // เมนูแฮมเบอร์เกอร์
    setupHamburgerMenu();
    
    // ตั้งค่าเมนู
    setupMenu();
    
    // ตั้งค่าโหมดกลางวัน/กลางคืน
    setupDarkMode();
    
    // ตั้งค่า Modal
    setupModal();
});

// ตรวจสอบสถานะการล็อคอิน
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'index.html';
    }
    
    // เจ้าหน้าที่ไม่สามารถเข้าหน้านี้ได้ถ้าเป็นหน้า employee.html
    if (window.location.pathname.includes('employee.html') && currentUser.role === 'officer') {
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        window.location.href = 'officer.html';
    }
    
    // พนักงานไม่สามารถเข้าหน้านี้ได้ถ้าเป็นหน้า officer.html
    if (window.location.pathname.includes('officer.html') && currentUser.role === 'employee') {
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        window.location.href = 'employee.html';
    }
}

// ตั้งค่าข้อมูลผู้ใช้
function setupUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && document.getElementById('userName')) {
        document.getElementById('userName').textContent = currentUser.name;
    }
}

// ตั้งค่าเมนูแฮมเบอร์เกอร์
function setupHamburgerMenu() {
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', function() {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
}

// ตั้งค่าเมนู
function setupMenu() {
    // เมนูแดชบอร์ด
    const menuDashboard = document.getElementById('menuDashboard');
    if (menuDashboard) {
        menuDashboard.addEventListener('click', function(e) {
            e.preventDefault();
            loadDashboard();
            closeSidebar();
        });
    }
    
    // เมนูส่งซ่อม
    const menuRepair = document.getElementById('menuRepair');
    if (menuRepair) {
        menuRepair.addEventListener('click', function(e) {
            e.preventDefault();
            loadRepairForm();
            closeSidebar();
        });
    }
    
    // เมนูติดตาม
    const menuTracking = document.getElementById('menuTracking');
    if (menuTracking) {
        menuTracking.addEventListener('click', function(e) {
            e.preventDefault();
            loadTracking();
            closeSidebar();
        });
    }
    
    // เมนูประวัติ
    const menuHistory = document.getElementById('menuHistory');
    if (menuHistory) {
        menuHistory.addEventListener('click', function(e) {
            e.preventDefault();
            loadHistory();
            closeSidebar();
        });
    }
    
    // เมนูออกจากระบบ
    const menuLogout = document.getElementById('menuLogout');
    if (menuLogout) {
        menuLogout.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
            closeSidebar();
        });
    }
    
    // โหลดแดชบอร์ดเป็นหน้าแรก
    loadDashboard();
}

// ฟังก์ชันปิด Sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && sidebarOverlay) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
}

// ฟังก์ชันออกจากระบบ
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// ตั้งค่าโหมดกลางวัน/กลางคืน
function setupDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // ตรวจสอบการตั้งค่าจาก localStorage
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            updateThemeToggleIcon(true);
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            if (isDarkMode) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
            
            updateThemeToggleIcon(isDarkMode);
        });
    }
}

// อัพเดตไอคอนปุ่มสลับโหมด
function updateThemeToggleIcon(isDarkMode) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (isDarkMode) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> โหมดกลางวัน';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> โหมดกลางคืน';
        }
    }
}

// ตั้งค่า Modal
function setupModal() {
    const modal = document.getElementById('detailModal');
    const closeModal = document.getElementById('closeModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // ปิด Modal เมื่อคลิกนอกพื้นที่
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ฟังก์ชันแสดง Modal
function showModal(title, content) {
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.style.display = 'block';
    }
}

// ฟังก์ชันโหลดแดชบอร์ด
function loadDashboard() {
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!contentArea || !pageTitle) return;
    
    pageTitle.textContent = 'แดชบอร์ดสรุปผล';
    
    // อัพเดตสถิติ
    updateDashboardStats();
    
    // แสดงกิจกรรมล่าสุด
    updateRecentActivity();
}
// ฟังก์ชันอัพเดตสถิติแดชบอร์ด
// ฟังก์ชันอัพเดตสถิติแดชบอร์ด
function updateDashboardStats() {
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // วันนี้
    const today = new Date();
    const todayStr = today.toLocaleDateString('th-TH');
    
    // กรองเฉพาะรายการวันนี้
    const todayRepairs = repairs.filter(repair => repair.date === todayStr);
    
    // คำนวณสถิติวันนี้
    const todayStats = {
        total: todayRepairs.length,
        pending: todayRepairs.filter(r => r.status === 'pending').length,
        inProgress: todayRepairs.filter(r => r.status === 'in-progress').length,
        testing: todayRepairs.filter(r => r.status === 'testing').length,
        completed: todayRepairs.filter(r => r.status === 'completed').length,
        cancelled: todayRepairs.filter(r => r.status === 'cancelled').length
    };
    
    // คำนวณสถิติทั้งหมด
    const allStats = {
        total: repairs.length,
        pending: repairs.filter(r => r.status === 'pending').length,
        inProgress: repairs.filter(r => r.status === 'in-progress').length,
        testing: repairs.filter(r => r.status === 'testing').length,
        completed: repairs.filter(r => r.status === 'completed').length,
        cancelled: repairs.filter(r => r.status === 'cancelled').length
    };
    
    // อัพเดตตัวเลขในแดชบอร์ด
    const totalRepairs = document.getElementById('totalRepairs');
    const pendingRepairs = document.getElementById('pendingRepairs');
    const completedRepairs = document.getElementById('completedRepairs');
    const cancelledRepairs = document.getElementById('cancelledRepairs');
    
    if (totalRepairs) totalRepairs.textContent = todayStats.total;
    if (pendingRepairs) pendingRepairs.textContent = todayStats.pending + todayStats.inProgress + todayStats.testing;
    if (completedRepairs) completedRepairs.textContent = todayStats.completed;
    if (cancelledRepairs) cancelledRepairs.textContent = todayStats.cancelled;
    
    // แสดงรายละเอียดเพิ่มเติม
    showDashboardDetails(todayStats, allStats, todayRepairs);
}

// เพิ่มฟังก์ชันนี้ก่อนฟังก์ชัน showDashboardDetails
function addDashboardStyles() {
    // เพิ่ม CSS สำหรับแดชบอร์ดถ้าจำเป็น
    if (!document.getElementById('dashboardStyles')) {
        const style = document.createElement('style');
        style.id = 'dashboardStyles';
        style.textContent = `
            .dashboard-summary {
                margin-bottom: 20px;
            }
            
            .today-summary, .work-status, .today-repairs, .no-work-today {
                background: white;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .summary-item {
                display: flex;
                align-items: center;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 6px;
            }
            
            .summary-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                color: white;
                font-size: 20px;
            }
            
            .status-progress {
                margin-top: 15px;
            }
            
            .progress-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .progress-bar {
                flex: 1;
                height: 10px;
                background: #e9ecef;
                border-radius: 5px;
                margin: 0 10px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                border-radius: 5px;
            }
            
            .repairs-list {
                margin-top: 15px;
            }
            
            .repair-item {
                background: #f8f9fa;
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 10px;
                border-left: 4px solid #3498db;
            }
            
            .repair-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .urgency-badge {
                padding: 2px 8px;
                border-radius: 12px;
                color: white;
                font-size: 12px;
                font-weight: bold;
            }
            
            .no-work-today {
                text-align: center;
                padding: 40px 20px;
                color: #6c757d;
            }
            
            .no-work-today i {
                font-size: 50px;
                margin-bottom: 15px;
                color: #28a745;
            }
        `;
        document.head.appendChild(style);
    }
}

// เพิ่มฟังก์ชันนี้ก่อนฟังก์ชัน showDashboardDetails
function addDashboardStyles() {
    // เพิ่ม CSS สำหรับแดชบอร์ดถ้าจำเป็น
    if (!document.getElementById('dashboardStyles')) {
        const style = document.createElement('style');
        style.id = 'dashboardStyles';
        style.textContent = `
            .dashboard-summary {
                margin-bottom: 20px;
            }
            
            .today-summary, .work-status, .today-repairs, .no-work-today {
                background: white;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .summary-item {
                display: flex;
                align-items: center;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 6px;
            }
            
            .summary-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                color: white;
                font-size: 20px;
            }
            
            .status-progress {
                margin-top: 15px;
            }
            
            .progress-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .progress-bar {
                flex: 1;
                height: 10px;
                background: #e9ecef;
                border-radius: 5px;
                margin: 0 10px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                border-radius: 5px;
            }
            
            .repairs-list {
                margin-top: 15px;
            }
            
            .repair-item {
                background: #f8f9fa;
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 10px;
                border-left: 4px solid #3498db;
            }
            
            .repair-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .urgency-badge {
                padding: 2px 8px;
                border-radius: 12px;
                color: white;
                font-size: 12px;
                font-weight: bold;
            }
            
            .no-work-today {
                text-align: center;
                padding: 40px 20px;
                color: #6c757d;
            }
            
            .no-work-today i {
                font-size: 50px;
                margin-bottom: 15px;
                color: #28a745;
            }
        `;
        document.head.appendChild(style);
    }
}

// แสดงรายละเอียดแดชบอร์ด
function showDashboardDetails(todayStats, allStats, todayRepairs) {
    const recentActivity = document.getElementById('recentActivity');
    if (!recentActivity) return;
    
    const today = new Date().toLocaleDateString('th-TH');
    
    // สร้าง HTML สำหรับแดชบอร์ด
    let dashboardHTML = `
        <div class="dashboard-summary">
            <div class="today-summary">
                <h3><i class="fas fa-calendar-day"></i> สรุปงานวันนี้ (${today})</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-icon" style="background-color: #3498db;">
                            <i class="fas fa-tools"></i>
                        </div>
                        <div class="summary-info">
                            <h4>ทั้งหมด</h4>
                            <p>${todayStats.total} เคส</p>
                        </div>
                    </div>
                    
                    <div class="summary-item">
                        <div class="summary-icon" style="background-color: #f39c12;">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="summary-info">
                            <h4>รอดำเนินการ</h4>
                            <p>${todayStats.pending + todayStats.inProgress + todayStats.testing} เคส</p>
                            <small>กำลังรับซ่อม: ${todayStats.pending} | กำลังซ่อม: ${todayStats.inProgress} | ทดลอง: ${todayStats.testing}</small>
                        </div>
                    </div>
                    
                    <div class="summary-item">
                        <div class="summary-icon" style="background-color: #27ae60;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="summary-info">
                            <h4>สำเร็จ</h4>
                            <p>${todayStats.completed} เคส</p>
                        </div>
                    </div>
                    
                    <div class="summary-item">
                        <div class="summary-icon" style="background-color: #e74c3c;">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="summary-info">
                            <h4>ยกเลิก</h4>
                            <p>${todayStats.cancelled} เคส</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="work-status">
                <h3><i class="fas fa-tasks"></i> สถานะงานปัจจุบัน</h3>
                <div class="status-progress">
                    <div class="progress-item">
                        <span class="status-label">กำลังรับซ่อม</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${todayStats.pending > 0 ? '100' : '0'}%; background-color: #f39c12;"></div>
                        </div>
                        <span class="status-count">${todayStats.pending}</span>
                    </div>
                    
                    <div class="progress-item">
                        <span class="status-label">กำลังซ่อม</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${todayStats.inProgress > 0 ? '100' : '0'}%; background-color: #3498db;"></div>
                        </div>
                        <span class="status-count">${todayStats.inProgress}</span>
                    </div>
                    
                    <div class="progress-item">
                        <span class="status-label">ทดลองใช้งาน</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${todayStats.testing > 0 ? '100' : '0'}%; background-color: #9b59b6;"></div>
                        </div>
                        <span class="status-count">${todayStats.testing}</span>
                    </div>
                </div>
            </div>
    `;
    
    // แสดงรายการงานวันนี้ (ถ้ามี)
    if (todayRepairs.length > 0) {
        dashboardHTML += `
            <div class="today-repairs">
                <h3><i class="fas fa-list"></i> งานวันนี้</h3>
                <div class="repairs-list">
        `;
        
        todayRepairs.forEach(repair => {
            // กำหนดสีตามความเร่งด่วน
            let urgencyColor = '';
            switch (repair.urgency) {
                case 'normal': urgencyColor = '#27ae60'; break;
                case 'urgent': urgencyColor = '#f39c12'; break;
                case 'very-urgent': urgencyColor = '#e74c3c'; break;
            }
            
            // กำหนดสถานะ
            let statusText = '';
            switch (repair.status) {
                case 'pending': statusText = 'กำลังรับซ่อม'; break;
                case 'in-progress': statusText = 'กำลังซ่อม'; break;
                case 'testing': statusText = 'ทดลองใช้งาน'; break;
                case 'completed': statusText = 'เสร็จสิ้น'; break;
                case 'cancelled': statusText = 'ยกเลิก'; break;
            }
            
            dashboardHTML += `
                <div class="repair-item">
                    <div class="repair-header">
                        <span class="repair-id">#${repair.id}</span>
                        <span class="urgency-badge" style="background-color: ${urgencyColor}">
                            ${repair.urgency === 'normal' ? 'ปกติ' : repair.urgency === 'urgent' ? 'ด่วน' : 'ด่วนที่สุด'}
                        </span>
                    </div>
                    <div class="repair-content">
                        <p><strong>${repair.reporterName}</strong> - ${getAssetTypeText(repair.assetType)} (${repair.fullAssetCode})</p>
                        <p class="repair-problem">${repair.problemDetails.substring(0, 50)}${repair.problemDetails.length > 50 ? '...' : ''}</p>
                        <div class="repair-footer">
                            <span class="status-badge">${statusText}</span>
                            <span class="repair-time">${repair.time}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">ประเภทครุภัณฑ์:</span>
                        <span class="detail-value">${repair.assetType} - ${repair.assetTypeFull || getAssetTypeText(repair.assetType)}</span>
                    </div>
                </div>
            `;
        });
        
        dashboardHTML += `
                </div>
            </div>
        `;
    } else {
        dashboardHTML += `
            <div class="no-work-today">
                <i class="fas fa-check-circle"></i>
                <p>ไม่มีงานซ่อมวันนี้</p>
            </div>
        `;
    }
    
    dashboardHTML += `</div>`;
    
    recentActivity.innerHTML = dashboardHTML;
    
    // เพิ่ม CSS สำหรับแดชบอร์ด
    addDashboardStyles();
}

// ฟังก์ชันอัพเดตกิจกรรมล่าสุด
function updateRecentActivity() {
    const recentActivity = document.getElementById('recentActivity');
    if (!recentActivity) return;
    
    // ข้อมูลกิจกรรมตัวอย่าง
    const activities = [
        { id: 1, text: 'ส่งคำขอซ่อมคอมพิวเตอร์หมายเลข A001', time: '10:30 น.', date: '15 ก.ย. 2566' },
        { id: 2, text: 'ยกเลิกคำขอซ่อมเครื่องปรับอากาศหมายเลข B005', time: '14:15 น.', date: '14 ก.ย. 2566' },
        { id: 3, text: 'ส่งคำขอซ่อมโปรเจกเตอร์หมายเลข F003', time: '09:00 น.', date: '13 ก.ย. 2566' }
    ];
    
    // ถ้าไม่มีกิจกรรม
    if (activities.length === 0) {
        recentActivity.innerHTML = '<p class="no-activity">ไม่มีกิจกรรมล่าสุด</p>';
        return;
    }
    
    // สร้างรายการกิจกรรม
    let activityHTML = '';
    activities.forEach(activity => {
        activityHTML += `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span class="activity-time">${activity.date} ${activity.time}</span>
                </div>
            </div>
        `;
    });
    
    recentActivity.innerHTML = activityHTML;
}
// ฟังก์ชันโหลดฟอร์มส่งซ่อม
function loadRepairForm() {
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!contentArea || !pageTitle) return;
    
    pageTitle.textContent = 'ส่งซ่อมครุภัณฑ์';
    
    const repairFormHTML = `
        <div class="repair-form-container">
            <form id="repairForm">
                <div class="form-section">
                    <h3><i class="fas fa-user"></i> ข้อมูลผู้แจ้ง</h3>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="reporterName">ชื่อ-นามสกุล <span class="required">*</span></label>
                            <input type="text" id="reporterName" class="form-control" placeholder="กรอกชื่อ-นามสกุล" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reporterDepartment">แผนก <span class="required">*</span></label>
                            <input type="text" id="reporterDepartment" class="form-control" placeholder="กรอกชื่อแผนก" required>
                            <small class="form-text">เช่น แผนกไอที, แผนกบุคคล, แผนกการเงิน</small>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="reporterPhone">เบอร์ติดต่อ <span class="required">*</span></label>
                        <input type="tel" id="reporterPhone" class="form-control" placeholder="กรอกเบอร์ติดต่อ 10 หลัก" pattern="[0-9]{10}" maxlength="10" required>
                        <small class="form-text">กรุณากรอกเบอร์ติดต่อ 10 หลัก ขึ้นต้นด้วย 06, 08, 09 เท่านั้น</small>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-box"></i> ข้อมูลครุภัณฑ์</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="assetType">ประเภทครุภัณฑ์ <span class="required">*</span></label>
                            <select id="assetType" class="form-control" required>
                                <option value="">เลือกประเภทครุภัณฑ์</option>
                                <option value="A">A - คอมพิวเตอร์</option>
                                <option value="B">B - เครื่องปรับอากาศ</option>
                                <option value="C">C - โต๊ะ</option>
                                <option value="D">D - โซฟา</option>
                                <option value="E">E - เครื่องถ่ายเอกสาร</option>
                                <option value="F">F - โปรเจกเตอร์</option>
                                <option value="G">G - อื่นๆ</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="assetCode">รหัสครุภัณฑ์ <span class="required">*</span></label>
                            <div class="asset-code-input">
                                <div class="asset-code-prefix" id="assetPrefix">-</div>
                                <input type="text" id="assetCode" class="form-control" placeholder="กรอกหมายเลขครุภัณฑ์" required>
                            </div>
                        </div>
                    </div>
                    
                    <!-- เพิ่มฟิลด์ชื่อครุภัณฑ์ -->
                    <div class="form-row">
                        <div class="form-group" id="assetNameGroup">
                            <label for="assetName">ชื่อครุภัณฑ์</label>
                            <input type="text" id="assetName" class="form-control" placeholder="กรอกชื่อครุภัณฑ์ (ถ้ามี)">
                            <small class="form-text">กรอกชื่อครุภัณฑ์เพิ่มเติม เช่น ยี่ห้อ, รุ่น</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="assetLocation">สถานที่ <span class="required">*</span></label>
                            <input type="text" id="assetLocation" class="form-control" placeholder="กรอกสถานที่ตั้งครุภัณฑ์" required>
                        </div>
                    </div>
                    
                    <div class="form-group" id="otherAssetNameGroup" style="display: none;">
                        <label for="otherAssetName">ชื่อครุภัณฑ์ (สำหรับประเภทอื่นๆ) <span class="required">*</span></label>
                        <input type="text" id="otherAssetName" class="form-control" placeholder="กรอกชื่อครุภัณฑ์สำหรับประเภท 'อื่นๆ'">
                        <small class="form-text">ต้องกรอกชื่อครุภัณฑ์เมื่อเลือกประเภท "อื่นๆ"</small>
                    </div>
                </div>
                
                <div class="form-section">
                    <h3><i class="fas fa-exclamation-triangle"></i> รายละเอียดปัญหา</h3>
                    
                    <div class="form-group">
                        <label for="problemDetails">รายละเอียดปัญหา <span class="required">*</span></label>
                        <textarea id="problemDetails" class="form-control" rows="4" placeholder="กรอกรายละเอียดปัญหา" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="urgencyLevel">ความเร่งด่วน <span class="required">*</span></label>
                        <div class="urgency-options">
                            <label class="urgency-option normal">
                                <input type="radio" name="urgency" value="normal" checked>
                                <span class="urgency-label">ปกติ</span>
                            </label>
                            <label class="urgency-option urgent">
                                <input type="radio" name="urgency" value="urgent">
                                <span class="urgency-label">ด่วน</span>
                            </label>
                            <label class="urgency-option very-urgent">
                                <input type="radio" name="urgency" value="very-urgent">
                                <span class="urgency-label">ด่วนที่สุด</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="problemImage">รูปภาพประกอบ (ถ้ามี)</label>
                        <div class="image-upload-area" id="imageUploadArea">
                            <input type="file" id="problemImage" accept="image/png, image/jpeg" multiple style="display: none;">
                            <div class="upload-placeholder" id="uploadPlaceholder">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>คลิกเพื่ออัพโหลดรูปภาพ</p>
                                <p class="upload-hint">รองรับไฟล์ PNG และ JPG เท่านั้น</p>
                            </div>
                            <div class="images-preview" id="imagesPreview" style="display: none;"></div>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> ส่งคำขอซ่อม
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelRepair">
                        <i class="fas fa-times"></i> ยกเลิก
                    </button>
                </div>
            </form>
        </div>
    `;
    
    contentArea.innerHTML = repairFormHTML;
    
    // ตั้งค่าฟอร์มส่งซ่อม
    setupRepairForm();
}

// ตั้งค่าฟอร์มส่งซ่อม
function setupRepairForm() {
    // ตรวจสอบว่าเป็นหน้า repair form จริงหรือไม่
    if (!document.getElementById('repairForm')) {
        console.log('Repair form not found, skipping setup');
        return;
    }
    
    const repairForm = document.getElementById('repairForm');
    const assetTypeSelect = document.getElementById('assetType');
    const assetPrefix = document.getElementById('assetPrefix');
    const assetCodeInput = document.getElementById('assetCode');
    const otherAssetNameGroup = document.getElementById('otherAssetNameGroup');
    const otherAssetNameInput = document.getElementById('otherAssetName');
    const imageUploadArea = document.getElementById('imageUploadArea');
    const problemImageInput = document.getElementById('problemImage');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const cancelButton = document.getElementById('cancelRepair');
    
      // อัพเดต prefix และฟิลด์ชื่อครุภัณฑ์เมื่อเลือกประเภท
    if (assetTypeSelect && assetPrefix) {
        assetTypeSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            assetPrefix.textContent = selectedValue ? selectedValue : '-';
            
            // กำหนดว่าประเภทไหนต้องการชื่อครุภัณฑ์
            const assetNameGroup = document.getElementById('assetNameGroup');
            const otherAssetNameGroup = document.getElementById('otherAssetNameGroup');
            const otherAssetNameInput = document.getElementById('otherAssetName');
            
            // สำหรับประเภท "อื่นๆ" ให้แสดงฟิลด์พิเศษ
            if (selectedValue === 'G') {
                if (assetNameGroup) assetNameGroup.style.display = 'none';
                if (otherAssetNameGroup) {
                    otherAssetNameGroup.style.display = 'block';
                    otherAssetNameInput.required = true;
                }
            } else {
                // สำหรับประเภทอื่นๆ ให้แสดงฟิลด์ชื่อครุภัณฑ์ปกติ
                if (assetNameGroup) assetNameGroup.style.display = 'block';
                if (otherAssetNameGroup) {
                    otherAssetNameGroup.style.display = 'none';
                    otherAssetNameInput.required = false;
                    otherAssetNameInput.value = '';
                }
            }
        });
    }
    
    // ตรวจสอบเบอร์โทรศัพท์
    const phoneInput = document.getElementById('reporterPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const phone = this.value;
            if (phone.length === 10) {
                const isValid = /^(06|08|09)/.test(phone);
                if (!isValid) {
                    this.setCustomValidity('เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 06, 08, หรือ 09');
                } else {
                    this.setCustomValidity('');
                }
            }
        });
    }
    
    // อัพโหลดรูปภาพ
    uploadPlaceholder.addEventListener('click', function() {
        problemImageInput.click();
    });
    
    problemImageInput.addEventListener('change', function() {
        const files = Array.from(this.files);
        
        // จำกัดจำนวนรูปภาพ
        if (files.length > 5) {
            alert('สามารถอัพโหลดรูปภาพได้สูงสุด 5 รูป');
            this.value = '';
            return;
        }
        
        // ล้างรูปภาพเก่า (ถ้ามี)
        const imagesPreview = document.getElementById('imagesPreview');
        if (imagesPreview) {
            imagesPreview.innerHTML = '';
        } else {
            console.error('imagesPreview element not found');
            return;
        }
        
        // ถ้าไม่มีไฟล์
        if (files.length === 0) {
            imagesPreview.style.display = 'none';
            uploadPlaceholder.style.display = 'flex';
            return;
        }
        
        let imagesProcessed = 0;
        const totalImages = files.filter(file => file.type.match('image.*')).length;
        
        // ถ้าไม่มีไฟล์รูปภาพ
        if (totalImages === 0) {
            alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (PNG, JPG)');
            this.value = '';
            imagesPreview.style.display = 'none';
            uploadPlaceholder.style.display = 'flex';
            return;
        }
        
        // แสดงรูปภาพใหม่
        files.forEach((file, index) => {
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        const imageContainer = document.createElement('div');
                        imageContainer.className = 'preview-image-container';
                        imageContainer.innerHTML = `
                            <img src="${e.target.result}" alt="Preview ${index + 1}" class="preview-image">
                            <button type="button" class="btn-remove-image" data-index="${index}">
                                <i class="fas fa-times"></i>
                            </button>
                            <div class="image-name">${file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}</div>
                        `;
                        
                        if (imagesPreview) {
                            imagesPreview.appendChild(imageContainer);
                        }
                        
                        imagesProcessed++;
                        
                        // เมื่อประมวลผลรูปภาพทั้งหมดแล้ว
                        if (imagesProcessed === totalImages) {
                            if (uploadPlaceholder) {
                                uploadPlaceholder.style.display = 'none';
                            }
                            if (imagesPreview) {
                                imagesPreview.style.display = 'flex';
                            }
                        }
                    } catch (error) {
                        console.error('Error creating image preview:', error);
                    }
                };
                
                reader.onerror = function() {
                    console.error('Error reading file:', file.name);
                    imagesProcessed++;
                };
                
                reader.readAsDataURL(file);
            } else {
                // นับไฟล์ที่ไม่ใช่รูปภาพ
                imagesProcessed++;
            }
        });
    });

    // ลบรูปภาพ
    const handleRemoveImage = function(e) {
        if (e.target.closest('.btn-remove-image')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.btn-remove-image');
            const index = parseInt(button.getAttribute('data-index'));
            const problemImageInput = document.getElementById('problemImage');
            const dt = new DataTransfer();
            const files = Array.from(problemImageInput.files);
            
            // ลบไฟล์ที่เลือก
            if (index >= 0 && index < files.length) {
                files.splice(index, 1);
            }
            
            // อัพเดต input file
            files.forEach(file => dt.items.add(file));
            problemImageInput.files = dt.files;
            
            // ลบรูปภาพจาก preview
            const imageContainer = button.closest('.preview-image-container');
            if (imageContainer) {
                imageContainer.remove();
            }
            
            // อัพเดต data-index ของปุ่มลบที่เหลือ
            const remainingButtons = document.querySelectorAll('.btn-remove-image');
            remainingButtons.forEach((btn, newIndex) => {
                btn.setAttribute('data-index', newIndex);
            });
            
            // ถ้าไม่มีรูปภาพเหลือ ให้แสดงพื้นที่อัพโหลด
            const imagesPreview = document.getElementById('imagesPreview');
            if (imagesPreview && imagesPreview.children.length === 0) {
                imagesPreview.style.display = 'none';
                if (uploadPlaceholder) {
                    uploadPlaceholder.style.display = 'flex';
                }
            }
        }
    };
    
    // ใช้ event delegation สำหรับการลบรูปภาพ
    document.addEventListener('click', handleRemoveImage);
    
    // ยกเลิก
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            if (confirm('ยกเลิกการส่งคำขอซ่อมนี้ใช่หรือไม่?')) {
                // ลบ event listener ก่อนเปลี่ยนหน้า
                document.removeEventListener('click', handleRemoveImage);
                loadDashboard();
            }
        });
    }
    
    // ส่งฟอร์ม
    // ส่งฟอร์ม
repairForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // ตรวจสอบเบอร์โทรศัพท์
    const phone = document.getElementById('reporterPhone').value;
    if (!/^(06|08|09)[0-9]{8}$/.test(phone)) {
        alert('เบอร์ติดต่อไม่ถูกต้อง กรุณากรอกเบอร์ 10 หลักขึ้นต้นด้วย 06, 08, หรือ 09');
        return;
    }
    
    // ตรวจสอบรหัสครุภัณฑ์
    const assetType = document.getElementById('assetType').value;
    const assetCode = document.getElementById('assetCode').value;
    
    if (!assetType) {
        alert('กรุณาเลือกประเภทครุภัณฑ์');
        return;
    }
    
    if (!assetCode) {
        alert('กรุณากรอกรหัสครุภัณฑ์');
        return;
    }
    
    // ตรวจสอบชื่อครุภัณฑ์สำหรับประเภทอื่นๆ
    const otherAssetName = document.getElementById('otherAssetName') ? document.getElementById('otherAssetName').value : '';
    if (assetType === 'G' && !otherAssetName) {
        alert('กรุณากรอกชื่อครุภัณฑ์สำหรับประเภท "อื่นๆ"');
        return;
    }
    
    // ดึงชื่อครุภัณฑ์ทั่วไป
    const assetName = document.getElementById('assetName') ? document.getElementById('assetName').value : '';
    
    // สร้างข้อมูลการซ่อม
    const repairData = {
        id: Date.now(),
        reporterName: document.getElementById('reporterName').value,
        reporterDepartment: document.getElementById('reporterDepartment').value,
        reporterPhone: phone,
        assetType: assetType,
        assetCode: assetCode,
        fullAssetCode: assetType + assetCode,
        assetName: assetName, // ชื่อครุภัณฑ์ทั่วไป
        assetLocation: document.getElementById('assetLocation').value,
        problemDetails: document.getElementById('problemDetails').value,
        urgency: document.querySelector('input[name="urgency"]:checked').value,
        status: 'pending',
        date: new Date().toLocaleDateString('th-TH'),
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        images: [],
        // เพิ่มชื่อครุภัณฑ์สำหรับประเภทอื่นๆ
        otherAssetName: assetType === 'G' ? otherAssetName : '',
        // เก็บชื่อประเภทครุภัณฑ์แบบเต็ม
        assetTypeFull: getAssetTypeFullText(assetType, 
            assetType === 'G' ? otherAssetName : assetName)
    };
    
    // บันทึกรูปภาพ (ถ้ามี)
    if (problemImageInput && problemImageInput.files.length > 0) {
        const files = Array.from(problemImageInput.files);
        let imagesLoaded = 0;
        
        // กรองเฉพาะไฟล์รูปภาพ
        const imageFiles = files.filter(file => file.type.match('image.*'));
        
        if (imageFiles.length === 0) {
            saveRepairRequest(repairData);
            return;
        }
        
        imageFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    repairData.images.push({
                        id: Date.now() + index,
                        data: e.target.result,
                        name: file.name,
                        type: file.type,
                        size: file.size
                    });
                    
                    imagesLoaded++;
                    
                    // เมื่อโหลดรูปภาพทั้งหมดแล้ว บันทึกข้อมูล
                    if (imagesLoaded === imageFiles.length) {
                        saveRepairRequest(repairData);
                    }
                } catch (error) {
                    console.error('Error processing image:', error);
                    imagesLoaded++;
                    
                    // ถ้าเกิดข้อผิดพลาด ให้ข้ามรูปนี้
                    if (imagesLoaded === imageFiles.length) {
                        saveRepairRequest(repairData);
                    }
                }
            };
            
            reader.onerror = function() {
                console.error('Error reading image file:', file.name);
                imagesLoaded++;
                
                if (imagesLoaded === imageFiles.length) {
                    saveRepairRequest(repairData);
                }
            };
            
            reader.readAsDataURL(file);
        });
    } else {
        saveRepairRequest(repairData);
    }
});
}

// ฟังก์ชันแปลงประเภทครุภัณฑ์เป็นชื่อเต็ม
// ฟังก์ชันแปลงประเภทครุภัณฑ์เป็นชื่อเต็ม
function getAssetTypeFullText(typeCode, additionalName = '') {
    const types = {
        'A': 'คอมพิวเตอร์',
        'B': 'เครื่องปรับอากาศ',
        'C': 'โต๊ะ',
        'D': 'โซฟา',
        'E': 'เครื่องถ่ายเอกสาร',
        'F': 'โปรเจกเตอร์',
        'G': 'อื่นๆ'
    };
    
    const baseName = types[typeCode] || 'ไม่ทราบประเภท';
    
    // สำหรับประเภทอื่นๆ
    if (typeCode === 'G' && additionalName) {
        return `อื่นๆ - ${additionalName}`;
    }
    
    // สำหรับประเภทอื่นๆที่มีชื่อครุภัณฑ์เพิ่มเติม
    if (additionalName) {
        return `${baseName} (${additionalName})`;
    }
    
    return baseName;
}

// บันทึกคำขอซ่อม
function saveRepairRequest(repairData) {
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // เพิ่มคำขอซ่อมใหม่
    repairs.push(repairData);
    
    // บันทึกลง localStorage
    localStorage.setItem('repairs', JSON.stringify(repairs));
    
    // แสดงข้อความสำเร็จ
    alert('ส่งคำขอซ่อมสำเร็จ!\nรหัสคำขอ: ' + repairData.id);
    
    // รีเซ็ตฟอร์ม
    resetRepairForm();
    
    // โหลดแดชบอร์ด
    loadDashboard();
    
    // อัพเดตสถิติ
    updateDashboardStats();
    
    // แจ้งเตือนเจ้าหน้าที่ (ถ้ามีฟังก์ชัน)
    if (typeof notifyOfficerNewRepair === 'function') {
        notifyOfficerNewRepair(repairData);
    }
}

// ฟังก์ชันรีเซ็ตฟอร์มส่งซ่อม
function resetRepairForm(repairData = null) {  // เพิ่มพารามิเตอร์ repairData
    const repairForm = document.getElementById('repairForm');
    if (!repairForm) return;
    
    // รีเซ็ตฟอร์มทั้งหมด
    repairForm.reset();
    
    // รีเซ็ต prefix ของรหัสครุภัณฑ์
    const assetPrefix = document.getElementById('assetPrefix');
    if (assetPrefix) {
        assetPrefix.textContent = '-';
    }
    
    // ซ่อนฟิลด์ชื่อครุภัณฑ์สำหรับประเภทอื่นๆ
    const otherAssetNameGroup = document.getElementById('otherAssetNameGroup');
    if (otherAssetNameGroup) {
        otherAssetNameGroup.style.display = 'none';
        const otherAssetNameInput = document.getElementById('otherAssetName');
        if (otherAssetNameInput) {
            otherAssetNameInput.required = false;
        }
    }
    
    // แสดงฟิลด์ชื่อครุภัณฑ์ทั่วไป
    const assetNameGroup = document.getElementById('assetNameGroup');
    if (assetNameGroup) {
        assetNameGroup.style.display = 'block';
    }
    
    // รีเซ็ตพื้นที่อัพโหลดรูปภาพ
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imagesPreview = document.getElementById('imagesPreview');
    const problemImageInput = document.getElementById('problemImage');
    
    if (uploadPlaceholder) {
        uploadPlaceholder.style.display = 'flex';
    }
    
    if (imagesPreview) {
        imagesPreview.innerHTML = '';
        imagesPreview.style.display = 'none';
    }
    
    if (problemImageInput) {
        problemImageInput.value = '';
    }
    
    // ตั้งค่าความเร่งด่วนเป็น "ปกติ" (ค่าเริ่มต้น)
    const normalUrgency = document.querySelector('input[name="urgency"][value="normal"]');
    if (normalUrgency) {
        normalUrgency.checked = true;
    }
    
    // ล้างการตรวจสอบความถูกต้อง
    const phoneInput = document.getElementById('reporterPhone');
    if (phoneInput) {
        phoneInput.setCustomValidity('');
    }
    
    // แสดงข้อความยืนยัน (เฉพาะเมื่อมี repairData)
    if (repairData) {
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            // กำหนดชื่อประเภทครุภัณฑ์แบบเต็ม
            let assetTypeDisplay = '';
            let assetNameToShow = '';
            
            if (repairData.assetType === 'G' && repairData.otherAssetName) {
                // ประเภทอื่นๆ
                assetTypeDisplay = `G - อื่นๆ`;
                assetNameToShow = repairData.otherAssetName;
            } else {
                // ประเภทอื่นๆ
                const assetTypeText = getAssetTypeText(repairData.assetType);
                if (repairData.assetName && repairData.assetName.trim() !== '') {
                    assetTypeDisplay = `${repairData.assetType} - ${assetTypeText}`;
                    assetNameToShow = repairData.assetName;
                } else {
                    assetTypeDisplay = `${repairData.assetType} - ${assetTypeText}`;
                }
            }
            
            const successHTML = `
                <div class="repair-form-container">
                    <div class="success-message">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>ส่งคำขอซ่อมสำเร็จ!</h2>
                        <p>ระบบได้รับคำขอซ่อมครุภัณฑ์ของคุณเรียบร้อยแล้ว</p>
                        <div class="success-details">
                            <p><strong>รหัสคำขอ:</strong> #${repairData.id}</p>
                            <p><strong>วันที่:</strong> ${repairData.date} ${repairData.time}</p>
                            <p><strong>ประเภทครุภัณฑ์:</strong> ${assetTypeDisplay}</p>
                            <p><strong>รหัสครุภัณฑ์:</strong> ${repairData.fullAssetCode}</p>
                            <p><strong>สถานที่:</strong> ${repairData.assetLocation}</p>
                            ${assetNameToShow ? `<p><strong>ชื่อครุภัณฑ์:</strong> ${assetNameToShow}</p>` : ''}
                            ${repairData.otherAssetName && repairData.assetType === 'G' ? `<p><strong>ชื่อครุภัณฑ์:</strong> ${repairData.otherAssetName}</p>` : ''}
                        </div>
                        <div class="success-actions">
                            <button class="btn btn-primary" id="newRepairBtn">
                                <i class="fas fa-plus-circle"></i> ส่งซ่อมใหม่
                            </button>
                            <button class="btn btn-secondary" id="trackRepairBtn">
                                <i class="fas fa-search"></i> ติดตามคำขอ
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            contentArea.innerHTML = successHTML;
            
            // ตั้งค่าเหตุการณ์สำหรับปุ่ม
            const newRepairBtn = document.getElementById('newRepairBtn');
            const trackRepairBtn = document.getElementById('trackRepairBtn');
            
            if (newRepairBtn) {
                newRepairBtn.addEventListener('click', function() {
                    loadRepairForm();
                });
            }
            
            if (trackRepairBtn) {
                trackRepairBtn.addEventListener('click', function() {
                    loadTracking();
                });
            }
        }
    }
}

// ฟังก์ชันโหลดหน้าติดตาม
function loadTracking() {
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!contentArea || !pageTitle) return;
    
    pageTitle.textContent = 'ติดตามการซ่อม';
    
    // สร้าง HTML สำหรับติดตามการซ่อม
    const trackingHTML = `
        <div class="tracking-container">
            <div class="search-section">
                <div class="search-box">
                    <input type="text" id="searchTracking" class="form-control" placeholder="ค้นหารหัสคำขอ, ชื่อผู้แจ้ง, หรือรหัสครุภัณฑ์">
                    <button class="btn btn-secondary" id="searchButton">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            
            <div class="tracking-list" id="trackingList">
                <!-- รายการติดตามจะถูกเพิ่มที่นี่ -->
                <div class="loading-message">
                    <i class="fas fa-spinner fa-spin"></i> กำลังโหลดข้อมูล...
                </div>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = trackingHTML;
    
    // โหลดรายการติดตาม
    loadTrackingList();
    
    // ตั้งค่าการค้นหา
    const searchInput = document.getElementById('searchTracking');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            filterTrackingList(searchInput.value);
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterTrackingList(this.value);
            }
        });
    }
}

// โหลดรายการติดตาม
function loadTrackingList(filter = '') {
    const trackingList = document.getElementById('trackingList');
    if (!trackingList) return;
    
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // กรองเฉพาะรายการที่ยังไม่เสร็จสิ้นหรือยกเลิก
    let filteredRepairs = repairs.filter(repair => 
        repair.status !== 'completed' && repair.status !== 'cancelled'
    );
    
    // กรองด้วยคำค้นหา (ถ้ามี)
    if (filter) {
        const searchTerm = filter.toLowerCase();
        filteredRepairs = filteredRepairs.filter(repair => 
            repair.id.toString().includes(searchTerm) ||
            repair.reporterName.toLowerCase().includes(searchTerm) ||
            repair.fullAssetCode.toLowerCase().includes(searchTerm)
        );
    }
    
    // ถ้าไม่มีรายการ
    if (filteredRepairs.length === 0) {
        trackingList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-inbox"></i>
                <p>ไม่มีรายการติดตาม</p>
            </div>
        `;
        return;
    }
    
    // สร้าง HTML สำหรับรายการติดตาม
let trackingHTML = '';

filteredRepairs.forEach(repair => {
    // กำหนดสีตามความเร่งด่วน
    let urgencyColor = '';
    let urgencyText = '';
    
    switch (repair.urgency) {
        case 'normal':
            urgencyColor = '#27ae60';
            urgencyText = 'ปกติ';
            break;
        case 'urgent':
            urgencyColor = '#f39c12';
            urgencyText = 'ด่วน';
            break;
        case 'very-urgent':
            urgencyColor = '#e74c3c';
            urgencyText = 'ด่วนที่สุด';
            break;
    }
    
    // กำหนดสถานะ
    let statusText = '';
    let statusColor = '';
    
    switch (repair.status) {
        case 'pending':
            statusText = 'กำลังรับซ่อม';
            statusColor = '#f39c12';
            break;
        case 'in-progress':
            statusText = 'กำลังซ่อม';
            statusColor = '#3498db';
            break;
        case 'testing':
            statusText = 'ทดลองใช้งาน';
            statusColor = '#9b59b6';
            break;
        case 'completed':
            statusText = 'เสร็จสิ้น';
            statusColor = '#27ae60';
            break;
        case 'cancelled':
            statusText = 'ยกเลิก';
            statusColor = '#e74c3c';
            break;
    }
    
    // กำหนดประเภทครุภัณฑ์
    let assetTypeText = '';
    switch (repair.assetType) {
        case 'A': assetTypeText = 'คอมพิวเตอร์'; break;
        case 'B': assetTypeText = 'เครื่องปรับอากาศ'; break;
        case 'C': assetTypeText = 'โต๊ะ'; break;
        case 'D': assetTypeText = 'โซฟา'; break;
        case 'E': assetTypeText = 'เครื่องถ่ายเอกสาร'; break;
        case 'F': assetTypeText = 'โปรเจกเตอร์'; break;
        case 'G': assetTypeText = 'อื่นๆ'; break;
    }
    
    // ตรวจสอบว่าเป็นเจ้าหน้าที่หรือไม่
        // ตรวจสอบว่าเป็นเจ้าหน้าที่หรือไม่
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isOfficer = currentUser && (currentUser.role === 'officer' || currentUser.role === 'admin');
    
    // สร้างปุ่มตามสิทธิ์
    let actionButtons = `
        <button class="btn btn-sm btn-view-details" data-id="${repair.id}">
            <i class="fas fa-eye"></i> ดูรายละเอียด
        </button>
    `;
    
    if (isOfficer) {
        // ปุ่มสำหรับเจ้าหน้าที่
        actionButtons += `
            <button class="btn btn-sm btn-change-status" data-id="${repair.id}">
                <i class="fas fa-exchange-alt"></i> เปลี่ยนสถานะ
            </button>
            
            <button class="btn btn-sm btn-complete" data-id="${repair.id}" ${repair.status === 'completed' || repair.status === 'cancelled' ? 'disabled' : ''}>
                <i class="fas fa-check-circle"></i> เสร็จสิ้น
            </button>
        `;
    }
    
    actionButtons += `
        <button class="btn btn-sm btn-cancel-request" data-id="${repair.id}" ${repair.status === 'cancelled' || repair.status === 'completed' ? 'disabled' : ''}>
            <i class="fas fa-times"></i> ยกเลิกคำขอ
        </button>
    `;
    
    trackingHTML += `
        <div class="tracking-item" data-id="${repair.id}">
            <div class="tracking-header">
                <div class="tracking-id">
                    <h4>คำขอซ่อม #${repair.id}</h4>
                    <span class="urgency-badge" style="background-color: ${urgencyColor}">
                        ${urgencyText}
                    </span>
                </div>
                <div class="tracking-status">
                    <span class="status-badge" style="background-color: ${statusColor}">
                        ${statusText}
                    </span>
                </div>
            </div>
            
            <div class="tracking-content">
                <div class="tracking-info">
                    <p><strong>ผู้แจ้ง:</strong> ${repair.reporterName}</p>
                    <p><strong>ประเภทครุภัณฑ์:</strong> ${repair.assetType} - ${assetTypeText}</p>
                    <p><strong>รหัสครุภัณฑ์:</strong> ${repair.fullAssetCode}</p>
                    <p><strong>วันที่แจ้ง:</strong> ${repair.date} ${repair.time}</p>
                </div>
                
                <div class="tracking-actions">
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;
});
    
    trackingList.innerHTML = trackingHTML;
    
    // ตั้งค่าเหตุการณ์สำหรับปุ่มดูรายละเอียด
    const viewButtons = document.querySelectorAll('.btn-view-details');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const repairId = parseInt(this.getAttribute('data-id'));
            showRepairDetails(repairId);
        });
    });
    
    // ตั้งค่าเหตุการณ์สำหรับปุ่มยกเลิก
    const cancelButtons = document.querySelectorAll('.btn-cancel-request');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const repairId = parseInt(this.getAttribute('data-id'));
            cancelRepairRequest(repairId);
        });
    });
        // ตั้งค่าเหตุการณ์สำหรับปุ่มเปลี่ยนสถานะ (เจ้าหน้าที่)
    const changeStatusButtons = document.querySelectorAll('.btn-change-status');
    changeStatusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const repairId = parseInt(this.getAttribute('data-id'));
            // หาข้อมูลสถานะปัจจุบัน
            let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
            const repair = repairs.find(r => r.id === repairId);
            if (repair) {
                showStatusOptions(repairId, repair.status);
            }
        });
    });
    
    // ตั้งค่าเหตุการณ์สำหรับปุ่มเสร็จสิ้น (เจ้าหน้าที่)
    const completeButtons = document.querySelectorAll('.btn-complete');
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const repairId = parseInt(this.getAttribute('data-id'));
            completeRepairRequest(repairId);
        });
    });
}

// กรองรายการติดตาม
function filterTrackingList(filter) {
    loadTrackingList(filter);
}

// แสดงรายละเอียดการซ่อม
// แสดงรายละเอียดการซ่อม
function showRepairDetails(repairId) {
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // หาข้อมูลการซ่อมตาม ID
    const repair = repairs.find(r => r.id === repairId);
    
    if (!repair) {
        alert('ไม่พบข้อมูลการซ่อม');
        return;
    }
    
    // กำหนดประเภทครุภัณฑ์
    let assetTypeText = getAssetTypeText(repair.assetType);
    
    // ตรวจสอบว่ามีชื่อครุภัณฑ์หรือไม่
    let assetNameToShow = '';
    if (repair.assetType === 'G' && repair.otherAssetName) {
        // ประเภท "อื่นๆ" ที่มีชื่อครุภัณฑ์เฉพาะ
        assetNameToShow = repair.otherAssetName;
    } else if (repair.assetName && repair.assetName.trim() !== '') {
        // ประเภทอื่นๆ ที่มีชื่อครุภัณฑ์เพิ่มเติม
        assetNameToShow = repair.assetName;
    }
    
    // กำหนดสถานะ
    let statusText = '';
    let statusColor = '';
    
    switch (repair.status) {
        case 'pending':
            statusText = 'กำลังรับซ่อม';
            statusColor = '#f39c12';
            break;
        case 'in-progress':
            statusText = 'กำลังซ่อม';
            statusColor = '#3498db';
            break;
        case 'testing':
            statusText = 'ทดลองใช้งาน';
            statusColor = '#9b59b6';
            break;
        case 'completed':
            statusText = 'เสร็จสิ้น';
            statusColor = '#27ae60';
            break;
        case 'cancelled':
            statusText = 'ยกเลิก';
            statusColor = '#e74c3c';
            break;
    }
    
    // กำหนดความเร่งด่วน
    let urgencyText = '';
    let urgencyColor = '';
    switch (repair.urgency) {
        case 'normal':
            urgencyText = 'ปกติ';
            urgencyColor = '#27ae60';
            break;
        case 'urgent':
            urgencyText = 'ด่วน';
            urgencyColor = '#f39c12';
            break;
        case 'very-urgent':
            urgencyText = 'ด่วนที่สุด';
            urgencyColor = '#e74c3c';
            break;
    }
    
    // กำหนดแผนก
    let departmentText = '';
    switch (repair.reporterDepartment) {
        case 'it': departmentText = 'แผนกไอที'; break;
        case 'hr': departmentText = 'แผนกบุคคล'; break;
        case 'finance': departmentText = 'แผนกการเงิน'; break;
        case 'sales': departmentText = 'แผนกขาย'; break;
        case 'marketing': departmentText = 'แผนกการตลาด'; break;
        default: departmentText = repair.reporterDepartment;
    }
    
    // สร้าง HTML สำหรับ Modal
    let detailHTML = `
        <div class="repair-details-modal">
            <div class="detail-section">
                <h4><i class="fas fa-user"></i> ข้อมูลผู้แจ้ง</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">ชื่อ-นามสกุล:</span>
                        <span class="detail-value">${repair.reporterName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">แผนก:</span>
                        <span class="detail-value">${departmentText}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">เบอร์ติดต่อ:</span>
                        <span class="detail-value">
                            <a href="tel:${repair.reporterPhone}" class="phone-link">
                                <i class="fas fa-phone"></i> ${repair.reporterPhone}
                            </a>
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-box"></i> ข้อมูลครุภัณฑ์</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">ประเภทครุภัณฑ์:</span>
                        <span class="detail-value">${repair.assetType} - ${assetTypeText}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">รหัสครุภัณฑ์:</span>
                        <span class="detail-value"><strong>${repair.fullAssetCode}</strong></span>
                    </div>
    `;
    
    // เพิ่มฟิลด์ชื่อครุภัณฑ์ (ถ้ามี)
    if (assetNameToShow) {
        detailHTML += `
                    <div class="detail-item">
                        <span class="detail-label">ชื่อครุภัณฑ์:</span>
                        <span class="detail-value">${assetNameToShow}</span>
                    </div>
        `;
    }
    
    detailHTML += `
                    <div class="detail-item">
                        <span class="detail-label">สถานที่:</span>
                        <span class="detail-value">${repair.assetLocation}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-exclamation-triangle"></i> รายละเอียดปัญหา</h4>
                <div class="problem-details">
                    <div class="problem-header">
                        <span class="urgency-badge" style="background-color: ${urgencyColor}">
                            ${urgencyText}
                        </span>
                        <span class="time-stamp">${repair.date} ${repair.time}</span>
                    </div>
                    <div class="problem-content">
                        <p>${repair.problemDetails}</p>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> สถานะการซ่อม</h4>
                <div class="status-info">
                    <span class="status-badge" style="background-color: ${statusColor}">
                        ${statusText}
                    </span>
                    <div class="status-history">
                        <p><strong>วันที่แจ้ง:</strong> ${repair.date} ${repair.time}</p>
                        <p><strong>รหัสคำขอ:</strong> #${repair.id}</p>
                    </div>
                </div>
            </div>
    `;
    
    // เพิ่มรูปภาพถ้ามี
    if (repair.images && repair.images.length > 0) {
        detailHTML += `
            <div class="detail-section">
                <h4><i class="fas fa-images"></i> รูปภาพประกอบ (${repair.images.length} รูป)</h4>
                <div class="images-container">
                    <div class="images-gallery" id="imagesGallery">
        `;
        
        repair.images.forEach((image, index) => {
            detailHTML += `
                <div class="gallery-item" data-index="${index}">
                    <img src="${image.data}" alt="รูปภาพประกอบ ${index + 1}" class="gallery-image">
                    <div class="image-overlay">
                        <span>รูปที่ ${index + 1}</span>
                    </div>
                </div>
            `;
        });
        
        detailHTML += `
                    </div>
                    <div class="gallery-note">
                        <small><i class="fas fa-info-circle"></i> คลิกรูปภาพเพื่อขยายและจัดการ</small>
                    </div>
                </div>
            </div>
        `;
    }
    
    detailHTML += `
        </div>
    `;
    
    // แสดง Modal
    showModal('รายละเอียดการซ่อม', detailHTML);
    
    // ตั้งค่าเหตุการณ์สำหรับรูปภาพ (ถ้ามี)
    if (repair.images && repair.images.length > 0) {
        setTimeout(() => {
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                item.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    openImageGallery(repair.images, index);
                });
            });
        }, 100);
    }
}

// ยกเลิกคำขอซ่อม
function cancelRepairRequest(repairId) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกคำขอซ่อมนี้?')) {
        return;
    }
    
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // หาข้อมูลการซ่อมตาม ID
    const repairIndex = repairs.findIndex(r => r.id === repairId);
    
    if (repairIndex === -1) {
        alert('ไม่พบข้อมูลการซ่อม');
        return;
    }
    
    // อัพเดตสถานะเป็นยกเลิก
    repairs[repairIndex].status = 'cancelled';
    
    // บันทึกลง localStorage
    localStorage.setItem('repairs', JSON.stringify(repairs));
    
    // แสดงข้อความสำเร็จ
    alert('ยกเลิกคำขอซ่อมสำเร็จ');
    
    // โหลดรายการติดตามใหม่
    loadTrackingList();
    
    // อัพเดตแดชบอร์ด
    updateDashboardStats();
}

// ฟังก์ชันโหลดหน้าประวัติ
function loadHistory() {
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!contentArea || !pageTitle) return;
    
    pageTitle.textContent = 'ประวัติการซ่อม';
    
    // สร้าง HTML สำหรับประวัติการซ่อม
    const historyHTML = `
        <div class="history-container">
            <div class="search-section">
                <div class="search-box">
                    <input type="text" id="searchHistory" class="form-control" placeholder="ค้นหารหัสคำขอ, ชื่อผู้แจ้ง, หรือรหัสครุภัณฑ์">
                    <button class="btn btn-secondary" id="searchHistoryButton">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                
                <div class="filter-options">
                    <select id="filterStatus" class="form-control">
                        <option value="">ทั้งหมด</option>
                        <option value="completed">เสร็จสิ้น</option>
                        <option value="cancelled">ยกเลิก</option>
                    </select>
                    
                    <select id="filterType" class="form-control">
                        <option value="">ทุกประเภท</option>
                        <option value="A">คอมพิวเตอร์</option>
                        <option value="B">เครื่องปรับอากาศ</option>
                        <option value="C">โต๊ะ</option>
                        <option value="D">โซฟา</option>
                        <option value="E">เครื่องถ่ายเอกสาร</option>
                        <option value="F">โปรเจกเตอร์</option>
                        <option value="G">อื่นๆ</option>
                    </select>
                </div>
            </div>
            
            <div class="history-list" id="historyList">
                <!-- รายการประวัติจะถูกเพิ่มที่นี่ -->
                <div class="loading-message">
                    <i class="fas fa-spinner fa-spin"></i> กำลังโหลดข้อมูล...
                </div>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = historyHTML;
    
    // โหลดรายการประวัติ
    loadHistoryList();
    
    // ตั้งค่าการค้นหาและกรอง
    const searchInput = document.getElementById('searchHistory');
    const searchButton = document.getElementById('searchHistoryButton');
    const filterStatus = document.getElementById('filterStatus');
    const filterType = document.getElementById('filterType');
    
    // ฟังก์ชันสำหรับโหลดประวัติด้วยตัวกรอง
    const loadFilteredHistory = () => {
        const searchTerm = searchInput ? searchInput.value : '';
        const statusFilter = filterStatus ? filterStatus.value : '';
        const typeFilter = filterType ? filterType.value : '';
        
        loadHistoryList(searchTerm, statusFilter, typeFilter);
    };
    
    if (searchButton) {
        searchButton.addEventListener('click', loadFilteredHistory);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                loadFilteredHistory();
            }
        });
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', loadFilteredHistory);
    }
    
    if (filterType) {
        filterType.addEventListener('change', loadFilteredHistory);
    }
}

// โหลดรายการประวัติ
function loadHistoryList(searchTerm = '', statusFilter = '', typeFilter = '') {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // กรองเฉพาะรายการที่เสร็จสิ้นหรือยกเลิก
    let filteredRepairs = repairs.filter(repair => 
        repair.status === 'completed' || repair.status === 'cancelled'
    );
    
    // กรองด้วยคำค้นหา
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredRepairs = filteredRepairs.filter(repair => 
            repair.id.toString().includes(term) ||
            repair.reporterName.toLowerCase().includes(term) ||
            repair.fullAssetCode.toLowerCase().includes(term)
        );
    }
    
    // กรองด้วยสถานะ
    if (statusFilter) {
        filteredRepairs = filteredRepairs.filter(repair => 
            repair.status === statusFilter
        );
    }
    
    // กรองด้วยประเภท
    if (typeFilter) {
        filteredRepairs = filteredRepairs.filter(repair => 
            repair.assetType === typeFilter
        );
    }
    
    // เรียงลำดับจากล่าสุดไปเก่าสุด
    filteredRepairs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // ถ้าไม่มีรายการ
    if (filteredRepairs.length === 0) {
        historyList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-history"></i>
                <p>ไม่มีประวัติการซ่อม</p>
            </div>
        `;
        return;
    }
    
    // สร้าง HTML สำหรับรายการประวัติ
    let historyHTML = '';
    
    filteredRepairs.forEach(repair => {
        // กำหนดสีตามความเร่งด่วน
        let urgencyColor = '';
        let urgencyText = '';
        
        switch (repair.urgency) {
            case 'normal':
                urgencyColor = '#27ae60';
                urgencyText = 'ปกติ';
                break;
            case 'urgent':
                urgencyColor = '#f39c12';
                urgencyText = 'ด่วน';
                break;
            case 'very-urgent':
                urgencyColor = '#e74c3c';
                urgencyText = 'ด่วนที่สุด';
                break;
        }
        
        // กำหนดสถานะ
        let statusText = '';
        let statusColor = '';
        
        if (repair.status === 'completed') {
            statusText = 'เสร็จสิ้น';
            statusColor = '#27ae60';
        } else if (repair.status === 'cancelled') {
            statusText = 'ยกเลิก';
            statusColor = '#e74c3c';
        }
        
        // กำหนดประเภทครุภัณฑ์
        let assetTypeText = '';
        switch (repair.assetType) {
            case 'A': assetTypeText = 'คอมพิวเตอร์'; break;
            case 'B': assetTypeText = 'เครื่องปรับอากาศ'; break;
            case 'C': assetTypeText = 'โต๊ะ'; break;
            case 'D': assetTypeText = 'โซฟา'; break;
            case 'E': assetTypeText = 'เครื่องถ่ายเอกสาร'; break;
            case 'F': assetTypeText = 'โปรเจกเตอร์'; break;
            case 'G': assetTypeText = 'อื่นๆ'; break;
        }
        
        historyHTML += `
            <div class="history-item" data-id="${repair.id}">
                <div class="history-header">
                    <div class="history-id">
                        <h4>คำขอซ่อม #${repair.id}</h4>
                        <span class="urgency-badge" style="background-color: ${urgencyColor}">
                            ${urgencyText}
                        </span>
                    </div>
                    <div class="history-status">
                        <span class="status-badge" style="background-color: ${statusColor}">
                            ${statusText}
                        </span>
                    </div>
                </div>
                
                <div class="history-content">
                    <div class="history-info">
                        <p><strong>ผู้แจ้ง:</strong> ${repair.reporterName}</p>
                        <p><strong>ประเภทครุภัณฑ์:</strong> ${repair.assetType} - ${assetTypeText}</p>
                        <p><strong>รหัสครุภัณฑ์:</strong> ${repair.fullAssetCode}</p>
                        <p><strong>วันที่แจ้ง:</strong> ${repair.date} ${repair.time}</p>
                    </div>
                    
                    <div class="history-actions">
                        <button class="btn btn-sm btn-view-details" data-id="${repair.id}">
                            <i class="fas fa-eye"></i> ดูรายละเอียด
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = historyHTML;
    
    // ตั้งค่าเหตุการณ์สำหรับปุ่มดูรายละเอียด
    const viewButtons = document.querySelectorAll('.btn-view-details');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const repairId = parseInt(this.getAttribute('data-id'));
            showRepairDetails(repairId);
        });
    });
}
// ฟังก์ชันสำหรับเจ้าหน้าที่ในการอัพเดตสถานะ
function updateRepairStatus(repairId, newStatus) {
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // หาข้อมูลการซ่อมตาม ID
    const repairIndex = repairs.findIndex(r => r.id === repairId);
    
    if (repairIndex === -1) {
        alert('ไม่พบข้อมูลการซ่อม');
        return false;
    }
    
    // อัพเดตสถานะ
    repairs[repairIndex].status = newStatus;
    
    // บันทึกลง localStorage
    localStorage.setItem('repairs', JSON.stringify(repairs));
    
    return true;
}

// แสดงตัวเลือกสถานะสำหรับเจ้าหน้าที่
function showStatusOptions(repairId, currentStatus) {
    const statusOptions = [
        { value: 'pending', label: 'กำลังรับซ่อม', color: '#f39c12' },
        { value: 'in-progress', label: 'กำลังซ่อม', color: '#3498db' },
        { value: 'testing', label: 'ทดลองใช้งาน', color: '#9b59b6' },
        { value: 'completed', label: 'เสร็จสิ้น', color: '#27ae60' }
    ];
    
    let optionsHTML = `
        <div class="status-options">
            <h4>เปลี่ยนสถานะการซ่อม</h4>
            <div class="status-options-list">
    `;
    
    statusOptions.forEach(option => {
        const isCurrent = option.value === currentStatus;
        optionsHTML += `
            <button class="status-option ${isCurrent ? 'current' : ''}" 
                    data-status="${option.value}"
                    style="border-color: ${option.color}; color: ${option.color};">
                ${option.label}
                ${isCurrent ? ' (ปัจจุบัน)' : ''}
            </button>
        `;
    });
    
    optionsHTML += `
            </div>
            <div class="status-actions">
                <button class="btn btn-secondary" id="cancelStatusChange">ยกเลิก</button>
            </div>
        </div>
    `;
    
    showModal('เปลี่ยนสถานะการซ่อม', optionsHTML);
    
    // ตั้งค่าเหตุการณ์สำหรับปุ่มตัวเลือกสถานะ
    const statusButtons = document.querySelectorAll('.status-option:not(.current)');
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newStatus = this.getAttribute('data-status');
            changeRepairStatus(repairId, newStatus);
        });
    });
    
    // ปุ่มยกเลิก
    const cancelBtn = document.getElementById('cancelStatusChange');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.getElementById('detailModal').style.display = 'none';
        });
    }
}

// เปลี่ยนสถานะการซ่อม
function changeRepairStatus(repairId, newStatus) {
    if (updateRepairStatus(repairId, newStatus)) {
        alert('เปลี่ยนสถานะการซ่อมเรียบร้อยแล้ว');
        document.getElementById('detailModal').style.display = 'none';
        
        // โหลดหน้าติดตามใหม่
        if (document.getElementById('pageTitle').textContent === 'ติดตามการซ่อม') {
            loadTrackingList();
        }
        
       if (typeof notifyRepairStatusChange === 'function') {
            notifyRepairStatusChange(repairId, oldStatus, newStatus);
        }  
        // อัพเดตแดชบอร์ด
        updateDashboardStats();
    }
}

// ฟังก์ชันเสร็จสิ้นการซ่อม (สำหรับเจ้าหน้าที่)
function completeRepairRequest(repairId) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะเป็นเสร็จสิ้น?')) {
        return;
    }
    
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // หาข้อมูลการซ่อมตาม ID
    const repairIndex = repairs.findIndex(r => r.id === repairId);
    
    if (repairIndex === -1) {
        alert('ไม่พบข้อมูลการซ่อม');
        return;
    }
    
    // อัพเดตสถานะเป็นเสร็จสิ้น
    repairs[repairIndex].status = 'completed';
    
    // บันทึกลง localStorage
    localStorage.setItem('repairs', JSON.stringify(repairs));
    
    // แสดงข้อความสำเร็จ
    alert('เปลี่ยนสถานะเป็นเสร็จสิ้นสำเร็จ');
    
    // โหลดรายการติดตามใหม่
    loadTrackingList();
    
    // อัพเดตแดชบอร์ด
    updateDashboardStats();
}