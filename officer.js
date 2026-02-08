// ระบบสำหรับเจ้าหน้าที่
document.addEventListener('DOMContentLoaded', function() {
    // ตรวจสอบการล็อคอิน
    checkOfficerLogin();
    
    // ตั้งค่าผู้ใช้
    setupOfficerUser();
    
    // เพิ่มเมนูพิเศษสำหรับเจ้าหน้าที่
    setupOfficerMenu();
    
    // โหลดแดชบอร์ด
    loadOfficerDashboard();
});

// ตรวจสอบสถานะการล็อคอินสำหรับเจ้าหน้าที่
function checkOfficerLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // ตรวจสอบสิทธิ์
    if (currentUser.role !== 'officer' && currentUser.role !== 'admin') {
        alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        window.location.href = 'index.html';
    }
}

// ตั้งค่าผู้ใช้เจ้าหน้าที่
function setupOfficerUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && document.getElementById('userName')) {
        document.getElementById('userName').textContent = currentUser.name;
    }
}

// ตั้งค่าเมนูพิเศษสำหรับเจ้าหน้าที่
function setupOfficerMenu() {
    // เมนูสถิติ
    const menuStatistics = document.getElementById('menuStatistics');
    if (menuStatistics) {
        menuStatistics.addEventListener('click', function(e) {
            e.preventDefault();
            loadStatistics();
            closeSidebar();
        });
    }
    
    // เมนูจัดการสมาชิก
    const menuUsers = document.getElementById('menuUsers');
    if (menuUsers) {
        menuUsers.addEventListener('click', function(e) {
            e.preventDefault();
            loadUserManagement();
            closeSidebar();
        });
    }
}

// โหลดแดชบอร์ดเจ้าหน้าที่
function loadOfficerDashboard() {
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!contentArea || !pageTitle) return;
    
    pageTitle.textContent = 'แดชบอร์ดสรุปผล';
    
    // อัพเดตสถิติ
    updateOfficerDashboardStats();
    
    // แสดงคำขอซ่อมล่าสุด
    updateRecentRepairRequests();
}

