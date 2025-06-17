import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create Campaign
  const campaign = await prisma.campaign.create({
    data: {
      name: 'الدورة الصيفية 2025',
      isCampaignContinous: false,
      completeCountApproach: 'UNLIMIT_ASSIGN',
      timingApproach: 'hours',
      startTime: '15:00',
      endTime: '17:00',
      days: 'tuesday,wednesday,thursday',
    },
  });

  // Create Teacher
  const teacher = await prisma.teacher.create({
    data: {
      first_name: 'أحمد',
      last_name: 'يوسف',
      mobile_phone_number: '0912345678',
      password: 'password',
    },
  });

  // Create Group
  const group = await prisma.group.create({
    data: {
      title: 'المجتهدون',
      class: 6,
      currentTeacherId: teacher.id,
      campaigns: {
        create: {
          campaignId: campaign.id,
        },
      },
      teachers: {
        create: {
          teacherId: teacher.id,
        },
      },
    },
  });

  // Create 5 Students
  const students = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.student.create({
        data: {
          first_name: `Student${i + 1}`,
          student_mobile: `091111111${i + 1}`,
          groups: {
            create: {
              groupId: group.id,
              campaignId: campaign.id,
            },
          },
        },
      }),
    ),
  );

  // Create Attendance records for 3 days per student
  const days = ['2024-06-04', '2024-06-05', '2024-06-06']; // Example: Tuesday–Thursday
  for (const student of students) {
    for (const day of days) {
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          groupId: group.id,
          campaignId: campaign.id,
          delayTime: 0,
          status: 'NOT_TAKEN',
          takenDate: new Date(`${day}T15:00:00Z`),
        },
      });
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
