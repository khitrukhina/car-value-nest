import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { User } from '../users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    createReport(reportDto: CreateReportDto, currUser: User) {
        const report = this.repo.create(reportDto);
        report.user = currUser;

        return this.repo.save(report);
    }

    async changeApproval(id: string, approveReportDto: ApproveReportDto) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) } });
        if (!report) {
            throw new NotFoundException('Report not found');
        }
        report.approved = approveReportDto.approved;

        return this.repo.save(report);
    }

    getEstimate(estimateDto: GetEstimateDto) {
        const builder = this.repo.createQueryBuilder();
        return builder.select('AVG(price)', 'price')
            .where(`make = :make`, { make: estimateDto.make })
            .andWhere(`model = :model`, { model: estimateDto.model })
            .andWhere(`lng - :lng BETWEEN -5 AND 5`, { lng: estimateDto.lng })
            .andWhere(`lat - :lat BETWEEN -5 AND 5`, { lat: estimateDto.lat })
            .andWhere(`year - :year BETWEEN -5 AND 5`, { year: estimateDto.year })
            .andWhere(`approved IS TRUE`)
            .orderBy(`ABS(mileage - :mileage)`, 'DESC')
            .setParameters({ mileage: estimateDto.mileage })
            .limit(3)
            .getRawOne();
    }
}
