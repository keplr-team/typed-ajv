/* eslint-disable no-underscore-dangle,@typescript-eslint/no-explicit-any */

import * as _ from 'lodash';

import {
  AnyOfOptions,
  ArrayOptions,
  BooleanOptions,
  ConstOptions,
  EnumOptions,
  NumericOptions,
  ObjectOptions,
  Options,
  StringOptions,
} from './json-schema-declarations';

/**
 * HOW IT WORKS
 *
 * A CS function returns an object with the following properties:
 * - getJsonSchema() => returns the part of the json schema corresponding to the CS
 *   function (ex.: something like {"type": "string"} for CS.String)
 * - T => a property of the typescript type corresponding to the CS function
 *   (ex. : string for CS.String). The value doesn't matter.
 *
 * The magic occurs mainly in the function CS.Object, which combines the json
 *  schemas and the typescript types of the properties given as arguments
 */
/*
 * TODO :
 *  - factorize the "required" logic for compound types
 *  - make the "required" arguments optional
 *  - add a "pick" function
 */

/** The return type of the CS.* functions */
interface CommonSchema<T, JC> {
  type: T;
  isRequired: boolean;
  getJsonSchema: () => JC;
}

/** The return type of the _* functions which are then transformed to CS.* functions with addRequiredArg */
interface CommonSchemaWithoutIsRequired<T, JC> {
  type: T;
  getJsonSchema: () => JC;
}

type Nullable<T, O extends [Options<any>] | []> = O extends [{ nullable: true }]
  ? T | null
  : T;

type NullableMerge<A, B> = A extends null
  ? (A & B) | null
  : B extends null
  ? (A & B) | null
  : A & B;

type HasDefault<T extends [Options<any>] | []> = T extends [
  { default: unknown },
]
  ? true
  : false;

function _String(...opts: [StringOptions] | []) {
  return {
    getJsonSchema: (): {
      type: 'string';
      transform: string[];
    } & Partial<StringOptions> => ({
      type: 'string' as const,
      transform: ['trim'],
      ...opts[0],
    }),
    type: 'abcd' as string,
  };
}

function _Number(...opts: [NumericOptions] | []) {
  return {
    getJsonSchema: (): { type: 'number' } & Partial<NumericOptions> => ({
      type: 'number' as const,
      ...opts[0],
    }),
    type: 1234 as number,
  };
}

function _Integer(...opts: [NumericOptions] | []) {
  return {
    getJsonSchema: (): { type: 'integer' } & Partial<NumericOptions> => ({
      type: 'integer' as const,
      ...opts[0],
    }),
    type: 2 as number,
  };
}

function _Boolean(...opts: [BooleanOptions] | []) {
  return {
    getJsonSchema: (): { type: 'boolean' } & Partial<BooleanOptions> => ({
      type: 'boolean' as const,
      ...opts[0],
    }),
    type: true as boolean,
  };
}

