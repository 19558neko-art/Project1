// ============================================
// ระบบแจ้งเตือนและซิงค์ข้อมูล
// ============================================

// ข้อมูลผู้ใช้เริ่มต้น
function getDefaultUsers() {
    return [
        {
            id: 1,
            title: 'นาย',
            firstName: 'สมชาย',
            lastName: 'ใจดี',
            position: 'ผู้ดูแลระบบ',
            birthDate: '1990-01-15',
            username: 'G1',
            password: '123456',
            role: 'admin',
            status: 'active',
            createdAt: '2023-01-01'
        },
        {
            id: 2,
            title: 'นางสาว',
            firstName: 'สมหญิง',
            lastName: 'รักงาน',
            position: 'เจ้าหน้าที่',
            birthDate: '1992-05-20',
            username: 'G2',
            password: '123456',
            role: 'officer',
            status: 'active',
            createdAt: '2023-01-01'
        },
        {
            id: 3,
            title: 'นาย',
            firstName: 'สมหมาย',
            lastName: 'ทำงาน',
            position: 'พนักงาน',
            birthDate: '1995-08-30',
            username: 'G3',
            password: '123456',
            role: 'employee',
            status: 'active',
            createdAt: '2023-01-01'
        }
    ];
}

// ฟังก์ชันซิงค์ข้อมูลระหว่างหน้า
function syncRepairData() {
    // ตรวจสอบและซิงค์ข้อมูลการซ่อม
    if (!localStorage.getItem('repairs')) {
        localStorage.setItem('repairs', JSON.stringify([]));
    }
    
    // ตรวจสอบและซิงค์ข้อมูลผู้ใช้
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(getDefaultUsers()));
    }
    
    // ตรวจสอบว่ามีข้อมูลการแจ้งเตือนหรือไม่
    if (!localStorage.getItem('notifications')) {
        localStorage.setItem('notifications', JSON.stringify([]));
    }
    
    // ตรวจสอบและซิงค์ข้อมูลสถิติ
    if (!localStorage.getItem('statistics')) {
        localStorage.setItem('statistics', JSON.stringify({
            totalRepairs: 0,
            completedRepairs: 0,
            pendingRepairs: 0,
            cancelledRepairs: 0,
            mostFrequentAsset: null,
            repairFrequency: {}
        }));
    }
}

// เรียกใช้ฟังก์ชันซิงค์เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    syncRepairData();
});

// ฟังก์ชันแจ้งเตือนเจ้าหน้าที่เมื่อมีการส่งซ่อมใหม่
function notifyOfficerNewRepair(repairData) {
    // ดึงข้อมูลการแจ้งเตือนจาก localStorage
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    // เพิ่มการแจ้งเตือนใหม่
    notifications.push({
        id: Date.now(),
        type: 'new_repair',
        message: `มีการส่งซ่อมใหม่จาก ${repairData.reporterName}`,
        repairId: repairData.id,
        timestamp: new Date().toISOString(),
        read: false
    });
    
    // บันทึกการแจ้งเตือน
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // อัพเดตการนับการแจ้งเตือน
    updateNotificationBadge();
    
    // อัพเดตสถิติ
    updateStatistics();
}

// อัพเดต badge การแจ้งเตือน
function updateNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // อัพเดต badge ใน navbar (ถ้ามี)
    const notificationBadge = document.getElementById('notificationBadge');
    if (notificationBadge) {
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            notificationBadge.style.display = 'flex';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
    
    // อัพเดต title ของหน้าเว็บ
    if (unreadCount > 0) {
        document.title = `(${unreadCount}) ESQ-Repair`;
    } else {
        document.title = 'ESQ-Repair';
    }
}

// เพิ่มเมนูการแจ้งเตือนใน sidebar (สำหรับเจ้าหน้าที่)
function addNotificationMenu() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isOfficer = currentUser && (currentUser.role === 'officer' || currentUser.role === 'admin');
    
    if (isOfficer) {
        // เพิ่มเมนูแจ้งเตือนใน sidebar
        const sidebarNav = document.querySelector('.sidebar-nav ul');
        if (sidebarNav) {
            // ตรวจสอบว่าเมนูนี้มีอยู่แล้วหรือไม่
            if (!document.getElementById('menuNotifications')) {
                const notificationItem = document.createElement('li');
                notificationItem.innerHTML = `
                    <a href="#" id="menuNotifications">
                        <i class="fas fa-bell"></i> การแจ้งเตือน
                        <span class="notification-badge" id="notificationBadge"></span>
                    </a>
                `;
                
                // แทรกก่อนเมนูออกจากระบบ
                const logoutItem = document.getElementById('menuLogout').parentElement;
                sidebarNav.insertBefore(notificationItem, logoutItem);
                
                // ตั้งค่าเหตุการณ์
                document.getElementById('menuNotifications').addEventListener('click', function(e) {
                    e.preventDefault();
                    loadNotifications();
                    closeSidebar();
                });
                
                // อัพเดต badge
                updateNotificationBadge();
            }
        }
    }
}

