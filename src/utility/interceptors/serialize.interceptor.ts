/**
 * A NestJS interceptor that serializes the response data using the provided DTO class.
 *
 * The `SerializeIncludes` function is a decorator that can be used to apply the `SerializeInterceptor` to a controller or route handler. It takes a DTO class as a parameter, which will be used to serialize the response data.
 *
 * The `SerializeInterceptor` class implements the `NestInterceptor` interface and is responsible for transforming the response data using the `plainToClass` function from the `class-transformer` library. This ensures that the response data is serialized according to the provided DTO class.
 *
 * @param dto The DTO class to use for serializing the response data.
 * @returns A decorator that applies the `SerializeInterceptor` to a controller or route handler.
 */
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function SerializeIncludes(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, { exposeUnsetFields: true });
      }),
    );
  }
}