// อัพเดตสถิติแดชบอร์ดเจ้าหน้าที่
function updateOfficerDashboardStats() {
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // คำนวณสถิติ
    const stats = {
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
    
    if (totalRepairs) totalRepairs.textContent = stats.total;
    if (pendingRepairs) pendingRepairs.textContent = stats.pending + stats.inProgress + stats.testing;
    if (completedRepairs) completedRepairs.textContent = stats.completed;
    if (cancelledRepairs) cancelledRepairs.textContent = stats.cancelled;
}

// อัพเดตคำขอซ่อมล่าสุด
function updateRecentRepairRequests() {
    const recentActivity = document.getElementById('recentActivity');
    if (!recentActivity) return;
    
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // เรียงลำดับจากล่าสุดไปเก่าสุด
    repairs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // เอาแค่ 5 รายการล่าสุด
    const recentRepairs = repairs.slice(0, 5);
    
    // ถ้าไม่มีรายการ
    if (recentRepairs.length === 0) {
        recentActivity.innerHTML = '<p class="no-activity">ไม่มีคำขอซ่อม</p>';
        return;
    }
    
    // สร้าง HTML สำหรับรายการ
    let activityHTML = '';
    
    recentRepairs.forEach(repair => {
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
        
        // กำหนดสถานะ
        let statusText = '';
        let statusClass = '';
        
        switch (repair.status) {
            case 'pending':
                statusText = 'กำลังรับซ่อม';
                statusClass = 'status-pending';
                break;
            case 'in-progress':
                statusText = 'กำลังซ่อม';
                statusClass = 'status-in-progress';
                break;
            case 'testing':
                statusText = 'ทดลองใช้งาน';
                statusClass = 'status-testing';
                break;
            case 'completed':
                statusText = 'เสร็จสิ้น';
                statusClass = 'status-completed';
                break;
            case 'cancelled':
                statusText = 'ยกเลิก';
                statusClass = 'status-cancelled';
                break;
        }
        
        activityHTML += `
            <div class="activity-item">
                <div class="activity-icon ${statusClass}">
                    <i class="fas fa-tools"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${repair.reporterName}</strong> - ${assetTypeText} (${repair.fullAssetCode})</p>
                    <p class="activity-desc">${repair.problemDetails.substring(0, 50)}${repair.problemDetails.length > 50 ? '...' : ''}</p>
                    <div class="activity-footer">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <span class="activity-time">${repair.date} ${repair.time}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    recentActivity.innerHTML = activityHTML;
}

// โหลดหน้าสถิติการซ่อม
// โหลดหน้าสถิติการซ่อม
function loadStatistics() {
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!contentArea || !pageTitle) return;
    
    pageTitle.textContent = 'สถิติการซ่อม';
    
    const statisticsHTML = `
        <div class="statistics-container">
            <div class="statistics-header">
                <h2><i class="fas fa-chart-line"></i> สถิติการซ่อมย้อนหลัง</h2>
                <p>วิเคราะห์ข้อมูลการซ่อมในอดีตเพื่อวางแผนการทำงาน</p>
            </div>
            
            <div class="time-filter">
                <div class="filter-controls">
                    <select id="timeRange" class="form-control">
                        <option value="month">เดือนนี้</option>
                        <option value="last-month">เดือนที่แล้ว</option>
                        <option value="quarter">ไตรมาสนี้</option>
                        <option value="year">ปีนี้</option>
                        <option value="all-time">ทั้งหมด</option>
                    </select>
                    
                    <input type="month" id="customMonth" class="form-control" style="display: none;">
                    
                    <button class="btn btn-primary" id="applyFilter">
                        <i class="fas fa-filter"></i> กรอง
                    </button>
                </div>
            </div>
            
            <div class="statistics-grid">
                <!-- สถิติสำคัญ -->
                <div class="stat-card-large">
                    <div class="stat-card-header">
                        <h3><i class="fas fa-crown"></i> อันดับครุภัณฑ์ที่ซ่อมบ่อย</h3>
                    </div>
                    <div class="stat-card-body">
                        <div class="top-assets-list" id="topAssetsList">
                            <div class="loading-message">
                                <i class="fas fa-spinner fa-spin"></i> กำลังโหลดข้อมูล...
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="stat-card-large">
                    <div class="stat-card-header">
                        <h3><i class="fas fa-user-tie"></i> อันดับผู้แจ้งซ่อมมากที่สุด</h3>
                    </div>
                    <div class="stat-card-body">
                        <div class="top-reporters-list" id="topReportersList">
                            <div class="loading-message">
                                <i class="fas fa-spinner fa-spin"></i> กำลังโหลดข้อมูล...
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- กราฟ -->
                <div class="stat-card-full">
                    <div class="stat-card-header">
                        <h3><i class="fas fa-chart-bar"></i> สถิติตามประเภทครุภัณฑ์</h3>
                    </div>
                    <div class="stat-card-body">
                        <canvas id="assetTypeChart"></canvas>
                    </div>
                </div>
                
                <div class="stat-card-full">
                    <div class="stat-card-header">
                        <h3><i class="fas fa-chart-pie"></i> สถิติตามแผนก</h3>
                    </div>
                    <div class="stat-card-body">
                        <canvas id="departmentChart"></canvas>
                    </div>
                </div>
                
                <div class="stat-card-full">
                    <div class="stat-card-header">
                        <h3><i class="fas fa-calendar-alt"></i> แนวโน้มการซ่อมรายเดือน</h3>
                    </div>
                    <div class="stat-card-body">
                        <canvas id="monthlyTrendChart"></canvas>
                    </div>
                </div>
                
                <!-- รายละเอียด -->
                <div class="stat-card-full">
                    <div class="stat-card-header">
                        <h3><i class="fas fa-file-alt"></i> รายงานสรุป</h3>
                    </div>
                    <div class="stat-card-body">
                        <div class="detailed-report" id="detailedReport">
                            <!-- รายงานจะถูกเพิ่มที่นี่ -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = statisticsHTML;
    
    // โหลดข้อมูลสถิติ
    loadStatisticsData('month');
    
    // ตั้งค่าการกรอง
    setupStatisticsFilter();
}

// โหลดข้อมูลสถิติตามช่วงเวลา
function loadStatisticsData(timeRange = 'month') {
    // ดึงรายการซ่อมจาก localStorage
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // กรองข้อมูลตามช่วงเวลา
    const filteredRepairs = filterRepairsByTimeRange(repairs, timeRange);
    
    // ถ้าไม่มีข้อมูล
    if (filteredRepairs.length === 0) {
        document.getElementById('topAssetsList').innerHTML = '<p class="no-data">ไม่มีข้อมูลการซ่อมในช่วงเวลาที่เลือก</p>';
        document.getElementById('topReportersList').innerHTML = '<p class="no-data">ไม่มีข้อมูลการซ่อมในช่วงเวลาที่เลือก</p>';
        document.getElementById('detailedReport').innerHTML = '<p>ไม่มีข้อมูลสำหรับสร้างรายงานสรุป</p>';
        return;
    }
    
    // 1. อันดับครุภัณฑ์ที่ซ่อมบ่อย
    const assetRepairCounts = {};
    filteredRepairs.forEach(repair => {
        const assetCode = repair.fullAssetCode;
        assetRepairCounts[assetCode] = (assetRepairCounts[assetCode] || 0) + 1;
    });
    
    // แปลงเป็นอาร์เรย์และเรียงลำดับ
    const sortedAssets = Object.entries(assetRepairCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    // แสดงรายการ
    const topAssetsList = document.getElementById('topAssetsList');
    let topAssetsHTML = '';
    
    sortedAssets.forEach(([assetCode, count], index) => {
        // หาประเภทจากตัวอักษรแรก
        const assetType = assetCode.charAt(0);
        const typeName = getAssetTypeText(assetType);
        
        topAssetsHTML += `
            <div class="top-item">
                <div class="rank ${index < 3 ? 'top-' + (index + 1) : ''}">${index + 1}</div>
                <div class="item-info">
                    <div class="item-name">${assetCode}</div>
                    <div class="item-details">${typeName} | ซ่อม ${count} ครั้ง</div>
                </div>
                <div class="item-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(count / Math.max(...sortedAssets.map(a => a[1]))) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    topAssetsList.innerHTML = topAssetsHTML;
    
    // 2. อันดับผู้แจ้งซ่อมมากที่สุด
    const reporterCounts = {};
    filteredRepairs.forEach(repair => {
        const reporter = repair.reporterName;
        reporterCounts[reporter] = (reporterCounts[reporter] || 0) + 1;
    });
    
    // แปลงเป็นอาร์เรย์และเรียงลำดับ
    const sortedReporters = Object.entries(reporterCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    // แสดงรายการ
    const topReportersList = document.getElementById('topReportersList');
    let topReportersHTML = '';
    
    sortedReporters.forEach(([reporter, count], index) => {
        topReportersHTML += `
            <div class="top-item">
                <div class="rank ${index < 3 ? 'top-' + (index + 1) : ''}">${index + 1}</div>
                <div class="item-info">
                    <div class="item-name">${reporter}</div>
                    <div class="item-details">แจ้งซ่อม ${count} ครั้ง</div>
                </div>
                <div class="item-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(count / Math.max(...sortedReporters.map(r => r[1]))) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    topReportersList.innerHTML = topReportersHTML;
    
    // 3. สร้างกราฟประเภทครุภัณฑ์
    createAssetTypeChart(filteredRepairs);
    
    // 4. สร้างกราฟแผนก
    createDepartmentChart(filteredRepairs);
    
    // 5. สร้างกราฟแนวโน้มรายเดือน
    createMonthlyTrendChart(filteredRepairs, timeRange);
    
    // 6. สร้างรายงานสรุป
    createDetailedReport(filteredRepairs, timeRange);
}

// กรองข้อมูลตามช่วงเวลา
function filterRepairsByTimeRange(repairs, timeRange) {
    const now = new Date();
    let startDate, endDate;
    
    switch (timeRange) {
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
        case 'last-month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
        case 'quarter':
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
            break;
        case 'all-time':
            return repairs; // คืนค่าทั้งหมด
        default:
            return repairs;
    }
    
    return repairs.filter(repair => {
        const repairDate = new Date(repair.timestamp);
        return repairDate >= startDate && repairDate <= endDate;
    });
}

// สร้างกราฟประเภทครุภัณฑ์
function createAssetTypeChart(repairs) {
    const assetTypeCounts = {};
    repairs.forEach(repair => {
        const type = repair.assetType;
        assetTypeCounts[type] = (assetTypeCounts[type] || 0) + 1;
    });
    
    const labels = Object.keys(assetTypeCounts).map(key => `${key} - ${getAssetTypeText(key)}`);
    const data = Object.values(assetTypeCounts);
    
    const ctx = document.getElementById('assetTypeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'จำนวนการซ่อม',
                data: data,
                backgroundColor: [
                    '#3498db', '#2ecc71', '#e74c3c', '#f39c12',
                    '#9b59b6', '#1abc9c', '#34495e', '#d35400',
                    '#c0392b', '#8e44ad'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// สร้างกราฟแผนก
function createDepartmentChart(repairs) {
    const departmentCounts = {};
    repairs.forEach(repair => {
        const dept = repair.reporterDepartment;
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });
    
    const ctx = document.getElementById('departmentChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(departmentCounts),
            datasets: [{
                data: Object.values(departmentCounts),
                backgroundColor: [
                    '#3498db', '#2ecc71', '#e74c3c', '#f39c12',
                    '#9b59b6', '#1abc9c', '#34495e', '#d35400'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// สร้างกราฟแนวโน้มรายเดือน
function createMonthlyTrendChart(repairs, timeRange) {
    const monthlyCounts = {};
    
    repairs.forEach(repair => {
        const date = new Date(repair.timestamp);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = `${date.getMonth() + 1}/${date.getFullYear() + 543}`;
        
        monthlyCounts[monthKey] = {
            label: monthLabel,
            count: (monthlyCounts[monthKey]?.count || 0) + 1
        };
    });
    
    // เรียงลำดับเดือน
    const sortedMonths = Object.keys(monthlyCounts).sort();
    
    const labels = sortedMonths.map(key => monthlyCounts[key].label);
    const data = sortedMonths.map(key => monthlyCounts[key].count);
    
    const ctx = document.getElementById('monthlyTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'จำนวนการซ่อม',
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// สร้างรายงานสรุป
function createDetailedReport(repairs, timeRange) {
    const total = repairs.length;
    const completed = repairs.filter(r => r.status === 'completed').length;
    const cancelled = repairs.filter(r => r.status === 'cancelled').length;
    const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    
    // คำนวณเวลาเฉลี่ย
    let totalDuration = 0;
    let completedCount = 0;
    
    repairs.forEach(repair => {
        if (repair.status === 'completed' && repair.timestamp) {
            const created = new Date(repair.timestamp);
            const completed = new Date(); // ในระบบจริงควรมีวันที่เสร็จสิ้น
            const duration = Math.floor((completed - created) / (1000 * 60 * 60 * 24));
            totalDuration += duration;
            completedCount++;
        }
    });
    
    const avgDuration = completedCount > 0 ? (totalDuration / completedCount).toFixed(1) : 0;
    
    // หาครุภัณฑ์ที่ซ่อมบ่อยที่สุด
    const assetFrequency = {};
    repairs.forEach(repair => {
        const assetCode = repair.fullAssetCode;
        assetFrequency[assetCode] = (assetFrequency[assetCode] || 0) + 1;
    });
    
    let mostFrequentAsset = 'ไม่มีข้อมูล';
    let maxFrequency = 0;
    
    Object.entries(assetFrequency).forEach(([assetCode, frequency]) => {
        if (frequency > maxFrequency) {
            maxFrequency = frequency;
            mostFrequentAsset = assetCode;
        }
    });
    
    const reportHTML = `
        <div class="report-content">
            <div class="report-summary">
                <div class="report-item">
                    <h4>ภาพรวม</h4>
                    <ul>
                        <li>จำนวนการซ่อมทั้งหมด: <strong>${total}</strong> ครั้ง</li>
                        <li>อัตราความสำเร็จ: <strong>${successRate}%</strong></li>
                        <li>เวลาดำเนินการเฉลี่ย: <strong>${avgDuration}</strong> วัน</li>
                        <li>ครุภัณฑ์ที่ซ่อมบ่อยที่สุด: <strong>${mostFrequentAsset}</strong> (${maxFrequency} ครั้ง)</li>
                    </ul>
                </div>
                
                <div class="report-item">
                    <h4>ข้อสังเกต</h4>
                    <ul>
                        ${total === 0 ? '<li>ไม่มีข้อมูลการซ่อมในช่วงเวลานี้</li>' : ''}
                        ${successRate < 50 ? '<li><span class="warning">⚠️ อัตราความสำเร็จต่ำ ควรปรับปรุงกระบวนการซ่อม</span></li>' : ''}
                        ${avgDuration > 7 ? '<li><span class="warning">⚠️ เวลาดำเนินการยาวนาน ควรตรวจสอบประสิทธิภาพการซ่อม</span></li>' : ''}
                        ${maxFrequency > 5 ? `<li><span class="warning">⚠️ ครุภัณฑ์ ${mostFrequentAsset} ซ่อมบ่อยเกินไป ควรพิจารณาซื้อใหม่</span></li>` : ''}
                    </ul>
                </div>
                
                <div class="report-item">
                    <h4>คำแนะนำ</h4>
                    <ul>
                        <li>${successRate < 70 ? 'เพิ่มประสิทธิภาพทีมซ่อม' : 'รักษาระดับประสิทธิภาพ'}</li>
                        <li>${avgDuration > 5 ? 'ลดเวลาดำเนินการโดยจัดลำดับความสำคัญ' : 'เวลาดำเนินการอยู่ในเกณฑ์ดี'}</li>
                        <li>${maxFrequency > 3 ? 'พิจารณาครุภัณฑ์ที่ซ่อมบ่อยสำหรับการเปลี่ยนใหม่' : 'ครุภัณฑ์ทั้งหมดอยู่ในสภาพดี'}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('detailedReport').innerHTML = reportHTML;
}

// โหลดหน้าจัดการสมาชิก
function loadUserManagement() {
    const contentArea = document.getElementById('contentArea');
    const pageTitle = document.getElementById('pageTitle');
    
    if (!contentArea || !pageTitle) return;
    
    pageTitle.textContent = 'จัดการสมาชิก';
    
    const userManagementHTML = `
        <div class="user-management-container">
            <div class="user-management-header">
                <h2><i class="fas fa-users"></i> จัดการสมาชิกระบบ</h2>
                <p>เพิ่ม แก้ไข และลบผู้ใช้งานระบบ</p>
            </div>
            
            <div class="user-management-actions">
                <button class="btn btn-primary" id="addUserBtn">
                    <i class="fas fa-user-plus"></i> เพิ่มสมาชิกใหม่
                </button>
                
                <div class="search-box">
                    <input type="text" id="searchUser" class="form-control" placeholder="ค้นหาสมาชิก">
                    <button class="btn btn-secondary" id="searchUserBtn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            
            <div class="users-table-container">
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>ชื่อ-นามสกุล</th>
                            <th>ชื่อผู้ใช้</th>
                            <th>ตำแหน่ง</th>
                            <th>ประเภทผู้ใช้</th>
                            <th>สถานะ</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody">
                        <!-- รายการผู้ใช้จะถูกเพิ่มที่นี่ -->
                        <tr>
                            <td colspan="7" class="loading-cell">
                                <i class="fas fa-spinner fa-spin"></i> กำลังโหลดข้อมูล...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    contentArea.innerHTML = userManagementHTML;
    
    // โหลดข้อมูลผู้ใช้
    loadUsers();
    
    // ตั้งค่าปุ่มเพิ่มสมาชิก
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserForm);
    }
    
    // ตั้งค่าการค้นหา
    const searchUserBtn = document.getElementById('searchUserBtn');
    const searchUserInput = document.getElementById('searchUser');
    
    if (searchUserBtn && searchUserInput) {
        searchUserBtn.addEventListener('click', () => filterUsers(searchUserInput.value));
        searchUserInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterUsers(searchUserInput.value);
        });
    }
}

// โหลดข้อมูลผู้ใช้
// ใน officer.js - ฟังก์ชัน loadUsers()
function loadUsers() {
    const usersTableBody = document.getElementById('usersTableBody');
    if (!usersTableBody) return;
    
    // ดึงข้อมูลผู้ใช้จาก localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // ถ้าไม่มีผู้ใช้ ให้ใช้ข้อมูลเริ่มต้นจาก auth.js
    if (users.length === 0) {
        // รีเฟรชจาก auth.js
        const defaultUsers = [
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
        
        users = defaultUsers;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // แสดงข้อมูลผู้ใช้
    displayUsers(users);
}

// แสดงข้อมูลผู้ใช้ในตาราง
function displayUsers(users) {
    const usersTableBody = document.getElementById('usersTableBody');
    if (!usersTableBody) return;
    
    if (users.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">
                    <i class="fas fa-user-slash"></i> ไม่มีข้อมูลผู้ใช้
                </td>
            </tr>
        `;
        return;
    }
    
    let usersHTML = '';
    
    users.forEach((user, index) => {
        // กำหนดประเภทผู้ใช้
        let roleText = '';
        let roleClass = '';
        
        switch (user.role) {
            case 'admin':
                roleText = 'ซุปเปอร์แอดมิน';
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
        
        usersHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.title}${user.firstName} ${user.lastName}</td>
                <td>${user.username}</td>
                <td>${user.position}</td>
                <td>
                    <span class="role-badge ${roleClass}">${roleText}</span>
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="user-actions">
                        <button class="btn-action btn-edit" data-id="${user.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" data-id="${user.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="btn-action btn-toggle-status" data-id="${user.id}" data-status="${user.status}">
                            <i class="fas fa-power-off"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    usersTableBody.innerHTML = usersHTML;
    
    // ตั้งค่าเหตุการณ์สำหรับปุ่มจัดการ
    setupUserActionButtons();
}

// ตั้งค่าปุ่มจัดการผู้ใช้
function setupUserActionButtons() {
    // ปุ่มแก้ไข
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            editUser(userId);
        });
    });
    
    // ปุ่มลบ
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            deleteUser(userId);
        });
    });
    
    // ปุ่มเปลี่ยนสถานะ
    const toggleButtons = document.querySelectorAll('.btn-toggle-status');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            const currentStatus = this.getAttribute('data-status');
            toggleUserStatus(userId, currentStatus);
        });
    });
}

// แสดงฟอร์มเพิ่มผู้ใช้
function showAddUserForm() {
    const formHTML = `
        <div class="add-user-form">
            <h3><i class="fas fa-user-plus"></i> เพิ่มสมาชิกใหม่</h3>
            
            <form id="newUserForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="userTitle">คำนำหน้า <span class="required">*</span></label>
                        <select id="userTitle" class="form-control" required>
                            <option value="">เลือกคำนำหน้า</option>
                            <option value="นาย">นาย</option>
                            <option value="นาง">นาง</option>
                            <option value="นางสาว">นางสาว</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="userFirstName">ชื่อ <span class="required">*</span></label>
                        <input type="text" id="userFirstName" class="form-control" placeholder="กรอกชื่อ" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="userLastName">นามสกุล <span class="required">*</span></label>
                        <input type="text" id="userLastName" class="form-control" placeholder="กรอกนามสกุล" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="userPosition">ตำแหน่ง <span class="required">*</span></label>
                        <input type="text" id="userPosition" class="form-control" placeholder="กรอกตำแหน่ง" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="userBirthDate">วันเดือนปีเกิด <span class="required">*</span></label>
                        <input type="date" id="userBirthDate" class="form-control" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="userUsername">ชื่อผู้ใช้งาน <span class="required">*</span></label>
                        <input type="text" id="userUsername" class="form-control" placeholder="กรอกชื่อผู้ใช้งาน" required>
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
                            <option value="admin">ซุปเปอร์แอดมิน</option>
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
                    <button type="button" class="btn btn-secondary" id="cancelAddUser">
                        <i class="fas fa-times"></i> ยกเลิก
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal('เพิ่มสมาชิกใหม่', formHTML);
    
    // ตั้งค่าฟอร์ม
    const newUserForm = document.getElementById('newUserForm');
    const cancelBtn = document.getElementById('cancelAddUser');
    
    if (newUserForm) {
        newUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNewUser();
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.getElementById('detailModal').style.display = 'none';
        });
    }
}

// บันทึกผู้ใช้ใหม่
function saveNewUser() {
    // ดึงค่าจากฟอร์ม
    const userData = {
        id: Date.now(),
        title: document.getElementById('userTitle').value,
        firstName: document.getElementById('userFirstName').value,
        lastName: document.getElementById('userLastName').value,
        position: document.getElementById('userPosition').value,
        birthDate: document.getElementById('userBirthDate').value,
        username: document.getElementById('userUsername').value,
        password: document.getElementById('userPassword').value,
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    // ตรวจสอบข้อมูล
    if (!userData.title || !userData.firstName || !userData.username || !userData.password) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    // ตรวจสอบชื่อผู้ใช้ซ้ำ
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const usernameExists = users.some(user => user.username === userData.username);
    
    if (usernameExists) {
        alert('ชื่อผู้ใช้นี้มีอยู่แล้ว กรุณาใช้ชื่อผู้ใช้อื่น');
        return;
    }
    
    // เพิ่มผู้ใช้ใหม่
    users.push(userData);
    
    // บันทึกลง localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // ปิด Modal
    document.getElementById('detailModal').style.display = 'none';
    
    // โหลดข้อมูลผู้ใช้ใหม่
    loadUsers();
    
    // แสดงข้อความสำเร็จ
    alert('เพิ่มสมาชิกใหม่เรียบร้อยแล้ว');
}

// แก้ไขผู้ใช้
function editUser(userId) {
    // ดึงข้อมูลผู้ใช้
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        alert('ไม่พบข้อมูลผู้ใช้');
        return;
    }
    
    const user = users[userIndex];
    
    // แสดงฟอร์มแก้ไข
    const formHTML = `
        <div class="edit-user-form">
            <h3><i class="fas fa-user-edit"></i> แก้ไขข้อมูลสมาชิก</h3>
            
            <form id="editUserForm" data-id="${user.id}">
                <div class="form-row">
                    <div class="form-group">
                        <label for="editUserTitle">คำนำหน้า <span class="required">*</span></label>
                        <select id="editUserTitle" class="form-control" required>
                            <option value="นาย" ${user.title === 'นาย' ? 'selected' : ''}>นาย</option>
                            <option value="นาง" ${user.title === 'นาง' ? 'selected' : ''}>นาง</option>
                            <option value="นางสาว" ${user.title === 'นางสาว' ? 'selected' : ''}>นางสาว</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editUserFirstName">ชื่อ <span class="required">*</span></label>
                        <input type="text" id="editUserFirstName" class="form-control" value="${user.firstName}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editUserLastName">นามสกุล <span class="required">*</span></label>
                        <input type="text" id="editUserLastName" class="form-control" value="${user.lastName}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editUserPosition">ตำแหน่ง <span class="required">*</span></label>
                        <input type="text" id="editUserPosition" class="form-control" value="${user.position}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editUserBirthDate">วันเดือนปีเกิด <span class="required">*</span></label>
                        <input type="date" id="editUserBirthDate" class="form-control" value="${user.birthDate}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editUserUsername">ชื่อผู้ใช้งาน <span class="required">*</span></label>
                        <input type="text" id="editUserUsername" class="form-control" value="${user.username}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editUserPassword">รหัสผ่าน</label>
                        <input type="password" id="editUserPassword" class="form-control" placeholder="เว้นว่างถ้าไม่ต้องการเปลี่ยน">
                        <small class="form-text">เว้นว่างถ้าไม่ต้องการเปลี่ยนรหัสผ่าน</small>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editUserRole">ประเภทผู้ใช้ <span class="required">*</span></label>
                        <select id="editUserRole" class="form-control" required>
                            <option value="employee" ${user.role === 'employee' ? 'selected' : ''}>พนักงาน</option>
                            <option value="officer" ${user.role === 'officer' ? 'selected' : ''}>เจ้าหน้าที่</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>ซุปเปอร์แอดมิน</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editUserStatus">สถานะ <span class="required">*</span></label>
                        <select id="editUserStatus" class="form-control" required>
                            <option value="active" ${user.status === 'active' ? 'selected' : ''}>ใช้งาน</option>
                            <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>ระงับ</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> บันทึกการแก้ไข
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelEditUser">
                        <i class="fas fa-times"></i> ยกเลิก
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal('แก้ไขข้อมูลสมาชิก', formHTML);
    
    // ตั้งค่าฟอร์ม
    const editUserForm = document.getElementById('editUserForm');
    const cancelBtn = document.getElementById('cancelEditUser');
    
    if (editUserForm) {
        editUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveEditedUser(userId);
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.getElementById('detailModal').style.display = 'none';
        });
    }
}

// บันทึกการแก้ไขผู้ใช้
function saveEditedUser(userId) {
    // ดึงค่าจากฟอร์ม
    const userData = {
        title: document.getElementById('editUserTitle').value,
        firstName: document.getElementById('editUserFirstName').value,
        lastName: document.getElementById('editUserLastName').value,
        position: document.getElementById('editUserPosition').value,
        birthDate: document.getElementById('editUserBirthDate').value,
        username: document.getElementById('editUserUsername').value,
        role: document.getElementById('editUserRole').value,
        status: document.getElementById('editUserStatus').value
    };
    
    // ถ้ามีการกรอกรหัสผ่านใหม่
    const newPassword = document.getElementById('editUserPassword').value;
    if (newPassword) {
        userData.password = newPassword;
    }
    
    // ดึงข้อมูลผู้ใช้ทั้งหมด
    let users = JSON.parse(localStorage.getItem('users')) || [];
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
    
    // บันทึกลง localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // ปิด Modal
    document.getElementById('detailModal').style.display = 'none';
    
    // โหลดข้อมูลผู้ใช้ใหม่
    loadUsers();
    
    // แสดงข้อความสำเร็จ
    alert('แก้ไขข้อมูลสมาชิกเรียบร้อยแล้ว');
}

// ลบผู้ใช้
function deleteUser(userId) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
        return;
    }
    
    // ดึงข้อมูลผู้ใช้ทั้งหมด
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // กรองเอาผู้ใช้ที่ต้องการลบออก
    const filteredUsers = users.filter(user => user.id !== userId);
    
    // บันทึกลง localStorage
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    
    // โหลดข้อมูลผู้ใช้ใหม่
    loadUsers();
    
    // แสดงข้อความสำเร็จ
    alert('ลบผู้ใช้เรียบร้อยแล้ว');
}

// เปลี่ยนสถานะผู้ใช้
function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const statusText = newStatus === 'active' ? 'เปิดใช้งาน' : 'ระงับการใช้งาน';
    
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะ${statusText}ผู้ใช้นี้?`)) {
        return;
    }
    
    // ดึงข้อมูลผู้ใช้ทั้งหมด
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        alert('ไม่พบข้อมูลผู้ใช้');
        return;
    }
    
    // อัพเดตสถานะ
    users[userIndex].status = newStatus;
    
    // บันทึกลง localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // โหลดข้อมูลผู้ใช้ใหม่
    loadUsers();
    
    // แสดงข้อความสำเร็จ
    alert(`${statusText}ผู้ใช้เรียบร้อยแล้ว`);
}

// กรองผู้ใช้
function filterUsers(searchTerm) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        users = users.filter(user => 
            user.firstName.toLowerCase().includes(term) ||
            user.lastName.toLowerCase().includes(term) ||
            user.username.toLowerCase().includes(term) ||
            user.position.toLowerCase().includes(term)
        );
    }
    
    displayUsers(users);
}