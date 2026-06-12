import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const surahWeights: Record<number, number> = {
  78: 1, 79: 1, 80: 1, 81: 1, 82: 1, 83: 1, 84: 1, 85: 1,
  86: 2, 87: 2, 88: 1, 89: 1, 90: 1,
  91: 2, 92: 2, 93: 2, 94: 2, 95: 2, 96: 2, 97: 2, 98: 2, 99: 2,
  100: 2, 101: 2, 102: 2,
  103: 3, 104: 3, 105: 3, 106: 3, 107: 3, 108: 3, 109: 3, 110: 3,
  111: 3, 112: 3, 113: 3, 114: 3,
};

const surahs = [
  { number: 1, name: 'الفاتحة', startPage: 1, endPage: 1 },
  { number: 2, name: 'البقرة', startPage: 2, endPage: 49 },
  { number: 3, name: 'آل عمران', startPage: 50, endPage: 76 },
  { number: 4, name: 'النساء', startPage: 77, endPage: 106 },
  { number: 5, name: 'المائدة', startPage: 106, endPage: 127 },
  { number: 6, name: 'الأنعام', startPage: 128, endPage: 150 },
  { number: 7, name: 'الأعراف', startPage: 151, endPage: 176 },
  { number: 8, name: 'الأنفال', startPage: 177, endPage: 186 },
  { number: 9, name: 'التوبة', startPage: 187, endPage: 207 },
  { number: 10, name: 'يونس', startPage: 208, endPage: 221 },
  { number: 11, name: 'هود', startPage: 221, endPage: 235 },
  { number: 12, name: 'يوسف', startPage: 235, endPage: 248 },
  { number: 13, name: 'الرعد', startPage: 249, endPage: 255 },
  { number: 14, name: 'إبراهيم', startPage: 255, endPage: 261 },
  { number: 15, name: 'الحجر', startPage: 262, endPage: 267 },
  { number: 16, name: 'النحل', startPage: 267, endPage: 281 },
  { number: 17, name: 'الإسراء', startPage: 282, endPage: 293 },
  { number: 18, name: 'الكهف', startPage: 293, endPage: 304 },
  { number: 19, name: 'مريم', startPage: 305, endPage: 312 },
  { number: 20, name: 'طه', startPage: 312, endPage: 321 },
  { number: 21, name: 'الأنبياء', startPage: 322, endPage: 331 },
  { number: 22, name: 'الحج', startPage: 332, endPage: 341 },
  { number: 23, name: 'المؤمنون', startPage: 342, endPage: 351 },
  { number: 24, name: 'النور', startPage: 351, endPage: 366 },
  { number: 25, name: 'الفرقان', startPage: 366, endPage: 376 },
  { number: 26, name: 'الشعراء', startPage: 376, endPage: 396 },
  { number: 27, name: 'النمل', startPage: 396, endPage: 404 },
  { number: 28, name: 'القصص', startPage: 404, endPage: 414 },
  { number: 29, name: 'العنكبوت', startPage: 414, endPage: 422 },
  { number: 30, name: 'الروم', startPage: 422, endPage: 427 },
  { number: 31, name: 'لقمان', startPage: 428, endPage: 433 },
  { number: 32, name: 'السجدة', startPage: 433, endPage: 435 },
  { number: 33, name: 'الأحزاب', startPage: 435, endPage: 445 },
  { number: 34, name: 'سبأ', startPage: 445, endPage: 452 },
  { number: 35, name: 'فاطر', startPage: 452, endPage: 457 },
  { number: 36, name: 'يس', startPage: 457, endPage: 464 },
  { number: 37, name: 'الصافات', startPage: 465, endPage: 476 },
  { number: 38, name: 'ص', startPage: 476, endPage: 482 },
  { number: 39, name: 'الزمر', startPage: 482, endPage: 495 },
  { number: 40, name: 'غافر', startPage: 495, endPage: 504 },
  { number: 41, name: 'فصلت', startPage: 504, endPage: 511 },
  { number: 42, name: 'الشورى', startPage: 511, endPage: 517 },
  { number: 43, name: 'الزخرف', startPage: 518, endPage: 525 },
  { number: 44, name: 'الدخان', startPage: 525, endPage: 528 },
  { number: 45, name: 'الجاثية', startPage: 528, endPage: 531 },
  { number: 46, name: 'الأحقاف', startPage: 531, endPage: 534 },
  { number: 47, name: 'محمد', startPage: 535, endPage: 537 },
  { number: 48, name: 'الفتح', startPage: 538, endPage: 541 },
  { number: 49, name: 'الحجرات', startPage: 542, endPage: 544 },
  { number: 50, name: 'ق', startPage: 545, endPage: 548 },
  { number: 51, name: 'الذاريات', startPage: 548, endPage: 550 },
  { number: 52, name: 'الطور', startPage: 550, endPage: 552 },
  { number: 53, name: 'النجم', startPage: 552, endPage: 555 },
  { number: 54, name: 'القمر', startPage: 555, endPage: 557 },
  { number: 55, name: 'الرحمن', startPage: 558, endPage: 560 },
  { number: 56, name: 'الواقعة', startPage: 560, endPage: 562 },
  { number: 57, name: 'الحديد', startPage: 562, endPage: 567 },
  { number: 58, name: 'المجادلة', startPage: 568, endPage: 571 },
  { number: 59, name: 'الحشر', startPage: 571, endPage: 573 },
  { number: 60, name: 'الممتحنة', startPage: 574, endPage: 576 },
  { number: 61, name: 'الصف', startPage: 577, endPage: 578 },
  { number: 62, name: 'الجمعة', startPage: 578, endPage: 579 },
  { number: 63, name: 'المنافقون', startPage: 579, endPage: 581 },
  { number: 64, name: 'التغابن', startPage: 581, endPage: 583 },
  { number: 65, name: 'الطلاق', startPage: 583, endPage: 585 },
  { number: 66, name: 'التحريم', startPage: 585, endPage: 587 },
  { number: 67, name: 'الملك', startPage: 588, endPage: 590 },
  { number: 68, name: 'القلم', startPage: 590, endPage: 592 },
  { number: 69, name: 'الحاقة', startPage: 592, endPage: 594 },
  { number: 70, name: 'المعارج', startPage: 595, endPage: 596 },
  { number: 71, name: 'نوح', startPage: 596, endPage: 598 },
  { number: 72, name: 'الجن', startPage: 598, endPage: 600 },
  { number: 73, name: 'المزمل', startPage: 601, endPage: 602 },
  { number: 74, name: 'المدثر', startPage: 602, endPage: 604 },
  { number: 75, name: 'القيامة', startPage: 604, endPage: 605 },
  { number: 76, name: 'الإنسان', startPage: 605, endPage: 607 },
  { number: 77, name: 'المرسلات', startPage: 607, endPage: 608 },
  { number: 78, name: 'النبأ', startPage: 608, endPage: 609 },
  { number: 79, name: 'النازعات', startPage: 610, endPage: 611 },
  { number: 80, name: 'عبس', startPage: 611, endPage: 612 },
  { number: 81, name: 'التكوير', startPage: 612, endPage: 613 },
  { number: 82, name: 'الانفطار', startPage: 613, endPage: 614 },
  { number: 83, name: 'المطففين', startPage: 614, endPage: 615 },
  { number: 84, name: 'الانشقاق', startPage: 615, endPage: 616 },
  { number: 85, name: 'البروج', startPage: 616, endPage: 617 },
  { number: 86, name: 'الطارق', startPage: 617, endPage: 618 },
  { number: 87, name: 'الأعلى', startPage: 618, endPage: 618 },
  { number: 88, name: 'الغاشية', startPage: 619, endPage: 619 },
  { number: 89, name: 'الفجر', startPage: 619, endPage: 621 },
  { number: 90, name: 'البلد', startPage: 621, endPage: 622 },
  { number: 91, name: 'الشمس', startPage: 622, endPage: 622 },
  { number: 92, name: 'الليل', startPage: 623, endPage: 623 },
  { number: 93, name: 'الضحى', startPage: 624, endPage: 624 },
  { number: 94, name: 'الشرح', startPage: 624, endPage: 624 },
  { number: 95, name: 'التين', startPage: 625, endPage: 625 },
  { number: 96, name: 'العلق', startPage: 625, endPage: 626 },
  { number: 97, name: 'القدر', startPage: 626, endPage: 626 },
  { number: 98, name: 'البينة', startPage: 626, endPage: 627 },
  { number: 99, name: 'الزلزلة', startPage: 627, endPage: 628 },
  { number: 100, name: 'العاديات', startPage: 628, endPage: 628 },
  { number: 101, name: 'القارعة', startPage: 629, endPage: 629 },
  { number: 102, name: 'التكاثر', startPage: 629, endPage: 629 },
  { number: 103, name: 'العصر', startPage: 630, endPage: 630 },
  { number: 104, name: 'الهمزة', startPage: 630, endPage: 630 },
  { number: 105, name: 'الفيل', startPage: 631, endPage: 631 },
  { number: 106, name: 'قريش', startPage: 631, endPage: 631 },
  { number: 107, name: 'الماعون', startPage: 632, endPage: 632 },
  { number: 108, name: 'الكوثر', startPage: 632, endPage: 632 },
  { number: 109, name: 'الكافرون', startPage: 633, endPage: 633 },
  { number: 110, name: 'النصر', startPage: 633, endPage: 633 },
  { number: 111, name: 'المسد', startPage: 634, endPage: 634 },
  { number: 112, name: 'الإخلاص', startPage: 634, endPage: 634 },
  { number: 113, name: 'الفلق', startPage: 634, endPage: 634 },
  { number: 114, name: 'الناس', startPage: 634, endPage: 634 },
];

