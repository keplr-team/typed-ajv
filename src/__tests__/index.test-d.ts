import { expectError, expectType } from 'tsd';
import { CS } from '../index';

// Any

expectType<any>(CS.Any(true).type);
expectType<true>(CS.Any(true).isRequired);
expectType<false>(CS.Any(false).isRequired);

// Boolean

expectType<boolean>(CS.Boolean(true).type);
expectType<boolean>(CS.Boolean(false).type);
expectType<true>(CS.Boolean(true).isRequired);
expectType<false>(CS.Boolean(false).isRequired);
expectError<number>(CS.Boolean(true).type);

// Const

expectType<'foo'>(CS.Const('foo' as const, true).type);
expectType<true>(CS.Const('foo' as const, true).isRequired);
expectType<false>(CS.Const('foo' as const, false).isRequired);
expectError<'foo'>(CS.Const('foo', true).type);

// Enum

expectType<'A' | 'B' | 'C'>(CS.Enum(['A', 'B', 'C'] as const, true).type);
expectType<true>(CS.Enum(['A', 'B', 'C'] as const, true).isRequired);
expectType<false>(CS.Enum(['A', 'B', 'C'] as const, false).isRequired);
expectError<'A' | 'B'>(CS.Enum(['A', 'B', 'C'] as const, true).type);
expectType<{ foo: 'A' | 'B' | 'C' }>(
    CS.Object({ foo: CS.Enum(['A', 'B', 'C'] as const, true) }, true).type,
);
expectType<{ foo?: 'A' | 'B' | 'C' }>(
    CS.Object({ foo: CS.Enum(['A', 'B', 'C'] as const, false) }, true).type,
);
expectType<{ foo: 'A' | 'B' | 'C' }>(
    CS.Object(
        { foo: CS.Enum(['A', 'B', 'C'] as const, false, { default: 'B' }) },
        true,
    ).type,
);

// Integer

expectType<number>(CS.Integer(true).type);
expectError<string>(CS.Integer(true).type);

// Null

expectType<null>(CS.Null(true).type);
expectType<true>(CS.Null(true).isRequired);
expectType<false>(CS.Null(false).isRequired);
expectError<boolean>(CS.Null(true).type);

// Number

expectType<number>(CS.Number(true).type);
expectType<true>(CS.Number(true).isRequired);
expectType<false>(CS.Number(false).isRequired);
expectError<boolean>(CS.Number(true).type);

// String

expectType<string>(CS.String(true).type);
expectType<true>(CS.String(true).isRequired);
expectType<false>(CS.String(false).isRequired);
expectError<number>(CS.String(true).type);

// Unknown

expectType<unknown>(CS.Unknown(true).type);
expectType<true>(CS.Unknown(true).isRequired);
expectType<false>(CS.Unknown(false).isRequired);
expectError<'foo'>(CS.Unknown(true).type);

// Array

expectType<boolean[]>(CS.Array(CS.Boolean(true), true).type);
expectType<true>(CS.Array(CS.Boolean(true), true).isRequired);
expectType<false>(CS.Array(CS.Boolean(true), false).isRequired);
expectError<string[]>(CS.Array(CS.Boolean(true), true).type);

// Object

expectType<{ p1: number }>(CS.Object({ p1: CS.Number(true) }, true).type);
expectType<true>(CS.Object({ p1: CS.Number(true) }, true).isRequired);
expectType<false>(CS.Object({ p1: CS.Number(true) }, false).isRequired);
expectType<{ p1: number }>(
    CS.Object({ p1: CS.Number(false, { default: 0 }) }, true).type,
);
expectType<{ p1?: number }>(CS.Object({ p1: CS.Number(false) }, true).type);
expectError<{ p1: number }>(CS.Object({ p1: CS.Number(false) }, true).type);
expectError<{ p1: boolean }>(CS.Object({ p1: CS.Number(true) }, true).type);
expectError<{ p2: number }>(CS.Object({ p1: CS.Number(true) }, true).type);
expectType<{ p1: number; p2?: boolean }>(
    CS.Object({ p1: CS.Number(true), p2: CS.Boolean(false) }, true).type,
);
expectType<{ p1: number; p2: boolean }>(
    CS.Object(
        { p1: CS.Number(true), p2: CS.Boolean(false, { default: false }) },
        true,
    ).type,
);
expectType<{ a: string[] }>(
    CS.Object(
        {
            a: CS.Array(CS.String(true), true),
        },
        true,
    ).type,
);

// MergeObject

expectType<{ p1: number } & { p2?: boolean }>(
    CS.MergeObjects(
        CS.Object({ p1: CS.Number(true) }, true),
        CS.Object({ p2: CS.Boolean(false) }, true),
        true,
    ).type,
);
expectType<{ p1: number } & { p2?: boolean }>(
    CS.MergeObjects(
        CS.Object({ p1: CS.Number(false, { default: 0 }) }, true),
        CS.Object({ p2: CS.Boolean(false) }, true),
        true,
    ).type,
);
expectType<true>(
    CS.MergeObjects(
        CS.Object({ p1: CS.Number(true) }, true),
        CS.Object({ p2: CS.Boolean(false) }, true),
        true,
    ).isRequired,
);
expectType<true>(
    CS.MergeObjects(
        CS.Object({ p1: CS.Number(true) }, false),
        CS.Object({ p2: CS.Boolean(false) }, false),
        true,
    ).isRequired,
);
expectType<false>(
    CS.MergeObjects(
        CS.Object({ p1: CS.Number(true) }, false),
        CS.Object({ p2: CS.Boolean(false) }, false),
        false,
    ).isRequired,
);
expectError<{ p1: number } & { p2?: boolean }>(
    CS.MergeObjects(
        CS.Object({ p1: CS.Number(false) }, true),
        CS.Object({ p2: CS.Boolean(false) }, true),
        true,
    ).type,
);
expectError<{ p1?: number } & { p2: boolean }>(
    CS.MergeObjects(
        CS.Object({ p1: CS.Number(true) }, true),
        CS.Object({ p2: CS.Boolean(false) }, true),
        true,
    ).type,
);

// AnyOf

expectType<boolean | number>(
    CS.AnyOf([CS.Boolean(true), CS.Number(true)], true).type,
);
expectType<true>(
    CS.AnyOf([CS.Boolean(true), CS.Number(true)], true).isRequired,
);
expectType<false>(
    CS.AnyOf([CS.Boolean(true), CS.Number(true)], false).isRequired,
);
expectError<number | string>(
    CS.AnyOf([CS.Boolean(true), CS.Number(true)], true).type,
);