// โหลดหน้าการแจ้งเตือน
function loadNotifications() {
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!contentArea || !pageTitle) return;
    
    pageTitle.textContent = 'การแจ้งเตือน';
    
    // ดึงข้อมูลการแจ้งเตือน
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // เรียงลำดับจากใหม่ไปเก่า
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const notificationsHTML = `
        <div class="notifications-container">
            <div class="notifications-header">
                <h2><i class="fas fa-bell"></i> การแจ้งเตือน</h2>
                <div class="notifications-actions">
                    <button class="btn btn-sm btn-secondary" id="markAllRead">
                        <i class="fas fa-check-double"></i> อ่านทั้งหมด
                    </button>
                    <button class="btn btn-sm btn-danger" id="clearAll">
                        <i class="fas fa-trash"></i> ล้างทั้งหมด
                    </button>
                </div>
            </div>
            
            <div class="notifications-list" id="notificationsList">
                ${notifications.length === 0 ? 
                    '<div class="no-notifications"><i class="fas fa-bell-slash"></i><p>ไม่มีข้อความแจ้งเตือน</p></div>' : 
                    notifications.map(notification => {
                        const repair = repairs.find(r => r.id === notification.repairId);
                        const timeAgo = getTimeAgo(notification.timestamp);
                        
                        return `
                            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                                <div class="notification-icon">
                                    <i class="fas ${getNotificationIcon(notification.type)}"></i>
                                </div>
                                <div class="notification-content">
                                    <p class="notification-message">${notification.message}</p>
                                    ${repair ? `
                                        <p class="notification-details">
                                            <strong>ครุภัณฑ์:</strong> ${repair.fullAssetCode} | 
                                            <strong>ประเภท:</strong> ${getAssetTypeText(repair.assetType)} | 
                                            <strong>ความเร่งด่วน:</strong> ${getUrgencyText(repair.urgency)}
                                        </p>
                                    ` : ''}
                                    <span class="notification-time">${timeAgo}</span>
                                </div>
                                <div class="notification-actions">
                                    ${!notification.read ? `
                                        <button class="btn btn-sm btn-mark-read" data-id="${notification.id}">
                                            <i class="fas fa-check"></i> อ่านแล้ว
                                        </button>
                                    ` : ''}
                                    ${repair ? `
                                        <button class="btn btn-sm btn-view-repair" data-repair-id="${notification.repairId}">
                                            <i class="fas fa-eye"></i> ดูรายละเอียด
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')
                }
            </div>
        </div>
    `;
    
    contentArea.innerHTML = notificationsHTML;
    
    // ตั้งค่าเหตุการณ์
    setupNotificationEvents();
}

// ตั้งค่าเหตุการณ์สำหรับการแจ้งเตือน
function setupNotificationEvents() {
    // อ่านทั้งหมด
    const markAllReadBtn = document.getElementById('markAllRead');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    }
    
    // ล้างทั้งหมด
    const clearAllBtn = document.getElementById('clearAll');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllNotifications);
    }
    
    // อ่านแล้ว (เฉพาะรายการ)
    const markReadButtons = document.querySelectorAll('.btn-mark-read');
    markReadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const notificationId = parseInt(this.getAttribute('data-id'));
            markNotificationAsRead(notificationId);
        });
    });
    
    // ดูรายละเอียดการซ่อม
    const viewRepairButtons = document.querySelectorAll('.btn-view-repair');
    viewRepairButtons.forEach(button => {
        button.addEventListener('click', function() {
            const repairId = parseInt(this.getAttribute('data-repair-id'));
            // ตรวจสอบว่าฟังก์ชัน showRepairDetails มีอยู่
            if (typeof showRepairDetails === 'function') {
                showRepairDetails(repairId);
            } else {
                // ถ้าไม่มี ให้แสดงข้อความ
                alert('ไม่สามารถแสดงรายละเอียดการซ่อมได้ในขณะนี้');
            }
        });
    });
}

// อ่านการแจ้งเตือนทั้งหมด
function markAllNotificationsAsRead() {
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    notifications = notifications.map(notification => ({
        ...notification,
        read: true
    }));
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // โหลดหน้าการแจ้งเตือนใหม่
    loadNotifications();
    
    // อัพเดต badge
    updateNotificationBadge();
    
    alert('ทำเครื่องหมายอ่านทั้งหมดเรียบร้อยแล้ว');
}

// ล้างการแจ้งเตือนทั้งหมด
function clearAllNotifications() {
    if (confirm('คุณแน่ใจหรือไม่ที่จะล้างการแจ้งเตือนทั้งหมด?')) {
        localStorage.setItem('notifications', JSON.stringify([]));
        
        // โหลดหน้าการแจ้งเตือนใหม่
        loadNotifications();
        
        // อัพเดต badge
        updateNotificationBadge();
        
        alert('ล้างการแจ้งเตือนทั้งหมดเรียบร้อยแล้ว');
    }
}