function _Any(...opts: [Options<any>] | []) {
  return {
    getJsonSchema: (): Partial<Options<unknown>> => ({ ...opts[0] }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    type: 'abcd' as any,
  };
}

function _Unknown(...opts: [Options<unknown>] | []) {
  return {
    getJsonSchema: (): Partial<Options<unknown>> => ({ ...opts[0] }),
    type: 'abcd' as unknown,
  };
}

function _Const<V, R extends boolean, O extends [ConstOptions<V>] | []>(
  value: V,
  required: R,
  ...opts: O
) {
  return {
    getJsonSchema(): { const: V } & Partial<ConstOptions<V>> {
      return { const: value, ...(opts.length && opts[0]) };
    },
    type: value as Nullable<typeof value, O>,
    isRequired: required as unknown as R extends true ? true : HasDefault<O>,
  };
}

function _Null(...opts: [Options<null>] | []) {
  return {
    getJsonSchema: (): { type: 'null' } & Partial<Options<null>> => ({
      type: 'null' as const,
      ...opts[0],
    }),
    type: null,
  };
}

/** The two following types return a subtype that represent the required/optional keys of
 * type T
 */
type GetRequiredKeys<T> = {
  [P in keyof T]: T[P] extends { isRequired: true } ? P : never;
}[keyof T];
type GetOptionalKeys<T> = {
  [P in keyof T]: T[P] extends { isRequired: false } ? P : never;
}[keyof T];
interface Props {
  [key: string]: CommonSchema<unknown, unknown>;
}
type AllowAdditionalProperties<T, O extends [ObjectOptions] | []> = O extends [
  { additionalProperties: true },
]
  ? T & { [k: string]: unknown }
  : T;

function _Object<
  P extends Props,
  R extends boolean,
  O extends [ObjectOptions] | [],
>(props: P, required: R, ...opts: O) {
  return {
    getJsonSchema: (): {
      type: 'object';
      required?: string[];
      properties: Record<keyof P, unknown>;
    } & Partial<ObjectOptions> => {
      const propsRequired = _.map(props, (v, k) =>
        v.isRequired ? k : '',
      ).filter(v => v !== '');

      const ret = {
        type: 'object' as const,
        properties: _.mapValues(props, v => v.getJsonSchema()),
        additionalProperties: false,
        ...(opts.length && opts[0]),
      };
      return propsRequired.length > 0
        ? { ...ret, required: propsRequired }
        : ret;
    },
    type: undefined as unknown as Nullable<
      AllowAdditionalProperties<
        { [k in GetRequiredKeys<P>]: P[k]['type'] } & {
          [k in GetOptionalKeys<P>]?: P[k]['type'];
        },
        O
      >,
      O
    >,
    isRequired: required as unknown as R extends true ? true : HasDefault<O>,
  };
}

function _Array<
  P extends CommonSchema<unknown, unknown>,
  R extends boolean,
  O extends [ArrayOptions] | [],
>(type: P, required: R, ...opts: O) {
  return {
    getJsonSchema: (): {
      type: 'array';
      items: unknown;
    } & Partial<ArrayOptions> => ({
      type: 'array' as const,
      items: type.getJsonSchema(),
      ...(opts.length && opts[0]),
    }),
    type: undefined as unknown as Nullable<P['type'][], O>,
    isRequired: required as unknown as R extends true ? true : HasDefault<O>,
  };
}

// TODO: more precise type to allow only objects as args
function _MergeObjects<
  JSA extends ReturnType<ReturnType<typeof _Object>['getJsonSchema']>,
  JSB extends ReturnType<ReturnType<typeof _Object>['getJsonSchema']>,
  A extends CommonSchema<unknown, JSA>,
  B extends CommonSchema<unknown, JSB>,
  R extends boolean,
>(obj1: A, obj2: B, required: R) {
  const s1 = obj1.getJsonSchema();
  const s2 = obj2.getJsonSchema();

  const intersection = _.intersection(
    Object.keys(s1.properties),
    Object.keys(s2.properties),
  );
  if (intersection.length) {
    throw new Error(
      `Merging of duplicate properties "${intersection.join(
        '", "',
      )}" is not allowed`,
    );
  }

  return {
    getJsonSchema: () => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const nullable = s1.nullable || s2.nullable;
      return {
        type: 'object' as const,
        properties: { ...s1.properties, ...s2.properties },
        required: [...(s1.required ?? []), ...(s2.required ?? [])],
        additionalProperties: false,
        ...(typeof nullable === 'boolean' ? { nullable } : undefined),
        ...(s1.default ?? s2.default
          ? { ...s1.default, ...s2.default }
          : undefined),
      };
    },
    type: undefined as unknown as NullableMerge<A['type'], B['type']>,
    isRequired: required as unknown as R,
  };
}

/**
 * string literals in TypeScript are of type string (not literal) by default so
 * the arguments to Enum should be of the form ['abc' as 'abc',...] if you
 * want the narrowest type possible
 * @param els
 */
