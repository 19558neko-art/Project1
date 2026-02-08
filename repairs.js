// ฟังก์ชันสำหรับจัดการการซ่อม
document.addEventListener('DOMContentLoaded', function() {
    // ตรวจสอบและเตรียมข้อมูลเริ่มต้น
    initializeRepairsData();
});

// เริ่มต้นข้อมูลการซ่อม
function initializeRepairsData() {
    // ตรวจสอบว่ามีข้อมูลการซ่อมใน localStorage หรือไม่
    if (!localStorage.getItem('repairs')) {
        // สร้างข้อมูลการซ่อมตัวอย่าง
        const sampleRepairs = [
            {
                id: 1001,
                reporterName: 'สมชาย ใจดี',
                reporterDepartment: 'it',
                reporterPhone: '0812345678',
                assetType: 'A',
                assetCode: '001',
                fullAssetCode: 'A001',
                assetLocation: 'แผนกไอที ชั้น 3',
                problemDetails: 'คอมพิวเตอร์ไม่สามารถเปิดได้ ไฟไม่ติด',
                urgency: 'urgent',
                status: 'completed',
                date: '15 ก.ย. 2566',
                time: '10:30 น.',
                timestamp: '2023-09-15T10:30:00'
            },
            {
                id: 1002,
                reporterName: 'สมหญิง รักงาน',
                reporterDepartment: 'hr',
                reporterPhone: '0898765432',
                assetType: 'B',
                assetCode: '005',
                fullAssetCode: 'B005',
                assetLocation: 'แผนกบุคคล ชั้น 2',
                problemDetails: 'เครื่องปรับอากาศไม่เย็น มีเสียงดัง',
                urgency: 'normal',
                status: 'in-progress',
                date: '14 ก.ย. 2566',
                time: '14:15 น.',
                timestamp: '2023-09-14T14:15:00'
            },
            {
                id: 1003,
                reporterName: 'สมหมาย ทำงาน',
                reporterDepartment: 'finance',
                reporterPhone: '0865432198',
                assetType: 'F',
                assetCode: '003',
                fullAssetCode: 'F003',
                assetLocation: 'ห้องประชุมใหญ่',
                problemDetails: 'โปรเจกเตอร์แสดงภาพไม่ชัด',
                urgency: 'very-urgent',
                status: 'pending',
                date: '13 ก.ย. 2566',
                time: '09:00 น.',
                timestamp: '2023-09-13T09:00:00'
            }
        ];
        
        localStorage.setItem('repairs', JSON.stringify(sampleRepairs));
    }
}

// ฟังก์ชันสำหรับค้นหาการซ่อม
function searchRepairs(searchTerm, filters = {}) {
    let repairs = JSON.parse(localStorage.getItem('repairs')) || [];
    
    // กรองด้วยคำค้นหา
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        repairs = repairs.filter(repair => 
            repair.id.toString().includes(term) ||
            repair.reporterName.toLowerCase().includes(term) ||
            repair.fullAssetCode.toLowerCase().includes(term) ||
            repair.problemDetails.toLowerCase().includes(term)
        );
    }
    
    // กรองด้วยสถานะ
    if (filters.status) {
        repairs = repairs.filter(repair => repair.status === filters.status);
    }
    
    // กรองด้วยประเภท
    if (filters.assetType) {
        repairs = repairs.filter(repair => repair.assetType === filters.assetType);
    }
    
    // กรองด้วยแผนก
    if (filters.department) {
        repairs = repairs.filter(repair => repair.reporterDepartment === filters.department);
    }
    
    // กรองด้วยช่วงเวลา
    if (filters.startDate && filters.endDate) {
        repairs = repairs.filter(repair => {
            const repairDate = new Date(repair.timestamp);
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999); // จนถึงสิ้นวัน
            
            return repairDate >= startDate && repairDate <= endDate;
        });
    }
    
    return repairs;
}

