import * as _ from 'lodash';
import {
    StringOptions,
    NumericOptions,
    ArrayOptions,
    Options,
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
interface CommonSchema<T> {
    type: T;
    isRequired: boolean;
    getJsonSchema: () => any;
}

/** The return type of the _* functions which are then transformed to CS.* functions with addRequiredArg */
interface CommonSchemaWithoutIsRequired<T> {
    type: T;
    getJsonSchema: () => any;
}

function _String(opts?: StringOptions) {
    return {
        getJsonSchema: () => ({
            type: 'string' as 'string',
            transform: ['trim'],
            ...opts,
        }),
        type: 'abcd' as string,
    };
}

function _Number(opts?: NumericOptions) {
    return {
        getJsonSchema: () => ({ type: 'number' as 'number', ...opts }),
        type: 1234 as number,
    };
}

function _Integer(opts?: NumericOptions) {
    return {
        getJsonSchema: () => ({ type: 'integer' as 'integer', ...opts }),
        type: 2 as number,
    };
}

function _Boolean() {
    return {
        getJsonSchema: () => ({ type: 'boolean' as 'boolean' }),
        type: true as boolean,
    };
}

function _Any() {
    return {
        getJsonSchema: () => ({}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: 'abcd' as any,
    };
}

function _Unknown() {
    return {
        getJsonSchema: () => ({}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: 'abcd' as unknown,
    };
}

/** The two following types return a subtype that represent the required/optional keys of
 * type T
 */
type GetRequiredKeys<T> = ({
    [P in keyof T]: T[P] extends { isRequired: true } ? P : never
})[keyof T];
type GetOptionalKeys<T> = ({
    [P in keyof T]: T[P] extends { isRequired: false } ? P : never
})[keyof T];
interface Props {
    [key: string]: CommonSchema<any>;
}

function _Object<P extends Props, R extends boolean>(props: P, required: R) {
    return {
        getJsonSchema: () => {
            const propsRequired = _.map(props, (v, k) =>
                v.isRequired ? k : '',
            ).filter(v => v !== '');

            const ret = {
                type: 'object',
                properties: _.mapValues(props, v =>
                    v.getJsonSchema(),
                ) as Record<string, any>,
                additionalProperties: false,
            };
            return propsRequired.length > 0
                ? { ...ret, required: propsRequired }
                : ret;
        },
        type: (undefined as unknown) as {
            [k in GetRequiredKeys<P>]: P[k]['type']
        } &
            { [k in GetOptionalKeys<P>]?: P[k]['type'] },
        isRequired: (required as unknown) as R extends true ? true : false,
    };
}

function _Array<P extends CommonSchema<any>, R extends boolean>(
    type: P,
    required: R,
    opts?: ArrayOptions,
) {
    return {
        getJsonSchema: () => {
            return {
                type: 'array',
                items: type.getJsonSchema(),
                ...opts,
            };
        },
        type: (undefined as unknown) as P['type'][],
        isRequired: (required as unknown) as R extends true ? true : false,
    };
}

// TODO: more precise type to allow only objects as args
function _MergeObjects<
    A extends CommonSchema<any>,
    B extends CommonSchema<any>,
    R extends boolean
>(obj1: A, obj2: B, required: R) {
    return {
        getJsonSchema: () => {
            const s1 = obj1.getJsonSchema();
            const s2 = obj2.getJsonSchema();
            return {
                type: 'object',
                properties: { ...s1.properties, ...s2.properties },
                required: [...(s1.required || []), ...(s2.required || [])],
                additionalProperties: false,
            };
        },
        type: (undefined as unknown) as A['type'] & B['type'],
        isRequired: (required as unknown) as R extends true ? true : false,
    };
}

/**
 * string literals in TypeScript are of type string (not literal) by default so
 * the arguments to Enum should be of the form ['abc' as 'abc',...] if you
 * want the narrowest type possible
 * @param els
 */
function _Enum<T extends ReadonlyArray<string>, R extends boolean>(
    els: T,
    required: R,
) {
    return {
        getJsonSchema: () => {
            return {
                type: 'string',
                enum: els,
            };
        },
        type: (undefined as unknown) as T[number],
        isRequired: (required as unknown) as R extends true ? true : false,
    };
}

/** Arbitrary sub-schema */
function _Schema<Type, R extends boolean>(jsonSchema: object, required: R) {
    return {
        getJsonSchema: () => jsonSchema,
        type: (undefined as unknown) as Type,
        isRequired: (required as unknown) as R extends true ? true : false,
    };
}

/** returns a CS function that takes the arguments of csFunc and a "required" argument as
 * the last argument.
 *
 * We have a version of this function for each number of arguments of the original function
 * because we can't use the spread operator if we want "required" as the last argument.
 */
function addRequiredArg<
    Ret extends CommonSchemaWithoutIsRequired<any>,
    CSOptions extends Options
>(csFunc: (opts?: CSOptions) => Ret) {
    function withRequired<T extends boolean>(required: T, opts?: CSOptions) {
        return {
            ...csFunc(opts),
            isRequired: (required as unknown) as T extends true ? true : false,
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

    // Compound types
    Object: _Object,
    Array: _Array,
    MergeObjects: _MergeObjects,
    Enum: _Enum,
    Schema: _Schema,
};
