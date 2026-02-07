// === بيانات وهمية (Mock Data) ===

// 1. الطلاب
let studentsDB = [
    {
        id: 1, code: "STU-101", name: "أحمد محمد علي", grade: "الصف الخامس - أ",
        attendance_days: 45, late_assignments: 1, performance: "ممتاز",
        profile_pic: "https://via.placeholder.com/150",
        notifications: ["درجة الرياضيات متاحة الآن."],
        marks: [
            { subject: "الرياضيات", score: 95, grade: "ممتاز", note: "أداء رائع" },
            { subject: "اللغة العربية", score: 88, grade: "جيد جداً", note: "" }
        ]
    },
    {
        id: 2, code: "STU-102", name: "سارة خالد", grade: "الصف الخامس - ب",
        attendance_days: 42, late_assignments: 0, performance: "جيد جداً",
        profile_pic: "https://via.placeholder.com/150",
        notifications: [],
        marks: [ { subject: "الرياضيات", score: 78, grade: "جيد", note: "" } ]
    }
];

// 2. المعلمين (جديد)
let teachersDB = [
    { 
        id: 1, name: "أ. علي حسن", email: "ali@school.com", pass: "123", 
        specialty: "رياضيات", subjects: "رياضيات, هندسة", classes: "5أ, 5ب", 
        absence: 2, pic: "https://via.placeholder.com/40" 
    },
    { 
        id: 2, name: "أ. منى سعيد", email: "mona@school.com", pass: "123", 
        specialty: "لغة عربية", subjects: "قواعد, نصوص", classes: "5أ", 
        absence: 0, pic: "https://via.placeholder.com/40" 
    }
];

// === إدارة تسجيل الدخول ===

function switchLogin(type) {
    const btns = document.querySelectorAll('.login-tabs button');
    btns.forEach(btn => btn.classList.remove('active'));
    document.getElementById('studentLoginForm').style.display = 'none';
    document.getElementById('teacherLoginForm').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'none';

    if (type === 'student') {
        btns[0].classList.add('active');
        document.getElementById('studentLoginForm').style.display = 'block';
    } else if (type === 'teacher') {
        btns[1].classList.add('active');
        document.getElementById('teacherLoginForm').style.display = 'block';
    } else {
        btns[2].classList.add('active');
        document.getElementById('adminLoginForm').style.display = 'block';
    }
}

// دخول الطالب
function studentLogin() {
    const code = document.getElementById('studentCodeInput').value;
    const student = studentsDB.find(s => s.code === code);
    if (student) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('studentDashboard').style.display = 'flex';
        loadStudentData(student);
    } else alert("الرمز غير صحيح!");
}

// دخول الإدارة
function adminLogin() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    if (user === 'admin' && pass === '123') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        loadAdminData();
    } else alert("بيانات خاطئة!");
}

// دخول المعلم (جديد)
let currentTeacher = null;
function teacherLogin() {
    const email = document.getElementById('teacherEmail').value;
    const pass = document.getElementById('teacherPass').value;
    const teacher = teachersDB.find(t => t.email === email && t.pass === pass);
    
    if (teacher) {
        currentTeacher = teacher;
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('teacherDashboard').style.display = 'flex';
        document.getElementById('teacherNameDisplay').innerText = `أهلاً بك، ${teacher.name}`;
        loadTeacherDashboard();
    } else alert("بيانات المعلم غير صحيحة");
}

function logout() { location.reload(); }

// === وظائف لوحة الطالب ===
function loadStudentData(student) {
    document.getElementById('studentNameDisplay').innerText = `أهلاً بك، ${student.name}`;
    document.getElementById('headerProfileImg').src = student.profile_pic;
    document.getElementById('stu-att-days').innerText = student.attendance_days;
    document.getElementById('attendanceBar').style.width = `${(student.attendance_days/60)*100}%`;
    document.getElementById('stu-late-assign').innerText = student.late_assignments;
    document.getElementById('stu-performance').innerText = student.performance;

    let notifHTML = "";
    student.notifications.forEach(n => notifHTML += `<li>${n}</li>`);
    document.getElementById('notificationsList').innerHTML = notifHTML;

    document.getElementById('studentProfileData').innerHTML = `
        <p><strong>الاسم:</strong> ${student.name}</p>
        <p><strong>الكود:</strong> ${student.code}</p>
        <p><strong>الصف:</strong> ${student.grade}</p>
    `;

    let marksHTML = "";
    student.marks.forEach(m => {
        marksHTML += `<tr><td>${m.subject}</td><td>${m.score}</td><td>${m.grade}</td><td>${m.note}</td></tr>`;
    });
    document.getElementById('studentMarksTable').innerHTML = marksHTML;
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
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
    // تحميل الطلاب
    let htmlStu = "";
    studentsDB.forEach(s => {
        htmlStu += `<tr><td>${s.name}</td><td>${s.code}</td><td>${s.grade}</td>
        <td><button style="color:red;border:none;background:none"><i class="fas fa-trash"></i></button></td></tr>`;
    });
    document.getElementById('adminStudentsTable').innerHTML = htmlStu;
    
    // تحميل المعلمين
    loadTeachers();
}

