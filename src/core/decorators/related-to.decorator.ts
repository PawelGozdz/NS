/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function RelatedTo<T>(property: keyof T, validationOptions?: ValidationOptions): PropertyDecorator {
  return function isDefinedWhenRelatedTo(object, propertyName) {
    registerDecorator({
      name: 'relatedTo',
      target: object.constructor,
      propertyName: propertyName as string,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === undefined || relatedValue !== undefined;
        },
        defaultMessage: (validationArguments: ValidationArguments): string => {
          const [relatedPropertyName] = validationArguments.constraints;
          return `${validationArguments.property} is related to ${relatedPropertyName}. Provide both.`;
        },
      },
    });
  };
}