// สร้างรายงานการซ่อม
function generateRepairReport(filters = {}) {
    const repairs = searchRepairs('', filters);
    
    const report = {
        total: repairs.length,
        byStatus: {},
        byAssetType: {},
        byDepartment: {},
        byUrgency: {
            normal: 0,
            urgent: 0,
            'very-urgent': 0
        },
        recentRepairs: repairs.slice(0, 10) // 10 รายการล่าสุด
    };
    
    // คำนวณสถิติ
    repairs.forEach(repair => {
        // ตามสถานะ
        report.byStatus[repair.status] = (report.byStatus[repair.status] || 0) + 1;
        
        // ตามประเภทครุภัณฑ์
        report.byAssetType[repair.assetType] = (report.byAssetType[repair.assetType] || 0) + 1;
        
        // ตามแผนก
        report.byDepartment[repair.reporterDepartment] = (report.byDepartment[repair.reporterDepartment] || 0) + 1;
        
        // ตามความเร่งด่วน
        report.byUrgency[repair.urgency]++;
    });
    
    return report;
}

// ส่งออกข้อมูลเป็น CSV
function exportToCSV(repairs) {
    if (repairs.length === 0) {
        alert('ไม่มีข้อมูลที่จะส่งออก');
        return;
    }
    
    // สร้างหัวข้อคอลัมน์
    const headers = [
        'รหัสคำขอ',
        'ผู้แจ้ง',
        'แผนก',
        'เบอร์ติดต่อ',
        'ประเภทครุภัณฑ์',
        'รหัสครุภัณฑ์',
        'สถานที่',
        'รายละเอียดปัญหา',
        'ความเร่งด่วน',
        'สถานะ',
        'วันที่แจ้ง',
        'เวลาที่แจ้ง'
    ];
    
    // สร้างแถวข้อมูล
    const rows = repairs.map(repair => [
        repair.id,
        repair.reporterName,
        repair.reporterDepartment,
        repair.reporterPhone,
        repair.assetType,
        repair.fullAssetCode,
        repair.assetLocation,
        repair.problemDetails.replace(/,/g, ' '), // หลีกเลี่ยงคอมม่าใน CSV
        repair.urgency,
        repair.status,
        repair.date,
        repair.time
    ]);
    
    // รวมหัวข้อและข้อมูล
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    // สร้าง Blob และดาวน์โหลด
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `repairs_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// ============================================
// ฟังก์ชันจัดการรูปภาพ
// ============================================

// ฟังก์ชันจัดการรูปภาพ
function setupImageHandlers() {
    // ตั้งค่าเหตุการณ์สำหรับรูปภาพในรายละเอียดการซ่อม
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('detail-image') || 
            e.target.classList.contains('repair-image') ||
            e.target.classList.contains('gallery-image')) {
            openImageModal(e.target.src);
        }
    });
}

// เปิดโมดอลแสดงรูปภาพ
function openImageModal(imageSrc) {
    const modalHTML = `
        <div class="image-modal">
            <div class="image-modal-content">
                <div class="image-modal-header">
                    <h3>รูปภาพประกอบ</h3>
                    <span class="close-image-modal">&times;</span>
                </div>
                <div class="image-modal-body">
                    <div class="image-container">
                        <img src="${imageSrc}" alt="รูปภาพประกอบ" id="modalImage">
                    </div>
                    <div class="image-controls">
                        <button class="btn btn-sm btn-secondary" id="zoomInBtn">
                            <i class="fas fa-search-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" id="zoomOutBtn">
                            <i class="fas fa-search-minus"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" id="rotateBtn">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" id="resetBtn">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" id="downloadBtn">
                            <i class="fas fa-download"></i> ดาวน์โหลด
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // เพิ่ม Modal ลงใน body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // ตั้งค่าเหตุการณ์
    const modal = modalContainer.querySelector('.image-modal');
    const closeBtn = modalContainer.querySelector('.close-image-modal');
    const zoomInBtn = modalContainer.querySelector('#zoomInBtn');
    const zoomOutBtn = modalContainer.querySelector('#zoomOutBtn');
    const rotateBtn = modalContainer.querySelector('#rotateBtn');
    const resetBtn = modalContainer.querySelector('#resetBtn');
    const downloadBtn = modalContainer.querySelector('#downloadBtn');
    const modalImage = modalContainer.querySelector('#modalImage');
    
    let scale = 1;
    let rotation = 0;
    
    // ปิด Modal
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // ซูมเข้า
    zoomInBtn.addEventListener('click', function() {
        scale += 0.1;
        updateImageTransform();
    });
    
    // ซูมออก
    zoomOutBtn.addEventListener('click', function() {
        if (scale > 0.2) {
            scale -= 0.1;
            updateImageTransform();
        }
    });
    
    // หมุนรูป
    rotateBtn.addEventListener('click', function() {
        rotation += 90;
        updateImageTransform();
    });
    
    // รีเซ็ต
    resetBtn.addEventListener('click', function() {
        scale = 1;
        rotation = 0;
        updateImageTransform();
    });
    
    // ดาวน์โหลด
    downloadBtn.addEventListener('click', function() {
        downloadImage(imageSrc);
    });
    
    // อัพเดตการแปลงรูปภาพ
    function updateImageTransform() {
        modalImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    }
    
    // ตั้งค่าเริ่มต้น
    updateImageTransform();
    
    // เพิ่มการควบคุมด้วยคีย์บอร์ด
    document.addEventListener('keydown', function handleKeydown(e) {
        if (!modal || modal.style.display === 'none') return;
        
        switch(e.key) {
            case 'Escape':
                modal.remove();
                document.removeEventListener('keydown', handleKeydown);
                break;
            case '+':
            case '=':
                scale += 0.1;
                updateImageTransform();
                e.preventDefault();
                break;
            case '-':
            case '_':
                if (scale > 0.2) {
                    scale -= 0.1;
                    updateImageTransform();
                }
                e.preventDefault();
                break;
            case 'r':
            case 'R':
                rotation += 90;
                updateImageTransform();
                break;
            case '0':
                scale = 1;
                rotation = 0;
                updateImageTransform();
                break;
        }
    });
}

