import Ajv from 'ajv';

import { CS } from '..';

describe('the schemas validate as expected with ajv', () => {
  describe('AnyOf', () => {
    it('validates the second prop of anyOf properly when using object and a discriminator', () => {
      const schema = CS.AnyOf(
        [
          CS.Object(
            { type: CS.Enum(['car'] as const, true), wheels: CS.Number(true) },
            true,
          ),
          CS.Object(
            { type: CS.Enum(['horse'] as const, true), legs: CS.Number(true) },
            true,
          ),
        ],
        true,
        { discriminator: 'type' },
      ).getJsonSchema();

      const validate = new Ajv({
        allErrors: true,
        removeAdditional: true,
        discriminator: true,
      }).compile(schema);

      // main test
      expect(validate({ type: 'horse', legs: 4 })).toBe(true);

      // sanity checks
      expect(validate({ type: 'horse', wheels: 2 })).toBe(false);
      expect(validate({ type: 'car', wheels: 2 })).toBe(true);
    });
  });

  describe('Const', () => {
    it('works properly', () => {
      const schema = CS.Const('a' as const, true).getJsonSchema();

      const validate = new Ajv({ allErrors: true }).compile(schema);

      // main test
      expect(validate('a')).toBe(true);
      expect(validate('b')).toBe(false);
      expect(validate(1)).toBe(false);
    });
  });
});
