// === قاعدة بيانات وهمية (Mock Data) ===
const studentsDB = [
    {
        id: 1,
        code: "STU-101",
        name: "أحمد محمد علي",
        grade: "الصف الخامس - أ",
        attendance_days: 45,
        marks: [
            { subject: "الرياضيات", score: 95, grade: "مستاز" },
            { subject: "اللغة العربية", score: 88, grade: "جيد جداً" },
            { subject: "العلوم", score: 92, grade: "ممتاز" }
        ]
    },
    {
        id: 2,
        code: "STU-102",
        name: "سارة خالد",
        grade: "الصف الخامس - ب",
        attendance_days: 42,
        marks: [
            { subject: "الرياضيات", score: 78, grade: "جيد" },
            { subject: "اللغة العربية", score: 90, grade: "ممتاز" }
        ]
    }
];

// === إدارة تسجيل الدخول ===

// التبديل بين تبويب الطالب والإدارة في شاشة الدخول
function switchLogin(type) {
    const btns = document.querySelectorAll('.login-tabs button');
    btns.forEach(btn => btn.classList.remove('active'));
    
    if (type === 'student') {
        btns[0].classList.add('active');
        document.getElementById('studentLoginForm').style.display = 'block';
        document.getElementById('adminLoginForm').style.display = 'none';
    } else {
        btns[1].classList.add('active');
        document.getElementById('studentLoginForm').style.display = 'none';
        document.getElementById('adminLoginForm').style.display = 'block';
    }
}

// دالة دخول الطالب
function studentLogin() {
    const code = document.getElementById('studentCodeInput').value;
    const student = studentsDB.find(s => s.code === code);

    if (student) {
        // إخفاء تسجيل الدخول وإظهار لوحة الطالب
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('studentDashboard').style.display = 'flex';
        
        // تعبئة البيانات
        loadStudentData(student);
    } else {
        alert("الرمز غير صحيح! حاول مرة أخرى.");
    }
}

// دالة دخول الإدارة (مبسطة)
function adminLogin() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    if (user === 'admin' && pass === '123') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        loadAdminData();
    } else {
        alert("بيانات الدخول خاطئة");
    }
}

// تسجيل الخروج
function logout() {
    location.reload(); // إعادة تحميل الصفحة للعودة للبداية
}

// === وظائف لوحة الطالب ===

function loadStudentData(student) {
    // الترحيب
    document.getElementById('studentNameDisplay').innerText = `أهلاً بك، ${student.name}`;
    document.getElementById('stu-att-days').innerText = student.attendance_days;

    // تعبئة الملف الشخصي
    const profileHTML = `
        <p><strong>الاسم:</strong> ${student.name}</p>
        <p><strong>الكود:</strong> ${student.code}</p>
        <p><strong>الصف:</strong> ${student.grade}</p>
    `;
    document.getElementById('studentProfileData').innerHTML = profileHTML;

    // تعبئة الدرجات
    let marksHTML = "";
    student.marks.forEach(m => {
        marksHTML += `
            <tr>
                <td>${m.subject}</td>
                <td>${m.score}</td>
                <td>${m.grade}</td>
            </tr>
        `;
    });
    document.getElementById('studentMarksTable').innerHTML = marksHTML;
}

function showSection(sectionId) {
    // إخفاء كل الأقسام
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    // إظهار القسم المطلوب
    document.getElementById(sectionId).classList.add('active');
    
    // تحديث القائمة الجانبية
    document.querySelectorAll('.sidebar nav a').forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// === وظائف لوحة الإدارة ===

function showAdminSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.admin-sidebar nav a').forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function loadAdminData() {
    let html = "";
    studentsDB.forEach(s => {
        html += `
            <tr>
                <td>${s.name}</td>
                <td><span style="background:#eee; padding:2px 5px; border-radius:4px">${s.code}</span></td>
                <td>${s.grade}</td>
                <td>
                    <button style="color:blue; border:none; background:none; cursor:pointer"><i class="fas fa-edit"></i></button>
                    <button style="color:red; border:none; background:none; cursor:pointer"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    document.getElementById('adminStudentsTable').innerHTML = html;
}