// ดาวน์โหลดรูปภาพ
function downloadImage(imageSrc) {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `repair_image_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// เปิดแกลเลอรีรูปภาพ
function openImageGallery(images, startIndex = 0) {
    const galleryHTML = `
        <div class="image-gallery-modal">
            <div class="gallery-modal-content">
                <div class="gallery-modal-header">
                    <h3>รูปภาพประกอบ (${images.length} รูป)</h3>
                    <span class="close-gallery">&times;</span>
                </div>
                <div class="gallery-modal-body">
                    <div class="gallery-main-image">
                        <img src="${images[startIndex].data}" alt="รูปภาพประกอบ" id="galleryMainImage">
                        <div class="image-info">
                            <span id="currentImageIndex">${startIndex + 1}</span> / ${images.length}
                        </div>
                    </div>
                    <div class="gallery-controls">
                        <button class="btn btn-secondary" id="prevImage">
                            <i class="fas fa-chevron-left"></i> ก่อนหน้า
                        </button>
                        <button class="btn btn-secondary" id="nextImage">
                            ถัดไป <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="gallery-thumbnails">
                        ${images.map((image, index) => `
                            <div class="thumbnail ${index === startIndex ? 'active' : ''}" data-index="${index}">
                                <img src="${image.data}" alt="รูปย่อ ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                    <div class="image-actions">
                        <button class="btn btn-sm btn-secondary" id="galleryZoomIn">
                            <i class="fas fa-search-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" id="galleryZoomOut">
                            <i class="fas fa-search-minus"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" id="galleryRotate">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" id="galleryReset">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" id="galleryDownload">
                            <i class="fas fa-download"></i> ดาวน์โหลด
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // เพิ่ม Modal ลงใน body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = galleryHTML;
    document.body.appendChild(modalContainer);
    
    // ตัวแปรควบคุม
    let currentIndex = startIndex;
    let scale = 1;
    let rotation = 0;
    
    // ตั้งค่าเหตุการณ์
    const modal = modalContainer.querySelector('.image-gallery-modal');
    const closeBtn = modalContainer.querySelector('.close-gallery');
    const prevBtn = modalContainer.querySelector('#prevImage');
    const nextBtn = modalContainer.querySelector('#nextImage');
    const thumbnails = modalContainer.querySelectorAll('.thumbnail');
    const mainImage = modalContainer.querySelector('#galleryMainImage');
    const currentIndexSpan = modalContainer.querySelector('#currentImageIndex');
    const zoomInBtn = modalContainer.querySelector('#galleryZoomIn');
    const zoomOutBtn = modalContainer.querySelector('#galleryZoomOut');
    const rotateBtn = modalContainer.querySelector('#galleryRotate');
    const resetBtn = modalContainer.querySelector('#galleryReset');
    const downloadBtn = modalContainer.querySelector('#galleryDownload');
    
    // ฟังก์ชันเปลี่ยนรูปภาพ
    function changeImage(newIndex) {
        currentIndex = newIndex;
        mainImage.src = images[currentIndex].data;
        currentIndexSpan.textContent = currentIndex + 1;
        
        // อัพเดต thumbnail ที่ active
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[currentIndex].classList.add('active');
        
        // รีเซ็ตการซูมและหมุน
        scale = 1;
        rotation = 0;
        updateImageTransform();
    }
    
    // อัพเดตการแปลงรูปภาพ
    function updateImageTransform() {
        mainImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    }
    
    // ปิด Modal
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // รูปภาพก่อนหน้า
    prevBtn.addEventListener('click', function() {
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        changeImage(newIndex);
    });
    
    // รูปภาพถัดไป
    nextBtn.addEventListener('click', function() {
        const newIndex = (currentIndex + 1) % images.length;
        changeImage(newIndex);
    });
    
    // คลิก thumbnail
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const newIndex = parseInt(this.getAttribute('data-index'));
            changeImage(newIndex);
        });
    });
    
    // ซูมเข้า
    zoomInBtn.addEventListener('click', function() {
        scale += 0.1;
        updateImageTransform();
    });
    
    // ซูมออก
    zoomOutBtn.addEventListener('click', function() {
        if (scale > 0.2) {
            scale -= 0.1;
            updateImageTransform();
        }
    });
    
    // หมุนรูป
    rotateBtn.addEventListener('click', function() {
        rotation += 90;
        updateImageTransform();
    });
    
    // รีเซ็ต
    resetBtn.addEventListener('click', function() {
        scale = 1;
        rotation = 0;
        updateImageTransform();
    });
    
    // ดาวน์โหลด
    downloadBtn.addEventListener('click', function() {
        downloadImage(images[currentIndex].data);
    });
    
    // ตั้งค่าเริ่มต้น
    updateImageTransform();
    
    // เพิ่มการควบคุมด้วยคีย์บอร์ด
    document.addEventListener('keydown', function handleKeydown(e) {
        if (!modal || modal.style.display === 'none') return;
        
        switch(e.key) {
            case 'Escape':
                modal.remove();
                document.removeEventListener('keydown', handleKeydown);
                break;
            case 'ArrowLeft':
                const prevIndex = (currentIndex - 1 + images.length) % images.length;
                changeImage(prevIndex);
                e.preventDefault();
                break;
            case 'ArrowRight':
                const nextIndex = (currentIndex + 1) % images.length;
                changeImage(nextIndex);
                e.preventDefault();
                break;
            case '+':
            case '=':
                scale += 0.1;
                updateImageTransform();
                e.preventDefault();
                break;
            case '-':
            case '_':
                if (scale > 0.2) {
                    scale -= 0.1;
                    updateImageTransform();
                }
                e.preventDefault();
                break;
            case 'r':
            case 'R':
                rotation += 90;
                updateImageTransform();
                break;
            case '0':
                scale = 1;
                rotation = 0;
                updateImageTransform();
                break;
        }
    });
}

// เรียกใช้ setupImageHandlers เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    setupImageHandlers();
});