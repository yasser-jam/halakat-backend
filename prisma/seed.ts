// prisma/seed.ts

import { PrismaClient, STATUS, MARITAL } from '@prisma/client'; // Import enums from Prisma client
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // Create seed data for teachers
  //   const teacher1 = await prisma.teacher.create({
  //     data: {
  //       educational_level: 'ماجستير',
  //       university_name: 'جامعة دمشق',
  //       college_name: 'كلية التربية',
  //       first_name: 'أحمد',
  //       last_name: 'الخطيب',
  //       birth_date: new Date('1980-05-10'),
  //       mobile_phone_number: '0998765432',
  //       job_role: 'مدرس أول',
  //       workplace_name: 'مركز التعليم المتقدم',
  //       is_mojaz: true,
  //       is_working: true,
  //       current_residence_address_area: 'باب توما',
  //       current_residence_address_street: 'شارع العابد',
  //       current_residence_address_building: 'البناء رقم 4',
  //     },
  //   });

  //   const teacher2 = await prisma.teacher.create({
  //     data: {
  //       educational_level: 'بكالوريوس',
  //       university_name: 'جامعة حلب',
  //       college_name: 'كلية الآداب',
  //       first_name: 'ليلى',
  //       last_name: 'العلي',
  //       birth_date: new Date('1985-09-15'),
  //       mobile_phone_number: '0987654321',
  //       job_role: 'مدرسة',
  //       workplace_name: 'مدرسة الأمل',
  //       is_mojaz: true,
  //       is_working: false,
  //       current_residence_address_area: 'المزة',
  //       current_residence_address_street: 'شارع الثورة',
  //       current_residence_address_building: 'البناء رقم 12',
  //     },
  //   });

  //   // Create seed data for groups
  //   const group1 = await prisma.group.create({
  //     data: {
  //       title: 'مجموعة النور',
  //       teacherId: teacher1.id,
  //     },
  //   });

  //   const group2 = await prisma.group.create({
  //     data: {
  //       title: 'مجموعة النجاح',
  //       teacherId: teacher2.id,
  //     },
  //   });

  // Create seed data for students with nested relation to Group
  const studentsData = [
    {
      first_name: 'محمد',
      last_name: 'الأسعد',
      birth_date: new Date('2012-03-15'),
      current_mosque_name: 'مسجد الرحمة',
      educational_class: 6,
      student_mobile: '0945123456',
      school: 'مدرسة اليرموك الابتدائية',
      in_another_mosque: false,
      father_name: 'عمر الأسعد',
      father_status: STATUS.ALIVE,
      father_job: 'مهندس',
      father_income_level: 'متوسط',
      father_education_level: 'بكالوريوس',
      father_phone_number: '0954332101',
      mother_name: 'سعاد الأسعد',
      mother_status: STATUS.ALIVE,
      mother_job: 'ممرضة',
      mother_income_level: 'متوسط',
      mother_education_level: 'دبلوم',
      mother_phone_number: '0998765430',
      parent_marital_status: MARITAL.MARRIED,
      current_residence_address_area: 'القصاع',
      current_residence_address_street: 'شارع الزهور',
      current_residence_address_building: 'البناء رقم 7',
    },
    {
      first_name: 'نور',
      last_name: 'الحموي',
      birth_date: new Date('2011-11-25'),
      current_mosque_name: 'مسجد النور',
      educational_class: 5,
      student_mobile: '0945761234',
      school: 'مدرسة الفتح النموذجية',
      in_another_mosque: true,
      father_name: 'حسن الحموي',
      father_status: STATUS.DEAD,
      father_job: 'تاجر',
      father_income_level: 'عالي',
      father_education_level: 'ثانوي',
      father_phone_number: '0934332456',
      mother_name: 'فاطمة الحموي',
      mother_status: STATUS.ALIVE,
      mother_job: 'ربة منزل',
      mother_income_level: 'عالي',
      mother_education_level: 'ابتدائي',
      mother_phone_number: '0995123456',
      parent_marital_status: MARITAL.SEPARATED,
      current_residence_address_area: 'الحمراء',
      current_residence_address_street: 'شارع النخيل',
      current_residence_address_building: 'البناء رقم 5',
    },
    {
      first_name: 'كريم',
      last_name: 'الشامي',
      birth_date: new Date('2013-06-30'),
      current_mosque_name: 'مسجد الهدى',
      educational_class: 4,
      student_mobile: '0932456789',
      school: 'مدرسة الشام الحديثة',
      in_another_mosque: false,
      father_name: 'مروان الشامي',
      father_status: STATUS.ALIVE,
      father_job: 'طبيب',
      father_income_level: 'عالي',
      father_education_level: 'دكتوراه',
      father_phone_number: '0911123456',
      mother_name: 'هدى الشامي',
      mother_status: STATUS.ALIVE,
      mother_job: 'صيدلانية',
      mother_income_level: 'عالي',
      mother_education_level: 'بكالوريوس',
      mother_phone_number: '0987654321',
      parent_marital_status: MARITAL.MARRIED,
      current_residence_address_area: 'كفرسوسة',
      current_residence_address_street: 'شارع الورد',
      current_residence_address_building: 'البناء رقم 9',
    },
    {
      first_name: 'سليم',
      last_name: 'الحسني',
      birth_date: new Date('2010-12-10'),
      current_mosque_name: 'مسجد الرحمن',
      educational_class: 7,
      student_mobile: '0936547891',
      school: 'مدرسة النبراس',
      in_another_mosque: true,
      father_name: 'أحمد الحسني',
      father_status: STATUS.ALIVE,
      father_job: 'نجار',
      father_income_level: 'منخفض',
      father_education_level: 'ابتدائي',
      father_phone_number: '0987564321',
      mother_name: 'منى الحسني',
      mother_status: STATUS.ALIVE,
      mother_job: 'مساعدة طبية',
      mother_income_level: 'متوسط',
      mother_education_level: 'ثانوي',
      mother_phone_number: '0921345670',
      parent_marital_status: MARITAL.MARRIED,
      current_residence_address_area: 'جرمانا',
      current_residence_address_street: 'شارع اللوز',
      current_residence_address_building: 'البناء رقم 3',
    },
    // Additional students without any group
    {
      first_name: 'علي',
      last_name: 'حمدان',
      birth_date: new Date('2014-02-14'),
      current_mosque_name: 'مسجد الإحسان',
      educational_class: 3,
      student_mobile: '0912345678',
      school: 'مدرسة التعاون',
      in_another_mosque: false,
      father_name: 'خالد حمدان',
      father_status: STATUS.ALIVE,
      father_job: 'حلاق',
      father_income_level: 'منخفض',
      father_education_level: 'إعدادي',
      father_phone_number: '0923456789',
      mother_name: 'هديل حمدان',
      mother_status: STATUS.ALIVE,
      mother_job: 'مدرسة',
      mother_income_level: 'متوسط',
      mother_education_level: 'ثانوي',
      mother_phone_number: '0998765432',
      parent_marital_status: MARITAL.MARRIED,
      current_residence_address_area: 'المرجة',
      current_residence_address_street: 'شارع الياسمين',
      current_residence_address_building: 'البناء رقم 2',
    },
    {
      first_name: 'ياسر',
      last_name: 'الغالي',
      birth_date: new Date('2015-08-19'),
      current_mosque_name: 'مسجد الفرقان',
      educational_class: 2,
      student_mobile: '0923456780',
      school: 'مدرسة الفرات',
      in_another_mosque: false,
      father_name: 'رامي الغالي',
      father_status: STATUS.ALIVE,
      father_job: 'سائق شاحنة',
      father_income_level: 'متوسط',
      father_education_level: 'ثانوي',
      father_phone_number: '0987654320',
      mother_name: 'سهى الغالي',
      mother_status: STATUS.ALIVE,
      mother_job: 'مساعدة إدارية',
      mother_income_level: 'متوسط',
      mother_education_level: 'ثانوي',
      mother_phone_number: '0912345671',
      parent_marital_status: MARITAL.MARRIED,
      current_residence_address_area: 'برزة',
      current_residence_address_street: 'شارع الجبل',
      current_residence_address_building: 'البناء رقم 8',
    },
    {
      first_name: 'أحمد',
      last_name: 'المزين',
      birth_date: new Date('2012-08-20'),
      current_mosque_name: 'مسجد الرحمة',
      educational_class: 2,
      student_mobile: '0923456781',
      school: 'مدرسة الفرات',
      in_another_mosque: false,
      father_name: 'سعد المزين',
      father_status: STATUS.ALIVE,
      father_job: 'سائق شاحنة',
      father_income_level: 'متوسط',
      father_education_level: 'ثانوي',
      father_phone_number: '0987654322',
      mother_name: 'سهى السعيد',
      mother_status: STATUS.ALIVE,
      mother_job: 'مساعدة إدارية',
      mother_income_level: 'متوسط',
      mother_education_level: 'ثانوي',
      mother_phone_number: '0912345672',
      parent_marital_status: MARITAL.MARRIED,
      current_residence_address_area: 'برزة',
      current_residence_address_street: 'شارع الجبل',
      current_residence_address_building: 'البناء رقم 9',
    },
    {
      first_name: 'كريم',
      last_name: 'الميداني',
      birth_date: new Date('2011-01-20'),
      current_mosque_name: 'مسجد الرحمة',
      educational_class: 2,
      student_mobile: '0923456711',
      school: 'مدرسة الفرات',
      in_another_mosque: true,
      father_name: 'فهد الميداني',
      father_status: STATUS.ALIVE,
      father_job: 'موظف',
      father_income_level: 'متوسط',
      father_education_level: 'ثانوي',
      father_phone_number: '0987614321',
      mother_name: 'مها الأحمد',
      mother_status: STATUS.ALIVE,
      mother_job: 'مساعدة إدارية',
      mother_income_level: 'متوسط',
      mother_education_level: 'ثانوي',
      mother_phone_number: '0922345672',
      parent_marital_status: MARITAL.MARRIED,
      current_residence_address_area: 'برزة',
      current_residence_address_street: 'شارع الجبل',
      current_residence_address_building: 'البناء رقم 9',
    },
  ];
  const hashedPassword = await bcrypt.hash('password', 10);

  // create SUPER_ADMIN
  await prisma.teacher.create({
    data: {
      mobile_phone_number: '0993544811',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  // create new teacher

  // create new campaign
  await prisma.campaign.create({
    data: {
      name: 'الدورة الصيفية 2024',
    },
  });

  for (const student of studentsData) {
    await prisma.student.create({
      data: student,
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
