import { CS } from '.';

const checkType = <A>(a: A) => a;

it('works with string schema', () => {
    const str = CS.String(true);
    type strType = typeof str.type;

    checkType<strType>('abcd');
    expect(str.getJsonSchema()).toEqual({
        type: 'string',
        transform: ['trim'],
    });
});

it('works with string schema and options', () => {
    const str = CS.String(true, { minLength: 1, maxLength: 10 });
    type strType = typeof str.type;

    checkType<strType>('abcd');
    expect(str.getJsonSchema()).toEqual({
        type: 'string',
        transform: ['trim'],
        minLength: 1,
        maxLength: 10,
    });
});

it('works with number schema', () => {
    const cs = CS.Number(true);
    type type_ = typeof cs.type;

    checkType<type_>(2);
    expect(cs.getJsonSchema()).toEqual({
        type: 'number',
    });
});

it('works with number schema and options', () => {
    const cs = CS.Number(true, { exclusiveMinimum: 3, exclusiveMaximum: 5 });
    type type_ = typeof cs.type;

    checkType<type_>(2);
    expect(cs.getJsonSchema()).toEqual({
        type: 'number',
        exclusiveMinimum: 3,
        exclusiveMaximum: 5,
    });
});

it('works with integer schema', () => {
    const cs = CS.Integer(true);
    type type_ = typeof cs.type;

    checkType<type_>(2);
    expect(cs.getJsonSchema()).toEqual({
        type: 'integer',
    });
});

it('works with integer schema and options', () => {
    const cs = CS.Integer(true, { minimum: 1, maximum: 4 });
    type type_ = typeof cs.type;

    checkType<type_>(2);
    expect(cs.getJsonSchema()).toEqual({
        type: 'integer',
        minimum: 1,
        maximum: 4,
    });
});

it('works with boolean schema', () => {
    const cs = CS.Boolean(true);
    type type_ = typeof cs.type;

    checkType<type_>(true);
    expect(cs.getJsonSchema()).toEqual({
        type: 'boolean',
    });
});

it('works with any schema', () => {
    const cs = CS.Any(true);
    type type_ = typeof cs.type;

    checkType<type_>(2);
    checkType<type_>('abc');
    checkType<type_>({ a: 1 });
    expect(cs.getJsonSchema()).toEqual({});
});

it('works with unknown schema', () => {
    const cs = CS.Unknown(true);
    type type_ = typeof cs.type;

    checkType<type_>(2);
    checkType<type_>('abc');
    checkType<type_>({ a: 1 });
    expect(cs.getJsonSchema()).toEqual({});
});

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
    expect(obj.getJsonSchema()).toEqual({
        type: 'object',
        additionalProperties: false,
        properties: {
            a: {
                type: 'string',
                transform: ['trim'],
            },
            b: {
                type: 'number',
            },
        },
        required: ['a', 'b'],
    });
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

    expect(obj.getJsonSchema()).toEqual({
        type: 'object',
        additionalProperties: false,
        properties: {
            a: {
                type: 'string',
                transform: ['trim'],
            },
            b: {
                type: 'string',
                transform: ['trim'],
            },
        },
        required: ['a'],
    });
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

    expect(obj.getJsonSchema()).toEqual({
        type: 'object',
        additionalProperties: false,
        properties: {
            a: {
                type: 'string',
                transform: ['trim'],
            },
            b: {
                type: 'string',
                transform: ['trim'],
            },
        },
    });
});

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

    expect(obj.getJsonSchema()).toEqual({
        type: 'object',
        additionalProperties: false,
        properties: {
            a: {
                type: 'string',
                transform: ['trim'],
            },
            b: {
                type: 'string',
                transform: ['trim'],
            },
        },
        required: ['a'],
    });
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

    expect(obj.getJsonSchema()).toEqual({
        type: 'object',
        additionalProperties: false,
        properties: {
            a: {
                type: 'string',
                transform: ['trim'],
            },
            b: {
                type: 'string',
                transform: ['trim'],
            },
        },
        required: [],
    });
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
    ).toThrowError('Merging of duplicate properties "a", "b" is not allowed');
});

it('works with array schema', () => {
    const arr = CS.Array(CS.String(true), true);
    type arrType = typeof arr.type;

    checkType<arrType>(['abcd', 'efgh']);
    expect(arr.getJsonSchema()).toEqual({
        type: 'array',
        items: {
            type: 'string',
            transform: ['trim'],
        },
    });
});

it('works with array schema and opts', () => {
    const arr = CS.Array(CS.String(true), true, {
        uniqueItems: true,
        minItems: 1,
    });
    type arrType = typeof arr.type;

    checkType<arrType>(['abcd', 'abcd']);
    expect(arr.getJsonSchema()).toEqual({
        type: 'array',
        items: {
            type: 'string',
            transform: ['trim'],
        },
        uniqueItems: true,
        minItems: 1,
    });
});

it('works with enum schema', () => {
    const cs = CS.Enum(['a' as 'a', 'b' as 'b'], true);
    const csTuple = CS.Enum(['a', 'b'] as ['a', 'b'], true);
    const csRo = CS.Enum(['a', 'b'] as ReadonlyArray<'a' | 'b'>, true);
    type csType = typeof cs.type;

    checkType<csType>('a');
    checkType<csType>('b');

    expect(cs.getJsonSchema()).toEqual({
        type: 'string',
        enum: ['a', 'b'],
    });
});

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

    expect(cs.getJsonSchema()).toEqual({
        type: 'object',
        required: ['foo'],
        additionalProperties: false,
        properties: {
            foo: {
                anyOf: [
                    { type: 'string', transform: ['trim'] },
                    { type: 'boolean' },
                ],
            },
        },
    });
});
