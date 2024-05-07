import { parse, type Input, type ObjectSchema } from 'valibot';

export const createEntityValidator = <S extends ObjectSchema<any>>(entityName: string, schema: S) => (
  (input: Input<S>) => {
    const inKeys = Object.keys(input);
    if (Object.keys(schema.entries).some((key) => !inKeys.includes(key))) {
      throw new Error(`${entityName}.NOT_CONTAIN_NEEDED_PROPERTY`);
    }

    return parse(schema, input, { abortEarly: true });
  }
)
