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

test('optional works', () => {
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

/*
test('returns schemas for basic types', t => {
  t.deepEqual(CS.Array(), { type: 'array' });
  t.deepEqual(CS.Boolean(), { type: 'boolean' });
  t.deepEqual(CS.Integer(), { type: 'integer' });
  t.deepEqual(CS.Number(), { type: 'number' });
  t.deepEqual(CS.Object(), { type: 'object', additionalProperties: false });
  t.deepEqual(CS.NullableString(), {
    type: ['string', 'null'],
    transform: ['trim'],
  });
  t.deepEqual(CS.String(), { type: 'string', transform: ['trim'] });
});

test('decorates an object schema with history', t => {
  const schema = CS.History(CS.Object());
  t.deepEqual(schema, {
    type: 'object',
    additionalProperties: false,
    properties: {
      createdAt: {
        type: 'number',
        default: schema.properties.createdAt.default,
      },
      updatedAt: {
        type: 'number',
        default: schema.properties.updatedAt.default,
      },
      history: {
        type: 'array',
        default: [],
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            date: { type: 'number' },
            fields: {
              type: 'array',
              items: { type: 'string', transform: ['trim'] },
            },
            userId: { type: 'string', transform: ['trim'] },
            context: { type: 'string', transform: ['trim'] },
          },
        },
      },
    },
  });
});

test('history fails to decorate a non-object', t => {
  t.throws(() => CS.History(CS.Array()));
});

test('object fails when keys are provided with properties', t => {
  t.throws(() => CS.Object({ properties: CS.String() }));
});

test('uses required in objects', t => {
  t.deepEqual(
    CS.Object({
      foo: CS.String({ required: true }),
      bar: CS.String(),
    }),
    {
      type: 'object',
      additionalProperties: false,
      properties: {
        foo: {
          type: 'string',
          transform: ['trim'],
        },
        bar: {
          type: 'string',
          transform: ['trim'],
        },
      },
      required: ['foo'],
    },
  );
});

test('uses required in objects with an existing required', t => {
  t.deepEqual(
    CS.Object(
      {
        foo: CS.String({ required: true }),
        bar: CS.String(),
      },
      {
        required: ['bar'],
      },
    ),
    {
      type: 'object',
      additionalProperties: false,
      properties: {
        foo: {
          type: 'string',
          transform: ['trim'],
        },
        bar: {
          type: 'string',
          transform: ['trim'],
        },
      },
      required: ['bar', 'foo'],
    },
  );
});

test('uses required in objects with duplicate required', t => {
  t.deepEqual(
    CS.Object(
      {
        foo: CS.String({ required: true }),
        bar: CS.String(),
      },
      {
        required: ['foo'],
      },
    ),
    {
      type: 'object',
      additionalProperties: false,
      properties: {
        foo: {
          type: 'string',
          transform: ['trim'],
        },
        bar: {
          type: 'string',
          transform: ['trim'],
        },
      },
      required: ['foo'],
    },
  );
});

test('skips required in objects with nested required', t => {
  t.deepEqual(
    CS.Object({
      foo: CS.Object({
        bar: CS.String({ required: true }),
      }),
    }),
    {
      type: 'object',
      additionalProperties: false,
      properties: {
        foo: {
          type: 'object',
          additionalProperties: false,
          properties: {
            bar: {
              type: 'string',
              transform: ['trim'],
            },
          },
          required: ['bar'],
        },
      },
      // required: ['foo'], <- Intentional comment to show this property should NOT be there
    },
  );
});

test('uses required in objects with nested required on object itself', t => {
  t.deepEqual(
    CS.Object({
      foo: CS.Object(
        {
          bar: CS.String({ required: true }),
        },
        {
          required: true,
        },
      ),
    }),
    {
      type: 'object',
      additionalProperties: false,
      properties: {
        foo: {
          type: 'object',
          additionalProperties: false,
          properties: {
            bar: {
              type: 'string',
              transform: ['trim'],
            },
          },
          required: CS.RequiredArray.from(['bar']),
        },
      },
      required: ['foo'],
    },
  );
});

test('fails on weird required value', t => {
  t.throws(
    () =>
      CS.Object(
        {
          foo: CS.String({ required: 42 }),
          bar: CS.String(),
        },
        {
          required: ['foo'],
        },
      ),
    'Abnormal value for "required" of "foo" (42)',
  );

  t.throws(
    () =>
      CS.Object(
        {
          foo: CS.String({ required: ['bar'] }),
          bar: CS.String(),
        },
        {
          required: ['foo'],
        },
      ),
    'Abnormal value for "required" of "foo" (["bar"])',
  );
});

test('uses array for array type', t => {
  t.deepEqual(CS.Array([CS.Boolean()]), {
    type: 'array',
    items: {
      type: 'boolean',
    },
  });
  t.deepEqual(CS.Array([CS.Boolean(), CS.Number()]), {
    type: 'array',
    items: [{ type: 'boolean' }, { type: 'number' }],
  });
  t.deepEqual(CS.Array([CS.Boolean(), CS.Number()], { default: [] }), {
    type: 'array',
    items: [{ type: 'boolean' }, { type: 'number' }],
    default: [],
  });
});

test('fails on invalid array input', t => {
  t.throws(() => CS.Array([], { items: [] }));
  t.throws(() => CS.Array([], { items: 42 }));
  t.throws(() => CS.Array({ items: 42 }));
  t.throws(() => CS.Array(42));
});

test('pick can filter object properties', t => {
  t.throws(() => CS.Pick(CS.Array(), ['foo']));
  t.throws(() => CS.Pick(CS.Object(), []));
  t.throws(() => CS.Pick(CS.Object()));

  t.deepEqual(CS.Pick(CS.Object(), ['foo']), {
    type: 'object',
    properties: {},
    additionalProperties: false,
  });

  t.deepEqual(
    CS.Pick(
      CS.Object({
        foo: CS.String(),
        bar: CS.Boolean(),
      }),
      ['foo'],
    ),
    {
      type: 'object',
      properties: {
        foo: { type: 'string', transform: ['trim'] },
      },
      additionalProperties: false,
    },
  );

  t.deepEqual(
    CS.Pick(
      CS.Object({
        foo: CS.String({ required: true }),
        bar: CS.Boolean(),
      }),
      ['foo'],
    ),
    {
      type: 'object',
      properties: {
        foo: { type: 'string', transform: ['trim'] },
      },
      required: ['foo'],
      additionalProperties: false,
    },
  );

  t.deepEqual(
    CS.Pick(
      CS.Object({
        foo: CS.String({ required: true }),
        bar: CS.Boolean({ required: true }),
      }),
      ['foo'],
    ),
    {
      type: 'object',
      properties: {
        foo: { type: 'string', transform: ['trim'] },
      },
      required: ['foo'],
      additionalProperties: false,
    },
  );

  t.deepEqual(
    CS.Pick(
      CS.Object({
        foo: CS.String(),
        bar: CS.Boolean({ required: true }),
      }),
      ['foo'],
    ),
    {
      type: 'object',
      properties: {
        foo: { type: 'string', transform: ['trim'] },
      },
      additionalProperties: false,
    },
  );
});

test('omit can filter object properties', t => {
  t.throws(() => CS.Omit(CS.Array(), ['foo']));
  t.throws(() => CS.Omit(CS.Object(), []));
  t.throws(() => CS.Omit(CS.Object()));

  t.deepEqual(CS.Omit(CS.Object(), ['foo']), {
    type: 'object',
    properties: {},
    additionalProperties: false,
  });

  t.deepEqual(
    CS.Omit(
      CS.Object({
        foo: CS.String(),
        bar: CS.Boolean(),
      }),
      ['bar'],
    ),
    {
      type: 'object',
      properties: {
        foo: { type: 'string', transform: ['trim'] },
      },
      additionalProperties: false,
    },
  );

  t.deepEqual(
    CS.Omit(
      CS.Object({
        foo: CS.String({ required: true }),
        bar: CS.Boolean(),
      }),
      ['bar'],
    ),
    {
      type: 'object',
      properties: {
        foo: { type: 'string', transform: ['trim'] },
      },
      required: ['foo'],
      additionalProperties: false,
    },
  );

  t.deepEqual(
    CS.Omit(
      CS.Object({
        foo: CS.String({ required: true }),
        bar: CS.Boolean({ required: true }),
      }),
      ['bar'],
    ),
    {
      type: 'object',
      properties: {
        foo: { type: 'string', transform: ['trim'] },
      },
      required: ['foo'],
      additionalProperties: false,
    },
  );

  t.deepEqual(
    CS.Omit(
      CS.Object({
        foo: CS.String(),
        bar: CS.Boolean({ required: true }),
      }),
      ['bar'],
    ),
    {
      type: 'object',
      properties: {
        foo: { type: 'string', transform: ['trim'] },
      },
      additionalProperties: false,
    },
  );
});
*/
