import { CS } from '.';

const checkType = <A>(a: A) => a;

test('string schema works', () => {
    const str = CS.String(true);
    type strType = typeof str.type;

    checkType<strType>('abcd');
    expect(str.getJsonSchema()).toEqual({
        type: 'string',
        transform: ['trim'],
    });
});

test('number schema works', () => {
    const cs = CS.Number(true);
    type type_ = typeof cs.type;

    checkType<type_>(2);
    expect(cs.getJsonSchema()).toEqual({
        type: 'number',
    });
});

test('integer schema works', () => {
    const cs = CS.Integer(true);
    type type_ = typeof cs.type;

    checkType<type_>(2);
    expect(cs.getJsonSchema()).toEqual({
        type: 'integer',
    });
});

test('any schema works', () => {
    const cs = CS.Any(true);
    type type_ = typeof cs.type;

    checkType<type_>(2);
    checkType<type_>('abc');
    checkType<type_>({ a: 1 });
    expect(cs.getJsonSchema()).toEqual({});
});

test('obj schema works', () => {
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

test('object with optional works', () => {
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

test('object with all optional works', () => {
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

test('mergeobjects works', () => {
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

test('mergeobjects with no required fields works', () => {
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

test('array schema works', () => {
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

test('enum schema works', () => {
    const cs = CS.Enum(['a' as 'a', 'b' as 'b'], true);
    type csType = typeof cs.type;

    checkType<csType>('a');
    checkType<csType>('b');

    expect(cs.getJsonSchema()).toEqual({
        type: 'string',
        enum: ['a', 'b'],
    });
});
