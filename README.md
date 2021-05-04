# typed-ajv

Define TypeScript types and JSON Schema schemas from the same declaration.

## Getting started

Define your schema:

```typescript
const cs = CS.Object({
  a: CS.String(true),
  b: CS.Number(false),
});
```

Get the type:

```typescript
type Type = typeof cs.type; // { a: string, b?: number }
```




Get the json schema:

```typescript
const jsonSchema = cs.getJsonSchema(); // { type: 'object', properties: [...] }
```

Validate your input data and type it :

```typescript
if (ajv.validate(jsonSchema, inputData)) {
  const data: Type = inputData;
}
```

## Supported primitive types

| Type    | Description                 |
| ------- | --------------------------- |
| Any     | Anything                    |
| Boolean |
| Const   | Constant of any type        |
| Integer | An integer type as `number` |
| Number  |
| String  |
| Unknown | Anything typed as `unknown` |
| Null    | Only `null`                 |

## Supported compound types

| Type         | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| AnyOf        | Any type within a selection of definitions                                 |
| Array        | An array of a type                                                         |
| Enum         | A string with enumerated values                                            |
| Object       | An object with typed properties                                            |
| MergeObjects | Merge two object definitions into one object containing all the properties |

## Helpers

| Type     | Description                                   | Example                                           |
| -------- | --------------------------------------------- | ------------------------------------------------- |
| Required | Changes the type of the schema to be required | CS.Required(CS.String(false)) === CS.String(true) |
| Optional | Changes the type of the schema to be optional | CS.Optional(CS.String(true)) === CS.String(false) |

## Using AnyOf with objects and `removeAdditional: true`

`AnyOf`, when ajv is configured with `removeAdditional: true`, doesn't behave the expected way. For example :

```ts
CS.AnyOf(
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
);
```

The above schema will unexpectedly fail to validate `{type: 'horse', legs: 4}` because, when evaluating the 'car' option, ajv will remove all the properties except `type` and `wheels`. Thus the 'horse' option will be evaluated with the `legs` property removed and fail to validate.

For the above schema to work as expected, use the discriminator option:

```ts
CS.AnyOf(
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
);
```

Ajv will also need to be initialized with the `discriminator: true` option.
