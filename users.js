// ระบบจัดการผู้ใช้
document.addEventListener('DOMContentLoaded', function() {
    // ตรวจสอบการล็อคอิน
    checkAdminLogin();
    
    // ตั้งค่าผู้ใช้
    setupAdminUser();
    
    // เมนูแฮมเบอร์เกอร์
    setupHamburgerMenu();
    
    // ตั้งค่าเมนู
    setupAdminMenu();
    
    // ตั้งค่าโหมดกลางวัน/กลางคืน
    setupDarkMode();
    
    // ตั้งค่า Modal
    setupModal();
    
    // โหลดแดชบอร์ด
    loadAdminDashboard();
});

// ตรวจสอบสถานะการล็อคอินสำหรับแอดมิน
function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // ตรวจสอบสิทธิ์ - เฉพาะแอดมินเท่านั้น
    if (currentUser.role !== 'admin') {
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        // นำทางไปหน้าตามสิทธิ์
        if (currentUser.role === 'officer') {
            window.location.href = 'officer.html';
        } else {
            window.location.href = 'employee.html';
        }
    }
}

// ตั้งค่าผู้ใช้แอดมิน
function setupAdminUser() {
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

// ตั้งค่าเมนูแอดมิน
function setupAdminMenu() {
    // เมนูแดชบอร์ด
    const menuDashboard = document.getElementById('menuDashboard');
    if (menuDashboard) {
        menuDashboard.addEventListener('click', function(e) {
            e.preventDefault();
            loadAdminDashboard();
            closeSidebar();
        });
    }
    
    // เมนูจัดการผู้ใช้
    const menuUsers = document.getElementById('menuUsers');
    if (menuUsers) {
        menuUsers.addEventListener('click', function(e) {
            e.preventDefault();
            loadAdminDashboard();
            closeSidebar();
        });
    }
    
    // เมนูกลับสู่ระบบ
    const menuBackToSystem = document.getElementById('menuBackToSystem');
    if (menuBackToSystem) {
        menuBackToSystem.addEventListener('click', function(e) {
            e.preventDefault();
            goBackToSystem();
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

// กลับสู่ระบบหลัก
function goBackToSystem() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser.role === 'admin') {
        if (confirm('ซุปเปอร์แอดมิน: คุณต้องการเข้าสู่ระบบในฐานะใด?\nตกลง = เจ้าหน้าที่\nยกเลิก = พนักงาน')) {
            window.location.href = 'officer.html';
        } else {
            window.location.href = 'employee.html';
        }
    }
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
    const userModal = document.getElementById('userModal');
    const closeUserModal = document.getElementById('closeUserModal');
    const confirmModal = document.getElementById('confirmModal');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const cancelDelete = document.getElementById('cancelDelete');
    
    if (closeUserModal) {
        closeUserModal.addEventListener('click', function() {
            userModal.style.display = 'none';
        });
    }
    
    if (closeConfirmModal) {
        closeConfirmModal.addEventListener('click', function() {
            confirmModal.style.display = 'none';
        });
    }
    
    if (cancelDelete) {
        cancelDelete.addEventListener('click', function() {
            confirmModal.style.display = 'none';
        });
    }
    
    // ปิด Modal เมื่อคลิกนอกพื้นที่
    window.addEventListener('click', function(event) {
        if (event.target === userModal) {
            userModal.style.display = 'none';
        }
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
}

// โหลดแดชบอร์ดแอดมิน
function loadAdminDashboard() {
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!contentArea || !pageTitle) return;
    
    pageTitle.textContent = 'จัดการผู้ใช้ระบบ';
    
    // อัพเดตสถิติ
    updateAdminStats();
    
    // โหลดตารางผู้ใช้
    loadUsersTable();
    
    // ตั้งค่าปุ่มเพิ่มผู้ใช้
    const addNewUserBtn = document.getElementById('addNewUser');
    if (addNewUserBtn) {
        addNewUserBtn.addEventListener('click', showAddUserForm);
    }
    
    // ตั้งค่าการค้นหา
    const searchUsersBtn = document.getElementById('searchUsersBtn');
    const searchUsersInput = document.getElementById('searchUsers');
    
    if (searchUsersBtn && searchUsersInput) {
        searchUsersBtn.addEventListener('click', function() {
            filterUsersTable(searchUsersInput.value);
        });
        
        searchUsersInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterUsersTable(this.value);
            }
        });
    }
    
    // ตั้งค่าตัวกรอง
    const filterRole = document.getElementById('filterRole');
    const filterStatus = document.getElementById('filterStatus');
    
    if (filterRole) {
        filterRole.addEventListener('change', function() {
            filterUsersTable();
        });
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            filterUsersTable();
        });
    }
    
    // ตั้งค่าการแบ่งหน้า
    setupPagination();
}

