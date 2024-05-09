import { parse, type Input, type ObjectSchema } from 'valibot';

export const createEntityValidator = <S extends ObjectSchema<any>>(entityName: string, schema: S) => (
  (input: Input<S>) => {
    const requiredKeys = Object.keys(schema.entries);
    const inputKeys = Object.entries(input).filter(([, v]) => v !== undefined).map(([k]) => k);

    if (!requiredKeys.every((key) => inputKeys.includes(key))) {
      throw new Error(`${entityName}.NOT_CONTAIN_NEEDED_PROPERTY`);
    }

    return parse(schema, input, { abortEarly: true, abortPipeEarly: true });
  }
);
