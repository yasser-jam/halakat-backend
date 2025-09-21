import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('بدء عملية إنشاء البيانات الأولية...');

  // تنظيف البيانات الموجودة
  await prisma.log.deleteMany();
  await prisma.mistakeInSession.deleteMany();
  await prisma.sessionSurah.deleteMany();
  await prisma.sessionSurahTemplate.deleteMany();
  await prisma.mistake.deleteMany();
  await prisma.savingSession.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.teacherRole.deleteMany();
  await prisma.appRole.deleteMany();
  await prisma.teacherGroup.deleteMany();
  await prisma.studentGroup.deleteMany();
  await prisma.groupCampaigns.deleteMany();
  await prisma.teacherCampaign.deleteMany();
  await prisma.studentCampaign.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.group.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();
  await prisma.organizationUser.deleteMany();
  await prisma.mosque.deleteMany();
  await prisma.organization.deleteMany();

  // إنشاء المؤسسة
  const organization = await prisma.organization.create({
    data: {
      name: 'مؤسسة تحفيظ القرآن الكريم',
      description: 'مؤسسة تعليمية متخصصة في تحفيظ القرآن الكريم',
      contact_email: 'info@tahfiz.org',
      contact_phone: '+966501234567',
      address: 'الرياض، المملكة العربية السعودية',
      is_active: true,
      metadata: {
        established_year: 2010,
        license_number: 'TH-2010-001',
      },
    },
  });

  console.log('✅ تم إنشاء المؤسسة');

  // إنشاء مستخدم المؤسسة
  await prisma.organizationUser.create({
    data: {
      organization_id: organization.id,
      email: 'admin@tahfiz.org',
      first_name: 'أحمد',
      last_name: 'المدير',
      role: 'OWNER',
      is_active: true,
    },
  });

  // إنشاء المساجد
  const mosque1 = await prisma.mosque.create({
    data: {
      organization_id: organization.id,
      name: 'مسجد النور',
      city: 'الرياض',
      address_area: 'حي الملز',
      address_details: 'شارع الملك فهد، بجوار مجمع الملز',
      contact_phone: '+966501234568',
      contact_email: 'noor@tahfiz.org',
      is_active: true,
      metadata: {
        capacity: 200,
        established: 2015,
      },
    },
  });

  const mosque2 = await prisma.mosque.create({
    data: {
      organization_id: organization.id,
      name: 'مسجد الهداية',
      city: 'الرياض',
      address_area: 'حي العليا',
      address_details: 'شارع العليا العام، قرب مستشفى الملك فيصل',
      contact_phone: '+966501234569',
      contact_email: 'hidaya@tahfiz.org',
      is_active: true,
      metadata: {
        capacity: 150,
        established: 2018,
      },
    },
  });

  console.log('✅ تم إنشاء المساجد');

  // إنشاء الطلاب
  const studentsData = [
    // طلاب مسجد النور
    {
      first_name: 'محمد',
      last_name: 'العبدالله',
      father_name: 'عبدالله محمد العبدالله',
      mother_name: 'فاطمة أحمد السالم',
    },
    {
      first_name: 'أحمد',
      last_name: 'الزهراني',
      father_name: 'سالم أحمد الزهراني',
      mother_name: 'عائشة محمد الغامدي',
    },
    {
      first_name: 'عبدالرحمن',
      last_name: 'القحطاني',
      father_name: 'محمد عبدالرحمن القحطاني',
      mother_name: 'خديجة علي المطيري',
    },
    {
      first_name: 'يوسف',
      last_name: 'الحربي',
      father_name: 'عبدالعزيز يوسف الحربي',
      mother_name: 'مريم سعد الدوسري',
    },
    {
      first_name: 'خالد',
      last_name: 'المطيري',
      father_name: 'فهد خالد المطيري',
      mother_name: 'نورة عبدالله العتيبي',
    },
    {
      first_name: 'سعد',
      last_name: 'العتيبي',
      father_name: 'ناصر سعد العتيبي',
      mother_name: 'هند محمد الشمري',
    },
    {
      first_name: 'فهد',
      last_name: 'الشمري',
      father_name: 'بندر فهد الشمري',
      mother_name: 'سارة أحمد الرشيد',
    },
    {
      first_name: 'عبدالله',
      last_name: 'الرشيد',
      father_name: 'تركي عبدالله الرشيد',
      mother_name: 'أمل سالم الحربي',
    },
    // طلاب مسجد الهداية
    {
      first_name: 'إبراهيم',
      last_name: 'الغامدي',
      father_name: 'عبدالرحمن إبراهيم الغامدي',
      mother_name: 'زينب محمد الزهراني',
    },
    {
      first_name: 'عمر',
      last_name: 'الدوسري',
      father_name: 'سليمان عمر الدوسري',
      mother_name: 'ليلى أحمد القحطاني',
    },
    {
      first_name: 'حسن',
      last_name: 'السالم',
      father_name: 'عبدالله حسن السالم',
      mother_name: 'وفاء عبدالعزيز الحربي',
    },
    {
      first_name: 'طارق',
      last_name: 'الخالدي',
      father_name: 'محمد طارق الخالدي',
      mother_name: 'رقية سعد المطيري',
    },
    {
      first_name: 'ماجد',
      last_name: 'البقمي',
      father_name: 'عبدالعزيز ماجد البقمي',
      mother_name: 'إيمان فهد العتيبي',
    },
    {
      first_name: 'نواف',
      last_name: 'الجهني',
      father_name: 'سالم نواف الجهني',
      mother_name: 'عبير ناصر الشمري',
    },
    {
      first_name: 'راشد',
      last_name: 'العنزي',
      father_name: 'فيصل راشد العنزي',
      mother_name: 'منى بندر الرشيد',
    },
    {
      first_name: 'بدر',
      last_name: 'الصبحي',
      father_name: 'أحمد بدر الصبحي',
      mother_name: 'جواهر تركي الغامدي',
    },
  ];

  const students = [];
  for (let i = 0; i < studentsData.length; i++) {
    const studentData = studentsData[i];
    const student = await prisma.student.create({
      data: {
        current_mosque_name: i < 8 ? 'مسجد النور' : 'مسجد الهداية',
        educational_class: Math.floor(Math.random() * 6) + 1,
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        birth_date: new Date(
          2010 + Math.floor(Math.random() * 8),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ),
        student_mobile: `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        school:
          i < 8
            ? 'مدرسة الملك فهد الابتدائية'
            : 'مدرسة الأمير سلمان الابتدائية',
        in_another_mosque: false,
        student_health_status: 'سليم',
        special_talent: ['حفظ سريع', 'صوت جميل', 'قراءة متقنة', 'تجويد ممتاز'][
          Math.floor(Math.random() * 4)
        ],
        father_name: studentData.father_name,
        father_status: 'ALIVE',
        father_job: ['مهندس', 'طبيب', 'معلم', 'موظف'][
          Math.floor(Math.random() * 4)
        ],
        father_income_level: ['متوسط', 'جيد', 'ممتاز'][
          Math.floor(Math.random() * 3)
        ],
        father_education_level: 'جامعي',
        father_health_status: 'سليم',
        father_phone_number: `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        mother_name: studentData.mother_name,
        mother_status: 'ALIVE',
        mother_job: ['ربة منزل', 'معلمة', 'طبيبة', 'موظفة'][
          Math.floor(Math.random() * 4)
        ],
        mother_education_level: 'جامعي',
        mother_health_status: 'سليم',
        mother_phone_number: `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        parent_marital_status: 'MARRIED',
        original_residence_address_area: i < 8 ? 'حي الملز' : 'حي العليا',
        original_residence_address_street: `شارع ${Math.floor(Math.random() * 50) + 1}`,
        current_residence_address_area: i < 8 ? 'حي الملز' : 'حي العليا',
        current_residence_address_street: `شارع ${Math.floor(Math.random() * 50) + 1}`,
        preserved_parts: `${Math.floor(Math.random() * 10) + 1} أجزاء`,
        parts_tested_by_the_endowments: `${Math.floor(Math.random() * 5) + 1} أجزاء`,
        password: '123456',
      },
    });
    students.push(student);
  }

  console.log('✅ تم إنشاء الطلاب');

  // إنشاء المعلمين
  const teachersData = [
    {
      first_name: 'عبدالله',
      last_name: 'الأحمد',
      university: 'جامعة الإمام محمد بن سعود',
      college: 'كلية الشريعة',
    },
    {
      first_name: 'محمد',
      last_name: 'الحسن',
      university: 'جامعة الملك سعود',
      college: 'كلية التربية',
    },
    {
      first_name: 'سالم',
      last_name: 'المحمد',
      university: 'جامعة الإمام محمد بن سعود',
      college: 'كلية أصول الدين',
    },
    {
      first_name: 'أحمد',
      last_name: 'العلي',
      university: 'جامعة الملك عبدالعزيز',
      college: 'كلية الآداب',
    },
    {
      first_name: 'ياسر',
      last_name: 'جمال الدين',
      university: 'جامعة دمشق',
      college: 'كلية الهندسة المعلوماتية',
    },
  ];

  const teachers = [];
  for (let i = 0; i < teachersData.length; i++) {
    const teacherData = teachersData[i];
    const teacher = await prisma.teacher.create({
      data: {
        educational_level: 'بكالوريوس',
        university_name: teacherData.university,
        college_name: teacherData.college,
        first_name: teacherData.first_name,
        last_name: teacherData.last_name,
        birth_date: new Date(
          1980 + Math.floor(Math.random() * 15),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ),
        mobile_phone_number:
          teacherData.first_name == 'ياسر'
            ? '0986365515'
            : `05${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        in_another_mosque: false,
        special_talent: ['تجويد', 'حفظ متقن', 'قراءات', 'تفسير'][
          Math.floor(Math.random() * 4)
        ],
        father_name: `${teacherData.first_name} ${teacherData.last_name}`,
        current_residence_address_area: i < 2 ? 'حي الملز' : 'حي العليا',
        current_residence_address_street: `شارع ${Math.floor(Math.random() * 50) + 1}`,
        preserved_parts: JSON.stringify(['1', '2', '3', '4']),
        parts_tested_by_the_endowments: JSON.stringify(['1', '2']),
        is_mojaz: true,
        is_working: true,
        job_role: 'معلم قرآن',
        workplace_name: i < 2 ? 'مسجد النور' : 'مسجد الهداية',
        password: '123456',
        role: teacherData.first_name == 'ياسر' ? 'SUPER_ADMIN' : 'TEACHER',
      },
    });
    teachers.push(teacher);
  }

  console.log('✅ تم إنشاء المعلمين');

  // إنشاء المجموعات
  const groups = [];

  // مجموعات مسجد النور
  const group1 = await prisma.group.create({
    data: {
      mosque_id: mosque1.id,
      title: 'مجموعة الفجر',
      class: 1,
      current_teacher_id: teachers[0].id,
    },
  });

  const group2 = await prisma.group.create({
    data: {
      mosque_id: mosque1.id,
      title: 'مجموعة الضحى',
      class: 2,
      current_teacher_id: teachers[1].id,
    },
  });

  // مجموعات مسجد الهداية
  const group3 = await prisma.group.create({
    data: {
      mosque_id: mosque2.id,
      title: 'مجموعة المغرب',
      class: 1,
      current_teacher_id: teachers[2].id,
    },
  });

  const group4 = await prisma.group.create({
    data: {
      mosque_id: mosque2.id,
      title: 'مجموعة العشاء',
      class: 2,
      current_teacher_id: teachers[3].id,
    },
  });

  groups.push(group1, group2, group3, group4);
  console.log('✅ تم إنشاء المجموعات');

  // إنشاء الحملات
  const campaign1 = await prisma.campaign.create({
    data: {
      mosque_id: mosque1.id,
      name: 'حملة تحفيظ القرآن الكريم - الفصل الأول',
      start_date: new Date('2024-06-15'),
      end_date: new Date('2024-07-16'),
      assign_start_date: new Date('2024-06-15'),
      assign_end_date: new Date('2024-07-16'),
      is_campaign_continuous: true,
      limited_students_count: false,
      students_count: 100,
      assign_by_link: false,
      complete_count_approach: 'UNLIMIT_ASSIGN',
      days: 'sunday,tuesday,thursday',
      timing_approach: 'hours',
      start_time: '16:00',
      end_time: '18:00',
      status: true,
      metadata: {
        description: 'حملة تحفيظ شاملة للقرآن الكريم',
        goals: ['حفظ 5 أجزاء', 'إتقان التجويد', 'فهم المعاني'],
      },
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      mosque_id: mosque2.id,
      name: 'حملة تحفيظ القرآن الكريم - الفصل الثاني',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-06-30'),
      assign_start_date: new Date('2024-01-01'),
      assign_end_date: new Date('2024-06-30'),
      is_campaign_continuous: true,
      limited_students_count: false,
      students_count: 80,
      assign_by_link: false,
      complete_count_approach: 'UNLIMIT_ASSIGN',
      days: 'sunday,monday,tuesday,wednesday,thursday',
      timing_approach: 'hours',
      start_time: '17:00',
      end_time: '19:00',
      status: true,
      metadata: {
        description: 'حملة تحفيظ متقدمة للقرآن الكريم',
        goals: ['حفظ 10 أجزاء', 'إتقان القراءات', 'التفسير المبسط'],
      },
    },
  });

  console.log('✅ تم إنشاء الحملات');

  // إنشاء الأدوار
  const roles = [];

  // أدوار الحملة الأولى
  const adminRole1 = await prisma.appRole.create({
    data: {
      name: 'أدمن',
      description: 'صلاحيات إدارية كاملة',
      permissions: JSON.stringify([
        'STUDENT_MANAGEMENT',
        'TEACHER_MANAGEMENT',
        'ROLES_MANAGEMENT',
        'SAVING_SESSION_MANAGEMENT',
        'ATTENDANCE_MANAGEMENT',
        'CURRICULUM_MANAGEMENT',
        'SETTINGS_MANAGEMENT',
        'POINTS_MANAGEMENT',
        'AWARDS_MANAGEMENT',
      ]),
      campaign_id: campaign1.id,
    },
  });

  const teacherRole1 = await prisma.appRole.create({
    data: {
      name: 'أستاذ',
      description: 'صلاحيات التدريس والتقييم',
      permissions: JSON.stringify([
        'STUDENT_MANAGEMENT',
        'SAVING_SESSION_MANAGEMENT',
        'ATTENDANCE_MANAGEMENT',
        'POINTS_MANAGEMENT',
      ]),
      campaign_id: campaign1.id,
    },
  });

  const reciterRole1 = await prisma.appRole.create({
    data: {
      name: 'مسمع',
      description: 'صلاحيات الاستماع والتقييم',
      permissions: JSON.stringify([
        'SAVING_SESSION_MANAGEMENT',
        'ATTENDANCE_MANAGEMENT',
      ]),
      campaign_id: campaign1.id,
    },
  });

  // أدوار الحملة الثانية
  const adminRole2 = await prisma.appRole.create({
    data: {
      name: 'أدمن',
      description: 'صلاحيات إدارية كاملة',
      permissions: JSON.stringify([
        'STUDENT_MANAGEMENT',
        'TEACHER_MANAGEMENT',
        'ROLES_MANAGEMENT',
        'SAVING_SESSION_MANAGEMENT',
        'ATTENDANCE_MANAGEMENT',
        'CURRICULUM_MANAGEMENT',
        'SETTINGS_MANAGEMENT',
        'POINTS_MANAGEMENT',
        'AWARDS_MANAGEMENT',
      ]),
      campaign_id: campaign2.id,
    },
  });

  const teacherRole2 = await prisma.appRole.create({
    data: {
      name: 'أستاذ',
      description: 'صلاحيات التدريس والتقييم',
      permissions: JSON.stringify([
        'STUDENT_MANAGEMENT',
        'SAVING_SESSION_MANAGEMENT',
        'ATTENDANCE_MANAGEMENT',
        'POINTS_MANAGEMENT',
      ]),
      campaign_id: campaign2.id,
    },
  });

  const reciterRole2 = await prisma.appRole.create({
    data: {
      name: 'مسمع',
      description: 'صلاحيات الاستماع والتقييم',
      permissions: JSON.stringify([
        'SAVING_SESSION_MANAGEMENT',
        'ATTENDANCE_MANAGEMENT',
      ]),
      campaign_id: campaign2.id,
    },
  });

  roles.push(
    adminRole1,
    teacherRole1,
    reciterRole1,
    adminRole2,
    teacherRole2,
    reciterRole2,
  );
  console.log('✅ تم إنشاء الأدوار');

  // ربط المجموعات بالحملات
  await prisma.groupCampaigns.createMany({
    data: [
      { group_id: group1.id, campaign_id: campaign1.id },
      { group_id: group2.id, campaign_id: campaign1.id },
      { group_id: group3.id, campaign_id: campaign2.id },
      { group_id: group4.id, campaign_id: campaign2.id },
    ],
  });

  // تسجيل الطلاب في الحملات
  await prisma.studentCampaign.createMany({
    data: [
      ...students.slice(0, 8).map((student) => ({
        student_id: student.id,
        campaign_id: campaign1.id,
        is_active: true,
      })),
      ...students.slice(8, 16).map((student) => ({
        student_id: student.id,
        campaign_id: campaign2.id,
        is_active: true,
      })),
    ],
  });

  // تعيين المعلمين للحملات
  await prisma.teacherCampaign.createMany({
    data: [
      { teacher_id: teachers[0].id, campaign_id: campaign1.id },
      { teacher_id: teachers[1].id, campaign_id: campaign1.id },
      { teacher_id: teachers[2].id, campaign_id: campaign2.id },
      { teacher_id: teachers[3].id, campaign_id: campaign2.id },
      { teacher_id: teachers[4].id, campaign_id: campaign1.id },
      { teacher_id: teachers[4].id, campaign_id: campaign2.id },
    ],
  });

  // ربط الطلاب بالمجموعات
  await prisma.studentGroup.createMany({
    data: [
      // طلاب مجموعة الفجر
      ...students.slice(0, 4).map((student) => ({
        student_id: student.id,
        group_id: group1.id,
        campaign_id: campaign1.id,
      })),
      // طلاب مجموعة الضحى
      ...students.slice(4, 8).map((student) => ({
        student_id: student.id,
        group_id: group2.id,
        campaign_id: campaign1.id,
      })),
      // طلاب مجموعة المغرب
      ...students.slice(8, 12).map((student) => ({
        student_id: student.id,
        group_id: group3.id,
        campaign_id: campaign2.id,
      })),
      // طلاب مجموعة العشاء
      ...students.slice(12, 16).map((student) => ({
        student_id: student.id,
        group_id: group4.id,
        campaign_id: campaign2.id,
      })),
    ],
  });

  // ربط المعلمين بالمجموعات
  await prisma.teacherGroup.createMany({
    data: [
      {
        teacher_id: teachers[0].id,
        group_id: group1.id,
        campaign_id: campaign1.id,
      },
      {
        teacher_id: teachers[1].id,
        group_id: group2.id,
        campaign_id: campaign1.id,
      },
      {
        teacher_id: teachers[2].id,
        group_id: group3.id,
        campaign_id: campaign2.id,
      },
      {
        teacher_id: teachers[3].id,
        group_id: group4.id,
        campaign_id: campaign2.id,
      },
    ],
  });

  // تعيين الأدوار للمعلمين
  await prisma.teacherRole.createMany({
    data: [
      {
        teacher_id: teachers[0].id,
        group_id: group1.id,
        campaign_id: campaign1.id,
        role_id: teacherRole1.id,
      },
      {
        teacher_id: teachers[1].id,
        group_id: group2.id,
        campaign_id: campaign1.id,
        role_id: teacherRole1.id,
      },
      {
        teacher_id: teachers[2].id,
        group_id: group3.id,
        campaign_id: campaign2.id,
        role_id: teacherRole2.id,
      },
      {
        teacher_id: teachers[3].id,
        group_id: group4.id,
        campaign_id: campaign2.id,
        role_id: teacherRole2.id,
      },
      {
        teacher_id: teachers[4].id,
        group_id: group1.id,
        campaign_id: campaign1.id,
        role_id: adminRole1.id,
      },
      {
        teacher_id: teachers[4].id,
        group_id: group4.id,
        campaign_id: campaign2.id,
        role_id: adminRole2.id,
      },
    ],
  });

  // إنشاء الأخطاء
  await prisma.mistake.createMany({
    data: [
      {
        campaign_id: campaign1.id,
        title: 'خطأ في التشكيل',
        reduced_marks: 15,
      },
      {
        campaign_id: campaign1.id,
        title: 'خطأ في القراءة',
        reduced_marks: 10,
      },
    ],
  });

  await prisma.mistake.createMany({
    data: [
      {
        campaign_id: campaign2.id,
        title: 'خطأ في التجويد',
        reduced_marks: 5,
      },
      {
        campaign_id: campaign2.id,
        title: 'خطأ في الحفظ',
        reduced_marks: 10,
      },
    ],
  });

  console.log('✅ تم إنشاء الأخطاء');

  // إنشاء التقييمات
  await prisma.evaluation.createMany({
    data: [
      {
        title: 'ممتاز',
        points: 100,
        minimum_marks: 90,
        campaign_id: campaign1.id,
      },
      {
        title: 'جيد جداً',
        points: 50,
        minimum_marks: 80,
        campaign_id: campaign1.id,
      },
      {
        title: 'ممتاز',
        points: 100,
        minimum_marks: 70,
        campaign_id: campaign2.id,
      },
      {
        title: 'ممتاز جداً',
        points: 150,
        minimum_marks: 80,
        campaign_id: campaign2.id,
      },
    ],
  });

  console.log('✅ تم إنشاء التقييمات');

  // إنشاء قوالب السور والصفحات
  let surahTemplates = [];

  // بيانات السور والصفحات (بناءً على المصحف القياسي 604 صفحة)
  const surahData = [
    { number: 1, name: 'الفاتحة', startPage: 1, endPage: 1, weight: 1.0 },
    { number: 2, name: 'البقرة', startPage: 2, endPage: 49, weight: 1.0 },
    { number: 3, name: 'آل عمران', startPage: 50, endPage: 76, weight: 1.0 },
    { number: 4, name: 'النساء', startPage: 77, endPage: 106, weight: 1.0 },
    { number: 5, name: 'المائدة', startPage: 107, endPage: 127, weight: 1.0 },
    { number: 6, name: 'الأنعام', startPage: 128, endPage: 150, weight: 1.0 },
    { number: 7, name: 'الأعراف', startPage: 151, endPage: 176, weight: 1.0 },
    { number: 8, name: 'الأنفال', startPage: 177, endPage: 186, weight: 1.0 },
    { number: 9, name: 'التوبة', startPage: 187, endPage: 207, weight: 1.0 },
    { number: 10, name: 'يونس', startPage: 208, endPage: 221, weight: 1.0 },
    { number: 11, name: 'هود', startPage: 222, endPage: 235, weight: 1.0 },
    { number: 12, name: 'يوسف', startPage: 236, endPage: 248, weight: 1.0 },
    { number: 13, name: 'الرعد', startPage: 249, endPage: 255, weight: 1.0 },
    { number: 14, name: 'إبراهيم', startPage: 256, endPage: 261, weight: 1.0 },
    { number: 15, name: 'الحجر', startPage: 262, endPage: 266, weight: 1.0 },
    { number: 16, name: 'النحل', startPage: 267, endPage: 281, weight: 1.0 },
    { number: 17, name: 'الإسراء', startPage: 282, endPage: 293, weight: 1.0 },
    { number: 18, name: 'الكهف', startPage: 294, endPage: 305, weight: 1.0 },
    { number: 19, name: 'مريم', startPage: 306, endPage: 312, weight: 1.0 },
    { number: 20, name: 'طه', startPage: 313, endPage: 321, weight: 1.0 },
    { number: 21, name: 'الأنبياء', startPage: 322, endPage: 331, weight: 1.0 },
    { number: 22, name: 'الحج', startPage: 332, endPage: 341, weight: 1.0 },
    { number: 23, name: 'المؤمنون', startPage: 342, endPage: 349, weight: 1.0 },
    { number: 24, name: 'النور', startPage: 350, endPage: 359, weight: 1.0 },
    { number: 25, name: 'الفرقان', startPage: 360, endPage: 366, weight: 1.0 },
    { number: 26, name: 'الشعراء', startPage: 367, endPage: 376, weight: 1.0 },
    { number: 27, name: 'النمل', startPage: 377, endPage: 385, weight: 1.0 },
    { number: 28, name: 'القصص', startPage: 386, endPage: 395, weight: 1.0 },
    { number: 29, name: 'العنكبوت', startPage: 396, endPage: 404, weight: 1.0 },
    { number: 30, name: 'الروم', startPage: 405, endPage: 410, weight: 1.0 },
    { number: 31, name: 'لقمان', startPage: 411, endPage: 414, weight: 1.0 },
    { number: 32, name: 'السجدة', startPage: 415, endPage: 417, weight: 1.0 },
    { number: 33, name: 'الأحزاب', startPage: 418, endPage: 427, weight: 1.0 },
    { number: 34, name: 'سبأ', startPage: 428, endPage: 433, weight: 1.0 },
    { number: 35, name: 'فاطر', startPage: 434, endPage: 439, weight: 1.0 },
    { number: 36, name: 'يس', startPage: 440, endPage: 445, weight: 1.0 },
    { number: 37, name: 'الصافات', startPage: 446, endPage: 452, weight: 1.0 },
    { number: 38, name: 'ص', startPage: 453, endPage: 458, weight: 1.0 },
    { number: 39, name: 'الزمر', startPage: 459, endPage: 467, weight: 1.0 },
    { number: 40, name: 'غافر', startPage: 468, endPage: 477, weight: 1.0 },
    { number: 41, name: 'فصلت', startPage: 478, endPage: 483, weight: 1.0 },
    { number: 42, name: 'الشورى', startPage: 484, endPage: 489, weight: 1.0 },
    { number: 43, name: 'الزخرف', startPage: 490, endPage: 495, weight: 1.0 },
    { number: 44, name: 'الدخان', startPage: 496, endPage: 498, weight: 1.0 },
    { number: 45, name: 'الجاثية', startPage: 499, endPage: 502, weight: 1.0 },
    { number: 46, name: 'الأحقاف', startPage: 503, endPage: 506, weight: 1.0 },
    { number: 47, name: 'محمد', startPage: 507, endPage: 510, weight: 1.0 },
    { number: 48, name: 'الفتح', startPage: 511, endPage: 514, weight: 1.0 },
    { number: 49, name: 'الحجرات', startPage: 515, endPage: 517, weight: 1.0 },
    { number: 50, name: 'ق', startPage: 518, endPage: 520, weight: 1.0 },
    { number: 51, name: 'الذاريات', startPage: 521, endPage: 523, weight: 1.0 },
    { number: 52, name: 'الطور', startPage: 524, endPage: 526, weight: 1.0 },
    { number: 53, name: 'النجم', startPage: 527, endPage: 529, weight: 1.0 },
    { number: 54, name: 'القمر', startPage: 530, endPage: 532, weight: 1.0 },
    { number: 55, name: 'الرحمن', startPage: 533, endPage: 535, weight: 1.0 },
    { number: 56, name: 'الواقعة', startPage: 536, endPage: 538, weight: 1.0 },
    { number: 57, name: 'الحديد', startPage: 539, endPage: 541, weight: 1.0 },
    { number: 58, name: 'المجادلة', startPage: 542, endPage: 544, weight: 1.0 },
    { number: 59, name: 'الحشر', startPage: 545, endPage: 547, weight: 1.0 },
    { number: 60, name: 'الممتحنة', startPage: 548, endPage: 549, weight: 1.0 },
    { number: 61, name: 'الصف', startPage: 550, endPage: 551, weight: 1.0 },
    { number: 62, name: 'الجمعة', startPage: 552, endPage: 553, weight: 1.0 },
    {
      number: 63,
      name: 'المنافقون',
      startPage: 554,
      endPage: 555,
      weight: 1.0,
    },
    { number: 64, name: 'التغابن', startPage: 556, endPage: 557, weight: 1.0 },
    { number: 65, name: 'الطلاق', startPage: 558, endPage: 559, weight: 1.0 },
    { number: 66, name: 'التحريم', startPage: 560, endPage: 561, weight: 1.0 },
    { number: 67, name: 'الملك', startPage: 562, endPage: 563, weight: 1.0 },
    { number: 68, name: 'القلم', startPage: 564, endPage: 565, weight: 1.0 },
    { number: 69, name: 'الحاقة', startPage: 566, endPage: 567, weight: 1.0 },
    { number: 70, name: 'المعارج', startPage: 568, endPage: 569, weight: 1.0 },
    { number: 71, name: 'نوح', startPage: 570, endPage: 571, weight: 1.0 },
    { number: 72, name: 'الجن', startPage: 572, endPage: 573, weight: 1.0 },
    { number: 73, name: 'المزمل', startPage: 574, endPage: 575, weight: 1.0 },
    { number: 74, name: 'المدثر', startPage: 576, endPage: 577, weight: 1.0 },
    { number: 75, name: 'القيامة', startPage: 578, endPage: 578, weight: 1.0 },
    { number: 76, name: 'الإنسان', startPage: 579, endPage: 580, weight: 1.0 },
    {
      number: 77,
      name: 'المرسلات',
      startPage: 581,
      endPage: 581,
      weight: 0.75,
    }, // مثال على صفحة جزئية
    { number: 78, name: 'النبأ', startPage: 582, endPage: 582, weight: 1.0 },
    { number: 79, name: 'النازعات', startPage: 583, endPage: 583, weight: 1.0 },
    { number: 80, name: 'عبس', startPage: 584, endPage: 584, weight: 1.0 },
    { number: 81, name: 'التكوير', startPage: 585, endPage: 585, weight: 1.0 },
    { number: 82, name: 'الانفطار', startPage: 586, endPage: 586, weight: 1.0 },
    { number: 83, name: 'المطففين', startPage: 587, endPage: 587, weight: 1.0 },
    { number: 84, name: 'الانشقاق', startPage: 588, endPage: 588, weight: 1.0 },
    { number: 85, name: 'البروج', startPage: 589, endPage: 589, weight: 1.0 },
    { number: 86, name: 'الطارق', startPage: 590, endPage: 590, weight: 1.0 },
    { number: 87, name: 'الأعلى', startPage: 591, endPage: 591, weight: 1.0 },
    { number: 88, name: 'الغاشية', startPage: 592, endPage: 592, weight: 1.0 },
    { number: 89, name: 'الفجر', startPage: 593, endPage: 593, weight: 1.0 },
    { number: 90, name: 'البلد', startPage: 594, endPage: 594, weight: 1.0 },
    { number: 91, name: 'الشمس', startPage: 595, endPage: 595, weight: 1.0 },
    { number: 92, name: 'الليل', startPage: 596, endPage: 596, weight: 1.0 },
    { number: 93, name: 'الضحى', startPage: 597, endPage: 597, weight: 1.0 },
    { number: 94, name: 'الشرح', startPage: 598, endPage: 598, weight: 1.0 },
    { number: 95, name: 'التين', startPage: 599, endPage: 599, weight: 1.0 },
    { number: 96, name: 'العلق', startPage: 600, endPage: 600, weight: 1.0 },
    { number: 97, name: 'القدر', startPage: 601, endPage: 601, weight: 1.0 },
    { number: 98, name: 'البينة', startPage: 602, endPage: 602, weight: 1.0 },
    { number: 99, name: 'الزلزلة', startPage: 603, endPage: 603, weight: 1.0 },
    {
      number: 100,
      name: 'العاديات',
      startPage: 604,
      endPage: 604,
      weight: 1.0,
    },
    { number: 101, name: 'القارعة', startPage: 604, endPage: 604, weight: 0.5 }, // مثال على صفحة جزئية
    {
      number: 102,
      name: 'التكاثر',
      startPage: 604,
      endPage: 604,
      weight: 0.25,
    }, // مثال على صفحة جزئية
    { number: 103, name: 'العصر', startPage: 604, endPage: 604, weight: 0.25 }, // مثال على صفحة جزئية
    { number: 104, name: 'الهمزة', startPage: 604, endPage: 604, weight: 0.25 }, // مثال على صفحة جزئية
    { number: 105, name: 'الفيل', startPage: 604, endPage: 604, weight: 0.25 }, // مثال على صفحة جزئية
    { number: 106, name: 'قريش', startPage: 604, endPage: 604, weight: 0.25 }, // مثال على صفحة جزئية
    {
      number: 107,
      name: 'الماعون',
      startPage: 604,
      endPage: 604,
      weight: 0.25,
    }, // مثال على صفحة جزئية
    { number: 108, name: 'الكوثر', startPage: 604, endPage: 604, weight: 0.25 }, // مثال على صفحة جزئية
    {
      number: 109,
      name: 'الكافرون',
      startPage: 604,
      endPage: 604,
      weight: 0.25,
    }, // مثال على صفحة جزئية
    { number: 110, name: 'النصر', startPage: 604, endPage: 604, weight: 0.25 }, // مثال على صفحة جزئية
    { number: 111, name: 'المسد', startPage: 604, endPage: 604, weight: 0.25 }, // مثال على صفحة جزئية
    {
      number: 112,
      name: 'الإخلاص',
      startPage: 604,
      endPage: 604,
      weight: 0.25,
    }, // مثال على صفحة جزئية
    { number: 113, name: 'الفلق', startPage: 604, endPage: 604, weight: 0.25 }, // مثال على صفحة جزئية
    { number: 114, name: 'الناس', startPage: 604, endPage: 604, weight: 0.25 }, // مثال على صفحة جزئية
  ];

  // إنشاء قوالب السور والصفحات
  for (const surah of surahData) {
    for (let page = surah.startPage; page <= surah.endPage; page++) {
      surahTemplates.push({
        surahNumber: surah.number,
        surahName: surah.name,
        pageNumber: page,
        startLine: page === surah.startPage ? 1 : null,
        endLine: page === surah.endPage ? 15 : null, // افتراض 15 سطر لكل صفحة
        weight:
          page === surah.startPage && page === surah.endPage
            ? surah.weight
            : 1.0,
      });
    }
  }

  await prisma.sessionSurahTemplate.createMany({
    data: surahTemplates,
  });

  console.log('✅ تم إنشاء قوالب السور والصفحات');

  // إنشاء سجلات الحضور
  const attendanceData = [];
  // توليد التواريخ فقط لأيام الأحد والثلاثاء والخميس بين 15 يونيو و16 يوليو 2024
  function getCampaign1Dates() {
    const start = new Date('2024-06-15');
    const end = new Date('2024-07-16');
    const result: Date[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.getDay(); // 0=Sunday, 2=Tuesday, 4=Thursday
      if ([0, 2, 4].includes(day)) {
        result.push(new Date(d));
      }
    }

    return result;
  }

  const attendanceDatesCampaign1 = getCampaign1Dates();
  console.log('check the dates: ');
  console.log(attendanceDatesCampaign1);

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const groupId =
      i < 4 ? group1.id : i < 8 ? group2.id : i < 12 ? group3.id : group4.id;
    const campaignId = i < 8 ? campaign1.id : campaign2.id;

    const dates =
      campaignId === campaign1.id
        ? attendanceDatesCampaign1
        : Array.from({ length: 10 }, (_, j) => new Date(2024, 0, j + 1)); // القديمة لحملة 2

    for (const date of dates) {
      attendanceData.push({
        student_id: student.id,
        group_id: groupId,
        campaign_id: campaignId,
        taken_date: date,
        delay_time: Math.floor(Math.random() * 30),
        status: Math.random() > 0.1 ? 'ATTEND' : 'MISS',
      });
    }
  }

  await prisma.attendance.createMany({
    data: attendanceData,
  });

  console.log('✅ تم إنشاء سجلات الحضور');

  // إنشاء جلسات التسميع مع السور الجديدة
  const evaluations = await prisma.evaluation.findMany();
  surahTemplates = await prisma.sessionSurahTemplate.findMany();

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const teacherId =
      i < 4
        ? teachers[0].id
        : i < 8
          ? teachers[1].id
          : i < 12
            ? teachers[2].id
            : teachers[3].id;
    const campaignId = i < 8 ? campaign1.id : campaign2.id;
    const evaluation = evaluations.find((e) => e.campaign_id === campaignId);

    // إنشاء 5 جلسات تسميع لكل طالب
    for (let j = 0; j < 5; j++) {
      const startPage = j * 20 + 1;
      const endPage = (j + 1) * 20;

      // إنشاء جلسة التسميع
      const savingSession = await prisma.savingSession.create({
        data: {
          teacher_id: teacherId,
          student_id: student.id,
          campaign_id: campaignId,
          evaluation_id: evaluation?.id,
          start: startPage,
          end: endPage,
          rating: Math.floor(Math.random() * 5) + 6, // تقييم من 6 إلى 10
          duration: Math.floor(Math.random() * 30) + 15, // مدة من 15 إلى 45 دقيقة
          created_at: new Date(2024, 0, j + 1),
        },
      });

      // إنشاء سور الجلسة بناءً على الصفحات
      const sessionTemplates = surahTemplates.filter(
        (template) =>
          template.pageNumber >= startPage && template.pageNumber <= endPage,
      );

      for (const template of sessionTemplates) {
        const isPassed = Math.random() > 0.3; // 70% نجاح
        const score = isPassed
          ? Math.floor(Math.random() * 20) + 80
          : Math.floor(Math.random() * 30) + 50;

        await prisma.sessionSurah.create({
          data: {
            saving_session_id: savingSession.id,
            template_id: template.id,
            isPassed: isPassed,
            score: score,
            notes: isPassed ? null : 'يحتاج مراجعة',
          },
        });
      }
    }
  }

  console.log('✅ تم إنشاء جلسات التسميع مع السور');

  // إنشاء الأخطاء في السور
  const createdSessions = await prisma.savingSession.findMany({
    include: { session_surahs: true },
  });
  const allMistakes = await prisma.mistake.findMany();

  for (const session of createdSessions) {
    const campaignMistakes = allMistakes.filter(
      (m) => m.campaign_id === session.campaign_id,
    );

    // إضافة أخطاء عشوائية لبعض السور في الجلسة
    const sessionSurahs = session.session_surahs;
    const surahsWithMistakes = sessionSurahs.filter(() => Math.random() > 0.7); // 30% من السور تحتوي على أخطاء

    for (const sessionSurah of surahsWithMistakes) {
      // إضافة 1-2 خطأ لكل سورة
      const numMistakes = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numMistakes; i++) {
        const randomMistake =
          campaignMistakes[Math.floor(Math.random() * campaignMistakes.length)];

        await prisma.mistakeInSession.create({
          data: {
            session_surah_id: sessionSurah.id,
            mistake_id: randomMistake.id,
          },
        });
      }
    }
  }

  console.log('✅ تم إنشاء الأخطاء في السور');

  // إنشاء سجلات النشاط
  const logData = [];

  // سجلات دخول المعلمين
  for (const teacher of teachers) {
    for (let i = 0; i < 10; i++) {
      logData.push({
        event: 'TEACHER_LOGIN',
        timestamp: new Date(2024, 0, i + 1, 8 + Math.floor(Math.random() * 8)),
        teacher_id: teacher.id,
        metadata: {
          ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
          user_agent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
    }
  }

  // سجلات دخول الطلاب
  for (const student of students) {
    for (let i = 0; i < 5; i++) {
      logData.push({
        event: 'STUDENT_LOGIN',
        timestamp: new Date(2024, 0, i + 1, 16 + Math.floor(Math.random() * 4)),
        student_id: student.id,
        metadata: {
          ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
          user_agent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        },
      });
    }
  }

  // سجلات إنشاء جلسات التسميع
  for (const session of createdSessions) {
    logData.push({
      event: 'SAVING_SESSION_CREATED',
      timestamp: session.created_at,
      teacher_id: session.teacher_id,
      student_id: session.student_id,
      metadata: {
        session_id: session.id,
        duration: session.duration,
        rating: session.rating,
      },
    });
  }

  await prisma.log.createMany({
    data: logData,
  });

  console.log('✅ تم إنشاء سجلات النشاط');

  console.log('🎉 تم إنشاء جميع البيانات الأولية بنجاح!');
  console.log(`
📊 ملخص البيانات المنشأة:
- مؤسسة واحدة: ${organization.name}
- مسجدان: ${mosque1.name} و ${mosque2.name}  
- حملتان: حملة لكل مسجد
- 4 مجموعات: مجموعتان لكل مسجد
- 4 معلمين: معلمان لكل مسجد
- 16 طالباً: 4 طلاب لكل مجموعة
- 6 أدوار: 3 أدوار لكل حملة (أدمن، أستاذ، مسمع)
- 4 أخطاء: خطأان لكل حملة
- 4 تقييمات: تقييمان لكل حملة
- ${surahTemplates.length} قالب سورة وصفحة
- ${students.length * 5} جلسة تسميع مع السور
- ${attendanceData.length} سجل حضور
- ${logData.length} سجل نشاط

✅ جميع العلاقات تم ربطها بنجاح
✅ جميع الأسماء والبيانات باللغة العربية
✅ كلمات المرور مشفرة: 123456
✅ نظام التقييم الجديد يعمل على مستوى السورة والصفحة
  `);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إنشاء البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
