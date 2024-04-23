import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

interface ClassConstructorI {
    new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructorI) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructorI) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
       // running before request is handled by the request handler
        return next.handle().pipe(
            map((data: any) => {

                // running before response is sent
                return plainToClass(this.dto, data, { excludeExtraneousValues: true });
            })
        );
    }
}