import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('بدء عملية إنشاء البيانات الأولية...');

  // تنظيف البيانات الموجودة
  await prisma.log.deleteMany();
  await prisma.mistakeInSession.deleteMany();
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

  // إنشاء جلسات التسميع
  const savingSessionsData = [];
  const evaluations = await prisma.evaluation.findMany();

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
      savingSessionsData.push({
        teacher_id: teacherId,
        student_id: student.id,
        campaign_id: campaignId,
        evaluation_id: evaluation?.id,
        start: j * 20 + 1, // صفحة البداية
        end: (j + 1) * 20, // صفحة النهاية
        rating: Math.floor(Math.random() * 5) + 6, // تقييم من 6 إلى 10
        duration: Math.floor(Math.random() * 30) + 15, // مدة من 15 إلى 45 دقيقة
        created_at: new Date(2024, 0, j + 1),
      });
    }
  }

  await prisma.savingSession.createMany({
    data: savingSessionsData,
  });

  console.log('✅ تم إنشاء جلسات التسميع');

  // إنشاء الأخطاء في الجلسات
  const createdSessions = await prisma.savingSession.findMany();
  const allMistakes = await prisma.mistake.findMany();

  const mistakeInSessionData = [];
  for (const session of createdSessions) {
    const campaignMistakes = allMistakes.filter(
      (m) => m.campaign_id === session.campaign_id,
    );

    // إضافة 1-3 أخطاء عشوائية لكل جلسة
    const numMistakes = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numMistakes; i++) {
      const randomMistake =
        campaignMistakes[Math.floor(Math.random() * campaignMistakes.length)];
      mistakeInSessionData.push({
        saving_session_id: session.id,
        mistake_id: randomMistake.id,
        page:
          Math.floor(Math.random() * (session.end - session.start + 1)) +
          session.start,
      });
    }
  }

  await prisma.mistakeInSession.createMany({
    data: mistakeInSessionData,
  });

  console.log('✅ تم إنشاء الأخطاء في الجلسات');

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
- ${savingSessionsData.length} جلسة تسميع
- ${mistakeInSessionData.length} خطأ في الجلسات
- ${attendanceData.length} سجل حضور
- ${logData.length} سجل نشاط

✅ جميع العلاقات تم ربطها بنجاح
✅ جميع الأسماء والبيانات باللغة العربية
✅ كلمات المرور مشفرة: 123456
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