// ตัวแปรสำหรับการแบ่งหน้า
let currentPage = 1;
const itemsPerPage = 10;
let filteredUsers = [];

// อัพเดตสถิติแอดมิน
function updateAdminStats() {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // ถ้าไม่มีผู้ใช้ ให้ใช้ข้อมูลเริ่มต้น
    if (users.length === 0) {
        users = getDefaultUsers();
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // คำนวณสถิติ
    const stats = {
        total: users.length,
        active: users.filter(user => user.status === 'active').length,
        admins: users.filter(user => user.role === 'admin').length,
        inactive: users.filter(user => user.status === 'inactive').length
    };
    
    // อัพเดตตัวเลขในแดชบอร์ด
    const totalUsers = document.getElementById('totalUsers');
    const activeUsers = document.getElementById('activeUsers');
    const adminUsers = document.getElementById('adminUsers');
    const inactiveUsers = document.getElementById('inactiveUsers');
    
    if (totalUsers) totalUsers.textContent = stats.total;
    if (activeUsers) activeUsers.textContent = stats.active;
    if (adminUsers) adminUsers.textContent = stats.admins;
    if (inactiveUsers) inactiveUsers.textContent = stats.inactive;
}

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
            name: 'ซุปเปอร์แอดมิน',
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
            name: 'เจ้าหน้าที่',
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
            name: 'พนักงาน',
            role: 'employee',
            status: 'active',
            createdAt: '2023-01-01'
        }
    ];
}

// โหลดตารางผู้ใช้
function loadUsersTable() {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // ถ้าไม่มีผู้ใช้ ให้ใช้ข้อมูลเริ่มต้น
    if (users.length === 0) {
        users = getDefaultUsers();
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // เก็บข้อมูลผู้ใช้ที่กรองแล้ว
    filteredUsers = [...users];
    
    // แสดงผู้ใช้ในตาราง
    displayUsersTable();
}

// แสดงผู้ใช้ในตาราง
function displayUsersTable() {
    const usersTableBody = document.getElementById('usersTableBody');
    if (!usersTableBody) return;
    
    // คำนวณช่วงข้อมูลที่จะแสดง
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const usersToDisplay = filteredUsers.slice(startIndex, endIndex);
    
    // ถ้าไม่มีข้อมูล
    if (usersToDisplay.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-data">
                    <i class="fas fa-user-slash"></i> ไม่พบข้อมูลผู้ใช้
                </td>
            </tr>
        `;
        updatePaginationInfo();
        return;
    }
    
    // สร้างแถวตาราง
    let tableHTML = '';
    
    usersToDisplay.forEach((user, index) => {
        const rowNumber = startIndex + index + 1;
        
        // กำหนดประเภทผู้ใช้
        let roleText = '';
        let roleClass = '';
        
        switch (user.role) {
            case 'admin':
                roleText = 'ผู้ดูแลระบบ';
                roleClass = 'role-admin';
                break;
            case 'officer':
                roleText = 'เจ้าหน้าที่';
                roleClass = 'role-officer';
                break;
            case 'employee':
                roleText = 'พนักงาน';
                roleClass = 'role-employee';
                break;
        }
        
        // กำหนดสถานะ
        let statusText = '';
        let statusClass = '';
        
        if (user.status === 'active') {
            statusText = 'ใช้งาน';
            statusClass = 'status-active';
        } else {
            statusText = 'ระงับ';
            statusClass = 'status-inactive';
        }
        
        // ฟอร์แมตวันที่
        const createdDate = formatDate(user.createdAt);
        
        tableHTML += `
            <tr>
                <td>${rowNumber}</td>
                <td>${user.title}${user.firstName} ${user.lastName}</td>
                <td>${user.username}</td>
                <td>${user.position}</td>
                <td>
                    <span class="role-badge ${roleClass}">${roleText}</span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>${createdDate}</td>
                <td>
                    <div class="user-actions">
                        <button class="btn-action btn-edit" data-id="${user.id}" title="แก้ไข">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" data-id="${user.id}" title="ลบ">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-action btn-toggle" data-id="${user.id}" data-status="${user.status}" title="${user.status === 'active' ? 'ระงับ' : 'เปิดใช้งาน'}">
                            <i class="fas fa-power-off"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    usersTableBody.innerHTML = tableHTML;
    
    // อัพเดตข้อมูลการแบ่งหน้า
    updatePaginationInfo();
    
    // ตั้งค่าเหตุการณ์สำหรับปุ่มจัดการ
    setupUserActionButtons();
}

// ฟอร์แมตวันที่
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear() + 543; // แปลงเป็นปีพุทธศักราช
    
    return `${day}/${month}/${year}`;
}

// ตั้งค่าเหตุการณ์สำหรับปุ่มจัดการผู้ใช้
function setupUserActionButtons() {
    // ปุ่มแก้ไข
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            showEditUserForm(userId);
        });
    });
    
    // ปุ่มลบ
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            showDeleteConfirm(userId);
        });
    });
    
    // ปุ่มเปลี่ยนสถานะ
    const toggleButtons = document.querySelectorAll('.btn-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            const currentStatus = this.getAttribute('data-status');
            toggleUserStatus(userId, currentStatus);
        });
    });
}

