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

## Supported compound types

| Type         | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| AnyOf        | Any type within a selection of definitions                                 |
| Array        | An array of a type                                                         |
| Enum         | A string with enumerated values                                            |
| Object       | An object with typed properties                                            |
| MergeObjects | Merge two object definitions into one object containing all the properties |
