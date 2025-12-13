import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('بدء عملية إنشاء البيانات الأولية للنظام الجديد...');
  console.log('Starting seed with new auth system...\n');

  // تنظيف البيانات الموجودة - Clean existing data
  console.log('🗑️  Cleaning existing data...');
  await prisma.log.deleteMany();
  await prisma.curriculumLessonSession.deleteMany();
  await prisma.groupCurriculum.deleteMany();
  await prisma.curriculumTemplateNode.deleteMany();
  await prisma.curriculumTemplate.deleteMany();
  await prisma.curriculumCategory.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.category.deleteMany();
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
  await prisma.mosqueManager.deleteMany();
  await prisma.organizationManager.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();
  await prisma.mosque.deleteMany();
  await prisma.organization.deleteMany();
  console.log('✅ Data cleaned\n');

  // ============================================
  // 1. إنشاء المؤسسة - Create Organization
  // ============================================
  console.log('📋 Creating Organization...');
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
  console.log(
    `✅ Organization created: ${organization.name} (ID: ${organization.id})\n`,
  );

  // ============================================
  // 2. إنشاء مالك المؤسسة - Create Organization Owner
  // ============================================
  console.log('👤 Creating Organization Owner...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const orgOwner = await prisma.teacher.create({
    data: {
      mobile_phone_number: '+966501234567',
      first_name: 'أحمد',
      last_name: 'المدير',
      password: hashedPassword,
      role: 'TEACHER',
      educational_level: 'بكالوريوس شريعة',
      university_name: 'جامعة الإمام محمد بن سعود الإسلامية',
    },
  });

  await prisma.organizationManager.create({
    data: {
      teacher_id: orgOwner.id,
      organization_id: organization.id,
      role: 'OWNER',
      is_active: true,
    },
  });
  console.log(
    `✅ Organization Owner created: ${orgOwner.first_name} ${orgOwner.last_name}`,
  );
  console.log(`   Phone: ${orgOwner.mobile_phone_number}`);
  console.log(`   Password: password123`);
  console.log(`   Role: OWNER\n`);

  // ============================================
  // 3. إنشاء المساجد - Create Mosques
  // ============================================
  console.log('🕌 Creating Mosques...');
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
  console.log(`✅ Mosque created: ${mosque1.name} (ID: ${mosque1.id})`);

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
  console.log(`✅ Mosque created: ${mosque2.name} (ID: ${mosque2.id})\n`);

  // ============================================
  // 4. إنشاء مدير المسجد - Create Mosque Manager
  // ============================================
  console.log('👤 Creating Mosque Manager...');
  const mosqueManager = await prisma.teacher.create({
    data: {
      mobile_phone_number: '+966501234570',
      first_name: 'محمد',
      last_name: 'مدير المسجد',
      password: hashedPassword,
      role: 'TEACHER',
      educational_level: 'بكالوريوس تربية إسلامية',
      university_name: 'جامعة الملك سعود',
    },
  });

  await prisma.mosqueManager.create({
    data: {
      teacher_id: mosqueManager.id,
      mosque_id: mosque1.id,
      role: 'ADMIN',
      is_active: true,
    },
  });
  console.log(
    `✅ Mosque Manager created: ${mosqueManager.first_name} ${mosqueManager.last_name}`,
  );
  console.log(`   Phone: ${mosqueManager.mobile_phone_number}`);
  console.log(`   Password: password123`);
  console.log(`   Manages: ${mosque1.name}`);
  console.log(`   Role: ADMIN\n`);

  // ============================================
  // 5. إنشاء معلم عادي - Create Regular Teacher
  // ============================================
  console.log('👨‍🏫 Creating Regular Teacher...');
  const regularTeacher = await prisma.teacher.create({
    data: {
      mobile_phone_number: '+966501234571',
      first_name: 'عبدالله',
      last_name: 'المعلم',
      password: hashedPassword,
      role: 'TEACHER',
      educational_level: 'دبلوم تحفيظ',
      is_mojaz: true,
    },
  });
  console.log(
    `✅ Regular Teacher created: ${regularTeacher.first_name} ${regularTeacher.last_name}`,
  );
  console.log(`   Phone: ${regularTeacher.mobile_phone_number}`);
  console.log(`   Password: password123\n`);

  // ============================================
  // 6. إنشاء طالب - Create Student
  // ============================================
  console.log('👦 Creating Student...');
  const student = await prisma.student.create({
    data: {
      mosque_id: mosque1.id,
      student_mobile: '+966501234580',
      first_name: 'خالد',
      last_name: 'الطالب',
      password: hashedPassword,
      birth_date: new Date('2010-01-15'),
      educational_class: 5,
      current_mosque_name: mosque1.name,
      school: 'مدرسة الملك فهد الابتدائية',
      father_name: 'محمد الطالب',
      father_phone_number: '+966501234581',
      mother_name: 'فاطمة',
      mother_phone_number: '+966501234582',
    },
  });
  console.log(`✅ Student created: ${student.first_name} ${student.last_name}`);
  console.log(`   Phone: ${student.student_mobile}`);
  console.log(`   Home Mosque: ${mosque1.name}`);
  console.log(`   Password: password123\n`);

  // ============================================
  // 7. إنشاء حملة - Create Campaign
  // ============================================
  console.log('📅 Creating Campaign...');
  const campaign = await prisma.campaign.create({
    data: {
      mosque_id: mosque1.id,
      name: 'الفصل الدراسي الأول 1446',
      start_date: new Date('2024-09-01'),
      end_date: new Date('2025-01-31'),
      status: true,
      is_campaign_continuous: false,
      days: JSON.stringify([
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
      ]),
      start_time: '16:00',
      end_time: '18:00',
    },
  });
  console.log(`✅ Campaign created: ${campaign.name} (ID: ${campaign.id})\n`);

  // ============================================
  // 8. تعيين المعلم في الحملة - Assign Teacher to Campaign
  // ============================================
  console.log('🔗 Assigning Teacher to Campaign...');
  await prisma.teacherCampaign.create({
    data: {
      teacher_id: regularTeacher.id,
      campaign_id: campaign.id,
      is_active: true,
    },
  });
  console.log(`✅ Teacher assigned to campaign\n`);

  // ============================================
  // 9. إنشاء مجموعة - Create Group
  // ============================================
  console.log('👥 Creating Group...');
  const group = await prisma.group.create({
    data: {
      mosque_id: mosque1.id,
      title: 'مجموعة المبتدئين',
      class: 1,
      current_teacher_id: regularTeacher.id,
    },
  });
  console.log(`✅ Group created: ${group.title} (ID: ${group.id})\n`);

  // ============================================
  // 10. ربط المجموعة بالحملة - Link Group to Campaign
  // ============================================
  console.log('🔗 Linking Group to Campaign...');
  await prisma.groupCampaigns.create({
    data: {
      group_id: group.id,
      campaign_id: campaign.id,
    },
  });
  console.log(`✅ Group linked to campaign\n`);

  // ============================================
  // 11. تعيين المعلم في المجموعة - Assign Teacher to Group
  // ============================================
  console.log('🔗 Assigning Teacher to Group...');
  await prisma.teacherGroup.create({
    data: {
      teacher_id: regularTeacher.id,
      group_id: group.id,
      campaign_id: campaign.id,
    },
  });
  console.log(`✅ Teacher assigned to group\n`);

  // ============================================
  // 12. تسجيل الطالب في الحملة - Enroll Student in Campaign
  // ============================================
  console.log('🔗 Enrolling Student in Campaign...');
  await prisma.studentCampaign.create({
    data: {
      student_id: student.id,
      campaign_id: campaign.id,
      is_active: true,
    },
  });
  console.log(`✅ Student enrolled in campaign\n`);

  // ============================================
  // 13. إضافة الطالب إلى المجموعة - Add Student to Group
  // ============================================
  console.log('🔗 Adding Student to Group...');
  await prisma.studentGroup.create({
    data: {
      student_id: student.id,
      group_id: group.id,
      campaign_id: campaign.id,
    },
  });
  console.log(`✅ Student added to group\n`);

  // ============================================
  // Summary
  // ============================================
  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ Seed completed successfully!');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('📊 SUMMARY:');
  console.log('───────────────────────────────────────────────────────');
  console.log(`Organizations: 1`);
  console.log(`  - ${organization.name}`);
  console.log('');
  console.log(`Mosques: 2`);
  console.log(`  - ${mosque1.name} (${mosque1.city})`);
  console.log(`  - ${mosque2.name} (${mosque2.city})`);
  console.log('');
  console.log(`Users: 4`);
  console.log(
    `  1. Organization Owner: ${orgOwner.first_name} ${orgOwner.last_name}`,
  );
  console.log(`     Phone: ${orgOwner.mobile_phone_number}`);
  console.log(`     Password: password123`);
  console.log(`     Manages: ${organization.name} (OWNER)`);
  console.log('');
  console.log(
    `  2. Mosque Manager: ${mosqueManager.first_name} ${mosqueManager.last_name}`,
  );
  console.log(`     Phone: ${mosqueManager.mobile_phone_number}`);
  console.log(`     Password: password123`);
  console.log(`     Manages: ${mosque1.name} (ADMIN)`);
  console.log('');
  console.log(
    `  3. Regular Teacher: ${regularTeacher.first_name} ${regularTeacher.last_name}`,
  );
  console.log(`     Phone: ${regularTeacher.mobile_phone_number}`);
  console.log(`     Password: password123`);
  console.log(`     Teaching: ${group.title} in ${campaign.name}`);
  console.log('');
  console.log(`  4. Student: ${student.first_name} ${student.last_name}`);
  console.log(`     Phone: ${student.student_mobile}`);
  console.log(`     Password: password123`);
  console.log(`     Enrolled: ${group.title} in ${campaign.name}`);
  console.log('');
  console.log(`Campaigns: 1`);
  console.log(`  - ${campaign.name} (${mosque1.name})`);
  console.log('');
  console.log(`Groups: 1`);
  console.log(`  - ${group.title} (Teacher: ${regularTeacher.first_name})`);
  console.log('───────────────────────────────────────────────────────\n');

  console.log('🔐 LOGIN CREDENTIALS:');
  console.log('───────────────────────────────────────────────────────');
  console.log('POST /auth/login (Unified login for all teachers)');
  console.log(
    `  Organization Owner: ${orgOwner.mobile_phone_number} / password123`,
  );
  console.log(
    `  Mosque Manager: ${mosqueManager.mobile_phone_number} / password123`,
  );
  console.log(
    `  Regular Teacher: ${regularTeacher.mobile_phone_number} / password123`,
  );
  console.log('');
  console.log('POST /auth/login/student');
  console.log(`  Student: ${student.student_mobile} / password123`);
  console.log('═══════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
