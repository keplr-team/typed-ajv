/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-unused-vars-experimental,@typescript-eslint/no-unsafe-call */
import { CS } from '../index';

const checkType = <A>(a: A) => a;

describe('typed-ajv', () => {
  describe('String()', () => {
    it('works with string schema', () => {
      const str = CS.String(true);
      type strType = typeof str.type;

      checkType<strType>('abcd');
      expect(str.getJsonSchema()).toMatchSnapshot();
    });

    it('works with string schema and options', () => {
      const str = CS.String(true, { minLength: 1, maxLength: 10 });
      type strType = typeof str.type;

      checkType<strType>('abcd');
      expect(str.getJsonSchema()).toMatchSnapshot();
    });

    it('works with string schema and nullable option', () => {
      const str = CS.String(true, { nullable: true });
      type strType = typeof str.type;

      checkType<strType>('abcd');
      checkType<strType>(null);
      expect(str.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Number()', () => {
    it('works with number schema', () => {
      const cs = CS.Number(true);
      type type_ = typeof cs.type;

      checkType<type_>(2);
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });

    it('works with number schema and options', () => {
      const cs = CS.Number(true, {
        exclusiveMinimum: 3,
        exclusiveMaximum: 5,
      });
      type type_ = typeof cs.type;

      checkType<type_>(2);
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });

    it('works with number schema and nullable option', () => {
      const cs = CS.Number(true, { nullable: true });
      type type_ = typeof cs.type;

      checkType<type_>(2);
      checkType<type_>(null);
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Integer()', () => {
    it('works with integer schema', () => {
      const cs = CS.Integer(true);
      type type_ = typeof cs.type;

      checkType<type_>(2);
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });

    it('works with integer schema and options', () => {
      const cs = CS.Integer(true, { minimum: 1, maximum: 4 });
      type type_ = typeof cs.type;

      checkType<type_>(2);
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });

    it('works with integer schema and nullable option', () => {
      const cs = CS.Integer(true, { nullable: true });
      type type_ = typeof cs.type;

      checkType<type_>(2);
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Boolean()', () => {
    it('works with boolean schema', () => {
      const cs = CS.Boolean(true);
      type type_ = typeof cs.type;

      checkType<type_>(true);
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });

    it('works with boolean schema and nullable option', () => {
      const cs = CS.Boolean(true, { nullable: true });
      type type_ = typeof cs.type;

      checkType<type_>(true);
      checkType<type_>(null);
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Any()', () => {
    it('works with any schema', () => {
      const cs = CS.Any(true);
      type type_ = typeof cs.type;

      checkType<type_>(2);
      checkType<type_>('abc');
      checkType<type_>({ a: 1 });
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });

    it('works with any schema and nullable option', () => {
      const cs = CS.Any(true, { nullable: true });
      type type_ = typeof cs.type;

      checkType<type_>(2);
      checkType<type_>('abc');
      checkType<type_>({ a: 1 });
      checkType<type_>(null);
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Unknown()', () => {
    it('works with unknown schema', () => {
      const cs = CS.Unknown(true);
      type type_ = typeof cs.type;

      checkType<type_>(2);
      checkType<type_>('abc');
      checkType<type_>({ a: 1 });
      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Object()', () => {
    it('works with object schema', () => {
      const obj = CS.Object(
        {
          a: CS.String(true),
          b: CS.Number(true),
        },
        true,
      );
      type objType = typeof obj.type;

      checkType<objType>({ a: 'abcd', b: 2 });
      expect(obj.getJsonSchema()).toMatchSnapshot();
    });

    it('works with object schema and optional', () => {
      const obj = CS.Object(
        {
          a: CS.String(true),
          b: CS.String(false),
        },
        true,
      );
      type objType = typeof obj.type;

      checkType<objType>({
        a: 'b',
        b: undefined,
      });
      checkType<objType>({
        a: 'b',
        b: 'b',
      });

      expect(obj.getJsonSchema()).toMatchSnapshot();
    });

    it('works with object schema with all optional', () => {
      const obj = CS.Object(
        {
          a: CS.String(false),
          b: CS.String(false),
        },
        true,
      );
      type objType = typeof obj.type;

      checkType<objType>({
        a: undefined,
        b: undefined,
      });
      checkType<objType>({
        a: 'b',
        b: 'b',
      });

      expect(obj.getJsonSchema()).toMatchSnapshot();
    });

    it('works with object schema and options', () => {
      const obj = CS.Object(
        {
          a: CS.String(true),
          b: CS.String(false),
        },
        true,
        { description: 'object', additionalProperties: true },
      );
      type objType = typeof obj.type;

      checkType<objType>({
        a: 'b',
        b: undefined,
      });
      checkType<objType>({
        a: 'b',
        b: 'b',
      });
      checkType<objType>({
        a: 'b',
        b: 'b',
        anotherProp: 42,
      });

      expect(obj.getJsonSchema()).toMatchSnapshot();
    });

    it('works with array schema and nullable option', () => {
      const obj = CS.Array(CS.String(true), true, { nullable: true });
      type objType = typeof obj.type;

      checkType<objType>(['a']);
      checkType<objType>(null);
    });

    it('works with object schema and nullable option', () => {
      const obj = CS.Object(
        {
          a: CS.String(true),
          b: CS.String(false),
        },
        true,
        { nullable: true },
      );
      type objType = typeof obj.type;

      checkType<objType>({
        a: 'b',
        b: undefined,
      });
      checkType<objType>({
        a: 'b',
        b: 'b',
      });
      checkType<objType>(null);

      expect(obj.getJsonSchema()).toMatchSnapshot();
    });

    it('works with object schema and nested array', () => {
      const obj = CS.Object(
        {
          a: CS.Array(CS.String(true), true),
        },
        true,
      );
      type objType = typeof obj.type;

      checkType<objType>({
        a: ['a'],
      });

      expect(obj.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('MergeObjects', () => {
    it('works with mergeobjects schema', () => {
      const obj = CS.MergeObjects(
        CS.Object(
          {
            a: CS.String(true),
          },
          true,
        ),
        CS.Object(
          {
            b: CS.String(false),
          },
          true,
        ),
        true,
      );
      type objType = typeof obj.type;

      checkType<objType>({
        a: 'a',
        b: undefined,
      });
      checkType<objType>({
        a: 'b',
        b: 'b',
      });

      expect(obj.getJsonSchema()).toMatchSnapshot();
    });

    it('works with mergeobjects schema with required in second object', () => {
      const obj = CS.MergeObjects(
        CS.Object(
          {
            a: CS.String(false),
          },
          true,
        ),
        CS.Object(
          {
            b: CS.String(true),
          },
          true,
        ),
        true,
      );
      type objType = typeof obj.type;

      checkType<objType>({
        a: undefined,
        b: 'b',
      });
      checkType<objType>({
        a: 'b',
        b: 'b',
      });

      expect(obj.getJsonSchema()).toMatchSnapshot();
    });

    it('works with mergeobjects schema and no required fields', () => {
      const obj = CS.MergeObjects(
        CS.Object(
          {
            a: CS.String(false),
          },
          true,
        ),
        CS.Object(
          {
            b: CS.String(false),
          },
          true,
        ),
        true,
      );
      type objType = typeof obj.type;

      checkType<objType>({
        a: undefined,
        b: undefined,
      });
      checkType<objType>({
        a: 'b',
        b: 'b',
      });

      expect(obj.getJsonSchema()).toMatchSnapshot();
    });

    it('rejects mergeobjects with duplicate keys', () => {
      expect(() =>
        CS.MergeObjects(
          CS.Object(
            {
              a: CS.String(true),
              b: CS.String(true),
            },
            true,
          ),
          CS.Object(
            {
              a: CS.String(true),
              b: CS.String(true),
            },
            true,
          ),
          true,
        ),
      ).toThrow('Merging of duplicate properties "a", "b" is not allowed');
    });

    it('works with mergeobjects schema and nullable option', () => {
      const obj = CS.MergeObjects(
        CS.Object(
          {
            a: CS.String(true),
          },
          true,
          { nullable: true },
        ),
        CS.Object(
          {
            b: CS.String(false),
          },
          true,
          { nullable: false },
        ),
        true,
      );
      type objType = typeof obj.type;

      checkType<objType>({
        a: 'a',
        b: undefined,
      });
      checkType<objType>({
        a: 'b',
        b: 'b',
      });
      checkType<objType>(null);

      expect(obj.getJsonSchema()).toMatchSnapshot();

      const obj2 = CS.MergeObjects(
        CS.Object(
          {
            a: CS.String(true),
          },
          true,
          { nullable: false },
        ),
        CS.Object(
          {
            b: CS.String(false),
          },
          true,
          { nullable: true },
        ),
        true,
      );
      type obj2Type = typeof obj2.type;

      checkType<obj2Type>({
        a: 'a',
        b: undefined,
      });
      checkType<obj2Type>({
        a: 'b',
        b: 'b',
      });
      checkType<obj2Type>(null);

      expect(obj2.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Array()', () => {
    it('works with array schema', () => {
      const arr = CS.Array(CS.String(true), true);
      type arrType = typeof arr.type;

      checkType<arrType>(['abcd', 'efgh']);
      expect(arr.getJsonSchema()).toMatchSnapshot();
    });

    it('works with array schema and opts', () => {
      const arr = CS.Array(CS.String(true), true, {
        uniqueItems: true,
        minItems: 1,
      });
      type arrType = typeof arr.type;

      checkType<arrType>(['abcd', 'abcd']);
      expect(arr.getJsonSchema()).toMatchSnapshot();
    });

    it('works with array schema and nullable option', () => {
      const arr = CS.Array(CS.String(true), true, {
        nullable: true,
      });
      type arrType = typeof arr.type;

      checkType<arrType>(['abcd', 'abcd']);
      checkType<arrType>(null);
      expect(arr.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Enum()', () => {
    it('works with enum schema', () => {
      const cs = CS.Enum(['a' as const, 'b' as const], true);
      const csTuple = CS.Enum(['a', 'b'] as ['a', 'b'], true);
      const csRo = CS.Enum(['a', 'b'] as const, true);
      type csType = typeof cs.type;

      checkType<csType>('a');
      checkType<csType>('b');

      expect(cs.getJsonSchema()).toMatchSnapshot();
    });

    it('works with enum schema and nullable option', () => {
      const cs = CS.Enum(['a' as const, 'b' as const], true, {
        nullable: true,
      });
      const csTuple = CS.Enum(['a', 'b'] as ['a', 'b'], true);
      const csRo = CS.Enum(['a', 'b'] as const, true);
      type csType = typeof cs.type;

      checkType<csType>('a');
      checkType<csType>('b');
      checkType<csType>(null);

      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('AnyOf()', () => {
    it('generates an anyOf schema', () => {
      const cs = CS.Object(
        {
          foo: CS.AnyOf([CS.String(true), CS.Boolean(true)], true),
        },
        true,
      );
      type csType = typeof cs.type;

      checkType<csType>({ foo: 'foo' });
      checkType<csType>({ foo: true });

      expect(cs.getJsonSchema()).toMatchSnapshot();
    });

    it('generates an anyOf schema with nullable option', () => {
      const cs = CS.Object(
        {
          foo: CS.AnyOf([CS.String(true), CS.Boolean(true)], true, {
            nullable: true as const, // TypeScript seems lost on this case, we need to force the "as const"
          }),
        },
        true,
      );
      type csType = typeof cs.type;

      checkType<csType>({ foo: 'foo' });
      checkType<csType>({ foo: true });
      checkType<csType>({ foo: null });

      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Const()', () => {
    it('works with const schema', () => {
      const cs = CS.Const(42 as const, true);
      type csType = typeof cs.type;

      checkType<csType>(42);

      expect(cs.getJsonSchema()).toMatchSnapshot();
    });

    it('works with const schema and nullable option', () => {
      const cs = CS.Const(42 as const, true, { nullable: true });
      type csType = typeof cs.type;

      checkType<csType>(42);
      checkType<csType>(null);

      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Null()', () => {
    it('works with null schema', () => {
      const cs = CS.Null(true);
      type csType = typeof cs.type;

      checkType<csType>(null);

      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Required()', () => {
    it('works within an object schema', () => {
      const cs = CS.Object({ a: CS.Required(CS.String(false)) }, true);
      type csType = typeof cs.type;

      checkType<csType>({ a: 'abcd' });

      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  describe('Optional()', () => {
    it('works within an object schema', () => {
      const cs = CS.Object({ a: CS.Optional(CS.String(true)) }, true);
      type csType = typeof cs.type;

      checkType<csType>({ a: 'abcd' });
      checkType<csType>({ a: undefined });
      checkType<csType>({});

      expect(cs.getJsonSchema()).toMatchSnapshot();
    });
  });

  it('sets defaults', () => {
    expect(CS.Any(true, { default: true }).getJsonSchema()).toMatchSnapshot();

    expect(
      CS.AnyOf([CS.Boolean(true), CS.Number(true)], false, {
        default: false,
      }).getJsonSchema(),
    ).toMatchSnapshot();

    expect(
      CS.Array(CS.Boolean(true), true, {
        default: [true],
      }).getJsonSchema(),
    ).toMatchSnapshot();

    expect(
      CS.Boolean(true, { default: false }).getJsonSchema(),
    ).toMatchSnapshot();

    expect(
      CS.Const(true as const, false, { default: true }).getJsonSchema(),
    ).toMatchSnapshot();

    expect(
      CS.Enum(['a', 'b', 'c'] as const, true, {
        default: 'b',
      }).getJsonSchema(),
    ).toMatchSnapshot();

    expect(CS.Null(false, { default: null }).getJsonSchema()).toMatchSnapshot();

    expect(CS.Number(true, { default: 123 }).getJsonSchema()).toMatchSnapshot();

    expect(CS.String(true, { default: 'anything' }).getJsonSchema()).toEqual({
      type: 'string',
      transform: ['trim'],
      default: 'anything',
    });

    expect(
      CS.Unknown(true, { default: false }).getJsonSchema(),
    ).toMatchSnapshot();

    expect(
      CS.MergeObjects(
        CS.Object({ a: CS.String(true) }, true, {
          default: { a: 'foo' },
        }),
        CS.Object({ b: CS.String(false) }, true, {
          default: { b: '123' },
        }),
        false,
      ).getJsonSchema(),
    ).toMatchSnapshot();
  });
});
