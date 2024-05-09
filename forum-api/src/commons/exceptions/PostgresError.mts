import NotFoundError from './NotFoundError.mjs'

// const GRAB_RELATION_TABLE_NAME_REGEX = /\btable\s+"([^"]+)"/gi;

// const PostgresCodeErrorMap: Record<string, (err: any) => Error> = {
//   '23503': (err) => new NotFoundError(`${err?.detail?.match(GRAB_RELATION_TABLE_NAME_REGEX)[1] || 'entitas'} tidak ditemukan`),
// }

// export const handlePostgresError = (err: Error) => {
//   if ('code' in err) {
//     return PostgresCodeErrorMap[err.code as string]?.(err);
//   }
// }

export const CONSTRAINT_VIOLATION_MAP: Record<string, (table: string, tableRelation: string) => Error> = {
  '23502': (table, tableRelation) => new NotFoundError(`${tableRelation} tidak ditemukan`),
  '23503': (table, tableRelation) => new NotFoundError(`${tableRelation} tidak ditemukan`),
  '23505': (table, tableRelation) => new NotFoundError(`${tableRelation} sudah ada`),
};