// ทำเครื่องหมายอ่านการแจ้งเตือน
function markNotificationAsRead(notificationId) {
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    notifications = notifications.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
    );
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // อัพเดตหน้าการแจ้งเตือน
    loadNotifications();
    
    // อัพเดต badge
    updateNotificationBadge();
}

// ฟังก์ชันช่วยเหลือ
function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
        return 'เมื่อสักครู่';
    } else if (diffMins < 60) {
        return `${diffMins} นาทีที่แล้ว`;
    } else if (diffHours < 24) {
        return `${diffHours} ชั่วโมงที่แล้ว`;
    } else if (diffDays < 30) {
        return `${diffDays} วันที่แล้ว`;
    } else {
        return past.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

function getAssetTypeText(type) {
    const types = {
        'A': 'คอมพิวเตอร์',
        'B': 'เครื่องปรับอากาศ',
        'C': 'โต๊ะ',
        'D': 'โซฟา',
        'E': 'เครื่องถ่ายเอกสาร',
        'F': 'โปรเจกเตอร์',
        'G': 'อื่นๆ'
    };
    return types[type] || type;
}

function getUrgencyText(urgency) {
    const urgencies = {
        'normal': 'ปกติ',
        'urgent': 'ด่วน',
        'very-urgent': 'ด่วนที่สุด'
    };
    return urgencies[urgency] || urgency;
}

function getNotificationIcon(type) {
    const icons = {
        'new_repair': 'fa-tools',
        'status_change': 'fa-exchange-alt',
        'repair_completed': 'fa-check-circle',
        'repair_cancelled': 'fa-times-circle',
        'urgent_repair': 'fa-exclamation-triangle'
    };
    return icons[type] || 'fa-bell';
}

// อัพเดตสถิติ
function updateStatistics() {
    const repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    if (repairs.length === 0) return;
    
    // คำนวณสถิติ
    const totalRepairs = repairs.length;
    const completedRepairs = repairs.filter(r => r.status === 'completed').length;
    const pendingRepairs = repairs.filter(r => r.status === 'pending' || r.status === 'in-progress' || r.status === 'testing').length;
    const cancelledRepairs = repairs.filter(r => r.status === 'cancelled').length;
    
    // คำนวณครุภัณฑ์ที่ซ่อมบ่อยที่สุด
    const assetFrequency = {};
    repairs.forEach(repair => {
        const assetCode = repair.fullAssetCode;
        assetFrequency[assetCode] = (assetFrequency[assetCode] || 0) + 1;
    });
    
    let mostFrequentAsset = null;
    let maxFrequency = 0;
    
    Object.entries(assetFrequency).forEach(([assetCode, frequency]) => {
        if (frequency > maxFrequency) {
            maxFrequency = frequency;
            mostFrequentAsset = assetCode;
        }
    });
    
    // บันทึกสถิติ
    const statistics = {
        totalRepairs,
        completedRepairs,
        pendingRepairs,
        cancelledRepairs,
        mostFrequentAsset,
        repairFrequency: assetFrequency,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('statistics', JSON.stringify(statistics));
}

// สร้างการแจ้งเตือนเมื่อสถานะการซ่อมเปลี่ยน
function notifyRepairStatusChange(repairId, oldStatus, newStatus) {
    const repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    const repair = repairs.find(r => r.id === repairId);
    
    if (!repair) return;
    
    const statusMessages = {
        'pending': 'กำลังรับซ่อม',
        'in-progress': 'กำลังซ่อม',
        'testing': 'ทดลองใช้งาน',
        'completed': 'เสร็จสิ้น',
        'cancelled': 'ยกเลิก'
    };
    
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    // สร้างการแจ้งเตือนสำหรับเจ้าหน้าที่
    notifications.push({
        id: Date.now(),
        type: 'status_change',
        message: `สถานะการซ่อม ${repair.fullAssetCode} เปลี่ยนจาก "${statusMessages[oldStatus]}" เป็น "${statusMessages[newStatus]}"`,
        repairId: repairId,
        timestamp: new Date().toISOString(),
        read: false
    });
    
    // ถ้าเสร็จสิ้นหรือยกเลิก สร้างการแจ้งเตือนสำหรับผู้แจ้ง
    if (newStatus === 'completed' || newStatus === 'cancelled') {
        notifications.push({
            id: Date.now() + 1,
            type: newStatus === 'completed' ? 'repair_completed' : 'repair_cancelled',
            message: `การซ่อม ${repair.fullAssetCode} ${newStatus === 'completed' ? 'เสร็จสิ้น' : 'ถูกยกเลิก'} แล้ว`,
            repairId: repairId,
            timestamp: new Date().toISOString(),
            read: false,
            targetUser: repair.reporterName
        });
    }
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationBadge();
}

// เริ่มต้นระบบแจ้งเตือน
function initNotificationSystem() {
    syncRepairData();
    addNotificationMenu();
    updateNotificationBadge();
}

// เรียกใช้เมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    initNotificationSystem();
});