// ตั้งค่าการแบ่งหน้า
function setupPagination() {
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayUsersTable();
            }
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayUsersTable();
            }
        });
    }
}

// อัพเดตข้อมูลการแบ่งหน้า
function updatePaginationInfo() {
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    
    const currentCount = document.getElementById('currentCount');
    const totalCount = document.getElementById('totalCount');
    const currentPageElement = document.getElementById('currentPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (currentCount) {
        const startIndex = (currentPage - 1) * itemsPerPage + 1;
        const endIndex = Math.min(startIndex + itemsPerPage - 1, totalUsers);
        currentCount.textContent = totalUsers > 0 ? `${startIndex}-${endIndex}` : '0';
    }
    
    if (totalCount) {
        totalCount.textContent = totalUsers;
    }
    
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
    
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage <= 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage >= totalPages || totalPages === 0;
    }
}

// กรองตารางผู้ใช้
function filterUsersTable(searchTerm = '') {
    // ดึงค่าจากตัวกรองถ้าไม่ระบุพารามิเตอร์
    if (searchTerm === '') {
        const searchInput = document.getElementById('searchUsers');
        searchTerm = searchInput ? searchInput.value : '';
    }
    
    const roleFilter = document.getElementById('filterRole') ? document.getElementById('filterRole').value : '';
    const statusFilter = document.getElementById('filterStatus') ? document.getElementById('filterStatus').value : '';
    
    // ดึงข้อมูลผู้ใช้ทั้งหมด
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // กรองข้อมูล
    filteredUsers = users.filter(user => {
        // กรองด้วยคำค้นหา
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const fullName = `${user.title}${user.firstName} ${user.lastName}`.toLowerCase();
            const username = user.username.toLowerCase();
            const position = user.position.toLowerCase();
            
            if (!fullName.includes(searchLower) && 
                !username.includes(searchLower) && 
                !position.includes(searchLower)) {
                return false;
            }
        }
        
        // กรองด้วยประเภท
        if (roleFilter && user.role !== roleFilter) {
            return false;
        }
        
        // กรองด้วยสถานะ
        if (statusFilter && user.status !== statusFilter) {
            return false;
        }
        
        return true;
    });
    
    // รีเซ็ตหน้าแรก
    currentPage = 1;
    
    // แสดงตารางใหม่
    displayUsersTable();
}

