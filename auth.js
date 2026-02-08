// ระบบตรวจสอบการล็อคอิน
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const userTypeSelect = document.getElementById('userType');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const loginError = document.getElementById('loginError');
    const themeToggle = document.getElementById('themeToggle');
    
    // ข้อมูลผู้ใช้เริ่มต้น (เฉพาะบัญชีพื้นฐาน)
    const defaultUsers = [
        {
            id: 1,
            username: 'G1',
            password: '123456',
            name: 'ซุปเปอร์แอดมิน',
            role: 'admin',
            title: 'นาย',
            firstName: 'สมชาย',
            lastName: 'ใจดี',
            position: 'ผู้ดูแลระบบ',
            birthDate: '1990-01-15',
            status: 'active',
            createdAt: '2023-01-01'
        },
        {
            id: 2,
            username: 'G2',
            password: '123456',
            name: 'เจ้าหน้าที่',
            role: 'officer',
            title: 'นางสาว',
            firstName: 'สมหญิง',
            lastName: 'รักงาน',
            position: 'เจ้าหน้าที่',
            birthDate: '1992-05-20',
            status: 'active',
            createdAt: '2023-01-01'
        },
        {
            id: 3,
            username: 'G3',
            password: '123456',
            name: 'พนักงาน',
            role: 'employee',
            title: 'นาย',
            firstName: 'สมหมาย',
            lastName: 'ทำงาน',
            position: 'พนักงาน',
            birthDate: '1995-08-30',
            status: 'active',
            createdAt: '2023-01-01'
        }
    ];
    
    // ตรวจสอบและสร้างข้อมูลผู้ใช้เริ่มต้นใน localStorage
    function initializeUsers() {
        let users = JSON.parse(localStorage.getItem('users'));
        
        // ถ้าไม่มีข้อมูลผู้ใช้ใน localStorage ให้ใช้ข้อมูลเริ่มต้น
        if (!users || users.length === 0) {
            localStorage.setItem('users', JSON.stringify(defaultUsers));
            users = defaultUsers;
        }
        
        return users;
    }
    
    // ฟังก์ชันแสดง/ซ่อนรหัสผ่าน
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // ฟังก์ชันสลับโหมดกลางวัน/กลางคืน
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
    
    // อัพเดตไอคอนปุ่มสลับโหมด
    function updateThemeToggleIcon(isDarkMode) {
        if (themeToggle) {
            if (isDarkMode) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> โหมดกลางวัน';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i> โหมดกลางคืน';
            }
        }
    }
    
    // ฟังก์ชันตรวจสอบการล็อคอิน
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userType = userTypeSelect.value;
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // ตรวจสอบข้อมูล
            if (!userType || !username || !password) {
                showError('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
            }
            
            // ดึงข้อมูลผู้ใช้จาก localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            // ถ้าไม่มีข้อมูลผู้ใช้ ให้ใช้ข้อมูลเริ่มต้น
            if (users.length === 0) {
                users = initializeUsers();
            }
            
            // ค้นหาผู้ใช้ตามชื่อผู้ใช้และรหัสผ่าน
            let isValid = false;
            let userData = null;
            
            // ค้นหาผู้ใช้ที่ตรงกับชื่อผู้ใช้และรหัสผ่าน
            const foundUser = users.find(user => 
                user.username === username && user.password === password
            );
            
            if (foundUser) {
                // ตรวจสอบประเภทผู้ใช้ (ถ้าต้องการจำกัดตาม userType)
                if (userType === 'admin' && foundUser.role !== 'admin') {
                    showError('บัญชีนี้ไม่มีสิทธิ์เป็นผู้ดูแลระบบ');
                    return;
                } else if (userType === 'officer' && foundUser.role === 'employee') {
                    showError('บัญชีนี้ไม่มีสิทธิ์เป็นเจ้าหน้าที่');
                    return;
                }
                
                isValid = true;
                userData = {
                    username: foundUser.username,
                    name: foundUser.name,
                    role: foundUser.role,
                    id: foundUser.id
                };
            }
            
            // ถ้าล็อคอินสำเร็จ
            if (isValid && userData) {
                // บันทึกข้อมูลผู้ใช้ใน localStorage
                localStorage.setItem('currentUser', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                // นำทางไปยังหน้าเมนูตามสิทธิ์
                redirectBasedOnRole(userData.role);
            } else {
                showError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        });
    }
    
    // ฟังก์ชันนำทางตามบทบาท
    function redirectBasedOnRole(role) {
        if (role === 'admin') {
            // แอดมินสามารถเลือกได้ว่าจะเข้าเป็นพนักงานหรือเจ้าหน้าที่
            if (confirm('ซุปเปอร์แอดมิน: คุณต้องการเข้าสู่ระบบในฐานะใด?\nตกลง = เจ้าหน้าที่\nยกเลิก = พนักงาน')) {
                window.location.href = 'officer.html';
            } else {
                window.location.href = 'employee.html';
            }
        } else if (role === 'officer') {
            window.location.href = 'officer.html';
        } else if (role === 'employee') {
            window.location.href = 'employee.html';
        }
    }
    
    // ฟังก์ชันแสดงข้อความผิดพลาด
    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'block';
            
            // ซ่อนข้อความผิดพลาดหลังจาก 5 วินาที
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
    
    // ตรวจสอบว่าผู้ใช้ล็อกอินอยู่แล้วหรือไม่
    function checkIfAlreadyLoggedIn() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (isLoggedIn && currentUser) {
            // นำทางไปยังหน้าเมนูตามสิทธิ์
            redirectBasedOnRole(currentUser.role);
        }
    }
    
    // เรียกตรวจสอบเมื่อโหลดหน้า
    checkIfAlreadyLoggedIn();
});