function generateTemplates() {
  const templates = [];
  for (const surah of surahs) {
    const weight = surahWeights[surah.number] ?? 1;
    for (let page = surah.startPage; page <= surah.endPage; page++) {
      templates.push({
        surahNumber: surah.number,
        surahName: surah.name,
        pageNumber: page,
        weight,
      });
    }
  }
  return templates;
}

async function updateWeights() {
  const byWeight = new Map<number, number[]>();
  for (const [sn, w] of Object.entries(surahWeights)) {
    const list = byWeight.get(w) || [];
    list.push(Number(sn));
    byWeight.set(w, list);
  }
  let total = 0;
  for (const [weight, surahNumbers] of byWeight) {
    const result = await prisma.sessionSurahTemplate.updateMany({
      where: { surahNumber: { in: surahNumbers }, weight: { not: weight } },
      data: { weight },
    });
    total += result.count;
  }
  if (total > 0) {
    console.log(`📝 تم تحديث ${total} سجل بقيم الوزن الجديدة`);
  }
}

async function main() {
  console.log('🌙 بدء بذر بيانات سور القرآن الكريم...\n');

  const existingCount = await prisma.sessionSurahTemplate.count();
  if (existingCount > 0) {
    console.log(`⚠️  يوجد بالفعل ${existingCount} سجل في جدول القوالب.`);
    console.log('📝 جاري تحديث الأوزان للسور 78-114...');
    await updateWeights();
    console.log('✅ تم تحديث الأوزان بنجاح.\n');
    return;
  }

  const templates = generateTemplates();
  console.log(`📝 جاري إنشاء ${templates.length} قالب للصفحات...`);

  await prisma.sessionSurahTemplate.createMany({
    data: templates,
    skipDuplicates: true,
  });

  console.log(`✅ تم إنشاء ${templates.length} قالب بنجاح`);
  console.log('📊 تشمل جميع سور القرآن الـ 114');
  console.log(`📄 إجمالي الصفحات: 604 صفحة (مصحف المدينة النبوية)\n`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في البذر:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
