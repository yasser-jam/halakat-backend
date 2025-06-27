import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMosqueDto } from './mosque.dto';

@Injectable()
export class MosqueService {
  constructor(private prisma: PrismaService) {}

  async create(createMosqueDto: CreateMosqueDto) {
    const mosque = await this.prisma.mosque.create({ data: createMosqueDto });
    return { message: 'Mosque created', data: mosque };
  }

  async findAll() {
    const mosques = await this.prisma.mosque.findMany();
    return { message: 'All mosques', data: mosques };
  }

  async findOne(id: number) {
    const mosque = await this.prisma.mosque.findUnique({
      where: { id: Number(id) },
    });
    return { message: `Mosque ${id} found`, data: mosque };
  }

  async update(id: number, updateMosqueDto: CreateMosqueDto) {
    const mosque = await this.prisma.mosque.update({
      where: { id: Number(id) },
      data: updateMosqueDto,
    });
    return { message: `Mosque ${id} updated`, data: mosque };
  }

  async remove(id: number) {
    await this.prisma.mosque.delete({ where: { id: Number(id) } });
    return { message: `Mosque ${id} deleted` };
  }
}
