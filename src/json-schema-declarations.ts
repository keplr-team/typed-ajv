/** JSON Schema basic options.
 * All options must extend this interface.
 */
export interface Options<Default> {
  /** The Open API Specification description
   *  CommonMark syntax MAY be used for rich text representation.
   */
  description?: string;

  /**
   * Allow the value to be null.
   */
  readonly nullable?: boolean;

  /**
   * Default value for that property
   */
  default?: Default;

  /**
   * Provide examples for that property
   */
  examples?: unknown[];
}

export type AnyOfOptions<T> = Options<T>;

/** JSON Schema options for arrays */
export interface ArrayOptions extends Options<unknown[]> {
  /** Array must have a length superior to given number */
  minItems?: number;
  /** Array must have a length inferior to given number */
  maxItems?: number;
  /** Array must have only unique values */
  uniqueItems?: boolean;
}

export type BooleanOptions = Options<boolean>;

export type ConstOptions<T> = Options<T>;

export type EnumOptions<T extends readonly string[]> = Options<T[number]>;

/** JSON Schema options for numeric values */
export interface NumericOptions extends Options<number> {
  /** Numeric value must be superior or equal (≥) to the given number */
  minimum?: number;
  /** Numeric value must be strictly superior (>) to the given number */
  exclusiveMinimum?: number;
  /** Numeric value must be inferior or equal (≤) to the given number */
  maximum?: number;
  /** Numeric value must be strictly inferior (<) to the given number */
  exclusiveMaximum?: number;
  /** Numeric value must be a multiple of the given number */
  multipleOf?: number;
}

/**
 * JSON Schema options for objects
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface ObjectOptions extends Options<object> {
  readonly additionalProperties?: boolean;

  minProperties?: number;

  maxProperties?: number;
}

/** JSON Schema options for strings */
export interface StringOptions extends Options<string> {
  /** Minimum length for the string, must be a non-negative number */
  minLength?: number;
  /** Maximum length for the string, must be a non-negative number */
  maxLength?: number;
  /** String value must match the given pattern, must be a string not a RegEx object */
  pattern?: string;
  /** String value must be of given format */
  format?:
    | 'date'
    | 'time'
    | 'date-time'
    | 'uri'
    | 'uri-reference'
    | 'uri-template'
    | 'email'
    | 'hostname'
    | 'ipv4'
    | 'ipv6'
    | 'regex'
    | 'uuid'
    | 'json-pointer'
    | 'relative-json-pointer';
}
