// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
// import { CreateEvaluationDto } from './evaluation.dto';

// @Injectable()
// export class EvaluationService {
//   constructor(private prisma: PrismaService) {}

//   create(data: CreateEvaluationDto) {
//     return this.prisma.evaluation.create({ data });
//   }

//   findAll() {
//     return this.prisma.evaluation.findMany();
//   }

//   findByCampaign(campaignId: number) {
//     return this.prisma.evaluation.findMany({ where: { campaignId } });
//   }

//   async assert(
//     campaignId: number,
//     evaluations: Array<{
//       id?: number;
//       title: string;
//       points: number;
//       reducedAmount: number;
//     }>,
//   ) {
//     // 1. Get current evaluations for this campaign
//     const existing = await this.prisma.evaluation.findMany({
//       where: { campaignId },
//     });

//     const incomingIds = new Set(
//       evaluations.filter((e) => e.id).map((e) => e.id),
//     );
//     const existingIds = new Set(existing.map((e) => e.id));

//     // 2. Update or create
//     for (const item of evaluations) {
//       if (item.id && existingIds.has(item.id)) {
//         const current = existing.find((e) => e.id === item.id);
//         if (
//           current?.title !== item.title ||
//           current?.points !== item.points ||
//           current?.reducedAmount !== item.reducedAmount
//         ) {
//           await this.prisma.evaluation.update({
//             where: { id: item.id },
//             data: {
//               title: item.title,
//               points: item.points,
//               reducedAmount: item.reducedAmount,
//             },
//           });
//         }
//       } else {
//         await this.prisma.evaluation.create({
//           data: {
//             campaignId,
//             title: item.title,
//             points: item.points,
//             reducedAmount: item.reducedAmount,
//           },
//         });
//       }
//     }

//     // 3. Delete evaluations not in incoming list
//     const toDelete = existing.filter((e) => !incomingIds.has(e.id));
//     for (const e of toDelete) {
//       await this.prisma.evaluation.delete({ where: { id: e.id } });
//     }

//     return { message: 'Campaign evaluations synced successfully.' };
//   }
// }