// แสดงฟอร์มเพิ่มผู้ใช้
function showAddUserForm() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('userModalBody');
    const modal = document.getElementById('userModal');
    
    if (!modalTitle || !modalBody || !modal) return;
    
    modalTitle.textContent = 'เพิ่มผู้ใช้ใหม่';
    
    const formHTML = `
        <form id="userForm" data-id="0">
            <div class="form-group">
                <label for="userTitle">คำนำหน้า <span class="required">*</span></label>
                <select id="userTitle" class="form-control" required>
                    <option value="">เลือกคำนำหน้า</option>
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                </select>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="userFirstName">ชื่อ <span class="required">*</span></label>
                    <input type="text" id="userFirstName" class="form-control" placeholder="กรอกชื่อ" required>
                </div>
                
                <div class="form-group">
                    <label for="userLastName">นามสกุล <span class="required">*</span></label>
                    <input type="text" id="userLastName" class="form-control" placeholder="กรอกนามสกุล" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="userPosition">ตำแหน่ง <span class="required">*</span></label>
                <input type="text" id="userPosition" class="form-control" placeholder="กรอกตำแหน่ง" required>
            </div>
            
            <div class="form-group">
                <label for="userBirthDate">วันเดือนปีเกิด</label>
                <input type="date" id="userBirthDate" class="form-control">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="userUsername">ชื่อผู้ใช้ <span class="required">*</span></label>
                    <input type="text" id="userUsername" class="form-control" placeholder="กรอกชื่อผู้ใช้" required>
                    <small class="form-text">ใช้สำหรับล็อคอินเข้าสู่ระบบ</small>
                </div>
                
                <div class="form-group">
                    <label for="userPassword">รหัสผ่าน <span class="required">*</span></label>
                    <input type="password" id="userPassword" class="form-control" placeholder="กรอกรหัสผ่าน" required minlength="6">
                    <small class="form-text">รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร</small>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="userRole">ประเภทผู้ใช้ <span class="required">*</span></label>
                    <select id="userRole" class="form-control" required>
                        <option value="">เลือกประเภทผู้ใช้</option>
                        <option value="employee">พนักงาน</option>
                        <option value="officer">เจ้าหน้าที่</option>
                        <option value="admin">ผู้ดูแลระบบ</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="userStatus">สถานะ <span class="required">*</span></label>
                    <select id="userStatus" class="form-control" required>
                        <option value="active">ใช้งาน</option>
                        <option value="inactive">ระงับ</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> บันทึก
                </button>
                <button type="button" class="btn btn-secondary" id="cancelForm">
                    <i class="fas fa-times"></i> ยกเลิก
                </button>
            </div>
        </form>
    `;
    
    modalBody.innerHTML = formHTML;
    modal.style.display = 'block';
    
    // ตั้งค่าฟอร์ม
    const userForm = document.getElementById('userForm');
    const cancelBtn = document.getElementById('cancelForm');
    
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUser();
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
}

