import { object, string } from 'valibot';
import { createEntityValidator } from './entity.mjs';

describe('Entity utilities', () => {
  describe('createEntityValidator()', () => {
    it('should throw error when input not contain needed property', () => {
      // Arrange
      const entityName = 'entity';
      const schema = object({
        id: string(),
        name: string(),
      });
      const input = { id: 'id-123' };

      const validate = createEntityValidator(entityName, schema);

      // Action & Assert
      // @ts-expect-error for testing purpose
      expect(() => validate(input)).toThrow(`${entityName}.NOT_CONTAIN_NEEDED_PROPERTY`);
    });

    it('should return parsed input when input contain needed property', () => {
      // Arrange
      const entityName = 'entity';
      const schema = object({
        id: string(),
        name: string(),
      });
      const input = { id: 'id-123', name: 'name' };

      const validator = createEntityValidator(entityName, schema);

      // Action
      const result = validator(input);

      // Assert
      expect(result).toEqual(input);
    });
  });
});
