import { Expose, Transform } from 'class-transformer';
import { Column } from 'typeorm';

export class ReportDto {
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    mileage: number;

    @Expose()
    approved: boolean;

    // adding new prop to the response associated with prop from the entity
    // obj will be the report entity
    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number;
}