// --- إدارة المعلمين (Logic) ---
function loadTeachers() {
    document.getElementById('totalTeachers').innerText = teachersDB.length;
    let html = "";
    teachersDB.forEach(t => {
        html += `
            <tr>
                <td><img src="${t.pic}" style="width:30px;border-radius:50%"></td>
                <td>${t.name}</td>
                <td>${t.specialty}</td>
                <td>${t.subjects}</td>
                <td>${t.absence} أيام</td>
                <td>
                    <button onclick="editTeacher(${t.id})" class="btn-3d" style="color:#0077B6; padding:5px;"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteTeacher(${t.id})" class="btn-3d" style="color:red; padding:5px;"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    document.getElementById('adminTeachersTable').innerHTML = html;
}

// إضافة / تعديل معلم
let editingTeacherId = null;

function openAddTeacherModal() {
    editingTeacherId = null;
    document.getElementById('modalTitle').innerText = "إضافة معلم جديد";
    document.getElementById('tName').value = "";
    document.getElementById('tSpecialty').value = "";
    document.getElementById('tSubjects').value = "";
    document.getElementById('tClasses').value = "";
    document.getElementById('tEmail').value = "";
    document.getElementById('tAbsence').value = 0;
    document.getElementById('teacherModal').style.display = 'flex';
}

function editTeacher(id) {
    const t = teachersDB.find(x => x.id === id);
    editingTeacherId = id;
    document.getElementById('modalTitle').innerText = "تعديل بيانات معلم";
    document.getElementById('tName').value = t.name;
    document.getElementById('tSpecialty').value = t.specialty;
    document.getElementById('tSubjects').value = t.subjects;
    document.getElementById('tClasses').value = t.classes;
    document.getElementById('tEmail').value = t.email;
    document.getElementById('tAbsence').value = t.absence;
    document.getElementById('teacherModal').style.display = 'flex';
}

function saveTeacher() {
    const data = {
        name: document.getElementById('tName').value,
        specialty: document.getElementById('tSpecialty').value,
        subjects: document.getElementById('tSubjects').value,
        classes: document.getElementById('tClasses').value,
        email: document.getElementById('tEmail').value,
        absence: document.getElementById('tAbsence').value,
        pass: "123", pic: "https://via.placeholder.com/40"
    };

    if (editingTeacherId) {
        const index = teachersDB.findIndex(t => t.id === editingTeacherId);
        teachersDB[index] = { ...teachersDB[index], ...data };
    } else {
        data.id = Date.now();
        teachersDB.push(data);
    }
    closeTeacherModal();
    loadTeachers();
}

function deleteTeacher(id) {
    if(confirm("هل أنت متأكد من حذف هذا المعلم؟")) {
        teachersDB = teachersDB.filter(t => t.id !== id);
        loadTeachers();
    }
}

function closeTeacherModal() { document.getElementById('teacherModal').style.display = 'none'; }

function searchTeacher() {
    const val = document.getElementById('searchTeacherInput').value.toLowerCase();
    const rows = document.querySelectorAll('#adminTeachersTable tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
}

// === وظائف لوحة المعلم (Teacher Portal) ===
function loadTeacherDashboard() {
    // هنا نعرض الطلاب ونسمح للمعلم برصد الدرجة للمادة الخاصة به
    let html = "";
    const mySubject = currentTeacher.specialty; // افتراض أن التخصص هو المادة الرئيسية

    studentsDB.forEach(s => {
        // البحث عن درجة الطالب في مادة المعلم
        const existingMark = s.marks.find(m => m.subject.includes(mySubject)) || { score: "--" };
        
        html += `
            <tr>
                <td>${s.code}</td>
                <td>${s.name}</td>
                <td>${s.grade}</td>
                <td>${existingMark.score}</td>
                <td>
                    <button class="btn-3d btn-primary" onclick="gradeStudent('${s.code}', '${mySubject}')">
                        <i class="fas fa-edit"></i> رصد
                    </button>
                </td>
            </tr>
        `;
    });
    document.getElementById('teacherStudentsTable').innerHTML = html;
}

function gradeStudent(stuCode, subject) {
    const score = prompt(`أدخل الدرجة للطالب (${stuCode}) في مادة ${subject}:`);
    if (score) {
        const student = studentsDB.find(s => s.code === stuCode);
        // تحديث أو إضافة الدرجة
        const markIndex = student.marks.findIndex(m => m.subject.includes(subject));
        if (markIndex >= 0) {
            student.marks[markIndex].score = score;
            student.marks[markIndex].grade = score >= 90 ? "ممتاز" : "جيد";
        } else {
            student.marks.push({ subject: subject, score: score, grade: "جديد", note: "تم الرصد حديثاً" });
        }
        
        student.notifications.push(`تم تحديث درجة ${subject} من قبل ${currentTeacher.name}`);
        alert("تم الرصد بنجاح! سيظهر في حساب الطالب.");
        loadTeacherDashboard(); // تحديث الجدول
    }
}

// أدوات مساعدة
function changeTheme(primary, dark) {
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--primary-dark', dark);
}
function uploadImage(input) { alert("تم رفع الصورة"); }
function downloadPDF(type) { alert(`جاري تصدير ${type}...`); }