// แสดงฟอร์มแก้ไขผู้ใช้
function showEditUserForm(userId) {
    // ดึงข้อมูลผู้ใช้
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('ไม่พบข้อมูลผู้ใช้');
        return;
    }
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('userModalBody');
    const modal = document.getElementById('userModal');
    
    if (!modalTitle || !modalBody || !modal) return;
    
    modalTitle.textContent = 'แก้ไขข้อมูลผู้ใช้';
    
    const formHTML = `
        <form id="userForm" data-id="${user.id}">
            <div class="form-group">
                <label for="userTitle">คำนำหน้า <span class="required">*</span></label>
                <select id="userTitle" class="form-control" required>
                    <option value="นาย" ${user.title === 'นาย' ? 'selected' : ''}>นาย</option>
                    <option value="นาง" ${user.title === 'นาง' ? 'selected' : ''}>นาง</option>
                    <option value="นางสาว" ${user.title === 'นางสาว' ? 'selected' : ''}>นางสาว</option>
                </select>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="userFirstName">ชื่อ <span class="required">*</span></label>
                    <input type="text" id="userFirstName" class="form-control" value="${user.firstName}" required>
                </div>
                
                <div class="form-group">
                    <label for="userLastName">นามสกุล <span class="required">*</span></label>
                    <input type="text" id="userLastName" class="form-control" value="${user.lastName}" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="userPosition">ตำแหน่ง <span class="required">*</span></label>
                <input type="text" id="userPosition" class="form-control" value="${user.position}" required>
            </div>
            
            <div class="form-group">
                <label for="userBirthDate">วันเดือนปีเกิด</label>
                <input type="date" id="userBirthDate" class="form-control" value="${user.birthDate || ''}">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="userUsername">ชื่อผู้ใช้ <span class="required">*</span></label>
                    <input type="text" id="userUsername" class="form-control" value="${user.username}" required>
                </div>
                
                <div class="form-group">
                    <label for="userPassword">รหัสผ่าน</label>
                    <input type="password" id="userPassword" class="form-control" placeholder="เว้นว่างถ้าไม่ต้องการเปลี่ยน">
                    <small class="form-text">เว้นว่างถ้าไม่ต้องการเปลี่ยนรหัสผ่าน</small>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="userRole">ประเภทผู้ใช้ <span class="required">*</span></label>
                    <select id="userRole" class="form-control" required>
                        <option value="employee" ${user.role === 'employee' ? 'selected' : ''}>พนักงาน</option>
                        <option value="officer" ${user.role === 'officer' ? 'selected' : ''}>เจ้าหน้าที่</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>ผู้ดูแลระบบ</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="userStatus">สถานะ <span class="required">*</span></label>
                    <select id="userStatus" class="form-control" required>
                        <option value="active" ${user.status === 'active' ? 'selected' : ''}>ใช้งาน</option>
                        <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>ระงับ</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> บันทึกการแก้ไข
                </button>
                <button type="button" class="btn btn-secondary" id="cancelForm">
                    <i class="fas fa-times"></i> ยกเลิก
                </button>
            </div>
        </form>
    `;
    
    modalBody.innerHTML = formHTML;
    modal.style.display = 'block';
    
    // ตั้งค่าฟอร์ม
    const userForm = document.getElementById('userForm');
    const cancelBtn = document.getElementById('cancelForm');
    
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUser();
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
}

// บันทึกผู้ใช้
function saveUser() {
    // ดึงค่าจากฟอร์ม
    const userId = parseInt(document.getElementById('userForm').getAttribute('data-id'));
    const isNewUser = userId === 0;
    
    const userData = {
        title: document.getElementById('userTitle').value,
        firstName: document.getElementById('userFirstName').value,
        lastName: document.getElementById('userLastName').value,
        position: document.getElementById('userPosition').value,
        birthDate: document.getElementById('userBirthDate').value || '',
        username: document.getElementById('userUsername').value,
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value
    };
    
    // ถ้ามีการกรอกรหัสผ่านใหม่
    const password = document.getElementById('userPassword').value;
    if (password) {
        userData.password = password;
    }
    
    // ตรวจสอบข้อมูล
    if (!userData.title || !userData.firstName || !userData.username) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    // ดึงข้อมูลผู้ใช้ทั้งหมด
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (isNewUser) {
        // ตรวจสอบชื่อผู้ใช้ซ้ำ
        const usernameExists = users.some(user => user.username === userData.username);
        
        if (usernameExists) {
            alert('ชื่อผู้ใช้นี้มีอยู่แล้ว กรุณาใช้ชื่อผู้ใช้อื่น');
            return;
        }
        
        // ตรวจสอบรหัสผ่านสำหรับผู้ใช้ใหม่
        if (!password) {
            alert('กรุณากรอกรหัสผ่านสำหรับผู้ใช้ใหม่');
            return;
        }
        
        // สร้างชื่อเต็ม
        const fullName = `${userData.title}${userData.firstName} ${userData.lastName}`;
        
        // เพิ่มผู้ใช้ใหม่
        userData.id = Date.now();
        userData.name = fullName;
        userData.createdAt = new Date().toISOString().split('T')[0];
        userData.password = password; // เก็บรหัสผ่าน
        
        users.push(userData);
    } else {
        // แก้ไขผู้ใช้เดิม
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            alert('ไม่พบข้อมูลผู้ใช้');
            return;
        }
        
        // ตรวจสอบชื่อผู้ใช้ซ้ำ (ไม่รวมผู้ใช้ปัจจุบัน)
        const usernameExists = users.some((user, index) => 
            index !== userIndex && user.username === userData.username
        );
        
        if (usernameExists) {
            alert('ชื่อผู้ใช้นี้มีอยู่แล้ว กรุณาใช้ชื่อผู้ใช้อื่น');
            return;
        }
        
        // อัพเดตข้อมูลผู้ใช้
        users[userIndex] = {
            ...users[userIndex],
            ...userData
        };
        
        // ถ้ามีการเปลี่ยนรหัสผ่าน
        if (password) {
            users[userIndex].password = password;
        }
        
        // อัพเดตชื่อเต็ม
        users[userIndex].name = `${userData.title}${userData.firstName} ${userData.lastName}`;
    }
    
    // บันทึกลง localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // ปิด Modal
    document.getElementById('userModal').style.display = 'none';
    
    // โหลดข้อมูลใหม่
    updateAdminStats();
    loadUsersTable();
    
    // แสดงข้อความสำเร็จ
    if (isNewUser) {
        alert(`เพิ่มผู้ใช้ใหม่เรียบร้อยแล้ว\nชื่อผู้ใช้: ${userData.username}\nรหัสผ่าน: ${password}\n\nผู้ใช้สามารถล็อกอินได้ทันทีด้วยชื่อผู้ใช้และรหัสผ่านนี้`);
    } else {
        alert('แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว');
    }
}