function _Enum<
  T extends readonly string[],
  R extends boolean,
  O extends [EnumOptions<T>] | [],
>(els: T, required: R, ...opts: O) {
  return {
    getJsonSchema: (): { type: 'string'; enum: T } & Partial<
      EnumOptions<T>
    > => ({
      type: 'string' as const,
      enum: els,
      ...(opts.length && opts[0]),
    }),
    type: undefined as unknown as Nullable<T[number], O>,
    isRequired: required as unknown as R extends true ? true : HasDefault<O>,
  };
}

function _AnyOf<
  T extends CommonSchema<unknown, unknown>[],
  R extends boolean,
  O extends [AnyOfOptions<Nullable<T[number]['type'], O>>] | [],
>(schemas: T, required: R, ...opts: O) {
  return {
    getJsonSchema() {
      if (!opts[0]?.discriminator) {
        return {
          anyOf: schemas.map(s => s.getJsonSchema()),
          ...(opts.length && opts[0]),
        };
      }
      return {
        type: 'object',
        oneOf: schemas.map(s => s.getJsonSchema()), // oneOf and anyOf are the same when discriminator is used
        ...(opts.length && opts[0]),
        discriminator: { propertyName: opts[0].discriminator },
      };
    },
    type: undefined as unknown as Nullable<T[number]['type'], O>,
    isRequired: required as unknown as R extends true ? true : HasDefault<O>,
  };
}

function _Required<S extends CommonSchema<unknown, unknown>>(schema: S) {
  return {
    ...(schema as Omit<S, 'type' | 'isRequired'>),
    type: undefined as Exclude<S['type'], undefined>,
    isRequired: true as const,
  };
}

function _Optional<S extends CommonSchema<unknown, unknown>>(schema: S) {
  return {
    ...(schema as Omit<S, 'isRequired'>),
    isRequired: false as const,
  };
}

/** returns a CS function that takes the arguments of csFunc and a "required" argument as
 * the last argument.
 *
 * We have a version of this function for each number of arguments of the original function
 * because we can't use the spread operator if we want "required" as the last argument.
 */
function addRequiredArg<
  Ret extends CommonSchemaWithoutIsRequired<unknown, unknown>,
  CSOptions extends [Options<Ret['type']>] | [],
>(csFunc: (...opts: CSOptions) => Ret) {
  function withRequired<T extends boolean, O extends CSOptions>(
    required: T,
    ...opts: O
  ) {
    return {
      ...(csFunc(...opts) as Omit<Ret, 'type'>), // We need to omit 'type' to override it
      type: undefined as Nullable<Ret['type'], O>,
      isRequired: required as unknown as T extends true ? true : HasDefault<O>,
    };
  }
  return withRequired;
}

export const CS = {
  // Basic types
  String: addRequiredArg(_String),
  Number: addRequiredArg(_Number),
  Integer: addRequiredArg(_Integer),
  Boolean: addRequiredArg(_Boolean),
  /** Accept any value and type it as any */
  Any: addRequiredArg(_Any),
  /** Accept any value and type it as unknown */
  Unknown: addRequiredArg(_Unknown),

  /**
   * Accept a value matching a constant.
   * @param value Any value. Note: in TypeScript, this parameter must be of a literal type.
   * @param required Boolean indicating whether this property is required or not.
   * @example CS.Const('select' as const)
   */
  Const: _Const,

  /** Accept only null */
  Null: addRequiredArg(_Null),

  // Compound types
  Object: _Object,
  Array: _Array,
  MergeObjects: _MergeObjects,
  Enum: _Enum,

  /**
   * Accept any of the schemas from the 1st argument.
   * Note: required attribute of schemas is not used, only the one for AnyOf.
   */
  AnyOf: _AnyOf,

  /**
   * Helpers
   */
  Required: _Required,
  Optional: _Optional,
};
