import { ClientError } from '../ClientError.mjs';
import { CONSTRAINT_VIOLATION_MAP } from '../PostgresError.mjs';

describe('PostgresError', () => {
  describe('CONSTRAINT_VIOLATION related', () => {
    it('Should translate error into ClientError', () => {
      const table = 'table';
      const tableRelation = 'tableRelation';
      const errorCodes = ['23502', '23503', '23505'];

      errorCodes.forEach((errorCode) => {
        const result = CONSTRAINT_VIOLATION_MAP[errorCode](table, tableRelation);

        expect(result).toBeInstanceOf(ClientError);
      });
    });
  });
});
