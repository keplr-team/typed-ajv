import { expectError, expectType } from 'tsd';
import { CS } from '../index';

// Any

expectType<any>(CS.Any(true).type);

// Boolean

expectType<boolean>(CS.Boolean(true).type);
expectError<number>(CS.Boolean(true).type);

// Const

expectType<'foo'>(CS.Const('foo' as const, true).type);
expectError<'foo'>(CS.Const('foo', true).type);

// Enum

expectType<'A' | 'B' | 'C'>(CS.Enum(['A', 'B', 'C'] as const, true).type);
expectError<'A' | 'B'>(CS.Enum(['A', 'B', 'C'] as const, true).type);

// Integer

expectType<number>(CS.Integer(true).type);
expectError<string>(CS.Integer(true).type);

// Null

expectType<null>(CS.Null(true).type);
expectError<boolean>(CS.Null(true).type);

// Number

expectType<number>(CS.Number(true).type);
expectError<boolean>(CS.Number(true).type);

// String

expectType<string>(CS.String(true).type);
expectError<number>(CS.String(true).type);

// Unknown

expectType<unknown>(CS.Unknown(true).type);
expectError<'foo'>(CS.Unknown(true).type);

// Array

expectType<boolean[]>(CS.Array(CS.Boolean(true), true).type);
expectError<string[]>(CS.Array(CS.Boolean(true), true).type);

// Object

expectType<{ p1: number }>(CS.Object({ p1: CS.Number(true) }, true).type);
expectError<{ p1: boolean }>(CS.Object({ p1: CS.Number(true) }, true).type);
expectError<{ p2: number }>(CS.Object({ p1: CS.Number(true) }, true).type);
expectType<{ p1: number } & { p2?: boolean }>(
    CS.Object({ p1: CS.Number(true), p2: CS.Boolean(false) }, true).type,
);

// MergeObject

expectType<{ p1: number } & { p2?: boolean }>(
    CS.MergeObjects(
        CS.Object({ p1: CS.Number(true) }, true),
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
expectError<number | string>(
    CS.AnyOf([CS.Boolean(true), CS.Number(true)], true).type,
);
