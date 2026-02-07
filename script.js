// === قاعدة بيانات وهمية محسنة (Enhanced Mock Data) ===
const studentsDB = [
    {
        id: 1,
        code: "STU-101",
        name: "أحمد محمد علي",
        grade: "الصف الخامس - أ",
        attendance_days: 45,
        late_assignments: 1,
        performance: "ممتاز",
        profile_pic: "https://via.placeholder.com/150",
        notifications: [
            "تم رصد درجة الرياضيات الجديدة.",
            "لديك واجب علوم متأخر.",
            "تغيير في جدول يوم الثلاثاء."
        ],
        marks: [
            { subject: "الرياضيات", score: 95, grade: "ممتاز", note: "أداء رائع، استمر." },
            { subject: "اللغة العربية", score: 88, grade: "جيد جداً", note: "يحتاج تركيز في النحو." },
            { subject: "العلوم", score: 92, grade: "ممتاز", note: "مشاركة مميزة في المعمل." }
        ],
        activities: [
            { name: "دوري كرة القدم", date: "2023-11-15", status: "مسجل" },
            { name: "مسابقة الرسم", date: "2023-11-20", status: "غير مسجل" }
        ]
    },
    {
        id: 2,
        code: "STU-102",
        name: "سارة خالد",
        grade: "الصف الخامس - ب",
        attendance_days: 42,
        late_assignments: 0,
        performance: "جيد جداً",
        profile_pic: "https://via.placeholder.com/150",
        notifications: [
            "لا توجد واجبات متأخرة.",
            "إعلان: رحلة مدرسية قادمة."
        ],
        marks: [
            { subject: "الرياضيات", score: 78, grade: "جيد", note: "تحسن ملحوظ." },
            { subject: "اللغة العربية", score: 90, grade: "ممتاز", note: "إملاء ممتاز." }
        ],
        activities: [
            { name: "النادي العلمي", date: "2023-11-18", status: "مسجل" }
        ]
    }
];

// === إدارة تسجيل الدخول ===

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

function studentLogin() {
    const code = document.getElementById('studentCodeInput').value;
    const student = studentsDB.find(s => s.code === code);

    if (student) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('studentDashboard').style.display = 'flex';
        loadStudentData(student);
    } else {
        alert("الرمز غير صحيح! حاول مرة أخرى.");
    }
}

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

function logout() {
    location.reload(); 
}

// === وظائف لوحة الطالب ===

function loadStudentData(student) {
    // الترحيب والصورة
    document.getElementById('studentNameDisplay').innerText = `أهلاً بك، ${student.name}`;
    document.getElementById('headerProfileImg').src = student.profile_pic;
    
    // الإحصائيات العلوية
    document.getElementById('stu-att-days').innerText = student.attendance_days;
    // تحديث شريط الحضور (افتراض أن الفصل 60 يوم)
    let attPercentage = (student.attendance_days / 60) * 100;
    document.getElementById('attendanceBar').style.width = `${attPercentage}%`;

    document.getElementById('stu-late-assign').innerText = student.late_assignments;
    document.getElementById('stu-performance').innerText = student.performance;

    // الإشعارات
    let notifHTML = "";
    student.notifications.forEach(n => {
        notifHTML += `<li>${n}</li>`;
    });
    document.getElementById('notificationsList').innerHTML = notifHTML;

    // المعلومات الشخصية
    const profileHTML = `
        <p><strong>الاسم:</strong> ${student.name}</p>
        <p><strong>الكود:</strong> ${student.code}</p>
        <p><strong>الصف:</strong> ${student.grade}</p>
    `;
    document.getElementById('studentProfileData').innerHTML = profileHTML;

    // الدرجات مع الملاحظات
    let marksHTML = "";
    student.marks.forEach(m => {
        marksHTML += `
            <tr>
                <td>${m.subject}</td>
                <td>${m.score}</td>
                <td>${m.grade}</td>
                <td style="font-size:0.9em; color:#555">${m.note}</td>
            </tr>
        `;
    });
    document.getElementById('studentMarksTable').innerHTML = marksHTML;

    // الأنشطة
    let actHTML = "";
    if(student.activities) {
        student.activities.forEach(a => {
            actHTML += `
                <div class="activity-item">
                    <div>
                        <h4>${a.name}</h4>
                        <small>${a.date}</small>
                    </div>
                    <span style="background:${a.status==='مسجل'?'#d4edda':'#f8d7da'}; padding:5px 10px; border-radius:10px; font-size:12px">
                        ${a.status}
                    </span>
                </div>
            `;
        });
    }
    document.getElementById('activitiesList').innerHTML = actHTML || "<p>لا توجد أنشطة حالياً</p>";
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.sidebar nav a').forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// === الميزات الجديدة (الثيم، التحميل، الصورة) ===

function changeTheme(primary, dark) {
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--primary-dark', dark);
}

function uploadImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('headerProfileImg').src = e.target.result;
            alert("تم تحديث الصورة الشخصية بنجاح!");
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function downloadPDF(type) {
    alert(`جاري تجهيز ملف ${type} للتحميل بصيغة PDF...\n(هذه محاكاة لعملية التحميل)`);
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