// แสดงหน้าต่างยืนยันการลบ
function showDeleteConfirm(userId) {
    // ดึงข้อมูลผู้ใช้
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('ไม่พบข้อมูลผู้ใช้');
        return;
    }
    
    // ตรวจสอบว่าลบผู้ใช้ปัจจุบันหรือไม่
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (user.username === currentUser.username) {
        alert('ไม่สามารถลบบัญชีผู้ใช้ที่กำลังใช้งานอยู่ได้');
        return;
    }
    
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmModal = document.getElementById('confirmModal');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    
    if (!confirmTitle || !confirmMessage || !confirmModal || !confirmDeleteBtn) return;
    
    confirmTitle.textContent = 'ยืนยันการลบผู้ใช้';
    confirmMessage.textContent = `คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ "${user.title}${user.firstName} ${user.lastName}" (${user.username})?`;
    confirmModal.style.display = 'block';
    
    // ลบเหตุการณ์เก่าออกก่อน
    const newConfirmDeleteBtn = confirmDeleteBtn.cloneNode(true);
    confirmDeleteBtn.parentNode.replaceChild(newConfirmDeleteBtn, confirmDeleteBtn);
    
    // เพิ่มเหตุการณ์ใหม่
    newConfirmDeleteBtn.addEventListener('click', function() {
        deleteUser(userId);
    });
}

// ลบผู้ใช้
function deleteUser(userId) {
    // ดึงข้อมูลผู้ใช้ทั้งหมด
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // กรองเอาผู้ใช้ที่ต้องการลบออก
    const filteredUsers = users.filter(user => user.id !== userId);
    
    // บันทึกลง localStorage
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    
    // ปิด Modal
    document.getElementById('confirmModal').style.display = 'none';
    
    // โหลดข้อมูลใหม่
    updateAdminStats();
    loadUsersTable();
    
    // แสดงข้อความสำเร็จ
    alert('ลบผู้ใช้เรียบร้อยแล้ว');
}

// เปลี่ยนสถานะผู้ใช้
function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = newStatus === 'active' ? 'เปิดใช้งาน' : 'ระงับ';
    
    // ตรวจสอบว่ากำลังเปลี่ยนสถานะผู้ใช้ปัจจุบันหรือไม่
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (user && user.username === currentUser.username) {
        alert('ไม่สามารถเปลี่ยนสถานะบัญชีผู้ใช้ที่กำลังใช้งานอยู่ได้');
        return;
    }
    
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะ${actionText}ผู้ใช้นี้?`)) {
        return;
    }
    
    // ดึงข้อมูลผู้ใช้ทั้งหมด
    users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        alert('ไม่พบข้อมูลผู้ใช้');
        return;
    }
    
    // อัพเดตสถานะ
    users[userIndex].status = newStatus;
    
    // บันทึกลง localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // โหลดข้อมูลใหม่
    updateAdminStats();
    loadUsersTable();
    
    // แสดงข้อความสำเร็จ
    alert(`${actionText}ผู้ใช้เรียบร้อยแล้ว`);
}