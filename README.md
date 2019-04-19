# typed-ajv

Define TypeScript types and JSON Schema schemas from the same declaration.

## Getting started

Define your schema:

```js
const cs = CS.Object({
    a: CS.String(true)
    b: CS.Number(false)
});
```

Get the type:

```js
type Type = typeof cs.type; // { a: string, b?: number }
```

Get the json schema:

```js
const jsonSchema = cs.getJsonSchema(); // { type: 'object', properties: [...] }
```

Validate your input data and type it :

```js
if (ajv.validate(jsonSchema, inputData)) {
    const data: Type = inputData;
}
```

## Supported primitive types

| Type    | Description                 |
| ------- | --------------------------- |
| Boolean |
| Number  |
| Integer | An integer type as `number` |
| String  |
| Any     | Anything                    |
| Unknown | Anything typed as `unknown` |

## Supported compound types

| Type         | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| Enum         | A string with enumerated values                                            |
| Array        | An array of a type                                                         |
| Object       | An object with typed properties                                            |
| MergeObjects | Merge two object definitions into one object containing all the properties |
| Schema       | An arbitrary json schema and an arbitrary typescript test                  |
