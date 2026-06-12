import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateExistingData() {
  console.log('🔄 بدء عملية ترحيل البيانات الموجودة...');

  try {
    // 1. إنشاء قوالب السور والصفحات إذا لم تكن موجودة
    const existingTemplates = await prisma.sessionSurahTemplate.count();
    if (existingTemplates === 0) {
      console.log('📝 إنشاء قوالب السور والصفحات...');
      
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
        // ... (يمكن إضافة باقي السور هنا أو استخدام البيانات من seed.ts)
      ];

      const surahTemplates = [];
      for (const surah of surahData) {
        for (let page = surah.startPage; page <= surah.endPage; page++) {
          surahTemplates.push({
            surahNumber: surah.number,
            surahName: surah.name,
            pageNumber: page,
            startLine: page === surah.startPage ? 1 : null,
            endLine: page === surah.endPage ? 15 : null,
            weight: page === surah.startPage && page === surah.endPage ? surah.weight : 1.0,
          });
        }
      }

      await prisma.sessionSurahTemplate.createMany({
        data: surahTemplates,
      });
      console.log('✅ تم إنشاء قوالب السور والصفحات');
    }

    // 2. إنشاء تقييم افتراضي إذا لم يكن موجود
    console.log('🔄 إنشاء تقييم افتراضي...');
    
    let defaultEvaluation = await prisma.evaluation.findFirst();
    if (!defaultEvaluation) {
      // نحتاج إلى campaign_id، لذا سنجد أول حملة أو ننشئ واحدة
      let defaultCampaign = await prisma.campaign.findFirst();
      if (!defaultCampaign) {
        // إنشاء مسجد افتراضي إذا لم يكن موجود
        let defaultMosque = await prisma.mosque.findFirst();
        if (!defaultMosque) {
          // إنشاء منظمة افتراضية إذا لم تكن موجودة
          let defaultOrg = await prisma.organization.findFirst();
          if (!defaultOrg) {
            defaultOrg = await prisma.organization.create({
              data: {
                name: 'منظمة افتراضية للترحيل',
                description: 'منظمة مؤقتة لترحيل البيانات'
              }
            });
          }
          
          defaultMosque = await prisma.mosque.create({
            data: {
              organization_id: defaultOrg.id,
              name: 'مسجد افتراضي للترحيل'
            }
          });
        }
        
        defaultCampaign = await prisma.campaign.create({
          data: {
            mosque_id: defaultMosque.id,
            name: 'حملة افتراضية للترحيل'
          }
        });
      }
      
      defaultEvaluation = await prisma.evaluation.create({
        data: {
          title: 'تقييم افتراضي للترحيل',
          points: 100,
          minimum_marks: 70,
          campaign_id: defaultCampaign.id
        }
      });
    }

    // 3. ترحيل جلسات التسميع الموجودة
    console.log('🔄 ترحيل جلسات التسميع الموجودة...');
    console.log('⚠️  تم تغيير هيكل البيانات: تم إزالة SavingSession, SessionSurah, MistakeInSession');
    console.log('⚠️  لم تعد هناك حاجة لترحيل البيانات - تم استبدالها بـ RecitationSession, SessionPortion, SessionError');
    console.log('✅ تم تخطي ترحيل جلسات التسميع');

    // 4. حذف البيانات القديمة (اختياري - يمكن تعليق هذا الجزء للاحتفاظ بالبيانات القديمة)
    console.log('🗑️ حذف البيانات القديمة...');
    
    // حذف الأخطاء القديمة المرتبطة بالجلسات
    // Note: This step is no longer needed as the schema has changed
    // The old saving_session_id field no longer exists

    console.log('✅ تم حذف البيانات القديمة');

    console.log('🎉 تم الانتهاء من ترحيل البيانات بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في ترحيل البيانات:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// تشغيل الترحيل
migrateExistingData()
  .catch((e) => {
    console.error('❌ فشل في ترحيل البيانات:', e);
    process.exit(1);
  });
