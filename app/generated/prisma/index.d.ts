
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model WhatsAppAccount
 * 
 */
export type WhatsAppAccount = $Result.DefaultSelection<Prisma.$WhatsAppAccountPayload>
/**
 * Model WhatsAppPhoneNumber
 * 
 */
export type WhatsAppPhoneNumber = $Result.DefaultSelection<Prisma.$WhatsAppPhoneNumberPayload>
/**
 * Model WhatsAppAudience
 * 
 */
export type WhatsAppAudience = $Result.DefaultSelection<Prisma.$WhatsAppAudiencePayload>
/**
 * Model WhatsAppRecipient
 * 
 */
export type WhatsAppRecipient = $Result.DefaultSelection<Prisma.$WhatsAppRecipientPayload>
/**
 * Model WhatsAppCampaign
 * 
 */
export type WhatsAppCampaign = $Result.DefaultSelection<Prisma.$WhatsAppCampaignPayload>
/**
 * Model WhatsAppMessage
 * 
 */
export type WhatsAppMessage = $Result.DefaultSelection<Prisma.$WhatsAppMessagePayload>
/**
 * Model MetaAdAccount
 * 
 */
export type MetaAdAccount = $Result.DefaultSelection<Prisma.$MetaAdAccountPayload>
/**
 * Model WhatsAppAutomation
 * 
 */
export type WhatsAppAutomation = $Result.DefaultSelection<Prisma.$WhatsAppAutomationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ActivityStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export type ActivityStatus = (typeof ActivityStatus)[keyof typeof ActivityStatus]

}

export type ActivityStatus = $Enums.ActivityStatus

export const ActivityStatus: typeof $Enums.ActivityStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.whatsAppAccount`: Exposes CRUD operations for the **WhatsAppAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WhatsAppAccounts
    * const whatsAppAccounts = await prisma.whatsAppAccount.findMany()
    * ```
    */
  get whatsAppAccount(): Prisma.WhatsAppAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.whatsAppPhoneNumber`: Exposes CRUD operations for the **WhatsAppPhoneNumber** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WhatsAppPhoneNumbers
    * const whatsAppPhoneNumbers = await prisma.whatsAppPhoneNumber.findMany()
    * ```
    */
  get whatsAppPhoneNumber(): Prisma.WhatsAppPhoneNumberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.whatsAppAudience`: Exposes CRUD operations for the **WhatsAppAudience** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WhatsAppAudiences
    * const whatsAppAudiences = await prisma.whatsAppAudience.findMany()
    * ```
    */
  get whatsAppAudience(): Prisma.WhatsAppAudienceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.whatsAppRecipient`: Exposes CRUD operations for the **WhatsAppRecipient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WhatsAppRecipients
    * const whatsAppRecipients = await prisma.whatsAppRecipient.findMany()
    * ```
    */
  get whatsAppRecipient(): Prisma.WhatsAppRecipientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.whatsAppCampaign`: Exposes CRUD operations for the **WhatsAppCampaign** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WhatsAppCampaigns
    * const whatsAppCampaigns = await prisma.whatsAppCampaign.findMany()
    * ```
    */
  get whatsAppCampaign(): Prisma.WhatsAppCampaignDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.whatsAppMessage`: Exposes CRUD operations for the **WhatsAppMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WhatsAppMessages
    * const whatsAppMessages = await prisma.whatsAppMessage.findMany()
    * ```
    */
  get whatsAppMessage(): Prisma.WhatsAppMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.metaAdAccount`: Exposes CRUD operations for the **MetaAdAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MetaAdAccounts
    * const metaAdAccounts = await prisma.metaAdAccount.findMany()
    * ```
    */
  get metaAdAccount(): Prisma.MetaAdAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.whatsAppAutomation`: Exposes CRUD operations for the **WhatsAppAutomation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WhatsAppAutomations
    * const whatsAppAutomations = await prisma.whatsAppAutomation.findMany()
    * ```
    */
  get whatsAppAutomation(): Prisma.WhatsAppAutomationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    WhatsAppAccount: 'WhatsAppAccount',
    WhatsAppPhoneNumber: 'WhatsAppPhoneNumber',
    WhatsAppAudience: 'WhatsAppAudience',
    WhatsAppRecipient: 'WhatsAppRecipient',
    WhatsAppCampaign: 'WhatsAppCampaign',
    WhatsAppMessage: 'WhatsAppMessage',
    MetaAdAccount: 'MetaAdAccount',
    WhatsAppAutomation: 'WhatsAppAutomation'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "whatsAppAccount" | "whatsAppPhoneNumber" | "whatsAppAudience" | "whatsAppRecipient" | "whatsAppCampaign" | "whatsAppMessage" | "metaAdAccount" | "whatsAppAutomation"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      WhatsAppAccount: {
        payload: Prisma.$WhatsAppAccountPayload<ExtArgs>
        fields: Prisma.WhatsAppAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WhatsAppAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WhatsAppAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload>
          }
          findFirst: {
            args: Prisma.WhatsAppAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WhatsAppAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload>
          }
          findMany: {
            args: Prisma.WhatsAppAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload>[]
          }
          create: {
            args: Prisma.WhatsAppAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload>
          }
          createMany: {
            args: Prisma.WhatsAppAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WhatsAppAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload>[]
          }
          delete: {
            args: Prisma.WhatsAppAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload>
          }
          update: {
            args: Prisma.WhatsAppAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload>
          }
          deleteMany: {
            args: Prisma.WhatsAppAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WhatsAppAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WhatsAppAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload>[]
          }
          upsert: {
            args: Prisma.WhatsAppAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAccountPayload>
          }
          aggregate: {
            args: Prisma.WhatsAppAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWhatsAppAccount>
          }
          groupBy: {
            args: Prisma.WhatsAppAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.WhatsAppAccountCountArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppAccountCountAggregateOutputType> | number
          }
        }
      }
      WhatsAppPhoneNumber: {
        payload: Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>
        fields: Prisma.WhatsAppPhoneNumberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WhatsAppPhoneNumberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WhatsAppPhoneNumberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload>
          }
          findFirst: {
            args: Prisma.WhatsAppPhoneNumberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WhatsAppPhoneNumberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload>
          }
          findMany: {
            args: Prisma.WhatsAppPhoneNumberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload>[]
          }
          create: {
            args: Prisma.WhatsAppPhoneNumberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload>
          }
          createMany: {
            args: Prisma.WhatsAppPhoneNumberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WhatsAppPhoneNumberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload>[]
          }
          delete: {
            args: Prisma.WhatsAppPhoneNumberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload>
          }
          update: {
            args: Prisma.WhatsAppPhoneNumberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload>
          }
          deleteMany: {
            args: Prisma.WhatsAppPhoneNumberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WhatsAppPhoneNumberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WhatsAppPhoneNumberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload>[]
          }
          upsert: {
            args: Prisma.WhatsAppPhoneNumberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppPhoneNumberPayload>
          }
          aggregate: {
            args: Prisma.WhatsAppPhoneNumberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWhatsAppPhoneNumber>
          }
          groupBy: {
            args: Prisma.WhatsAppPhoneNumberGroupByArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppPhoneNumberGroupByOutputType>[]
          }
          count: {
            args: Prisma.WhatsAppPhoneNumberCountArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppPhoneNumberCountAggregateOutputType> | number
          }
        }
      }
      WhatsAppAudience: {
        payload: Prisma.$WhatsAppAudiencePayload<ExtArgs>
        fields: Prisma.WhatsAppAudienceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WhatsAppAudienceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WhatsAppAudienceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload>
          }
          findFirst: {
            args: Prisma.WhatsAppAudienceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WhatsAppAudienceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload>
          }
          findMany: {
            args: Prisma.WhatsAppAudienceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload>[]
          }
          create: {
            args: Prisma.WhatsAppAudienceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload>
          }
          createMany: {
            args: Prisma.WhatsAppAudienceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WhatsAppAudienceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload>[]
          }
          delete: {
            args: Prisma.WhatsAppAudienceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload>
          }
          update: {
            args: Prisma.WhatsAppAudienceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload>
          }
          deleteMany: {
            args: Prisma.WhatsAppAudienceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WhatsAppAudienceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WhatsAppAudienceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload>[]
          }
          upsert: {
            args: Prisma.WhatsAppAudienceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAudiencePayload>
          }
          aggregate: {
            args: Prisma.WhatsAppAudienceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWhatsAppAudience>
          }
          groupBy: {
            args: Prisma.WhatsAppAudienceGroupByArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppAudienceGroupByOutputType>[]
          }
          count: {
            args: Prisma.WhatsAppAudienceCountArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppAudienceCountAggregateOutputType> | number
          }
        }
      }
      WhatsAppRecipient: {
        payload: Prisma.$WhatsAppRecipientPayload<ExtArgs>
        fields: Prisma.WhatsAppRecipientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WhatsAppRecipientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WhatsAppRecipientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload>
          }
          findFirst: {
            args: Prisma.WhatsAppRecipientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WhatsAppRecipientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload>
          }
          findMany: {
            args: Prisma.WhatsAppRecipientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload>[]
          }
          create: {
            args: Prisma.WhatsAppRecipientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload>
          }
          createMany: {
            args: Prisma.WhatsAppRecipientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WhatsAppRecipientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload>[]
          }
          delete: {
            args: Prisma.WhatsAppRecipientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload>
          }
          update: {
            args: Prisma.WhatsAppRecipientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload>
          }
          deleteMany: {
            args: Prisma.WhatsAppRecipientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WhatsAppRecipientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WhatsAppRecipientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload>[]
          }
          upsert: {
            args: Prisma.WhatsAppRecipientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppRecipientPayload>
          }
          aggregate: {
            args: Prisma.WhatsAppRecipientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWhatsAppRecipient>
          }
          groupBy: {
            args: Prisma.WhatsAppRecipientGroupByArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppRecipientGroupByOutputType>[]
          }
          count: {
            args: Prisma.WhatsAppRecipientCountArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppRecipientCountAggregateOutputType> | number
          }
        }
      }
      WhatsAppCampaign: {
        payload: Prisma.$WhatsAppCampaignPayload<ExtArgs>
        fields: Prisma.WhatsAppCampaignFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WhatsAppCampaignFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WhatsAppCampaignFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload>
          }
          findFirst: {
            args: Prisma.WhatsAppCampaignFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WhatsAppCampaignFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload>
          }
          findMany: {
            args: Prisma.WhatsAppCampaignFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload>[]
          }
          create: {
            args: Prisma.WhatsAppCampaignCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload>
          }
          createMany: {
            args: Prisma.WhatsAppCampaignCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WhatsAppCampaignCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload>[]
          }
          delete: {
            args: Prisma.WhatsAppCampaignDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload>
          }
          update: {
            args: Prisma.WhatsAppCampaignUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload>
          }
          deleteMany: {
            args: Prisma.WhatsAppCampaignDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WhatsAppCampaignUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WhatsAppCampaignUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload>[]
          }
          upsert: {
            args: Prisma.WhatsAppCampaignUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppCampaignPayload>
          }
          aggregate: {
            args: Prisma.WhatsAppCampaignAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWhatsAppCampaign>
          }
          groupBy: {
            args: Prisma.WhatsAppCampaignGroupByArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppCampaignGroupByOutputType>[]
          }
          count: {
            args: Prisma.WhatsAppCampaignCountArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppCampaignCountAggregateOutputType> | number
          }
        }
      }
      WhatsAppMessage: {
        payload: Prisma.$WhatsAppMessagePayload<ExtArgs>
        fields: Prisma.WhatsAppMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WhatsAppMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WhatsAppMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload>
          }
          findFirst: {
            args: Prisma.WhatsAppMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WhatsAppMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload>
          }
          findMany: {
            args: Prisma.WhatsAppMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload>[]
          }
          create: {
            args: Prisma.WhatsAppMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload>
          }
          createMany: {
            args: Prisma.WhatsAppMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WhatsAppMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload>[]
          }
          delete: {
            args: Prisma.WhatsAppMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload>
          }
          update: {
            args: Prisma.WhatsAppMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload>
          }
          deleteMany: {
            args: Prisma.WhatsAppMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WhatsAppMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WhatsAppMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload>[]
          }
          upsert: {
            args: Prisma.WhatsAppMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppMessagePayload>
          }
          aggregate: {
            args: Prisma.WhatsAppMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWhatsAppMessage>
          }
          groupBy: {
            args: Prisma.WhatsAppMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.WhatsAppMessageCountArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppMessageCountAggregateOutputType> | number
          }
        }
      }
      MetaAdAccount: {
        payload: Prisma.$MetaAdAccountPayload<ExtArgs>
        fields: Prisma.MetaAdAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MetaAdAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MetaAdAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload>
          }
          findFirst: {
            args: Prisma.MetaAdAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MetaAdAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload>
          }
          findMany: {
            args: Prisma.MetaAdAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload>[]
          }
          create: {
            args: Prisma.MetaAdAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload>
          }
          createMany: {
            args: Prisma.MetaAdAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MetaAdAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload>[]
          }
          delete: {
            args: Prisma.MetaAdAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload>
          }
          update: {
            args: Prisma.MetaAdAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload>
          }
          deleteMany: {
            args: Prisma.MetaAdAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MetaAdAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MetaAdAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload>[]
          }
          upsert: {
            args: Prisma.MetaAdAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MetaAdAccountPayload>
          }
          aggregate: {
            args: Prisma.MetaAdAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMetaAdAccount>
          }
          groupBy: {
            args: Prisma.MetaAdAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<MetaAdAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.MetaAdAccountCountArgs<ExtArgs>
            result: $Utils.Optional<MetaAdAccountCountAggregateOutputType> | number
          }
        }
      }
      WhatsAppAutomation: {
        payload: Prisma.$WhatsAppAutomationPayload<ExtArgs>
        fields: Prisma.WhatsAppAutomationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WhatsAppAutomationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WhatsAppAutomationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload>
          }
          findFirst: {
            args: Prisma.WhatsAppAutomationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WhatsAppAutomationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload>
          }
          findMany: {
            args: Prisma.WhatsAppAutomationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload>[]
          }
          create: {
            args: Prisma.WhatsAppAutomationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload>
          }
          createMany: {
            args: Prisma.WhatsAppAutomationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WhatsAppAutomationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload>[]
          }
          delete: {
            args: Prisma.WhatsAppAutomationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload>
          }
          update: {
            args: Prisma.WhatsAppAutomationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload>
          }
          deleteMany: {
            args: Prisma.WhatsAppAutomationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WhatsAppAutomationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WhatsAppAutomationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload>[]
          }
          upsert: {
            args: Prisma.WhatsAppAutomationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WhatsAppAutomationPayload>
          }
          aggregate: {
            args: Prisma.WhatsAppAutomationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWhatsAppAutomation>
          }
          groupBy: {
            args: Prisma.WhatsAppAutomationGroupByArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppAutomationGroupByOutputType>[]
          }
          count: {
            args: Prisma.WhatsAppAutomationCountArgs<ExtArgs>
            result: $Utils.Optional<WhatsAppAutomationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    whatsAppAccount?: WhatsAppAccountOmit
    whatsAppPhoneNumber?: WhatsAppPhoneNumberOmit
    whatsAppAudience?: WhatsAppAudienceOmit
    whatsAppRecipient?: WhatsAppRecipientOmit
    whatsAppCampaign?: WhatsAppCampaignOmit
    whatsAppMessage?: WhatsAppMessageOmit
    metaAdAccount?: MetaAdAccountOmit
    whatsAppAutomation?: WhatsAppAutomationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    WhatsAppAccount: number
    MetaAdAccount: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    WhatsAppAccount?: boolean | UserCountOutputTypeCountWhatsAppAccountArgs
    MetaAdAccount?: boolean | UserCountOutputTypeCountMetaAdAccountArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWhatsAppAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppAccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMetaAdAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetaAdAccountWhereInput
  }


  /**
   * Count Type WhatsAppAccountCountOutputType
   */

  export type WhatsAppAccountCountOutputType = {
    audiences: number
    campaigns: number
    phoneNumbers: number
  }

  export type WhatsAppAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    audiences?: boolean | WhatsAppAccountCountOutputTypeCountAudiencesArgs
    campaigns?: boolean | WhatsAppAccountCountOutputTypeCountCampaignsArgs
    phoneNumbers?: boolean | WhatsAppAccountCountOutputTypeCountPhoneNumbersArgs
  }

  // Custom InputTypes
  /**
   * WhatsAppAccountCountOutputType without action
   */
  export type WhatsAppAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccountCountOutputType
     */
    select?: WhatsAppAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WhatsAppAccountCountOutputType without action
   */
  export type WhatsAppAccountCountOutputTypeCountAudiencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppAudienceWhereInput
  }

  /**
   * WhatsAppAccountCountOutputType without action
   */
  export type WhatsAppAccountCountOutputTypeCountCampaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppCampaignWhereInput
  }

  /**
   * WhatsAppAccountCountOutputType without action
   */
  export type WhatsAppAccountCountOutputTypeCountPhoneNumbersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppPhoneNumberWhereInput
  }


  /**
   * Count Type WhatsAppPhoneNumberCountOutputType
   */

  export type WhatsAppPhoneNumberCountOutputType = {
    recipients: number
    messages: number
    automations: number
  }

  export type WhatsAppPhoneNumberCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recipients?: boolean | WhatsAppPhoneNumberCountOutputTypeCountRecipientsArgs
    messages?: boolean | WhatsAppPhoneNumberCountOutputTypeCountMessagesArgs
    automations?: boolean | WhatsAppPhoneNumberCountOutputTypeCountAutomationsArgs
  }

  // Custom InputTypes
  /**
   * WhatsAppPhoneNumberCountOutputType without action
   */
  export type WhatsAppPhoneNumberCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumberCountOutputType
     */
    select?: WhatsAppPhoneNumberCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WhatsAppPhoneNumberCountOutputType without action
   */
  export type WhatsAppPhoneNumberCountOutputTypeCountRecipientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppRecipientWhereInput
  }

  /**
   * WhatsAppPhoneNumberCountOutputType without action
   */
  export type WhatsAppPhoneNumberCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppMessageWhereInput
  }

  /**
   * WhatsAppPhoneNumberCountOutputType without action
   */
  export type WhatsAppPhoneNumberCountOutputTypeCountAutomationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppAutomationWhereInput
  }


  /**
   * Count Type WhatsAppAudienceCountOutputType
   */

  export type WhatsAppAudienceCountOutputType = {
    recipients: number
    campaigns: number
  }

  export type WhatsAppAudienceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    recipients?: boolean | WhatsAppAudienceCountOutputTypeCountRecipientsArgs
    campaigns?: boolean | WhatsAppAudienceCountOutputTypeCountCampaignsArgs
  }

  // Custom InputTypes
  /**
   * WhatsAppAudienceCountOutputType without action
   */
  export type WhatsAppAudienceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudienceCountOutputType
     */
    select?: WhatsAppAudienceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WhatsAppAudienceCountOutputType without action
   */
  export type WhatsAppAudienceCountOutputTypeCountRecipientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppRecipientWhereInput
  }

  /**
   * WhatsAppAudienceCountOutputType without action
   */
  export type WhatsAppAudienceCountOutputTypeCountCampaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppCampaignWhereInput
  }


  /**
   * Count Type WhatsAppRecipientCountOutputType
   */

  export type WhatsAppRecipientCountOutputType = {
    messages: number
  }

  export type WhatsAppRecipientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | WhatsAppRecipientCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * WhatsAppRecipientCountOutputType without action
   */
  export type WhatsAppRecipientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipientCountOutputType
     */
    select?: WhatsAppRecipientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WhatsAppRecipientCountOutputType without action
   */
  export type WhatsAppRecipientCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    phone: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    phone: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    WhatsAppAccount?: boolean | User$WhatsAppAccountArgs<ExtArgs>
    MetaAdAccount?: boolean | User$MetaAdAccountArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "phone" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    WhatsAppAccount?: boolean | User$WhatsAppAccountArgs<ExtArgs>
    MetaAdAccount?: boolean | User$MetaAdAccountArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      WhatsAppAccount: Prisma.$WhatsAppAccountPayload<ExtArgs>[]
      MetaAdAccount: Prisma.$MetaAdAccountPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      phone: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    WhatsAppAccount<T extends User$WhatsAppAccountArgs<ExtArgs> = {}>(args?: Subset<T, User$WhatsAppAccountArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    MetaAdAccount<T extends User$MetaAdAccountArgs<ExtArgs> = {}>(args?: Subset<T, User$MetaAdAccountArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.WhatsAppAccount
   */
  export type User$WhatsAppAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    where?: WhatsAppAccountWhereInput
    orderBy?: WhatsAppAccountOrderByWithRelationInput | WhatsAppAccountOrderByWithRelationInput[]
    cursor?: WhatsAppAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppAccountScalarFieldEnum | WhatsAppAccountScalarFieldEnum[]
  }

  /**
   * User.MetaAdAccount
   */
  export type User$MetaAdAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    where?: MetaAdAccountWhereInput
    orderBy?: MetaAdAccountOrderByWithRelationInput | MetaAdAccountOrderByWithRelationInput[]
    cursor?: MetaAdAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MetaAdAccountScalarFieldEnum | MetaAdAccountScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model WhatsAppAccount
   */

  export type AggregateWhatsAppAccount = {
    _count: WhatsAppAccountCountAggregateOutputType | null
    _min: WhatsAppAccountMinAggregateOutputType | null
    _max: WhatsAppAccountMaxAggregateOutputType | null
  }

  export type WhatsAppAccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    wabaid: string | null
    accessToken: string | null
    displayName: string | null
    verified: boolean | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppAccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    wabaid: string | null
    accessToken: string | null
    displayName: string | null
    verified: boolean | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppAccountCountAggregateOutputType = {
    id: number
    userId: number
    wabaid: number
    accessToken: number
    phoneNumberIds: number
    displayName: number
    verified: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WhatsAppAccountMinAggregateInputType = {
    id?: true
    userId?: true
    wabaid?: true
    accessToken?: true
    displayName?: true
    verified?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppAccountMaxAggregateInputType = {
    id?: true
    userId?: true
    wabaid?: true
    accessToken?: true
    displayName?: true
    verified?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppAccountCountAggregateInputType = {
    id?: true
    userId?: true
    wabaid?: true
    accessToken?: true
    phoneNumberIds?: true
    displayName?: true
    verified?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WhatsAppAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppAccount to aggregate.
     */
    where?: WhatsAppAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAccounts to fetch.
     */
    orderBy?: WhatsAppAccountOrderByWithRelationInput | WhatsAppAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WhatsAppAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WhatsAppAccounts
    **/
    _count?: true | WhatsAppAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WhatsAppAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WhatsAppAccountMaxAggregateInputType
  }

  export type GetWhatsAppAccountAggregateType<T extends WhatsAppAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateWhatsAppAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWhatsAppAccount[P]>
      : GetScalarType<T[P], AggregateWhatsAppAccount[P]>
  }




  export type WhatsAppAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppAccountWhereInput
    orderBy?: WhatsAppAccountOrderByWithAggregationInput | WhatsAppAccountOrderByWithAggregationInput[]
    by: WhatsAppAccountScalarFieldEnum[] | WhatsAppAccountScalarFieldEnum
    having?: WhatsAppAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WhatsAppAccountCountAggregateInputType | true
    _min?: WhatsAppAccountMinAggregateInputType
    _max?: WhatsAppAccountMaxAggregateInputType
  }

  export type WhatsAppAccountGroupByOutputType = {
    id: string
    userId: string
    wabaid: string
    accessToken: string
    phoneNumberIds: string[]
    displayName: string
    verified: boolean
    status: string
    createdAt: Date
    updatedAt: Date
    _count: WhatsAppAccountCountAggregateOutputType | null
    _min: WhatsAppAccountMinAggregateOutputType | null
    _max: WhatsAppAccountMaxAggregateOutputType | null
  }

  type GetWhatsAppAccountGroupByPayload<T extends WhatsAppAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WhatsAppAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WhatsAppAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WhatsAppAccountGroupByOutputType[P]>
            : GetScalarType<T[P], WhatsAppAccountGroupByOutputType[P]>
        }
      >
    >


  export type WhatsAppAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    wabaid?: boolean
    accessToken?: boolean
    phoneNumberIds?: boolean
    displayName?: boolean
    verified?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    audiences?: boolean | WhatsAppAccount$audiencesArgs<ExtArgs>
    campaigns?: boolean | WhatsAppAccount$campaignsArgs<ExtArgs>
    phoneNumbers?: boolean | WhatsAppAccount$phoneNumbersArgs<ExtArgs>
    _count?: boolean | WhatsAppAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppAccount"]>

  export type WhatsAppAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    wabaid?: boolean
    accessToken?: boolean
    phoneNumberIds?: boolean
    displayName?: boolean
    verified?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppAccount"]>

  export type WhatsAppAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    wabaid?: boolean
    accessToken?: boolean
    phoneNumberIds?: boolean
    displayName?: boolean
    verified?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppAccount"]>

  export type WhatsAppAccountSelectScalar = {
    id?: boolean
    userId?: boolean
    wabaid?: boolean
    accessToken?: boolean
    phoneNumberIds?: boolean
    displayName?: boolean
    verified?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WhatsAppAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "wabaid" | "accessToken" | "phoneNumberIds" | "displayName" | "verified" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["whatsAppAccount"]>
  export type WhatsAppAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    audiences?: boolean | WhatsAppAccount$audiencesArgs<ExtArgs>
    campaigns?: boolean | WhatsAppAccount$campaignsArgs<ExtArgs>
    phoneNumbers?: boolean | WhatsAppAccount$phoneNumbersArgs<ExtArgs>
    _count?: boolean | WhatsAppAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WhatsAppAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WhatsAppAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WhatsAppAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WhatsAppAccount"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      audiences: Prisma.$WhatsAppAudiencePayload<ExtArgs>[]
      campaigns: Prisma.$WhatsAppCampaignPayload<ExtArgs>[]
      phoneNumbers: Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      wabaid: string
      accessToken: string
      phoneNumberIds: string[]
      displayName: string
      verified: boolean
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["whatsAppAccount"]>
    composites: {}
  }

  type WhatsAppAccountGetPayload<S extends boolean | null | undefined | WhatsAppAccountDefaultArgs> = $Result.GetResult<Prisma.$WhatsAppAccountPayload, S>

  type WhatsAppAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WhatsAppAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WhatsAppAccountCountAggregateInputType | true
    }

  export interface WhatsAppAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WhatsAppAccount'], meta: { name: 'WhatsAppAccount' } }
    /**
     * Find zero or one WhatsAppAccount that matches the filter.
     * @param {WhatsAppAccountFindUniqueArgs} args - Arguments to find a WhatsAppAccount
     * @example
     * // Get one WhatsAppAccount
     * const whatsAppAccount = await prisma.whatsAppAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WhatsAppAccountFindUniqueArgs>(args: SelectSubset<T, WhatsAppAccountFindUniqueArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WhatsAppAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WhatsAppAccountFindUniqueOrThrowArgs} args - Arguments to find a WhatsAppAccount
     * @example
     * // Get one WhatsAppAccount
     * const whatsAppAccount = await prisma.whatsAppAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WhatsAppAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, WhatsAppAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAccountFindFirstArgs} args - Arguments to find a WhatsAppAccount
     * @example
     * // Get one WhatsAppAccount
     * const whatsAppAccount = await prisma.whatsAppAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WhatsAppAccountFindFirstArgs>(args?: SelectSubset<T, WhatsAppAccountFindFirstArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAccountFindFirstOrThrowArgs} args - Arguments to find a WhatsAppAccount
     * @example
     * // Get one WhatsAppAccount
     * const whatsAppAccount = await prisma.whatsAppAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WhatsAppAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, WhatsAppAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WhatsAppAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WhatsAppAccounts
     * const whatsAppAccounts = await prisma.whatsAppAccount.findMany()
     * 
     * // Get first 10 WhatsAppAccounts
     * const whatsAppAccounts = await prisma.whatsAppAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const whatsAppAccountWithIdOnly = await prisma.whatsAppAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WhatsAppAccountFindManyArgs>(args?: SelectSubset<T, WhatsAppAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WhatsAppAccount.
     * @param {WhatsAppAccountCreateArgs} args - Arguments to create a WhatsAppAccount.
     * @example
     * // Create one WhatsAppAccount
     * const WhatsAppAccount = await prisma.whatsAppAccount.create({
     *   data: {
     *     // ... data to create a WhatsAppAccount
     *   }
     * })
     * 
     */
    create<T extends WhatsAppAccountCreateArgs>(args: SelectSubset<T, WhatsAppAccountCreateArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WhatsAppAccounts.
     * @param {WhatsAppAccountCreateManyArgs} args - Arguments to create many WhatsAppAccounts.
     * @example
     * // Create many WhatsAppAccounts
     * const whatsAppAccount = await prisma.whatsAppAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WhatsAppAccountCreateManyArgs>(args?: SelectSubset<T, WhatsAppAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WhatsAppAccounts and returns the data saved in the database.
     * @param {WhatsAppAccountCreateManyAndReturnArgs} args - Arguments to create many WhatsAppAccounts.
     * @example
     * // Create many WhatsAppAccounts
     * const whatsAppAccount = await prisma.whatsAppAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WhatsAppAccounts and only return the `id`
     * const whatsAppAccountWithIdOnly = await prisma.whatsAppAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WhatsAppAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, WhatsAppAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WhatsAppAccount.
     * @param {WhatsAppAccountDeleteArgs} args - Arguments to delete one WhatsAppAccount.
     * @example
     * // Delete one WhatsAppAccount
     * const WhatsAppAccount = await prisma.whatsAppAccount.delete({
     *   where: {
     *     // ... filter to delete one WhatsAppAccount
     *   }
     * })
     * 
     */
    delete<T extends WhatsAppAccountDeleteArgs>(args: SelectSubset<T, WhatsAppAccountDeleteArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WhatsAppAccount.
     * @param {WhatsAppAccountUpdateArgs} args - Arguments to update one WhatsAppAccount.
     * @example
     * // Update one WhatsAppAccount
     * const whatsAppAccount = await prisma.whatsAppAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WhatsAppAccountUpdateArgs>(args: SelectSubset<T, WhatsAppAccountUpdateArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WhatsAppAccounts.
     * @param {WhatsAppAccountDeleteManyArgs} args - Arguments to filter WhatsAppAccounts to delete.
     * @example
     * // Delete a few WhatsAppAccounts
     * const { count } = await prisma.whatsAppAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WhatsAppAccountDeleteManyArgs>(args?: SelectSubset<T, WhatsAppAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WhatsAppAccounts
     * const whatsAppAccount = await prisma.whatsAppAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WhatsAppAccountUpdateManyArgs>(args: SelectSubset<T, WhatsAppAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppAccounts and returns the data updated in the database.
     * @param {WhatsAppAccountUpdateManyAndReturnArgs} args - Arguments to update many WhatsAppAccounts.
     * @example
     * // Update many WhatsAppAccounts
     * const whatsAppAccount = await prisma.whatsAppAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WhatsAppAccounts and only return the `id`
     * const whatsAppAccountWithIdOnly = await prisma.whatsAppAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WhatsAppAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, WhatsAppAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WhatsAppAccount.
     * @param {WhatsAppAccountUpsertArgs} args - Arguments to update or create a WhatsAppAccount.
     * @example
     * // Update or create a WhatsAppAccount
     * const whatsAppAccount = await prisma.whatsAppAccount.upsert({
     *   create: {
     *     // ... data to create a WhatsAppAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WhatsAppAccount we want to update
     *   }
     * })
     */
    upsert<T extends WhatsAppAccountUpsertArgs>(args: SelectSubset<T, WhatsAppAccountUpsertArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WhatsAppAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAccountCountArgs} args - Arguments to filter WhatsAppAccounts to count.
     * @example
     * // Count the number of WhatsAppAccounts
     * const count = await prisma.whatsAppAccount.count({
     *   where: {
     *     // ... the filter for the WhatsAppAccounts we want to count
     *   }
     * })
    **/
    count<T extends WhatsAppAccountCountArgs>(
      args?: Subset<T, WhatsAppAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WhatsAppAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WhatsAppAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WhatsAppAccountAggregateArgs>(args: Subset<T, WhatsAppAccountAggregateArgs>): Prisma.PrismaPromise<GetWhatsAppAccountAggregateType<T>>

    /**
     * Group by WhatsAppAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WhatsAppAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WhatsAppAccountGroupByArgs['orderBy'] }
        : { orderBy?: WhatsAppAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WhatsAppAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWhatsAppAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WhatsAppAccount model
   */
  readonly fields: WhatsAppAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WhatsAppAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WhatsAppAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    audiences<T extends WhatsAppAccount$audiencesArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppAccount$audiencesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    campaigns<T extends WhatsAppAccount$campaignsArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppAccount$campaignsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    phoneNumbers<T extends WhatsAppAccount$phoneNumbersArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppAccount$phoneNumbersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WhatsAppAccount model
   */
  interface WhatsAppAccountFieldRefs {
    readonly id: FieldRef<"WhatsAppAccount", 'String'>
    readonly userId: FieldRef<"WhatsAppAccount", 'String'>
    readonly wabaid: FieldRef<"WhatsAppAccount", 'String'>
    readonly accessToken: FieldRef<"WhatsAppAccount", 'String'>
    readonly phoneNumberIds: FieldRef<"WhatsAppAccount", 'String[]'>
    readonly displayName: FieldRef<"WhatsAppAccount", 'String'>
    readonly verified: FieldRef<"WhatsAppAccount", 'Boolean'>
    readonly status: FieldRef<"WhatsAppAccount", 'String'>
    readonly createdAt: FieldRef<"WhatsAppAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"WhatsAppAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WhatsAppAccount findUnique
   */
  export type WhatsAppAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAccount to fetch.
     */
    where: WhatsAppAccountWhereUniqueInput
  }

  /**
   * WhatsAppAccount findUniqueOrThrow
   */
  export type WhatsAppAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAccount to fetch.
     */
    where: WhatsAppAccountWhereUniqueInput
  }

  /**
   * WhatsAppAccount findFirst
   */
  export type WhatsAppAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAccount to fetch.
     */
    where?: WhatsAppAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAccounts to fetch.
     */
    orderBy?: WhatsAppAccountOrderByWithRelationInput | WhatsAppAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppAccounts.
     */
    cursor?: WhatsAppAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppAccounts.
     */
    distinct?: WhatsAppAccountScalarFieldEnum | WhatsAppAccountScalarFieldEnum[]
  }

  /**
   * WhatsAppAccount findFirstOrThrow
   */
  export type WhatsAppAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAccount to fetch.
     */
    where?: WhatsAppAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAccounts to fetch.
     */
    orderBy?: WhatsAppAccountOrderByWithRelationInput | WhatsAppAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppAccounts.
     */
    cursor?: WhatsAppAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppAccounts.
     */
    distinct?: WhatsAppAccountScalarFieldEnum | WhatsAppAccountScalarFieldEnum[]
  }

  /**
   * WhatsAppAccount findMany
   */
  export type WhatsAppAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAccounts to fetch.
     */
    where?: WhatsAppAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAccounts to fetch.
     */
    orderBy?: WhatsAppAccountOrderByWithRelationInput | WhatsAppAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WhatsAppAccounts.
     */
    cursor?: WhatsAppAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAccounts.
     */
    skip?: number
    distinct?: WhatsAppAccountScalarFieldEnum | WhatsAppAccountScalarFieldEnum[]
  }

  /**
   * WhatsAppAccount create
   */
  export type WhatsAppAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a WhatsAppAccount.
     */
    data: XOR<WhatsAppAccountCreateInput, WhatsAppAccountUncheckedCreateInput>
  }

  /**
   * WhatsAppAccount createMany
   */
  export type WhatsAppAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WhatsAppAccounts.
     */
    data: WhatsAppAccountCreateManyInput | WhatsAppAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WhatsAppAccount createManyAndReturn
   */
  export type WhatsAppAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * The data used to create many WhatsAppAccounts.
     */
    data: WhatsAppAccountCreateManyInput | WhatsAppAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppAccount update
   */
  export type WhatsAppAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a WhatsAppAccount.
     */
    data: XOR<WhatsAppAccountUpdateInput, WhatsAppAccountUncheckedUpdateInput>
    /**
     * Choose, which WhatsAppAccount to update.
     */
    where: WhatsAppAccountWhereUniqueInput
  }

  /**
   * WhatsAppAccount updateMany
   */
  export type WhatsAppAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WhatsAppAccounts.
     */
    data: XOR<WhatsAppAccountUpdateManyMutationInput, WhatsAppAccountUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppAccounts to update
     */
    where?: WhatsAppAccountWhereInput
    /**
     * Limit how many WhatsAppAccounts to update.
     */
    limit?: number
  }

  /**
   * WhatsAppAccount updateManyAndReturn
   */
  export type WhatsAppAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * The data used to update WhatsAppAccounts.
     */
    data: XOR<WhatsAppAccountUpdateManyMutationInput, WhatsAppAccountUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppAccounts to update
     */
    where?: WhatsAppAccountWhereInput
    /**
     * Limit how many WhatsAppAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppAccount upsert
   */
  export type WhatsAppAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the WhatsAppAccount to update in case it exists.
     */
    where: WhatsAppAccountWhereUniqueInput
    /**
     * In case the WhatsAppAccount found by the `where` argument doesn't exist, create a new WhatsAppAccount with this data.
     */
    create: XOR<WhatsAppAccountCreateInput, WhatsAppAccountUncheckedCreateInput>
    /**
     * In case the WhatsAppAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WhatsAppAccountUpdateInput, WhatsAppAccountUncheckedUpdateInput>
  }

  /**
   * WhatsAppAccount delete
   */
  export type WhatsAppAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
    /**
     * Filter which WhatsAppAccount to delete.
     */
    where: WhatsAppAccountWhereUniqueInput
  }

  /**
   * WhatsAppAccount deleteMany
   */
  export type WhatsAppAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppAccounts to delete
     */
    where?: WhatsAppAccountWhereInput
    /**
     * Limit how many WhatsAppAccounts to delete.
     */
    limit?: number
  }

  /**
   * WhatsAppAccount.audiences
   */
  export type WhatsAppAccount$audiencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    where?: WhatsAppAudienceWhereInput
    orderBy?: WhatsAppAudienceOrderByWithRelationInput | WhatsAppAudienceOrderByWithRelationInput[]
    cursor?: WhatsAppAudienceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppAudienceScalarFieldEnum | WhatsAppAudienceScalarFieldEnum[]
  }

  /**
   * WhatsAppAccount.campaigns
   */
  export type WhatsAppAccount$campaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    where?: WhatsAppCampaignWhereInput
    orderBy?: WhatsAppCampaignOrderByWithRelationInput | WhatsAppCampaignOrderByWithRelationInput[]
    cursor?: WhatsAppCampaignWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppCampaignScalarFieldEnum | WhatsAppCampaignScalarFieldEnum[]
  }

  /**
   * WhatsAppAccount.phoneNumbers
   */
  export type WhatsAppAccount$phoneNumbersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    where?: WhatsAppPhoneNumberWhereInput
    orderBy?: WhatsAppPhoneNumberOrderByWithRelationInput | WhatsAppPhoneNumberOrderByWithRelationInput[]
    cursor?: WhatsAppPhoneNumberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppPhoneNumberScalarFieldEnum | WhatsAppPhoneNumberScalarFieldEnum[]
  }

  /**
   * WhatsAppAccount without action
   */
  export type WhatsAppAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAccount
     */
    select?: WhatsAppAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAccount
     */
    omit?: WhatsAppAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAccountInclude<ExtArgs> | null
  }


  /**
   * Model WhatsAppPhoneNumber
   */

  export type AggregateWhatsAppPhoneNumber = {
    _count: WhatsAppPhoneNumberCountAggregateOutputType | null
    _min: WhatsAppPhoneNumberMinAggregateOutputType | null
    _max: WhatsAppPhoneNumberMaxAggregateOutputType | null
  }

  export type WhatsAppPhoneNumberMinAggregateOutputType = {
    id: string | null
    phoneNumberId: string | null
    phoneNumber: string | null
    name: string | null
    codeVerificationStatus: string | null
    isRegistered: boolean | null
    isSubscribed: boolean | null
    accountId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppPhoneNumberMaxAggregateOutputType = {
    id: string | null
    phoneNumberId: string | null
    phoneNumber: string | null
    name: string | null
    codeVerificationStatus: string | null
    isRegistered: boolean | null
    isSubscribed: boolean | null
    accountId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppPhoneNumberCountAggregateOutputType = {
    id: number
    phoneNumberId: number
    phoneNumber: number
    name: number
    codeVerificationStatus: number
    isRegistered: number
    isSubscribed: number
    accountId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WhatsAppPhoneNumberMinAggregateInputType = {
    id?: true
    phoneNumberId?: true
    phoneNumber?: true
    name?: true
    codeVerificationStatus?: true
    isRegistered?: true
    isSubscribed?: true
    accountId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppPhoneNumberMaxAggregateInputType = {
    id?: true
    phoneNumberId?: true
    phoneNumber?: true
    name?: true
    codeVerificationStatus?: true
    isRegistered?: true
    isSubscribed?: true
    accountId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppPhoneNumberCountAggregateInputType = {
    id?: true
    phoneNumberId?: true
    phoneNumber?: true
    name?: true
    codeVerificationStatus?: true
    isRegistered?: true
    isSubscribed?: true
    accountId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WhatsAppPhoneNumberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppPhoneNumber to aggregate.
     */
    where?: WhatsAppPhoneNumberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppPhoneNumbers to fetch.
     */
    orderBy?: WhatsAppPhoneNumberOrderByWithRelationInput | WhatsAppPhoneNumberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WhatsAppPhoneNumberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppPhoneNumbers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppPhoneNumbers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WhatsAppPhoneNumbers
    **/
    _count?: true | WhatsAppPhoneNumberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WhatsAppPhoneNumberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WhatsAppPhoneNumberMaxAggregateInputType
  }

  export type GetWhatsAppPhoneNumberAggregateType<T extends WhatsAppPhoneNumberAggregateArgs> = {
        [P in keyof T & keyof AggregateWhatsAppPhoneNumber]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWhatsAppPhoneNumber[P]>
      : GetScalarType<T[P], AggregateWhatsAppPhoneNumber[P]>
  }




  export type WhatsAppPhoneNumberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppPhoneNumberWhereInput
    orderBy?: WhatsAppPhoneNumberOrderByWithAggregationInput | WhatsAppPhoneNumberOrderByWithAggregationInput[]
    by: WhatsAppPhoneNumberScalarFieldEnum[] | WhatsAppPhoneNumberScalarFieldEnum
    having?: WhatsAppPhoneNumberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WhatsAppPhoneNumberCountAggregateInputType | true
    _min?: WhatsAppPhoneNumberMinAggregateInputType
    _max?: WhatsAppPhoneNumberMaxAggregateInputType
  }

  export type WhatsAppPhoneNumberGroupByOutputType = {
    id: string
    phoneNumberId: string
    phoneNumber: string
    name: string | null
    codeVerificationStatus: string | null
    isRegistered: boolean
    isSubscribed: boolean
    accountId: string
    createdAt: Date
    updatedAt: Date
    _count: WhatsAppPhoneNumberCountAggregateOutputType | null
    _min: WhatsAppPhoneNumberMinAggregateOutputType | null
    _max: WhatsAppPhoneNumberMaxAggregateOutputType | null
  }

  type GetWhatsAppPhoneNumberGroupByPayload<T extends WhatsAppPhoneNumberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WhatsAppPhoneNumberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WhatsAppPhoneNumberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WhatsAppPhoneNumberGroupByOutputType[P]>
            : GetScalarType<T[P], WhatsAppPhoneNumberGroupByOutputType[P]>
        }
      >
    >


  export type WhatsAppPhoneNumberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumberId?: boolean
    phoneNumber?: boolean
    name?: boolean
    codeVerificationStatus?: boolean
    isRegistered?: boolean
    isSubscribed?: boolean
    accountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    recipients?: boolean | WhatsAppPhoneNumber$recipientsArgs<ExtArgs>
    messages?: boolean | WhatsAppPhoneNumber$messagesArgs<ExtArgs>
    automations?: boolean | WhatsAppPhoneNumber$automationsArgs<ExtArgs>
    _count?: boolean | WhatsAppPhoneNumberCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppPhoneNumber"]>

  export type WhatsAppPhoneNumberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumberId?: boolean
    phoneNumber?: boolean
    name?: boolean
    codeVerificationStatus?: boolean
    isRegistered?: boolean
    isSubscribed?: boolean
    accountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppPhoneNumber"]>

  export type WhatsAppPhoneNumberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumberId?: boolean
    phoneNumber?: boolean
    name?: boolean
    codeVerificationStatus?: boolean
    isRegistered?: boolean
    isSubscribed?: boolean
    accountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppPhoneNumber"]>

  export type WhatsAppPhoneNumberSelectScalar = {
    id?: boolean
    phoneNumberId?: boolean
    phoneNumber?: boolean
    name?: boolean
    codeVerificationStatus?: boolean
    isRegistered?: boolean
    isSubscribed?: boolean
    accountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WhatsAppPhoneNumberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phoneNumberId" | "phoneNumber" | "name" | "codeVerificationStatus" | "isRegistered" | "isSubscribed" | "accountId" | "createdAt" | "updatedAt", ExtArgs["result"]["whatsAppPhoneNumber"]>
  export type WhatsAppPhoneNumberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    recipients?: boolean | WhatsAppPhoneNumber$recipientsArgs<ExtArgs>
    messages?: boolean | WhatsAppPhoneNumber$messagesArgs<ExtArgs>
    automations?: boolean | WhatsAppPhoneNumber$automationsArgs<ExtArgs>
    _count?: boolean | WhatsAppPhoneNumberCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WhatsAppPhoneNumberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
  }
  export type WhatsAppPhoneNumberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
  }

  export type $WhatsAppPhoneNumberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WhatsAppPhoneNumber"
    objects: {
      account: Prisma.$WhatsAppAccountPayload<ExtArgs>
      recipients: Prisma.$WhatsAppRecipientPayload<ExtArgs>[]
      messages: Prisma.$WhatsAppMessagePayload<ExtArgs>[]
      automations: Prisma.$WhatsAppAutomationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phoneNumberId: string
      phoneNumber: string
      name: string | null
      codeVerificationStatus: string | null
      isRegistered: boolean
      isSubscribed: boolean
      accountId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["whatsAppPhoneNumber"]>
    composites: {}
  }

  type WhatsAppPhoneNumberGetPayload<S extends boolean | null | undefined | WhatsAppPhoneNumberDefaultArgs> = $Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload, S>

  type WhatsAppPhoneNumberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WhatsAppPhoneNumberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WhatsAppPhoneNumberCountAggregateInputType | true
    }

  export interface WhatsAppPhoneNumberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WhatsAppPhoneNumber'], meta: { name: 'WhatsAppPhoneNumber' } }
    /**
     * Find zero or one WhatsAppPhoneNumber that matches the filter.
     * @param {WhatsAppPhoneNumberFindUniqueArgs} args - Arguments to find a WhatsAppPhoneNumber
     * @example
     * // Get one WhatsAppPhoneNumber
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WhatsAppPhoneNumberFindUniqueArgs>(args: SelectSubset<T, WhatsAppPhoneNumberFindUniqueArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WhatsAppPhoneNumber that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WhatsAppPhoneNumberFindUniqueOrThrowArgs} args - Arguments to find a WhatsAppPhoneNumber
     * @example
     * // Get one WhatsAppPhoneNumber
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WhatsAppPhoneNumberFindUniqueOrThrowArgs>(args: SelectSubset<T, WhatsAppPhoneNumberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppPhoneNumber that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppPhoneNumberFindFirstArgs} args - Arguments to find a WhatsAppPhoneNumber
     * @example
     * // Get one WhatsAppPhoneNumber
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WhatsAppPhoneNumberFindFirstArgs>(args?: SelectSubset<T, WhatsAppPhoneNumberFindFirstArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppPhoneNumber that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppPhoneNumberFindFirstOrThrowArgs} args - Arguments to find a WhatsAppPhoneNumber
     * @example
     * // Get one WhatsAppPhoneNumber
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WhatsAppPhoneNumberFindFirstOrThrowArgs>(args?: SelectSubset<T, WhatsAppPhoneNumberFindFirstOrThrowArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WhatsAppPhoneNumbers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppPhoneNumberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WhatsAppPhoneNumbers
     * const whatsAppPhoneNumbers = await prisma.whatsAppPhoneNumber.findMany()
     * 
     * // Get first 10 WhatsAppPhoneNumbers
     * const whatsAppPhoneNumbers = await prisma.whatsAppPhoneNumber.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const whatsAppPhoneNumberWithIdOnly = await prisma.whatsAppPhoneNumber.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WhatsAppPhoneNumberFindManyArgs>(args?: SelectSubset<T, WhatsAppPhoneNumberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WhatsAppPhoneNumber.
     * @param {WhatsAppPhoneNumberCreateArgs} args - Arguments to create a WhatsAppPhoneNumber.
     * @example
     * // Create one WhatsAppPhoneNumber
     * const WhatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.create({
     *   data: {
     *     // ... data to create a WhatsAppPhoneNumber
     *   }
     * })
     * 
     */
    create<T extends WhatsAppPhoneNumberCreateArgs>(args: SelectSubset<T, WhatsAppPhoneNumberCreateArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WhatsAppPhoneNumbers.
     * @param {WhatsAppPhoneNumberCreateManyArgs} args - Arguments to create many WhatsAppPhoneNumbers.
     * @example
     * // Create many WhatsAppPhoneNumbers
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WhatsAppPhoneNumberCreateManyArgs>(args?: SelectSubset<T, WhatsAppPhoneNumberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WhatsAppPhoneNumbers and returns the data saved in the database.
     * @param {WhatsAppPhoneNumberCreateManyAndReturnArgs} args - Arguments to create many WhatsAppPhoneNumbers.
     * @example
     * // Create many WhatsAppPhoneNumbers
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WhatsAppPhoneNumbers and only return the `id`
     * const whatsAppPhoneNumberWithIdOnly = await prisma.whatsAppPhoneNumber.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WhatsAppPhoneNumberCreateManyAndReturnArgs>(args?: SelectSubset<T, WhatsAppPhoneNumberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WhatsAppPhoneNumber.
     * @param {WhatsAppPhoneNumberDeleteArgs} args - Arguments to delete one WhatsAppPhoneNumber.
     * @example
     * // Delete one WhatsAppPhoneNumber
     * const WhatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.delete({
     *   where: {
     *     // ... filter to delete one WhatsAppPhoneNumber
     *   }
     * })
     * 
     */
    delete<T extends WhatsAppPhoneNumberDeleteArgs>(args: SelectSubset<T, WhatsAppPhoneNumberDeleteArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WhatsAppPhoneNumber.
     * @param {WhatsAppPhoneNumberUpdateArgs} args - Arguments to update one WhatsAppPhoneNumber.
     * @example
     * // Update one WhatsAppPhoneNumber
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WhatsAppPhoneNumberUpdateArgs>(args: SelectSubset<T, WhatsAppPhoneNumberUpdateArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WhatsAppPhoneNumbers.
     * @param {WhatsAppPhoneNumberDeleteManyArgs} args - Arguments to filter WhatsAppPhoneNumbers to delete.
     * @example
     * // Delete a few WhatsAppPhoneNumbers
     * const { count } = await prisma.whatsAppPhoneNumber.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WhatsAppPhoneNumberDeleteManyArgs>(args?: SelectSubset<T, WhatsAppPhoneNumberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppPhoneNumbers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppPhoneNumberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WhatsAppPhoneNumbers
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WhatsAppPhoneNumberUpdateManyArgs>(args: SelectSubset<T, WhatsAppPhoneNumberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppPhoneNumbers and returns the data updated in the database.
     * @param {WhatsAppPhoneNumberUpdateManyAndReturnArgs} args - Arguments to update many WhatsAppPhoneNumbers.
     * @example
     * // Update many WhatsAppPhoneNumbers
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WhatsAppPhoneNumbers and only return the `id`
     * const whatsAppPhoneNumberWithIdOnly = await prisma.whatsAppPhoneNumber.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WhatsAppPhoneNumberUpdateManyAndReturnArgs>(args: SelectSubset<T, WhatsAppPhoneNumberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WhatsAppPhoneNumber.
     * @param {WhatsAppPhoneNumberUpsertArgs} args - Arguments to update or create a WhatsAppPhoneNumber.
     * @example
     * // Update or create a WhatsAppPhoneNumber
     * const whatsAppPhoneNumber = await prisma.whatsAppPhoneNumber.upsert({
     *   create: {
     *     // ... data to create a WhatsAppPhoneNumber
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WhatsAppPhoneNumber we want to update
     *   }
     * })
     */
    upsert<T extends WhatsAppPhoneNumberUpsertArgs>(args: SelectSubset<T, WhatsAppPhoneNumberUpsertArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WhatsAppPhoneNumbers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppPhoneNumberCountArgs} args - Arguments to filter WhatsAppPhoneNumbers to count.
     * @example
     * // Count the number of WhatsAppPhoneNumbers
     * const count = await prisma.whatsAppPhoneNumber.count({
     *   where: {
     *     // ... the filter for the WhatsAppPhoneNumbers we want to count
     *   }
     * })
    **/
    count<T extends WhatsAppPhoneNumberCountArgs>(
      args?: Subset<T, WhatsAppPhoneNumberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WhatsAppPhoneNumberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WhatsAppPhoneNumber.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppPhoneNumberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WhatsAppPhoneNumberAggregateArgs>(args: Subset<T, WhatsAppPhoneNumberAggregateArgs>): Prisma.PrismaPromise<GetWhatsAppPhoneNumberAggregateType<T>>

    /**
     * Group by WhatsAppPhoneNumber.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppPhoneNumberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WhatsAppPhoneNumberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WhatsAppPhoneNumberGroupByArgs['orderBy'] }
        : { orderBy?: WhatsAppPhoneNumberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WhatsAppPhoneNumberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWhatsAppPhoneNumberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WhatsAppPhoneNumber model
   */
  readonly fields: WhatsAppPhoneNumberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WhatsAppPhoneNumber.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WhatsAppPhoneNumberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends WhatsAppAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppAccountDefaultArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    recipients<T extends WhatsAppPhoneNumber$recipientsArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppPhoneNumber$recipientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends WhatsAppPhoneNumber$messagesArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppPhoneNumber$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    automations<T extends WhatsAppPhoneNumber$automationsArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppPhoneNumber$automationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WhatsAppPhoneNumber model
   */
  interface WhatsAppPhoneNumberFieldRefs {
    readonly id: FieldRef<"WhatsAppPhoneNumber", 'String'>
    readonly phoneNumberId: FieldRef<"WhatsAppPhoneNumber", 'String'>
    readonly phoneNumber: FieldRef<"WhatsAppPhoneNumber", 'String'>
    readonly name: FieldRef<"WhatsAppPhoneNumber", 'String'>
    readonly codeVerificationStatus: FieldRef<"WhatsAppPhoneNumber", 'String'>
    readonly isRegistered: FieldRef<"WhatsAppPhoneNumber", 'Boolean'>
    readonly isSubscribed: FieldRef<"WhatsAppPhoneNumber", 'Boolean'>
    readonly accountId: FieldRef<"WhatsAppPhoneNumber", 'String'>
    readonly createdAt: FieldRef<"WhatsAppPhoneNumber", 'DateTime'>
    readonly updatedAt: FieldRef<"WhatsAppPhoneNumber", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WhatsAppPhoneNumber findUnique
   */
  export type WhatsAppPhoneNumberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppPhoneNumber to fetch.
     */
    where: WhatsAppPhoneNumberWhereUniqueInput
  }

  /**
   * WhatsAppPhoneNumber findUniqueOrThrow
   */
  export type WhatsAppPhoneNumberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppPhoneNumber to fetch.
     */
    where: WhatsAppPhoneNumberWhereUniqueInput
  }

  /**
   * WhatsAppPhoneNumber findFirst
   */
  export type WhatsAppPhoneNumberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppPhoneNumber to fetch.
     */
    where?: WhatsAppPhoneNumberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppPhoneNumbers to fetch.
     */
    orderBy?: WhatsAppPhoneNumberOrderByWithRelationInput | WhatsAppPhoneNumberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppPhoneNumbers.
     */
    cursor?: WhatsAppPhoneNumberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppPhoneNumbers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppPhoneNumbers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppPhoneNumbers.
     */
    distinct?: WhatsAppPhoneNumberScalarFieldEnum | WhatsAppPhoneNumberScalarFieldEnum[]
  }

  /**
   * WhatsAppPhoneNumber findFirstOrThrow
   */
  export type WhatsAppPhoneNumberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppPhoneNumber to fetch.
     */
    where?: WhatsAppPhoneNumberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppPhoneNumbers to fetch.
     */
    orderBy?: WhatsAppPhoneNumberOrderByWithRelationInput | WhatsAppPhoneNumberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppPhoneNumbers.
     */
    cursor?: WhatsAppPhoneNumberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppPhoneNumbers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppPhoneNumbers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppPhoneNumbers.
     */
    distinct?: WhatsAppPhoneNumberScalarFieldEnum | WhatsAppPhoneNumberScalarFieldEnum[]
  }

  /**
   * WhatsAppPhoneNumber findMany
   */
  export type WhatsAppPhoneNumberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppPhoneNumbers to fetch.
     */
    where?: WhatsAppPhoneNumberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppPhoneNumbers to fetch.
     */
    orderBy?: WhatsAppPhoneNumberOrderByWithRelationInput | WhatsAppPhoneNumberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WhatsAppPhoneNumbers.
     */
    cursor?: WhatsAppPhoneNumberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppPhoneNumbers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppPhoneNumbers.
     */
    skip?: number
    distinct?: WhatsAppPhoneNumberScalarFieldEnum | WhatsAppPhoneNumberScalarFieldEnum[]
  }

  /**
   * WhatsAppPhoneNumber create
   */
  export type WhatsAppPhoneNumberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    /**
     * The data needed to create a WhatsAppPhoneNumber.
     */
    data: XOR<WhatsAppPhoneNumberCreateInput, WhatsAppPhoneNumberUncheckedCreateInput>
  }

  /**
   * WhatsAppPhoneNumber createMany
   */
  export type WhatsAppPhoneNumberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WhatsAppPhoneNumbers.
     */
    data: WhatsAppPhoneNumberCreateManyInput | WhatsAppPhoneNumberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WhatsAppPhoneNumber createManyAndReturn
   */
  export type WhatsAppPhoneNumberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * The data used to create many WhatsAppPhoneNumbers.
     */
    data: WhatsAppPhoneNumberCreateManyInput | WhatsAppPhoneNumberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppPhoneNumber update
   */
  export type WhatsAppPhoneNumberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    /**
     * The data needed to update a WhatsAppPhoneNumber.
     */
    data: XOR<WhatsAppPhoneNumberUpdateInput, WhatsAppPhoneNumberUncheckedUpdateInput>
    /**
     * Choose, which WhatsAppPhoneNumber to update.
     */
    where: WhatsAppPhoneNumberWhereUniqueInput
  }

  /**
   * WhatsAppPhoneNumber updateMany
   */
  export type WhatsAppPhoneNumberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WhatsAppPhoneNumbers.
     */
    data: XOR<WhatsAppPhoneNumberUpdateManyMutationInput, WhatsAppPhoneNumberUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppPhoneNumbers to update
     */
    where?: WhatsAppPhoneNumberWhereInput
    /**
     * Limit how many WhatsAppPhoneNumbers to update.
     */
    limit?: number
  }

  /**
   * WhatsAppPhoneNumber updateManyAndReturn
   */
  export type WhatsAppPhoneNumberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * The data used to update WhatsAppPhoneNumbers.
     */
    data: XOR<WhatsAppPhoneNumberUpdateManyMutationInput, WhatsAppPhoneNumberUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppPhoneNumbers to update
     */
    where?: WhatsAppPhoneNumberWhereInput
    /**
     * Limit how many WhatsAppPhoneNumbers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppPhoneNumber upsert
   */
  export type WhatsAppPhoneNumberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    /**
     * The filter to search for the WhatsAppPhoneNumber to update in case it exists.
     */
    where: WhatsAppPhoneNumberWhereUniqueInput
    /**
     * In case the WhatsAppPhoneNumber found by the `where` argument doesn't exist, create a new WhatsAppPhoneNumber with this data.
     */
    create: XOR<WhatsAppPhoneNumberCreateInput, WhatsAppPhoneNumberUncheckedCreateInput>
    /**
     * In case the WhatsAppPhoneNumber was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WhatsAppPhoneNumberUpdateInput, WhatsAppPhoneNumberUncheckedUpdateInput>
  }

  /**
   * WhatsAppPhoneNumber delete
   */
  export type WhatsAppPhoneNumberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    /**
     * Filter which WhatsAppPhoneNumber to delete.
     */
    where: WhatsAppPhoneNumberWhereUniqueInput
  }

  /**
   * WhatsAppPhoneNumber deleteMany
   */
  export type WhatsAppPhoneNumberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppPhoneNumbers to delete
     */
    where?: WhatsAppPhoneNumberWhereInput
    /**
     * Limit how many WhatsAppPhoneNumbers to delete.
     */
    limit?: number
  }

  /**
   * WhatsAppPhoneNumber.recipients
   */
  export type WhatsAppPhoneNumber$recipientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    where?: WhatsAppRecipientWhereInput
    orderBy?: WhatsAppRecipientOrderByWithRelationInput | WhatsAppRecipientOrderByWithRelationInput[]
    cursor?: WhatsAppRecipientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppRecipientScalarFieldEnum | WhatsAppRecipientScalarFieldEnum[]
  }

  /**
   * WhatsAppPhoneNumber.messages
   */
  export type WhatsAppPhoneNumber$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    where?: WhatsAppMessageWhereInput
    orderBy?: WhatsAppMessageOrderByWithRelationInput | WhatsAppMessageOrderByWithRelationInput[]
    cursor?: WhatsAppMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppMessageScalarFieldEnum | WhatsAppMessageScalarFieldEnum[]
  }

  /**
   * WhatsAppPhoneNumber.automations
   */
  export type WhatsAppPhoneNumber$automationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    where?: WhatsAppAutomationWhereInput
    orderBy?: WhatsAppAutomationOrderByWithRelationInput | WhatsAppAutomationOrderByWithRelationInput[]
    cursor?: WhatsAppAutomationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppAutomationScalarFieldEnum | WhatsAppAutomationScalarFieldEnum[]
  }

  /**
   * WhatsAppPhoneNumber without action
   */
  export type WhatsAppPhoneNumberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
  }


  /**
   * Model WhatsAppAudience
   */

  export type AggregateWhatsAppAudience = {
    _count: WhatsAppAudienceCountAggregateOutputType | null
    _min: WhatsAppAudienceMinAggregateOutputType | null
    _max: WhatsAppAudienceMaxAggregateOutputType | null
  }

  export type WhatsAppAudienceMinAggregateOutputType = {
    id: string | null
    name: string | null
    accountId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppAudienceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    accountId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppAudienceCountAggregateOutputType = {
    id: number
    name: number
    accountId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WhatsAppAudienceMinAggregateInputType = {
    id?: true
    name?: true
    accountId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppAudienceMaxAggregateInputType = {
    id?: true
    name?: true
    accountId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppAudienceCountAggregateInputType = {
    id?: true
    name?: true
    accountId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WhatsAppAudienceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppAudience to aggregate.
     */
    where?: WhatsAppAudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAudiences to fetch.
     */
    orderBy?: WhatsAppAudienceOrderByWithRelationInput | WhatsAppAudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WhatsAppAudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAudiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAudiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WhatsAppAudiences
    **/
    _count?: true | WhatsAppAudienceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WhatsAppAudienceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WhatsAppAudienceMaxAggregateInputType
  }

  export type GetWhatsAppAudienceAggregateType<T extends WhatsAppAudienceAggregateArgs> = {
        [P in keyof T & keyof AggregateWhatsAppAudience]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWhatsAppAudience[P]>
      : GetScalarType<T[P], AggregateWhatsAppAudience[P]>
  }




  export type WhatsAppAudienceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppAudienceWhereInput
    orderBy?: WhatsAppAudienceOrderByWithAggregationInput | WhatsAppAudienceOrderByWithAggregationInput[]
    by: WhatsAppAudienceScalarFieldEnum[] | WhatsAppAudienceScalarFieldEnum
    having?: WhatsAppAudienceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WhatsAppAudienceCountAggregateInputType | true
    _min?: WhatsAppAudienceMinAggregateInputType
    _max?: WhatsAppAudienceMaxAggregateInputType
  }

  export type WhatsAppAudienceGroupByOutputType = {
    id: string
    name: string
    accountId: string
    createdAt: Date
    updatedAt: Date
    _count: WhatsAppAudienceCountAggregateOutputType | null
    _min: WhatsAppAudienceMinAggregateOutputType | null
    _max: WhatsAppAudienceMaxAggregateOutputType | null
  }

  type GetWhatsAppAudienceGroupByPayload<T extends WhatsAppAudienceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WhatsAppAudienceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WhatsAppAudienceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WhatsAppAudienceGroupByOutputType[P]>
            : GetScalarType<T[P], WhatsAppAudienceGroupByOutputType[P]>
        }
      >
    >


  export type WhatsAppAudienceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    accountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    recipients?: boolean | WhatsAppAudience$recipientsArgs<ExtArgs>
    campaigns?: boolean | WhatsAppAudience$campaignsArgs<ExtArgs>
    _count?: boolean | WhatsAppAudienceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppAudience"]>

  export type WhatsAppAudienceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    accountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppAudience"]>

  export type WhatsAppAudienceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    accountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppAudience"]>

  export type WhatsAppAudienceSelectScalar = {
    id?: boolean
    name?: boolean
    accountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WhatsAppAudienceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "accountId" | "createdAt" | "updatedAt", ExtArgs["result"]["whatsAppAudience"]>
  export type WhatsAppAudienceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    recipients?: boolean | WhatsAppAudience$recipientsArgs<ExtArgs>
    campaigns?: boolean | WhatsAppAudience$campaignsArgs<ExtArgs>
    _count?: boolean | WhatsAppAudienceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WhatsAppAudienceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
  }
  export type WhatsAppAudienceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
  }

  export type $WhatsAppAudiencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WhatsAppAudience"
    objects: {
      account: Prisma.$WhatsAppAccountPayload<ExtArgs>
      recipients: Prisma.$WhatsAppRecipientPayload<ExtArgs>[]
      campaigns: Prisma.$WhatsAppCampaignPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      accountId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["whatsAppAudience"]>
    composites: {}
  }

  type WhatsAppAudienceGetPayload<S extends boolean | null | undefined | WhatsAppAudienceDefaultArgs> = $Result.GetResult<Prisma.$WhatsAppAudiencePayload, S>

  type WhatsAppAudienceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WhatsAppAudienceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WhatsAppAudienceCountAggregateInputType | true
    }

  export interface WhatsAppAudienceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WhatsAppAudience'], meta: { name: 'WhatsAppAudience' } }
    /**
     * Find zero or one WhatsAppAudience that matches the filter.
     * @param {WhatsAppAudienceFindUniqueArgs} args - Arguments to find a WhatsAppAudience
     * @example
     * // Get one WhatsAppAudience
     * const whatsAppAudience = await prisma.whatsAppAudience.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WhatsAppAudienceFindUniqueArgs>(args: SelectSubset<T, WhatsAppAudienceFindUniqueArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WhatsAppAudience that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WhatsAppAudienceFindUniqueOrThrowArgs} args - Arguments to find a WhatsAppAudience
     * @example
     * // Get one WhatsAppAudience
     * const whatsAppAudience = await prisma.whatsAppAudience.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WhatsAppAudienceFindUniqueOrThrowArgs>(args: SelectSubset<T, WhatsAppAudienceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppAudience that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAudienceFindFirstArgs} args - Arguments to find a WhatsAppAudience
     * @example
     * // Get one WhatsAppAudience
     * const whatsAppAudience = await prisma.whatsAppAudience.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WhatsAppAudienceFindFirstArgs>(args?: SelectSubset<T, WhatsAppAudienceFindFirstArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppAudience that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAudienceFindFirstOrThrowArgs} args - Arguments to find a WhatsAppAudience
     * @example
     * // Get one WhatsAppAudience
     * const whatsAppAudience = await prisma.whatsAppAudience.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WhatsAppAudienceFindFirstOrThrowArgs>(args?: SelectSubset<T, WhatsAppAudienceFindFirstOrThrowArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WhatsAppAudiences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAudienceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WhatsAppAudiences
     * const whatsAppAudiences = await prisma.whatsAppAudience.findMany()
     * 
     * // Get first 10 WhatsAppAudiences
     * const whatsAppAudiences = await prisma.whatsAppAudience.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const whatsAppAudienceWithIdOnly = await prisma.whatsAppAudience.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WhatsAppAudienceFindManyArgs>(args?: SelectSubset<T, WhatsAppAudienceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WhatsAppAudience.
     * @param {WhatsAppAudienceCreateArgs} args - Arguments to create a WhatsAppAudience.
     * @example
     * // Create one WhatsAppAudience
     * const WhatsAppAudience = await prisma.whatsAppAudience.create({
     *   data: {
     *     // ... data to create a WhatsAppAudience
     *   }
     * })
     * 
     */
    create<T extends WhatsAppAudienceCreateArgs>(args: SelectSubset<T, WhatsAppAudienceCreateArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WhatsAppAudiences.
     * @param {WhatsAppAudienceCreateManyArgs} args - Arguments to create many WhatsAppAudiences.
     * @example
     * // Create many WhatsAppAudiences
     * const whatsAppAudience = await prisma.whatsAppAudience.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WhatsAppAudienceCreateManyArgs>(args?: SelectSubset<T, WhatsAppAudienceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WhatsAppAudiences and returns the data saved in the database.
     * @param {WhatsAppAudienceCreateManyAndReturnArgs} args - Arguments to create many WhatsAppAudiences.
     * @example
     * // Create many WhatsAppAudiences
     * const whatsAppAudience = await prisma.whatsAppAudience.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WhatsAppAudiences and only return the `id`
     * const whatsAppAudienceWithIdOnly = await prisma.whatsAppAudience.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WhatsAppAudienceCreateManyAndReturnArgs>(args?: SelectSubset<T, WhatsAppAudienceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WhatsAppAudience.
     * @param {WhatsAppAudienceDeleteArgs} args - Arguments to delete one WhatsAppAudience.
     * @example
     * // Delete one WhatsAppAudience
     * const WhatsAppAudience = await prisma.whatsAppAudience.delete({
     *   where: {
     *     // ... filter to delete one WhatsAppAudience
     *   }
     * })
     * 
     */
    delete<T extends WhatsAppAudienceDeleteArgs>(args: SelectSubset<T, WhatsAppAudienceDeleteArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WhatsAppAudience.
     * @param {WhatsAppAudienceUpdateArgs} args - Arguments to update one WhatsAppAudience.
     * @example
     * // Update one WhatsAppAudience
     * const whatsAppAudience = await prisma.whatsAppAudience.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WhatsAppAudienceUpdateArgs>(args: SelectSubset<T, WhatsAppAudienceUpdateArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WhatsAppAudiences.
     * @param {WhatsAppAudienceDeleteManyArgs} args - Arguments to filter WhatsAppAudiences to delete.
     * @example
     * // Delete a few WhatsAppAudiences
     * const { count } = await prisma.whatsAppAudience.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WhatsAppAudienceDeleteManyArgs>(args?: SelectSubset<T, WhatsAppAudienceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppAudiences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAudienceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WhatsAppAudiences
     * const whatsAppAudience = await prisma.whatsAppAudience.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WhatsAppAudienceUpdateManyArgs>(args: SelectSubset<T, WhatsAppAudienceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppAudiences and returns the data updated in the database.
     * @param {WhatsAppAudienceUpdateManyAndReturnArgs} args - Arguments to update many WhatsAppAudiences.
     * @example
     * // Update many WhatsAppAudiences
     * const whatsAppAudience = await prisma.whatsAppAudience.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WhatsAppAudiences and only return the `id`
     * const whatsAppAudienceWithIdOnly = await prisma.whatsAppAudience.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WhatsAppAudienceUpdateManyAndReturnArgs>(args: SelectSubset<T, WhatsAppAudienceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WhatsAppAudience.
     * @param {WhatsAppAudienceUpsertArgs} args - Arguments to update or create a WhatsAppAudience.
     * @example
     * // Update or create a WhatsAppAudience
     * const whatsAppAudience = await prisma.whatsAppAudience.upsert({
     *   create: {
     *     // ... data to create a WhatsAppAudience
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WhatsAppAudience we want to update
     *   }
     * })
     */
    upsert<T extends WhatsAppAudienceUpsertArgs>(args: SelectSubset<T, WhatsAppAudienceUpsertArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WhatsAppAudiences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAudienceCountArgs} args - Arguments to filter WhatsAppAudiences to count.
     * @example
     * // Count the number of WhatsAppAudiences
     * const count = await prisma.whatsAppAudience.count({
     *   where: {
     *     // ... the filter for the WhatsAppAudiences we want to count
     *   }
     * })
    **/
    count<T extends WhatsAppAudienceCountArgs>(
      args?: Subset<T, WhatsAppAudienceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WhatsAppAudienceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WhatsAppAudience.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAudienceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WhatsAppAudienceAggregateArgs>(args: Subset<T, WhatsAppAudienceAggregateArgs>): Prisma.PrismaPromise<GetWhatsAppAudienceAggregateType<T>>

    /**
     * Group by WhatsAppAudience.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAudienceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WhatsAppAudienceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WhatsAppAudienceGroupByArgs['orderBy'] }
        : { orderBy?: WhatsAppAudienceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WhatsAppAudienceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWhatsAppAudienceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WhatsAppAudience model
   */
  readonly fields: WhatsAppAudienceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WhatsAppAudience.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WhatsAppAudienceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends WhatsAppAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppAccountDefaultArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    recipients<T extends WhatsAppAudience$recipientsArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppAudience$recipientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    campaigns<T extends WhatsAppAudience$campaignsArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppAudience$campaignsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WhatsAppAudience model
   */
  interface WhatsAppAudienceFieldRefs {
    readonly id: FieldRef<"WhatsAppAudience", 'String'>
    readonly name: FieldRef<"WhatsAppAudience", 'String'>
    readonly accountId: FieldRef<"WhatsAppAudience", 'String'>
    readonly createdAt: FieldRef<"WhatsAppAudience", 'DateTime'>
    readonly updatedAt: FieldRef<"WhatsAppAudience", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WhatsAppAudience findUnique
   */
  export type WhatsAppAudienceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAudience to fetch.
     */
    where: WhatsAppAudienceWhereUniqueInput
  }

  /**
   * WhatsAppAudience findUniqueOrThrow
   */
  export type WhatsAppAudienceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAudience to fetch.
     */
    where: WhatsAppAudienceWhereUniqueInput
  }

  /**
   * WhatsAppAudience findFirst
   */
  export type WhatsAppAudienceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAudience to fetch.
     */
    where?: WhatsAppAudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAudiences to fetch.
     */
    orderBy?: WhatsAppAudienceOrderByWithRelationInput | WhatsAppAudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppAudiences.
     */
    cursor?: WhatsAppAudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAudiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAudiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppAudiences.
     */
    distinct?: WhatsAppAudienceScalarFieldEnum | WhatsAppAudienceScalarFieldEnum[]
  }

  /**
   * WhatsAppAudience findFirstOrThrow
   */
  export type WhatsAppAudienceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAudience to fetch.
     */
    where?: WhatsAppAudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAudiences to fetch.
     */
    orderBy?: WhatsAppAudienceOrderByWithRelationInput | WhatsAppAudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppAudiences.
     */
    cursor?: WhatsAppAudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAudiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAudiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppAudiences.
     */
    distinct?: WhatsAppAudienceScalarFieldEnum | WhatsAppAudienceScalarFieldEnum[]
  }

  /**
   * WhatsAppAudience findMany
   */
  export type WhatsAppAudienceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAudiences to fetch.
     */
    where?: WhatsAppAudienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAudiences to fetch.
     */
    orderBy?: WhatsAppAudienceOrderByWithRelationInput | WhatsAppAudienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WhatsAppAudiences.
     */
    cursor?: WhatsAppAudienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAudiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAudiences.
     */
    skip?: number
    distinct?: WhatsAppAudienceScalarFieldEnum | WhatsAppAudienceScalarFieldEnum[]
  }

  /**
   * WhatsAppAudience create
   */
  export type WhatsAppAudienceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    /**
     * The data needed to create a WhatsAppAudience.
     */
    data: XOR<WhatsAppAudienceCreateInput, WhatsAppAudienceUncheckedCreateInput>
  }

  /**
   * WhatsAppAudience createMany
   */
  export type WhatsAppAudienceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WhatsAppAudiences.
     */
    data: WhatsAppAudienceCreateManyInput | WhatsAppAudienceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WhatsAppAudience createManyAndReturn
   */
  export type WhatsAppAudienceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * The data used to create many WhatsAppAudiences.
     */
    data: WhatsAppAudienceCreateManyInput | WhatsAppAudienceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppAudience update
   */
  export type WhatsAppAudienceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    /**
     * The data needed to update a WhatsAppAudience.
     */
    data: XOR<WhatsAppAudienceUpdateInput, WhatsAppAudienceUncheckedUpdateInput>
    /**
     * Choose, which WhatsAppAudience to update.
     */
    where: WhatsAppAudienceWhereUniqueInput
  }

  /**
   * WhatsAppAudience updateMany
   */
  export type WhatsAppAudienceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WhatsAppAudiences.
     */
    data: XOR<WhatsAppAudienceUpdateManyMutationInput, WhatsAppAudienceUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppAudiences to update
     */
    where?: WhatsAppAudienceWhereInput
    /**
     * Limit how many WhatsAppAudiences to update.
     */
    limit?: number
  }

  /**
   * WhatsAppAudience updateManyAndReturn
   */
  export type WhatsAppAudienceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * The data used to update WhatsAppAudiences.
     */
    data: XOR<WhatsAppAudienceUpdateManyMutationInput, WhatsAppAudienceUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppAudiences to update
     */
    where?: WhatsAppAudienceWhereInput
    /**
     * Limit how many WhatsAppAudiences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppAudience upsert
   */
  export type WhatsAppAudienceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    /**
     * The filter to search for the WhatsAppAudience to update in case it exists.
     */
    where: WhatsAppAudienceWhereUniqueInput
    /**
     * In case the WhatsAppAudience found by the `where` argument doesn't exist, create a new WhatsAppAudience with this data.
     */
    create: XOR<WhatsAppAudienceCreateInput, WhatsAppAudienceUncheckedCreateInput>
    /**
     * In case the WhatsAppAudience was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WhatsAppAudienceUpdateInput, WhatsAppAudienceUncheckedUpdateInput>
  }

  /**
   * WhatsAppAudience delete
   */
  export type WhatsAppAudienceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    /**
     * Filter which WhatsAppAudience to delete.
     */
    where: WhatsAppAudienceWhereUniqueInput
  }

  /**
   * WhatsAppAudience deleteMany
   */
  export type WhatsAppAudienceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppAudiences to delete
     */
    where?: WhatsAppAudienceWhereInput
    /**
     * Limit how many WhatsAppAudiences to delete.
     */
    limit?: number
  }

  /**
   * WhatsAppAudience.recipients
   */
  export type WhatsAppAudience$recipientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    where?: WhatsAppRecipientWhereInput
    orderBy?: WhatsAppRecipientOrderByWithRelationInput | WhatsAppRecipientOrderByWithRelationInput[]
    cursor?: WhatsAppRecipientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppRecipientScalarFieldEnum | WhatsAppRecipientScalarFieldEnum[]
  }

  /**
   * WhatsAppAudience.campaigns
   */
  export type WhatsAppAudience$campaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    where?: WhatsAppCampaignWhereInput
    orderBy?: WhatsAppCampaignOrderByWithRelationInput | WhatsAppCampaignOrderByWithRelationInput[]
    cursor?: WhatsAppCampaignWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppCampaignScalarFieldEnum | WhatsAppCampaignScalarFieldEnum[]
  }

  /**
   * WhatsAppAudience without action
   */
  export type WhatsAppAudienceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
  }


  /**
   * Model WhatsAppRecipient
   */

  export type AggregateWhatsAppRecipient = {
    _count: WhatsAppRecipientCountAggregateOutputType | null
    _min: WhatsAppRecipientMinAggregateOutputType | null
    _max: WhatsAppRecipientMaxAggregateOutputType | null
  }

  export type WhatsAppRecipientMinAggregateOutputType = {
    id: string | null
    phoneNumber: string | null
    name: string | null
    audienceId: string | null
    whatsAppPhoneNumberId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppRecipientMaxAggregateOutputType = {
    id: string | null
    phoneNumber: string | null
    name: string | null
    audienceId: string | null
    whatsAppPhoneNumberId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppRecipientCountAggregateOutputType = {
    id: number
    phoneNumber: number
    name: number
    audienceId: number
    whatsAppPhoneNumberId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WhatsAppRecipientMinAggregateInputType = {
    id?: true
    phoneNumber?: true
    name?: true
    audienceId?: true
    whatsAppPhoneNumberId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppRecipientMaxAggregateInputType = {
    id?: true
    phoneNumber?: true
    name?: true
    audienceId?: true
    whatsAppPhoneNumberId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppRecipientCountAggregateInputType = {
    id?: true
    phoneNumber?: true
    name?: true
    audienceId?: true
    whatsAppPhoneNumberId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WhatsAppRecipientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppRecipient to aggregate.
     */
    where?: WhatsAppRecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppRecipients to fetch.
     */
    orderBy?: WhatsAppRecipientOrderByWithRelationInput | WhatsAppRecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WhatsAppRecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppRecipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppRecipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WhatsAppRecipients
    **/
    _count?: true | WhatsAppRecipientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WhatsAppRecipientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WhatsAppRecipientMaxAggregateInputType
  }

  export type GetWhatsAppRecipientAggregateType<T extends WhatsAppRecipientAggregateArgs> = {
        [P in keyof T & keyof AggregateWhatsAppRecipient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWhatsAppRecipient[P]>
      : GetScalarType<T[P], AggregateWhatsAppRecipient[P]>
  }




  export type WhatsAppRecipientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppRecipientWhereInput
    orderBy?: WhatsAppRecipientOrderByWithAggregationInput | WhatsAppRecipientOrderByWithAggregationInput[]
    by: WhatsAppRecipientScalarFieldEnum[] | WhatsAppRecipientScalarFieldEnum
    having?: WhatsAppRecipientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WhatsAppRecipientCountAggregateInputType | true
    _min?: WhatsAppRecipientMinAggregateInputType
    _max?: WhatsAppRecipientMaxAggregateInputType
  }

  export type WhatsAppRecipientGroupByOutputType = {
    id: string
    phoneNumber: string
    name: string | null
    audienceId: string | null
    whatsAppPhoneNumberId: string | null
    createdAt: Date
    updatedAt: Date
    _count: WhatsAppRecipientCountAggregateOutputType | null
    _min: WhatsAppRecipientMinAggregateOutputType | null
    _max: WhatsAppRecipientMaxAggregateOutputType | null
  }

  type GetWhatsAppRecipientGroupByPayload<T extends WhatsAppRecipientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WhatsAppRecipientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WhatsAppRecipientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WhatsAppRecipientGroupByOutputType[P]>
            : GetScalarType<T[P], WhatsAppRecipientGroupByOutputType[P]>
        }
      >
    >


  export type WhatsAppRecipientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumber?: boolean
    name?: boolean
    audienceId?: boolean
    whatsAppPhoneNumberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    audience?: boolean | WhatsAppRecipient$audienceArgs<ExtArgs>
    whatsAppPhoneNumber?: boolean | WhatsAppRecipient$whatsAppPhoneNumberArgs<ExtArgs>
    messages?: boolean | WhatsAppRecipient$messagesArgs<ExtArgs>
    _count?: boolean | WhatsAppRecipientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppRecipient"]>

  export type WhatsAppRecipientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumber?: boolean
    name?: boolean
    audienceId?: boolean
    whatsAppPhoneNumberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    audience?: boolean | WhatsAppRecipient$audienceArgs<ExtArgs>
    whatsAppPhoneNumber?: boolean | WhatsAppRecipient$whatsAppPhoneNumberArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppRecipient"]>

  export type WhatsAppRecipientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumber?: boolean
    name?: boolean
    audienceId?: boolean
    whatsAppPhoneNumberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    audience?: boolean | WhatsAppRecipient$audienceArgs<ExtArgs>
    whatsAppPhoneNumber?: boolean | WhatsAppRecipient$whatsAppPhoneNumberArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppRecipient"]>

  export type WhatsAppRecipientSelectScalar = {
    id?: boolean
    phoneNumber?: boolean
    name?: boolean
    audienceId?: boolean
    whatsAppPhoneNumberId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WhatsAppRecipientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phoneNumber" | "name" | "audienceId" | "whatsAppPhoneNumberId" | "createdAt" | "updatedAt", ExtArgs["result"]["whatsAppRecipient"]>
  export type WhatsAppRecipientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    audience?: boolean | WhatsAppRecipient$audienceArgs<ExtArgs>
    whatsAppPhoneNumber?: boolean | WhatsAppRecipient$whatsAppPhoneNumberArgs<ExtArgs>
    messages?: boolean | WhatsAppRecipient$messagesArgs<ExtArgs>
    _count?: boolean | WhatsAppRecipientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WhatsAppRecipientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    audience?: boolean | WhatsAppRecipient$audienceArgs<ExtArgs>
    whatsAppPhoneNumber?: boolean | WhatsAppRecipient$whatsAppPhoneNumberArgs<ExtArgs>
  }
  export type WhatsAppRecipientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    audience?: boolean | WhatsAppRecipient$audienceArgs<ExtArgs>
    whatsAppPhoneNumber?: boolean | WhatsAppRecipient$whatsAppPhoneNumberArgs<ExtArgs>
  }

  export type $WhatsAppRecipientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WhatsAppRecipient"
    objects: {
      audience: Prisma.$WhatsAppAudiencePayload<ExtArgs> | null
      whatsAppPhoneNumber: Prisma.$WhatsAppPhoneNumberPayload<ExtArgs> | null
      messages: Prisma.$WhatsAppMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phoneNumber: string
      name: string | null
      audienceId: string | null
      whatsAppPhoneNumberId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["whatsAppRecipient"]>
    composites: {}
  }

  type WhatsAppRecipientGetPayload<S extends boolean | null | undefined | WhatsAppRecipientDefaultArgs> = $Result.GetResult<Prisma.$WhatsAppRecipientPayload, S>

  type WhatsAppRecipientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WhatsAppRecipientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WhatsAppRecipientCountAggregateInputType | true
    }

  export interface WhatsAppRecipientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WhatsAppRecipient'], meta: { name: 'WhatsAppRecipient' } }
    /**
     * Find zero or one WhatsAppRecipient that matches the filter.
     * @param {WhatsAppRecipientFindUniqueArgs} args - Arguments to find a WhatsAppRecipient
     * @example
     * // Get one WhatsAppRecipient
     * const whatsAppRecipient = await prisma.whatsAppRecipient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WhatsAppRecipientFindUniqueArgs>(args: SelectSubset<T, WhatsAppRecipientFindUniqueArgs<ExtArgs>>): Prisma__WhatsAppRecipientClient<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WhatsAppRecipient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WhatsAppRecipientFindUniqueOrThrowArgs} args - Arguments to find a WhatsAppRecipient
     * @example
     * // Get one WhatsAppRecipient
     * const whatsAppRecipient = await prisma.whatsAppRecipient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WhatsAppRecipientFindUniqueOrThrowArgs>(args: SelectSubset<T, WhatsAppRecipientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WhatsAppRecipientClient<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppRecipient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppRecipientFindFirstArgs} args - Arguments to find a WhatsAppRecipient
     * @example
     * // Get one WhatsAppRecipient
     * const whatsAppRecipient = await prisma.whatsAppRecipient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WhatsAppRecipientFindFirstArgs>(args?: SelectSubset<T, WhatsAppRecipientFindFirstArgs<ExtArgs>>): Prisma__WhatsAppRecipientClient<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppRecipient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppRecipientFindFirstOrThrowArgs} args - Arguments to find a WhatsAppRecipient
     * @example
     * // Get one WhatsAppRecipient
     * const whatsAppRecipient = await prisma.whatsAppRecipient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WhatsAppRecipientFindFirstOrThrowArgs>(args?: SelectSubset<T, WhatsAppRecipientFindFirstOrThrowArgs<ExtArgs>>): Prisma__WhatsAppRecipientClient<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WhatsAppRecipients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppRecipientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WhatsAppRecipients
     * const whatsAppRecipients = await prisma.whatsAppRecipient.findMany()
     * 
     * // Get first 10 WhatsAppRecipients
     * const whatsAppRecipients = await prisma.whatsAppRecipient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const whatsAppRecipientWithIdOnly = await prisma.whatsAppRecipient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WhatsAppRecipientFindManyArgs>(args?: SelectSubset<T, WhatsAppRecipientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WhatsAppRecipient.
     * @param {WhatsAppRecipientCreateArgs} args - Arguments to create a WhatsAppRecipient.
     * @example
     * // Create one WhatsAppRecipient
     * const WhatsAppRecipient = await prisma.whatsAppRecipient.create({
     *   data: {
     *     // ... data to create a WhatsAppRecipient
     *   }
     * })
     * 
     */
    create<T extends WhatsAppRecipientCreateArgs>(args: SelectSubset<T, WhatsAppRecipientCreateArgs<ExtArgs>>): Prisma__WhatsAppRecipientClient<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WhatsAppRecipients.
     * @param {WhatsAppRecipientCreateManyArgs} args - Arguments to create many WhatsAppRecipients.
     * @example
     * // Create many WhatsAppRecipients
     * const whatsAppRecipient = await prisma.whatsAppRecipient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WhatsAppRecipientCreateManyArgs>(args?: SelectSubset<T, WhatsAppRecipientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WhatsAppRecipients and returns the data saved in the database.
     * @param {WhatsAppRecipientCreateManyAndReturnArgs} args - Arguments to create many WhatsAppRecipients.
     * @example
     * // Create many WhatsAppRecipients
     * const whatsAppRecipient = await prisma.whatsAppRecipient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WhatsAppRecipients and only return the `id`
     * const whatsAppRecipientWithIdOnly = await prisma.whatsAppRecipient.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WhatsAppRecipientCreateManyAndReturnArgs>(args?: SelectSubset<T, WhatsAppRecipientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WhatsAppRecipient.
     * @param {WhatsAppRecipientDeleteArgs} args - Arguments to delete one WhatsAppRecipient.
     * @example
     * // Delete one WhatsAppRecipient
     * const WhatsAppRecipient = await prisma.whatsAppRecipient.delete({
     *   where: {
     *     // ... filter to delete one WhatsAppRecipient
     *   }
     * })
     * 
     */
    delete<T extends WhatsAppRecipientDeleteArgs>(args: SelectSubset<T, WhatsAppRecipientDeleteArgs<ExtArgs>>): Prisma__WhatsAppRecipientClient<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WhatsAppRecipient.
     * @param {WhatsAppRecipientUpdateArgs} args - Arguments to update one WhatsAppRecipient.
     * @example
     * // Update one WhatsAppRecipient
     * const whatsAppRecipient = await prisma.whatsAppRecipient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WhatsAppRecipientUpdateArgs>(args: SelectSubset<T, WhatsAppRecipientUpdateArgs<ExtArgs>>): Prisma__WhatsAppRecipientClient<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WhatsAppRecipients.
     * @param {WhatsAppRecipientDeleteManyArgs} args - Arguments to filter WhatsAppRecipients to delete.
     * @example
     * // Delete a few WhatsAppRecipients
     * const { count } = await prisma.whatsAppRecipient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WhatsAppRecipientDeleteManyArgs>(args?: SelectSubset<T, WhatsAppRecipientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppRecipients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppRecipientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WhatsAppRecipients
     * const whatsAppRecipient = await prisma.whatsAppRecipient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WhatsAppRecipientUpdateManyArgs>(args: SelectSubset<T, WhatsAppRecipientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppRecipients and returns the data updated in the database.
     * @param {WhatsAppRecipientUpdateManyAndReturnArgs} args - Arguments to update many WhatsAppRecipients.
     * @example
     * // Update many WhatsAppRecipients
     * const whatsAppRecipient = await prisma.whatsAppRecipient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WhatsAppRecipients and only return the `id`
     * const whatsAppRecipientWithIdOnly = await prisma.whatsAppRecipient.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WhatsAppRecipientUpdateManyAndReturnArgs>(args: SelectSubset<T, WhatsAppRecipientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WhatsAppRecipient.
     * @param {WhatsAppRecipientUpsertArgs} args - Arguments to update or create a WhatsAppRecipient.
     * @example
     * // Update or create a WhatsAppRecipient
     * const whatsAppRecipient = await prisma.whatsAppRecipient.upsert({
     *   create: {
     *     // ... data to create a WhatsAppRecipient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WhatsAppRecipient we want to update
     *   }
     * })
     */
    upsert<T extends WhatsAppRecipientUpsertArgs>(args: SelectSubset<T, WhatsAppRecipientUpsertArgs<ExtArgs>>): Prisma__WhatsAppRecipientClient<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WhatsAppRecipients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppRecipientCountArgs} args - Arguments to filter WhatsAppRecipients to count.
     * @example
     * // Count the number of WhatsAppRecipients
     * const count = await prisma.whatsAppRecipient.count({
     *   where: {
     *     // ... the filter for the WhatsAppRecipients we want to count
     *   }
     * })
    **/
    count<T extends WhatsAppRecipientCountArgs>(
      args?: Subset<T, WhatsAppRecipientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WhatsAppRecipientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WhatsAppRecipient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppRecipientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WhatsAppRecipientAggregateArgs>(args: Subset<T, WhatsAppRecipientAggregateArgs>): Prisma.PrismaPromise<GetWhatsAppRecipientAggregateType<T>>

    /**
     * Group by WhatsAppRecipient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppRecipientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WhatsAppRecipientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WhatsAppRecipientGroupByArgs['orderBy'] }
        : { orderBy?: WhatsAppRecipientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WhatsAppRecipientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWhatsAppRecipientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WhatsAppRecipient model
   */
  readonly fields: WhatsAppRecipientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WhatsAppRecipient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WhatsAppRecipientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    audience<T extends WhatsAppRecipient$audienceArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppRecipient$audienceArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    whatsAppPhoneNumber<T extends WhatsAppRecipient$whatsAppPhoneNumberArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppRecipient$whatsAppPhoneNumberArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    messages<T extends WhatsAppRecipient$messagesArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppRecipient$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WhatsAppRecipient model
   */
  interface WhatsAppRecipientFieldRefs {
    readonly id: FieldRef<"WhatsAppRecipient", 'String'>
    readonly phoneNumber: FieldRef<"WhatsAppRecipient", 'String'>
    readonly name: FieldRef<"WhatsAppRecipient", 'String'>
    readonly audienceId: FieldRef<"WhatsAppRecipient", 'String'>
    readonly whatsAppPhoneNumberId: FieldRef<"WhatsAppRecipient", 'String'>
    readonly createdAt: FieldRef<"WhatsAppRecipient", 'DateTime'>
    readonly updatedAt: FieldRef<"WhatsAppRecipient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WhatsAppRecipient findUnique
   */
  export type WhatsAppRecipientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppRecipient to fetch.
     */
    where: WhatsAppRecipientWhereUniqueInput
  }

  /**
   * WhatsAppRecipient findUniqueOrThrow
   */
  export type WhatsAppRecipientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppRecipient to fetch.
     */
    where: WhatsAppRecipientWhereUniqueInput
  }

  /**
   * WhatsAppRecipient findFirst
   */
  export type WhatsAppRecipientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppRecipient to fetch.
     */
    where?: WhatsAppRecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppRecipients to fetch.
     */
    orderBy?: WhatsAppRecipientOrderByWithRelationInput | WhatsAppRecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppRecipients.
     */
    cursor?: WhatsAppRecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppRecipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppRecipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppRecipients.
     */
    distinct?: WhatsAppRecipientScalarFieldEnum | WhatsAppRecipientScalarFieldEnum[]
  }

  /**
   * WhatsAppRecipient findFirstOrThrow
   */
  export type WhatsAppRecipientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppRecipient to fetch.
     */
    where?: WhatsAppRecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppRecipients to fetch.
     */
    orderBy?: WhatsAppRecipientOrderByWithRelationInput | WhatsAppRecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppRecipients.
     */
    cursor?: WhatsAppRecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppRecipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppRecipients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppRecipients.
     */
    distinct?: WhatsAppRecipientScalarFieldEnum | WhatsAppRecipientScalarFieldEnum[]
  }

  /**
   * WhatsAppRecipient findMany
   */
  export type WhatsAppRecipientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppRecipients to fetch.
     */
    where?: WhatsAppRecipientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppRecipients to fetch.
     */
    orderBy?: WhatsAppRecipientOrderByWithRelationInput | WhatsAppRecipientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WhatsAppRecipients.
     */
    cursor?: WhatsAppRecipientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppRecipients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppRecipients.
     */
    skip?: number
    distinct?: WhatsAppRecipientScalarFieldEnum | WhatsAppRecipientScalarFieldEnum[]
  }

  /**
   * WhatsAppRecipient create
   */
  export type WhatsAppRecipientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    /**
     * The data needed to create a WhatsAppRecipient.
     */
    data: XOR<WhatsAppRecipientCreateInput, WhatsAppRecipientUncheckedCreateInput>
  }

  /**
   * WhatsAppRecipient createMany
   */
  export type WhatsAppRecipientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WhatsAppRecipients.
     */
    data: WhatsAppRecipientCreateManyInput | WhatsAppRecipientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WhatsAppRecipient createManyAndReturn
   */
  export type WhatsAppRecipientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * The data used to create many WhatsAppRecipients.
     */
    data: WhatsAppRecipientCreateManyInput | WhatsAppRecipientCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppRecipient update
   */
  export type WhatsAppRecipientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    /**
     * The data needed to update a WhatsAppRecipient.
     */
    data: XOR<WhatsAppRecipientUpdateInput, WhatsAppRecipientUncheckedUpdateInput>
    /**
     * Choose, which WhatsAppRecipient to update.
     */
    where: WhatsAppRecipientWhereUniqueInput
  }

  /**
   * WhatsAppRecipient updateMany
   */
  export type WhatsAppRecipientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WhatsAppRecipients.
     */
    data: XOR<WhatsAppRecipientUpdateManyMutationInput, WhatsAppRecipientUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppRecipients to update
     */
    where?: WhatsAppRecipientWhereInput
    /**
     * Limit how many WhatsAppRecipients to update.
     */
    limit?: number
  }

  /**
   * WhatsAppRecipient updateManyAndReturn
   */
  export type WhatsAppRecipientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * The data used to update WhatsAppRecipients.
     */
    data: XOR<WhatsAppRecipientUpdateManyMutationInput, WhatsAppRecipientUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppRecipients to update
     */
    where?: WhatsAppRecipientWhereInput
    /**
     * Limit how many WhatsAppRecipients to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppRecipient upsert
   */
  export type WhatsAppRecipientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    /**
     * The filter to search for the WhatsAppRecipient to update in case it exists.
     */
    where: WhatsAppRecipientWhereUniqueInput
    /**
     * In case the WhatsAppRecipient found by the `where` argument doesn't exist, create a new WhatsAppRecipient with this data.
     */
    create: XOR<WhatsAppRecipientCreateInput, WhatsAppRecipientUncheckedCreateInput>
    /**
     * In case the WhatsAppRecipient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WhatsAppRecipientUpdateInput, WhatsAppRecipientUncheckedUpdateInput>
  }

  /**
   * WhatsAppRecipient delete
   */
  export type WhatsAppRecipientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
    /**
     * Filter which WhatsAppRecipient to delete.
     */
    where: WhatsAppRecipientWhereUniqueInput
  }

  /**
   * WhatsAppRecipient deleteMany
   */
  export type WhatsAppRecipientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppRecipients to delete
     */
    where?: WhatsAppRecipientWhereInput
    /**
     * Limit how many WhatsAppRecipients to delete.
     */
    limit?: number
  }

  /**
   * WhatsAppRecipient.audience
   */
  export type WhatsAppRecipient$audienceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAudience
     */
    select?: WhatsAppAudienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAudience
     */
    omit?: WhatsAppAudienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAudienceInclude<ExtArgs> | null
    where?: WhatsAppAudienceWhereInput
  }

  /**
   * WhatsAppRecipient.whatsAppPhoneNumber
   */
  export type WhatsAppRecipient$whatsAppPhoneNumberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    where?: WhatsAppPhoneNumberWhereInput
  }

  /**
   * WhatsAppRecipient.messages
   */
  export type WhatsAppRecipient$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    where?: WhatsAppMessageWhereInput
    orderBy?: WhatsAppMessageOrderByWithRelationInput | WhatsAppMessageOrderByWithRelationInput[]
    cursor?: WhatsAppMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WhatsAppMessageScalarFieldEnum | WhatsAppMessageScalarFieldEnum[]
  }

  /**
   * WhatsAppRecipient without action
   */
  export type WhatsAppRecipientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppRecipient
     */
    select?: WhatsAppRecipientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppRecipient
     */
    omit?: WhatsAppRecipientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppRecipientInclude<ExtArgs> | null
  }


  /**
   * Model WhatsAppCampaign
   */

  export type AggregateWhatsAppCampaign = {
    _count: WhatsAppCampaignCountAggregateOutputType | null
    _min: WhatsAppCampaignMinAggregateOutputType | null
    _max: WhatsAppCampaignMaxAggregateOutputType | null
  }

  export type WhatsAppCampaignMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    message: string | null
    mediaUrl: string | null
    templateId: string | null
    accountId: string | null
    audienceId: string | null
    status: string | null
    scheduledAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppCampaignMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: string | null
    message: string | null
    mediaUrl: string | null
    templateId: string | null
    accountId: string | null
    audienceId: string | null
    status: string | null
    scheduledAt: Date | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppCampaignCountAggregateOutputType = {
    id: number
    name: number
    type: number
    message: number
    mediaUrl: number
    templateId: number
    templateParams: number
    accountId: number
    audienceId: number
    status: number
    scheduledAt: number
    completedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WhatsAppCampaignMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    message?: true
    mediaUrl?: true
    templateId?: true
    accountId?: true
    audienceId?: true
    status?: true
    scheduledAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppCampaignMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    message?: true
    mediaUrl?: true
    templateId?: true
    accountId?: true
    audienceId?: true
    status?: true
    scheduledAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppCampaignCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    message?: true
    mediaUrl?: true
    templateId?: true
    templateParams?: true
    accountId?: true
    audienceId?: true
    status?: true
    scheduledAt?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WhatsAppCampaignAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppCampaign to aggregate.
     */
    where?: WhatsAppCampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppCampaigns to fetch.
     */
    orderBy?: WhatsAppCampaignOrderByWithRelationInput | WhatsAppCampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WhatsAppCampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppCampaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppCampaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WhatsAppCampaigns
    **/
    _count?: true | WhatsAppCampaignCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WhatsAppCampaignMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WhatsAppCampaignMaxAggregateInputType
  }

  export type GetWhatsAppCampaignAggregateType<T extends WhatsAppCampaignAggregateArgs> = {
        [P in keyof T & keyof AggregateWhatsAppCampaign]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWhatsAppCampaign[P]>
      : GetScalarType<T[P], AggregateWhatsAppCampaign[P]>
  }




  export type WhatsAppCampaignGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppCampaignWhereInput
    orderBy?: WhatsAppCampaignOrderByWithAggregationInput | WhatsAppCampaignOrderByWithAggregationInput[]
    by: WhatsAppCampaignScalarFieldEnum[] | WhatsAppCampaignScalarFieldEnum
    having?: WhatsAppCampaignScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WhatsAppCampaignCountAggregateInputType | true
    _min?: WhatsAppCampaignMinAggregateInputType
    _max?: WhatsAppCampaignMaxAggregateInputType
  }

  export type WhatsAppCampaignGroupByOutputType = {
    id: string
    name: string
    type: string
    message: string | null
    mediaUrl: string | null
    templateId: string | null
    templateParams: JsonValue | null
    accountId: string
    audienceId: string
    status: string
    scheduledAt: Date | null
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: WhatsAppCampaignCountAggregateOutputType | null
    _min: WhatsAppCampaignMinAggregateOutputType | null
    _max: WhatsAppCampaignMaxAggregateOutputType | null
  }

  type GetWhatsAppCampaignGroupByPayload<T extends WhatsAppCampaignGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WhatsAppCampaignGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WhatsAppCampaignGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WhatsAppCampaignGroupByOutputType[P]>
            : GetScalarType<T[P], WhatsAppCampaignGroupByOutputType[P]>
        }
      >
    >


  export type WhatsAppCampaignSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    message?: boolean
    mediaUrl?: boolean
    templateId?: boolean
    templateParams?: boolean
    accountId?: boolean
    audienceId?: boolean
    status?: boolean
    scheduledAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    audience?: boolean | WhatsAppAudienceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppCampaign"]>

  export type WhatsAppCampaignSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    message?: boolean
    mediaUrl?: boolean
    templateId?: boolean
    templateParams?: boolean
    accountId?: boolean
    audienceId?: boolean
    status?: boolean
    scheduledAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    audience?: boolean | WhatsAppAudienceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppCampaign"]>

  export type WhatsAppCampaignSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    message?: boolean
    mediaUrl?: boolean
    templateId?: boolean
    templateParams?: boolean
    accountId?: boolean
    audienceId?: boolean
    status?: boolean
    scheduledAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    audience?: boolean | WhatsAppAudienceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppCampaign"]>

  export type WhatsAppCampaignSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    message?: boolean
    mediaUrl?: boolean
    templateId?: boolean
    templateParams?: boolean
    accountId?: boolean
    audienceId?: boolean
    status?: boolean
    scheduledAt?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WhatsAppCampaignOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "type" | "message" | "mediaUrl" | "templateId" | "templateParams" | "accountId" | "audienceId" | "status" | "scheduledAt" | "completedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["whatsAppCampaign"]>
  export type WhatsAppCampaignInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    audience?: boolean | WhatsAppAudienceDefaultArgs<ExtArgs>
  }
  export type WhatsAppCampaignIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    audience?: boolean | WhatsAppAudienceDefaultArgs<ExtArgs>
  }
  export type WhatsAppCampaignIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | WhatsAppAccountDefaultArgs<ExtArgs>
    audience?: boolean | WhatsAppAudienceDefaultArgs<ExtArgs>
  }

  export type $WhatsAppCampaignPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WhatsAppCampaign"
    objects: {
      account: Prisma.$WhatsAppAccountPayload<ExtArgs>
      audience: Prisma.$WhatsAppAudiencePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: string
      message: string | null
      mediaUrl: string | null
      templateId: string | null
      templateParams: Prisma.JsonValue | null
      accountId: string
      audienceId: string
      status: string
      scheduledAt: Date | null
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["whatsAppCampaign"]>
    composites: {}
  }

  type WhatsAppCampaignGetPayload<S extends boolean | null | undefined | WhatsAppCampaignDefaultArgs> = $Result.GetResult<Prisma.$WhatsAppCampaignPayload, S>

  type WhatsAppCampaignCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WhatsAppCampaignFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WhatsAppCampaignCountAggregateInputType | true
    }

  export interface WhatsAppCampaignDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WhatsAppCampaign'], meta: { name: 'WhatsAppCampaign' } }
    /**
     * Find zero or one WhatsAppCampaign that matches the filter.
     * @param {WhatsAppCampaignFindUniqueArgs} args - Arguments to find a WhatsAppCampaign
     * @example
     * // Get one WhatsAppCampaign
     * const whatsAppCampaign = await prisma.whatsAppCampaign.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WhatsAppCampaignFindUniqueArgs>(args: SelectSubset<T, WhatsAppCampaignFindUniqueArgs<ExtArgs>>): Prisma__WhatsAppCampaignClient<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WhatsAppCampaign that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WhatsAppCampaignFindUniqueOrThrowArgs} args - Arguments to find a WhatsAppCampaign
     * @example
     * // Get one WhatsAppCampaign
     * const whatsAppCampaign = await prisma.whatsAppCampaign.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WhatsAppCampaignFindUniqueOrThrowArgs>(args: SelectSubset<T, WhatsAppCampaignFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WhatsAppCampaignClient<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppCampaign that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppCampaignFindFirstArgs} args - Arguments to find a WhatsAppCampaign
     * @example
     * // Get one WhatsAppCampaign
     * const whatsAppCampaign = await prisma.whatsAppCampaign.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WhatsAppCampaignFindFirstArgs>(args?: SelectSubset<T, WhatsAppCampaignFindFirstArgs<ExtArgs>>): Prisma__WhatsAppCampaignClient<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppCampaign that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppCampaignFindFirstOrThrowArgs} args - Arguments to find a WhatsAppCampaign
     * @example
     * // Get one WhatsAppCampaign
     * const whatsAppCampaign = await prisma.whatsAppCampaign.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WhatsAppCampaignFindFirstOrThrowArgs>(args?: SelectSubset<T, WhatsAppCampaignFindFirstOrThrowArgs<ExtArgs>>): Prisma__WhatsAppCampaignClient<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WhatsAppCampaigns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppCampaignFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WhatsAppCampaigns
     * const whatsAppCampaigns = await prisma.whatsAppCampaign.findMany()
     * 
     * // Get first 10 WhatsAppCampaigns
     * const whatsAppCampaigns = await prisma.whatsAppCampaign.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const whatsAppCampaignWithIdOnly = await prisma.whatsAppCampaign.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WhatsAppCampaignFindManyArgs>(args?: SelectSubset<T, WhatsAppCampaignFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WhatsAppCampaign.
     * @param {WhatsAppCampaignCreateArgs} args - Arguments to create a WhatsAppCampaign.
     * @example
     * // Create one WhatsAppCampaign
     * const WhatsAppCampaign = await prisma.whatsAppCampaign.create({
     *   data: {
     *     // ... data to create a WhatsAppCampaign
     *   }
     * })
     * 
     */
    create<T extends WhatsAppCampaignCreateArgs>(args: SelectSubset<T, WhatsAppCampaignCreateArgs<ExtArgs>>): Prisma__WhatsAppCampaignClient<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WhatsAppCampaigns.
     * @param {WhatsAppCampaignCreateManyArgs} args - Arguments to create many WhatsAppCampaigns.
     * @example
     * // Create many WhatsAppCampaigns
     * const whatsAppCampaign = await prisma.whatsAppCampaign.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WhatsAppCampaignCreateManyArgs>(args?: SelectSubset<T, WhatsAppCampaignCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WhatsAppCampaigns and returns the data saved in the database.
     * @param {WhatsAppCampaignCreateManyAndReturnArgs} args - Arguments to create many WhatsAppCampaigns.
     * @example
     * // Create many WhatsAppCampaigns
     * const whatsAppCampaign = await prisma.whatsAppCampaign.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WhatsAppCampaigns and only return the `id`
     * const whatsAppCampaignWithIdOnly = await prisma.whatsAppCampaign.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WhatsAppCampaignCreateManyAndReturnArgs>(args?: SelectSubset<T, WhatsAppCampaignCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WhatsAppCampaign.
     * @param {WhatsAppCampaignDeleteArgs} args - Arguments to delete one WhatsAppCampaign.
     * @example
     * // Delete one WhatsAppCampaign
     * const WhatsAppCampaign = await prisma.whatsAppCampaign.delete({
     *   where: {
     *     // ... filter to delete one WhatsAppCampaign
     *   }
     * })
     * 
     */
    delete<T extends WhatsAppCampaignDeleteArgs>(args: SelectSubset<T, WhatsAppCampaignDeleteArgs<ExtArgs>>): Prisma__WhatsAppCampaignClient<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WhatsAppCampaign.
     * @param {WhatsAppCampaignUpdateArgs} args - Arguments to update one WhatsAppCampaign.
     * @example
     * // Update one WhatsAppCampaign
     * const whatsAppCampaign = await prisma.whatsAppCampaign.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WhatsAppCampaignUpdateArgs>(args: SelectSubset<T, WhatsAppCampaignUpdateArgs<ExtArgs>>): Prisma__WhatsAppCampaignClient<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WhatsAppCampaigns.
     * @param {WhatsAppCampaignDeleteManyArgs} args - Arguments to filter WhatsAppCampaigns to delete.
     * @example
     * // Delete a few WhatsAppCampaigns
     * const { count } = await prisma.whatsAppCampaign.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WhatsAppCampaignDeleteManyArgs>(args?: SelectSubset<T, WhatsAppCampaignDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppCampaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppCampaignUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WhatsAppCampaigns
     * const whatsAppCampaign = await prisma.whatsAppCampaign.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WhatsAppCampaignUpdateManyArgs>(args: SelectSubset<T, WhatsAppCampaignUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppCampaigns and returns the data updated in the database.
     * @param {WhatsAppCampaignUpdateManyAndReturnArgs} args - Arguments to update many WhatsAppCampaigns.
     * @example
     * // Update many WhatsAppCampaigns
     * const whatsAppCampaign = await prisma.whatsAppCampaign.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WhatsAppCampaigns and only return the `id`
     * const whatsAppCampaignWithIdOnly = await prisma.whatsAppCampaign.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WhatsAppCampaignUpdateManyAndReturnArgs>(args: SelectSubset<T, WhatsAppCampaignUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WhatsAppCampaign.
     * @param {WhatsAppCampaignUpsertArgs} args - Arguments to update or create a WhatsAppCampaign.
     * @example
     * // Update or create a WhatsAppCampaign
     * const whatsAppCampaign = await prisma.whatsAppCampaign.upsert({
     *   create: {
     *     // ... data to create a WhatsAppCampaign
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WhatsAppCampaign we want to update
     *   }
     * })
     */
    upsert<T extends WhatsAppCampaignUpsertArgs>(args: SelectSubset<T, WhatsAppCampaignUpsertArgs<ExtArgs>>): Prisma__WhatsAppCampaignClient<$Result.GetResult<Prisma.$WhatsAppCampaignPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WhatsAppCampaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppCampaignCountArgs} args - Arguments to filter WhatsAppCampaigns to count.
     * @example
     * // Count the number of WhatsAppCampaigns
     * const count = await prisma.whatsAppCampaign.count({
     *   where: {
     *     // ... the filter for the WhatsAppCampaigns we want to count
     *   }
     * })
    **/
    count<T extends WhatsAppCampaignCountArgs>(
      args?: Subset<T, WhatsAppCampaignCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WhatsAppCampaignCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WhatsAppCampaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppCampaignAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WhatsAppCampaignAggregateArgs>(args: Subset<T, WhatsAppCampaignAggregateArgs>): Prisma.PrismaPromise<GetWhatsAppCampaignAggregateType<T>>

    /**
     * Group by WhatsAppCampaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppCampaignGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WhatsAppCampaignGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WhatsAppCampaignGroupByArgs['orderBy'] }
        : { orderBy?: WhatsAppCampaignGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WhatsAppCampaignGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWhatsAppCampaignGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WhatsAppCampaign model
   */
  readonly fields: WhatsAppCampaignFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WhatsAppCampaign.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WhatsAppCampaignClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends WhatsAppAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppAccountDefaultArgs<ExtArgs>>): Prisma__WhatsAppAccountClient<$Result.GetResult<Prisma.$WhatsAppAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    audience<T extends WhatsAppAudienceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppAudienceDefaultArgs<ExtArgs>>): Prisma__WhatsAppAudienceClient<$Result.GetResult<Prisma.$WhatsAppAudiencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WhatsAppCampaign model
   */
  interface WhatsAppCampaignFieldRefs {
    readonly id: FieldRef<"WhatsAppCampaign", 'String'>
    readonly name: FieldRef<"WhatsAppCampaign", 'String'>
    readonly type: FieldRef<"WhatsAppCampaign", 'String'>
    readonly message: FieldRef<"WhatsAppCampaign", 'String'>
    readonly mediaUrl: FieldRef<"WhatsAppCampaign", 'String'>
    readonly templateId: FieldRef<"WhatsAppCampaign", 'String'>
    readonly templateParams: FieldRef<"WhatsAppCampaign", 'Json'>
    readonly accountId: FieldRef<"WhatsAppCampaign", 'String'>
    readonly audienceId: FieldRef<"WhatsAppCampaign", 'String'>
    readonly status: FieldRef<"WhatsAppCampaign", 'String'>
    readonly scheduledAt: FieldRef<"WhatsAppCampaign", 'DateTime'>
    readonly completedAt: FieldRef<"WhatsAppCampaign", 'DateTime'>
    readonly createdAt: FieldRef<"WhatsAppCampaign", 'DateTime'>
    readonly updatedAt: FieldRef<"WhatsAppCampaign", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WhatsAppCampaign findUnique
   */
  export type WhatsAppCampaignFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppCampaign to fetch.
     */
    where: WhatsAppCampaignWhereUniqueInput
  }

  /**
   * WhatsAppCampaign findUniqueOrThrow
   */
  export type WhatsAppCampaignFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppCampaign to fetch.
     */
    where: WhatsAppCampaignWhereUniqueInput
  }

  /**
   * WhatsAppCampaign findFirst
   */
  export type WhatsAppCampaignFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppCampaign to fetch.
     */
    where?: WhatsAppCampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppCampaigns to fetch.
     */
    orderBy?: WhatsAppCampaignOrderByWithRelationInput | WhatsAppCampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppCampaigns.
     */
    cursor?: WhatsAppCampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppCampaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppCampaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppCampaigns.
     */
    distinct?: WhatsAppCampaignScalarFieldEnum | WhatsAppCampaignScalarFieldEnum[]
  }

  /**
   * WhatsAppCampaign findFirstOrThrow
   */
  export type WhatsAppCampaignFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppCampaign to fetch.
     */
    where?: WhatsAppCampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppCampaigns to fetch.
     */
    orderBy?: WhatsAppCampaignOrderByWithRelationInput | WhatsAppCampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppCampaigns.
     */
    cursor?: WhatsAppCampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppCampaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppCampaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppCampaigns.
     */
    distinct?: WhatsAppCampaignScalarFieldEnum | WhatsAppCampaignScalarFieldEnum[]
  }

  /**
   * WhatsAppCampaign findMany
   */
  export type WhatsAppCampaignFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppCampaigns to fetch.
     */
    where?: WhatsAppCampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppCampaigns to fetch.
     */
    orderBy?: WhatsAppCampaignOrderByWithRelationInput | WhatsAppCampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WhatsAppCampaigns.
     */
    cursor?: WhatsAppCampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppCampaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppCampaigns.
     */
    skip?: number
    distinct?: WhatsAppCampaignScalarFieldEnum | WhatsAppCampaignScalarFieldEnum[]
  }

  /**
   * WhatsAppCampaign create
   */
  export type WhatsAppCampaignCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    /**
     * The data needed to create a WhatsAppCampaign.
     */
    data: XOR<WhatsAppCampaignCreateInput, WhatsAppCampaignUncheckedCreateInput>
  }

  /**
   * WhatsAppCampaign createMany
   */
  export type WhatsAppCampaignCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WhatsAppCampaigns.
     */
    data: WhatsAppCampaignCreateManyInput | WhatsAppCampaignCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WhatsAppCampaign createManyAndReturn
   */
  export type WhatsAppCampaignCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * The data used to create many WhatsAppCampaigns.
     */
    data: WhatsAppCampaignCreateManyInput | WhatsAppCampaignCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppCampaign update
   */
  export type WhatsAppCampaignUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    /**
     * The data needed to update a WhatsAppCampaign.
     */
    data: XOR<WhatsAppCampaignUpdateInput, WhatsAppCampaignUncheckedUpdateInput>
    /**
     * Choose, which WhatsAppCampaign to update.
     */
    where: WhatsAppCampaignWhereUniqueInput
  }

  /**
   * WhatsAppCampaign updateMany
   */
  export type WhatsAppCampaignUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WhatsAppCampaigns.
     */
    data: XOR<WhatsAppCampaignUpdateManyMutationInput, WhatsAppCampaignUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppCampaigns to update
     */
    where?: WhatsAppCampaignWhereInput
    /**
     * Limit how many WhatsAppCampaigns to update.
     */
    limit?: number
  }

  /**
   * WhatsAppCampaign updateManyAndReturn
   */
  export type WhatsAppCampaignUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * The data used to update WhatsAppCampaigns.
     */
    data: XOR<WhatsAppCampaignUpdateManyMutationInput, WhatsAppCampaignUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppCampaigns to update
     */
    where?: WhatsAppCampaignWhereInput
    /**
     * Limit how many WhatsAppCampaigns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppCampaign upsert
   */
  export type WhatsAppCampaignUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    /**
     * The filter to search for the WhatsAppCampaign to update in case it exists.
     */
    where: WhatsAppCampaignWhereUniqueInput
    /**
     * In case the WhatsAppCampaign found by the `where` argument doesn't exist, create a new WhatsAppCampaign with this data.
     */
    create: XOR<WhatsAppCampaignCreateInput, WhatsAppCampaignUncheckedCreateInput>
    /**
     * In case the WhatsAppCampaign was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WhatsAppCampaignUpdateInput, WhatsAppCampaignUncheckedUpdateInput>
  }

  /**
   * WhatsAppCampaign delete
   */
  export type WhatsAppCampaignDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
    /**
     * Filter which WhatsAppCampaign to delete.
     */
    where: WhatsAppCampaignWhereUniqueInput
  }

  /**
   * WhatsAppCampaign deleteMany
   */
  export type WhatsAppCampaignDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppCampaigns to delete
     */
    where?: WhatsAppCampaignWhereInput
    /**
     * Limit how many WhatsAppCampaigns to delete.
     */
    limit?: number
  }

  /**
   * WhatsAppCampaign without action
   */
  export type WhatsAppCampaignDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppCampaign
     */
    select?: WhatsAppCampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppCampaign
     */
    omit?: WhatsAppCampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppCampaignInclude<ExtArgs> | null
  }


  /**
   * Model WhatsAppMessage
   */

  export type AggregateWhatsAppMessage = {
    _count: WhatsAppMessageCountAggregateOutputType | null
    _min: WhatsAppMessageMinAggregateOutputType | null
    _max: WhatsAppMessageMaxAggregateOutputType | null
  }

  export type WhatsAppMessageMinAggregateOutputType = {
    id: string | null
    wamid: string | null
    status: string | null
    message: string | null
    isOutbound: boolean | null
    errorMessage: string | null
    phoneNumber: string | null
    sentAt: Date | null
    deliveredAt: Date | null
    readAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    whatsAppPhoneNumberId: string | null
    recipientId: string | null
  }

  export type WhatsAppMessageMaxAggregateOutputType = {
    id: string | null
    wamid: string | null
    status: string | null
    message: string | null
    isOutbound: boolean | null
    errorMessage: string | null
    phoneNumber: string | null
    sentAt: Date | null
    deliveredAt: Date | null
    readAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    whatsAppPhoneNumberId: string | null
    recipientId: string | null
  }

  export type WhatsAppMessageCountAggregateOutputType = {
    id: number
    wamid: number
    status: number
    message: number
    isOutbound: number
    errorMessage: number
    phoneNumber: number
    sentAt: number
    deliveredAt: number
    readAt: number
    createdAt: number
    updatedAt: number
    whatsAppPhoneNumberId: number
    recipientId: number
    _all: number
  }


  export type WhatsAppMessageMinAggregateInputType = {
    id?: true
    wamid?: true
    status?: true
    message?: true
    isOutbound?: true
    errorMessage?: true
    phoneNumber?: true
    sentAt?: true
    deliveredAt?: true
    readAt?: true
    createdAt?: true
    updatedAt?: true
    whatsAppPhoneNumberId?: true
    recipientId?: true
  }

  export type WhatsAppMessageMaxAggregateInputType = {
    id?: true
    wamid?: true
    status?: true
    message?: true
    isOutbound?: true
    errorMessage?: true
    phoneNumber?: true
    sentAt?: true
    deliveredAt?: true
    readAt?: true
    createdAt?: true
    updatedAt?: true
    whatsAppPhoneNumberId?: true
    recipientId?: true
  }

  export type WhatsAppMessageCountAggregateInputType = {
    id?: true
    wamid?: true
    status?: true
    message?: true
    isOutbound?: true
    errorMessage?: true
    phoneNumber?: true
    sentAt?: true
    deliveredAt?: true
    readAt?: true
    createdAt?: true
    updatedAt?: true
    whatsAppPhoneNumberId?: true
    recipientId?: true
    _all?: true
  }

  export type WhatsAppMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppMessage to aggregate.
     */
    where?: WhatsAppMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppMessages to fetch.
     */
    orderBy?: WhatsAppMessageOrderByWithRelationInput | WhatsAppMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WhatsAppMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WhatsAppMessages
    **/
    _count?: true | WhatsAppMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WhatsAppMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WhatsAppMessageMaxAggregateInputType
  }

  export type GetWhatsAppMessageAggregateType<T extends WhatsAppMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateWhatsAppMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWhatsAppMessage[P]>
      : GetScalarType<T[P], AggregateWhatsAppMessage[P]>
  }




  export type WhatsAppMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppMessageWhereInput
    orderBy?: WhatsAppMessageOrderByWithAggregationInput | WhatsAppMessageOrderByWithAggregationInput[]
    by: WhatsAppMessageScalarFieldEnum[] | WhatsAppMessageScalarFieldEnum
    having?: WhatsAppMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WhatsAppMessageCountAggregateInputType | true
    _min?: WhatsAppMessageMinAggregateInputType
    _max?: WhatsAppMessageMaxAggregateInputType
  }

  export type WhatsAppMessageGroupByOutputType = {
    id: string
    wamid: string | null
    status: string
    message: string | null
    isOutbound: boolean
    errorMessage: string | null
    phoneNumber: string | null
    sentAt: Date | null
    deliveredAt: Date | null
    readAt: Date | null
    createdAt: Date
    updatedAt: Date
    whatsAppPhoneNumberId: string | null
    recipientId: string
    _count: WhatsAppMessageCountAggregateOutputType | null
    _min: WhatsAppMessageMinAggregateOutputType | null
    _max: WhatsAppMessageMaxAggregateOutputType | null
  }

  type GetWhatsAppMessageGroupByPayload<T extends WhatsAppMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WhatsAppMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WhatsAppMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WhatsAppMessageGroupByOutputType[P]>
            : GetScalarType<T[P], WhatsAppMessageGroupByOutputType[P]>
        }
      >
    >


  export type WhatsAppMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wamid?: boolean
    status?: boolean
    message?: boolean
    isOutbound?: boolean
    errorMessage?: boolean
    phoneNumber?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    readAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    whatsAppPhoneNumberId?: boolean
    recipientId?: boolean
    whatsAppPhoneNumber?: boolean | WhatsAppMessage$whatsAppPhoneNumberArgs<ExtArgs>
    recipient?: boolean | WhatsAppRecipientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppMessage"]>

  export type WhatsAppMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wamid?: boolean
    status?: boolean
    message?: boolean
    isOutbound?: boolean
    errorMessage?: boolean
    phoneNumber?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    readAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    whatsAppPhoneNumberId?: boolean
    recipientId?: boolean
    whatsAppPhoneNumber?: boolean | WhatsAppMessage$whatsAppPhoneNumberArgs<ExtArgs>
    recipient?: boolean | WhatsAppRecipientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppMessage"]>

  export type WhatsAppMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    wamid?: boolean
    status?: boolean
    message?: boolean
    isOutbound?: boolean
    errorMessage?: boolean
    phoneNumber?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    readAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    whatsAppPhoneNumberId?: boolean
    recipientId?: boolean
    whatsAppPhoneNumber?: boolean | WhatsAppMessage$whatsAppPhoneNumberArgs<ExtArgs>
    recipient?: boolean | WhatsAppRecipientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppMessage"]>

  export type WhatsAppMessageSelectScalar = {
    id?: boolean
    wamid?: boolean
    status?: boolean
    message?: boolean
    isOutbound?: boolean
    errorMessage?: boolean
    phoneNumber?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    readAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    whatsAppPhoneNumberId?: boolean
    recipientId?: boolean
  }

  export type WhatsAppMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "wamid" | "status" | "message" | "isOutbound" | "errorMessage" | "phoneNumber" | "sentAt" | "deliveredAt" | "readAt" | "createdAt" | "updatedAt" | "whatsAppPhoneNumberId" | "recipientId", ExtArgs["result"]["whatsAppMessage"]>
  export type WhatsAppMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    whatsAppPhoneNumber?: boolean | WhatsAppMessage$whatsAppPhoneNumberArgs<ExtArgs>
    recipient?: boolean | WhatsAppRecipientDefaultArgs<ExtArgs>
  }
  export type WhatsAppMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    whatsAppPhoneNumber?: boolean | WhatsAppMessage$whatsAppPhoneNumberArgs<ExtArgs>
    recipient?: boolean | WhatsAppRecipientDefaultArgs<ExtArgs>
  }
  export type WhatsAppMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    whatsAppPhoneNumber?: boolean | WhatsAppMessage$whatsAppPhoneNumberArgs<ExtArgs>
    recipient?: boolean | WhatsAppRecipientDefaultArgs<ExtArgs>
  }

  export type $WhatsAppMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WhatsAppMessage"
    objects: {
      whatsAppPhoneNumber: Prisma.$WhatsAppPhoneNumberPayload<ExtArgs> | null
      recipient: Prisma.$WhatsAppRecipientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      wamid: string | null
      status: string
      message: string | null
      isOutbound: boolean
      errorMessage: string | null
      phoneNumber: string | null
      sentAt: Date | null
      deliveredAt: Date | null
      readAt: Date | null
      createdAt: Date
      updatedAt: Date
      whatsAppPhoneNumberId: string | null
      recipientId: string
    }, ExtArgs["result"]["whatsAppMessage"]>
    composites: {}
  }

  type WhatsAppMessageGetPayload<S extends boolean | null | undefined | WhatsAppMessageDefaultArgs> = $Result.GetResult<Prisma.$WhatsAppMessagePayload, S>

  type WhatsAppMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WhatsAppMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WhatsAppMessageCountAggregateInputType | true
    }

  export interface WhatsAppMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WhatsAppMessage'], meta: { name: 'WhatsAppMessage' } }
    /**
     * Find zero or one WhatsAppMessage that matches the filter.
     * @param {WhatsAppMessageFindUniqueArgs} args - Arguments to find a WhatsAppMessage
     * @example
     * // Get one WhatsAppMessage
     * const whatsAppMessage = await prisma.whatsAppMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WhatsAppMessageFindUniqueArgs>(args: SelectSubset<T, WhatsAppMessageFindUniqueArgs<ExtArgs>>): Prisma__WhatsAppMessageClient<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WhatsAppMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WhatsAppMessageFindUniqueOrThrowArgs} args - Arguments to find a WhatsAppMessage
     * @example
     * // Get one WhatsAppMessage
     * const whatsAppMessage = await prisma.whatsAppMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WhatsAppMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, WhatsAppMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WhatsAppMessageClient<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppMessageFindFirstArgs} args - Arguments to find a WhatsAppMessage
     * @example
     * // Get one WhatsAppMessage
     * const whatsAppMessage = await prisma.whatsAppMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WhatsAppMessageFindFirstArgs>(args?: SelectSubset<T, WhatsAppMessageFindFirstArgs<ExtArgs>>): Prisma__WhatsAppMessageClient<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppMessageFindFirstOrThrowArgs} args - Arguments to find a WhatsAppMessage
     * @example
     * // Get one WhatsAppMessage
     * const whatsAppMessage = await prisma.whatsAppMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WhatsAppMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, WhatsAppMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__WhatsAppMessageClient<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WhatsAppMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WhatsAppMessages
     * const whatsAppMessages = await prisma.whatsAppMessage.findMany()
     * 
     * // Get first 10 WhatsAppMessages
     * const whatsAppMessages = await prisma.whatsAppMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const whatsAppMessageWithIdOnly = await prisma.whatsAppMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WhatsAppMessageFindManyArgs>(args?: SelectSubset<T, WhatsAppMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WhatsAppMessage.
     * @param {WhatsAppMessageCreateArgs} args - Arguments to create a WhatsAppMessage.
     * @example
     * // Create one WhatsAppMessage
     * const WhatsAppMessage = await prisma.whatsAppMessage.create({
     *   data: {
     *     // ... data to create a WhatsAppMessage
     *   }
     * })
     * 
     */
    create<T extends WhatsAppMessageCreateArgs>(args: SelectSubset<T, WhatsAppMessageCreateArgs<ExtArgs>>): Prisma__WhatsAppMessageClient<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WhatsAppMessages.
     * @param {WhatsAppMessageCreateManyArgs} args - Arguments to create many WhatsAppMessages.
     * @example
     * // Create many WhatsAppMessages
     * const whatsAppMessage = await prisma.whatsAppMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WhatsAppMessageCreateManyArgs>(args?: SelectSubset<T, WhatsAppMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WhatsAppMessages and returns the data saved in the database.
     * @param {WhatsAppMessageCreateManyAndReturnArgs} args - Arguments to create many WhatsAppMessages.
     * @example
     * // Create many WhatsAppMessages
     * const whatsAppMessage = await prisma.whatsAppMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WhatsAppMessages and only return the `id`
     * const whatsAppMessageWithIdOnly = await prisma.whatsAppMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WhatsAppMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, WhatsAppMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WhatsAppMessage.
     * @param {WhatsAppMessageDeleteArgs} args - Arguments to delete one WhatsAppMessage.
     * @example
     * // Delete one WhatsAppMessage
     * const WhatsAppMessage = await prisma.whatsAppMessage.delete({
     *   where: {
     *     // ... filter to delete one WhatsAppMessage
     *   }
     * })
     * 
     */
    delete<T extends WhatsAppMessageDeleteArgs>(args: SelectSubset<T, WhatsAppMessageDeleteArgs<ExtArgs>>): Prisma__WhatsAppMessageClient<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WhatsAppMessage.
     * @param {WhatsAppMessageUpdateArgs} args - Arguments to update one WhatsAppMessage.
     * @example
     * // Update one WhatsAppMessage
     * const whatsAppMessage = await prisma.whatsAppMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WhatsAppMessageUpdateArgs>(args: SelectSubset<T, WhatsAppMessageUpdateArgs<ExtArgs>>): Prisma__WhatsAppMessageClient<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WhatsAppMessages.
     * @param {WhatsAppMessageDeleteManyArgs} args - Arguments to filter WhatsAppMessages to delete.
     * @example
     * // Delete a few WhatsAppMessages
     * const { count } = await prisma.whatsAppMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WhatsAppMessageDeleteManyArgs>(args?: SelectSubset<T, WhatsAppMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WhatsAppMessages
     * const whatsAppMessage = await prisma.whatsAppMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WhatsAppMessageUpdateManyArgs>(args: SelectSubset<T, WhatsAppMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppMessages and returns the data updated in the database.
     * @param {WhatsAppMessageUpdateManyAndReturnArgs} args - Arguments to update many WhatsAppMessages.
     * @example
     * // Update many WhatsAppMessages
     * const whatsAppMessage = await prisma.whatsAppMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WhatsAppMessages and only return the `id`
     * const whatsAppMessageWithIdOnly = await prisma.whatsAppMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WhatsAppMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, WhatsAppMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WhatsAppMessage.
     * @param {WhatsAppMessageUpsertArgs} args - Arguments to update or create a WhatsAppMessage.
     * @example
     * // Update or create a WhatsAppMessage
     * const whatsAppMessage = await prisma.whatsAppMessage.upsert({
     *   create: {
     *     // ... data to create a WhatsAppMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WhatsAppMessage we want to update
     *   }
     * })
     */
    upsert<T extends WhatsAppMessageUpsertArgs>(args: SelectSubset<T, WhatsAppMessageUpsertArgs<ExtArgs>>): Prisma__WhatsAppMessageClient<$Result.GetResult<Prisma.$WhatsAppMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WhatsAppMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppMessageCountArgs} args - Arguments to filter WhatsAppMessages to count.
     * @example
     * // Count the number of WhatsAppMessages
     * const count = await prisma.whatsAppMessage.count({
     *   where: {
     *     // ... the filter for the WhatsAppMessages we want to count
     *   }
     * })
    **/
    count<T extends WhatsAppMessageCountArgs>(
      args?: Subset<T, WhatsAppMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WhatsAppMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WhatsAppMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WhatsAppMessageAggregateArgs>(args: Subset<T, WhatsAppMessageAggregateArgs>): Prisma.PrismaPromise<GetWhatsAppMessageAggregateType<T>>

    /**
     * Group by WhatsAppMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WhatsAppMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WhatsAppMessageGroupByArgs['orderBy'] }
        : { orderBy?: WhatsAppMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WhatsAppMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWhatsAppMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WhatsAppMessage model
   */
  readonly fields: WhatsAppMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WhatsAppMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WhatsAppMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    whatsAppPhoneNumber<T extends WhatsAppMessage$whatsAppPhoneNumberArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppMessage$whatsAppPhoneNumberArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    recipient<T extends WhatsAppRecipientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppRecipientDefaultArgs<ExtArgs>>): Prisma__WhatsAppRecipientClient<$Result.GetResult<Prisma.$WhatsAppRecipientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WhatsAppMessage model
   */
  interface WhatsAppMessageFieldRefs {
    readonly id: FieldRef<"WhatsAppMessage", 'String'>
    readonly wamid: FieldRef<"WhatsAppMessage", 'String'>
    readonly status: FieldRef<"WhatsAppMessage", 'String'>
    readonly message: FieldRef<"WhatsAppMessage", 'String'>
    readonly isOutbound: FieldRef<"WhatsAppMessage", 'Boolean'>
    readonly errorMessage: FieldRef<"WhatsAppMessage", 'String'>
    readonly phoneNumber: FieldRef<"WhatsAppMessage", 'String'>
    readonly sentAt: FieldRef<"WhatsAppMessage", 'DateTime'>
    readonly deliveredAt: FieldRef<"WhatsAppMessage", 'DateTime'>
    readonly readAt: FieldRef<"WhatsAppMessage", 'DateTime'>
    readonly createdAt: FieldRef<"WhatsAppMessage", 'DateTime'>
    readonly updatedAt: FieldRef<"WhatsAppMessage", 'DateTime'>
    readonly whatsAppPhoneNumberId: FieldRef<"WhatsAppMessage", 'String'>
    readonly recipientId: FieldRef<"WhatsAppMessage", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WhatsAppMessage findUnique
   */
  export type WhatsAppMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppMessage to fetch.
     */
    where: WhatsAppMessageWhereUniqueInput
  }

  /**
   * WhatsAppMessage findUniqueOrThrow
   */
  export type WhatsAppMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppMessage to fetch.
     */
    where: WhatsAppMessageWhereUniqueInput
  }

  /**
   * WhatsAppMessage findFirst
   */
  export type WhatsAppMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppMessage to fetch.
     */
    where?: WhatsAppMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppMessages to fetch.
     */
    orderBy?: WhatsAppMessageOrderByWithRelationInput | WhatsAppMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppMessages.
     */
    cursor?: WhatsAppMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppMessages.
     */
    distinct?: WhatsAppMessageScalarFieldEnum | WhatsAppMessageScalarFieldEnum[]
  }

  /**
   * WhatsAppMessage findFirstOrThrow
   */
  export type WhatsAppMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppMessage to fetch.
     */
    where?: WhatsAppMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppMessages to fetch.
     */
    orderBy?: WhatsAppMessageOrderByWithRelationInput | WhatsAppMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppMessages.
     */
    cursor?: WhatsAppMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppMessages.
     */
    distinct?: WhatsAppMessageScalarFieldEnum | WhatsAppMessageScalarFieldEnum[]
  }

  /**
   * WhatsAppMessage findMany
   */
  export type WhatsAppMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppMessages to fetch.
     */
    where?: WhatsAppMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppMessages to fetch.
     */
    orderBy?: WhatsAppMessageOrderByWithRelationInput | WhatsAppMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WhatsAppMessages.
     */
    cursor?: WhatsAppMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppMessages.
     */
    skip?: number
    distinct?: WhatsAppMessageScalarFieldEnum | WhatsAppMessageScalarFieldEnum[]
  }

  /**
   * WhatsAppMessage create
   */
  export type WhatsAppMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a WhatsAppMessage.
     */
    data: XOR<WhatsAppMessageCreateInput, WhatsAppMessageUncheckedCreateInput>
  }

  /**
   * WhatsAppMessage createMany
   */
  export type WhatsAppMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WhatsAppMessages.
     */
    data: WhatsAppMessageCreateManyInput | WhatsAppMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WhatsAppMessage createManyAndReturn
   */
  export type WhatsAppMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * The data used to create many WhatsAppMessages.
     */
    data: WhatsAppMessageCreateManyInput | WhatsAppMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppMessage update
   */
  export type WhatsAppMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a WhatsAppMessage.
     */
    data: XOR<WhatsAppMessageUpdateInput, WhatsAppMessageUncheckedUpdateInput>
    /**
     * Choose, which WhatsAppMessage to update.
     */
    where: WhatsAppMessageWhereUniqueInput
  }

  /**
   * WhatsAppMessage updateMany
   */
  export type WhatsAppMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WhatsAppMessages.
     */
    data: XOR<WhatsAppMessageUpdateManyMutationInput, WhatsAppMessageUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppMessages to update
     */
    where?: WhatsAppMessageWhereInput
    /**
     * Limit how many WhatsAppMessages to update.
     */
    limit?: number
  }

  /**
   * WhatsAppMessage updateManyAndReturn
   */
  export type WhatsAppMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * The data used to update WhatsAppMessages.
     */
    data: XOR<WhatsAppMessageUpdateManyMutationInput, WhatsAppMessageUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppMessages to update
     */
    where?: WhatsAppMessageWhereInput
    /**
     * Limit how many WhatsAppMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppMessage upsert
   */
  export type WhatsAppMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the WhatsAppMessage to update in case it exists.
     */
    where: WhatsAppMessageWhereUniqueInput
    /**
     * In case the WhatsAppMessage found by the `where` argument doesn't exist, create a new WhatsAppMessage with this data.
     */
    create: XOR<WhatsAppMessageCreateInput, WhatsAppMessageUncheckedCreateInput>
    /**
     * In case the WhatsAppMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WhatsAppMessageUpdateInput, WhatsAppMessageUncheckedUpdateInput>
  }

  /**
   * WhatsAppMessage delete
   */
  export type WhatsAppMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
    /**
     * Filter which WhatsAppMessage to delete.
     */
    where: WhatsAppMessageWhereUniqueInput
  }

  /**
   * WhatsAppMessage deleteMany
   */
  export type WhatsAppMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppMessages to delete
     */
    where?: WhatsAppMessageWhereInput
    /**
     * Limit how many WhatsAppMessages to delete.
     */
    limit?: number
  }

  /**
   * WhatsAppMessage.whatsAppPhoneNumber
   */
  export type WhatsAppMessage$whatsAppPhoneNumberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppPhoneNumber
     */
    select?: WhatsAppPhoneNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppPhoneNumber
     */
    omit?: WhatsAppPhoneNumberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppPhoneNumberInclude<ExtArgs> | null
    where?: WhatsAppPhoneNumberWhereInput
  }

  /**
   * WhatsAppMessage without action
   */
  export type WhatsAppMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppMessage
     */
    select?: WhatsAppMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppMessage
     */
    omit?: WhatsAppMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppMessageInclude<ExtArgs> | null
  }


  /**
   * Model MetaAdAccount
   */

  export type AggregateMetaAdAccount = {
    _count: MetaAdAccountCountAggregateOutputType | null
    _min: MetaAdAccountMinAggregateOutputType | null
    _max: MetaAdAccountMaxAggregateOutputType | null
  }

  export type MetaAdAccountMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    accessToken: string | null
    pageId: string | null
    status: $Enums.ActivityStatus | null
    agentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MetaAdAccountMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    accessToken: string | null
    pageId: string | null
    status: $Enums.ActivityStatus | null
    agentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MetaAdAccountCountAggregateOutputType = {
    id: number
    name: number
    email: number
    accessToken: number
    pageId: number
    status: number
    agentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MetaAdAccountMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    accessToken?: true
    pageId?: true
    status?: true
    agentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MetaAdAccountMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    accessToken?: true
    pageId?: true
    status?: true
    agentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MetaAdAccountCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    accessToken?: true
    pageId?: true
    status?: true
    agentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MetaAdAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetaAdAccount to aggregate.
     */
    where?: MetaAdAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetaAdAccounts to fetch.
     */
    orderBy?: MetaAdAccountOrderByWithRelationInput | MetaAdAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MetaAdAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetaAdAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetaAdAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MetaAdAccounts
    **/
    _count?: true | MetaAdAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MetaAdAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MetaAdAccountMaxAggregateInputType
  }

  export type GetMetaAdAccountAggregateType<T extends MetaAdAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateMetaAdAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMetaAdAccount[P]>
      : GetScalarType<T[P], AggregateMetaAdAccount[P]>
  }




  export type MetaAdAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MetaAdAccountWhereInput
    orderBy?: MetaAdAccountOrderByWithAggregationInput | MetaAdAccountOrderByWithAggregationInput[]
    by: MetaAdAccountScalarFieldEnum[] | MetaAdAccountScalarFieldEnum
    having?: MetaAdAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MetaAdAccountCountAggregateInputType | true
    _min?: MetaAdAccountMinAggregateInputType
    _max?: MetaAdAccountMaxAggregateInputType
  }

  export type MetaAdAccountGroupByOutputType = {
    id: string
    name: string | null
    email: string | null
    accessToken: string
    pageId: string | null
    status: $Enums.ActivityStatus | null
    agentId: string
    createdAt: Date
    updatedAt: Date
    _count: MetaAdAccountCountAggregateOutputType | null
    _min: MetaAdAccountMinAggregateOutputType | null
    _max: MetaAdAccountMaxAggregateOutputType | null
  }

  type GetMetaAdAccountGroupByPayload<T extends MetaAdAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MetaAdAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MetaAdAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MetaAdAccountGroupByOutputType[P]>
            : GetScalarType<T[P], MetaAdAccountGroupByOutputType[P]>
        }
      >
    >


  export type MetaAdAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    accessToken?: boolean
    pageId?: boolean
    status?: boolean
    agentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["metaAdAccount"]>

  export type MetaAdAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    accessToken?: boolean
    pageId?: boolean
    status?: boolean
    agentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["metaAdAccount"]>

  export type MetaAdAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    accessToken?: boolean
    pageId?: boolean
    status?: boolean
    agentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["metaAdAccount"]>

  export type MetaAdAccountSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    accessToken?: boolean
    pageId?: boolean
    status?: boolean
    agentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MetaAdAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "accessToken" | "pageId" | "status" | "agentId" | "createdAt" | "updatedAt", ExtArgs["result"]["metaAdAccount"]>
  export type MetaAdAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MetaAdAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MetaAdAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agent?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MetaAdAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MetaAdAccount"
    objects: {
      agent: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      accessToken: string
      pageId: string | null
      status: $Enums.ActivityStatus | null
      agentId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["metaAdAccount"]>
    composites: {}
  }

  type MetaAdAccountGetPayload<S extends boolean | null | undefined | MetaAdAccountDefaultArgs> = $Result.GetResult<Prisma.$MetaAdAccountPayload, S>

  type MetaAdAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MetaAdAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MetaAdAccountCountAggregateInputType | true
    }

  export interface MetaAdAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MetaAdAccount'], meta: { name: 'MetaAdAccount' } }
    /**
     * Find zero or one MetaAdAccount that matches the filter.
     * @param {MetaAdAccountFindUniqueArgs} args - Arguments to find a MetaAdAccount
     * @example
     * // Get one MetaAdAccount
     * const metaAdAccount = await prisma.metaAdAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MetaAdAccountFindUniqueArgs>(args: SelectSubset<T, MetaAdAccountFindUniqueArgs<ExtArgs>>): Prisma__MetaAdAccountClient<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MetaAdAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MetaAdAccountFindUniqueOrThrowArgs} args - Arguments to find a MetaAdAccount
     * @example
     * // Get one MetaAdAccount
     * const metaAdAccount = await prisma.metaAdAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MetaAdAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, MetaAdAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MetaAdAccountClient<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetaAdAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaAdAccountFindFirstArgs} args - Arguments to find a MetaAdAccount
     * @example
     * // Get one MetaAdAccount
     * const metaAdAccount = await prisma.metaAdAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MetaAdAccountFindFirstArgs>(args?: SelectSubset<T, MetaAdAccountFindFirstArgs<ExtArgs>>): Prisma__MetaAdAccountClient<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MetaAdAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaAdAccountFindFirstOrThrowArgs} args - Arguments to find a MetaAdAccount
     * @example
     * // Get one MetaAdAccount
     * const metaAdAccount = await prisma.metaAdAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MetaAdAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, MetaAdAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__MetaAdAccountClient<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MetaAdAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaAdAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MetaAdAccounts
     * const metaAdAccounts = await prisma.metaAdAccount.findMany()
     * 
     * // Get first 10 MetaAdAccounts
     * const metaAdAccounts = await prisma.metaAdAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const metaAdAccountWithIdOnly = await prisma.metaAdAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MetaAdAccountFindManyArgs>(args?: SelectSubset<T, MetaAdAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MetaAdAccount.
     * @param {MetaAdAccountCreateArgs} args - Arguments to create a MetaAdAccount.
     * @example
     * // Create one MetaAdAccount
     * const MetaAdAccount = await prisma.metaAdAccount.create({
     *   data: {
     *     // ... data to create a MetaAdAccount
     *   }
     * })
     * 
     */
    create<T extends MetaAdAccountCreateArgs>(args: SelectSubset<T, MetaAdAccountCreateArgs<ExtArgs>>): Prisma__MetaAdAccountClient<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MetaAdAccounts.
     * @param {MetaAdAccountCreateManyArgs} args - Arguments to create many MetaAdAccounts.
     * @example
     * // Create many MetaAdAccounts
     * const metaAdAccount = await prisma.metaAdAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MetaAdAccountCreateManyArgs>(args?: SelectSubset<T, MetaAdAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MetaAdAccounts and returns the data saved in the database.
     * @param {MetaAdAccountCreateManyAndReturnArgs} args - Arguments to create many MetaAdAccounts.
     * @example
     * // Create many MetaAdAccounts
     * const metaAdAccount = await prisma.metaAdAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MetaAdAccounts and only return the `id`
     * const metaAdAccountWithIdOnly = await prisma.metaAdAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MetaAdAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, MetaAdAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MetaAdAccount.
     * @param {MetaAdAccountDeleteArgs} args - Arguments to delete one MetaAdAccount.
     * @example
     * // Delete one MetaAdAccount
     * const MetaAdAccount = await prisma.metaAdAccount.delete({
     *   where: {
     *     // ... filter to delete one MetaAdAccount
     *   }
     * })
     * 
     */
    delete<T extends MetaAdAccountDeleteArgs>(args: SelectSubset<T, MetaAdAccountDeleteArgs<ExtArgs>>): Prisma__MetaAdAccountClient<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MetaAdAccount.
     * @param {MetaAdAccountUpdateArgs} args - Arguments to update one MetaAdAccount.
     * @example
     * // Update one MetaAdAccount
     * const metaAdAccount = await prisma.metaAdAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MetaAdAccountUpdateArgs>(args: SelectSubset<T, MetaAdAccountUpdateArgs<ExtArgs>>): Prisma__MetaAdAccountClient<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MetaAdAccounts.
     * @param {MetaAdAccountDeleteManyArgs} args - Arguments to filter MetaAdAccounts to delete.
     * @example
     * // Delete a few MetaAdAccounts
     * const { count } = await prisma.metaAdAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MetaAdAccountDeleteManyArgs>(args?: SelectSubset<T, MetaAdAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MetaAdAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaAdAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MetaAdAccounts
     * const metaAdAccount = await prisma.metaAdAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MetaAdAccountUpdateManyArgs>(args: SelectSubset<T, MetaAdAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MetaAdAccounts and returns the data updated in the database.
     * @param {MetaAdAccountUpdateManyAndReturnArgs} args - Arguments to update many MetaAdAccounts.
     * @example
     * // Update many MetaAdAccounts
     * const metaAdAccount = await prisma.metaAdAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MetaAdAccounts and only return the `id`
     * const metaAdAccountWithIdOnly = await prisma.metaAdAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MetaAdAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, MetaAdAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MetaAdAccount.
     * @param {MetaAdAccountUpsertArgs} args - Arguments to update or create a MetaAdAccount.
     * @example
     * // Update or create a MetaAdAccount
     * const metaAdAccount = await prisma.metaAdAccount.upsert({
     *   create: {
     *     // ... data to create a MetaAdAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MetaAdAccount we want to update
     *   }
     * })
     */
    upsert<T extends MetaAdAccountUpsertArgs>(args: SelectSubset<T, MetaAdAccountUpsertArgs<ExtArgs>>): Prisma__MetaAdAccountClient<$Result.GetResult<Prisma.$MetaAdAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MetaAdAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaAdAccountCountArgs} args - Arguments to filter MetaAdAccounts to count.
     * @example
     * // Count the number of MetaAdAccounts
     * const count = await prisma.metaAdAccount.count({
     *   where: {
     *     // ... the filter for the MetaAdAccounts we want to count
     *   }
     * })
    **/
    count<T extends MetaAdAccountCountArgs>(
      args?: Subset<T, MetaAdAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MetaAdAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MetaAdAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaAdAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MetaAdAccountAggregateArgs>(args: Subset<T, MetaAdAccountAggregateArgs>): Prisma.PrismaPromise<GetMetaAdAccountAggregateType<T>>

    /**
     * Group by MetaAdAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MetaAdAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MetaAdAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MetaAdAccountGroupByArgs['orderBy'] }
        : { orderBy?: MetaAdAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MetaAdAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMetaAdAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MetaAdAccount model
   */
  readonly fields: MetaAdAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MetaAdAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MetaAdAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agent<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MetaAdAccount model
   */
  interface MetaAdAccountFieldRefs {
    readonly id: FieldRef<"MetaAdAccount", 'String'>
    readonly name: FieldRef<"MetaAdAccount", 'String'>
    readonly email: FieldRef<"MetaAdAccount", 'String'>
    readonly accessToken: FieldRef<"MetaAdAccount", 'String'>
    readonly pageId: FieldRef<"MetaAdAccount", 'String'>
    readonly status: FieldRef<"MetaAdAccount", 'ActivityStatus'>
    readonly agentId: FieldRef<"MetaAdAccount", 'String'>
    readonly createdAt: FieldRef<"MetaAdAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"MetaAdAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MetaAdAccount findUnique
   */
  export type MetaAdAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    /**
     * Filter, which MetaAdAccount to fetch.
     */
    where: MetaAdAccountWhereUniqueInput
  }

  /**
   * MetaAdAccount findUniqueOrThrow
   */
  export type MetaAdAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    /**
     * Filter, which MetaAdAccount to fetch.
     */
    where: MetaAdAccountWhereUniqueInput
  }

  /**
   * MetaAdAccount findFirst
   */
  export type MetaAdAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    /**
     * Filter, which MetaAdAccount to fetch.
     */
    where?: MetaAdAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetaAdAccounts to fetch.
     */
    orderBy?: MetaAdAccountOrderByWithRelationInput | MetaAdAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetaAdAccounts.
     */
    cursor?: MetaAdAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetaAdAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetaAdAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetaAdAccounts.
     */
    distinct?: MetaAdAccountScalarFieldEnum | MetaAdAccountScalarFieldEnum[]
  }

  /**
   * MetaAdAccount findFirstOrThrow
   */
  export type MetaAdAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    /**
     * Filter, which MetaAdAccount to fetch.
     */
    where?: MetaAdAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetaAdAccounts to fetch.
     */
    orderBy?: MetaAdAccountOrderByWithRelationInput | MetaAdAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MetaAdAccounts.
     */
    cursor?: MetaAdAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetaAdAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetaAdAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MetaAdAccounts.
     */
    distinct?: MetaAdAccountScalarFieldEnum | MetaAdAccountScalarFieldEnum[]
  }

  /**
   * MetaAdAccount findMany
   */
  export type MetaAdAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    /**
     * Filter, which MetaAdAccounts to fetch.
     */
    where?: MetaAdAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MetaAdAccounts to fetch.
     */
    orderBy?: MetaAdAccountOrderByWithRelationInput | MetaAdAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MetaAdAccounts.
     */
    cursor?: MetaAdAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MetaAdAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MetaAdAccounts.
     */
    skip?: number
    distinct?: MetaAdAccountScalarFieldEnum | MetaAdAccountScalarFieldEnum[]
  }

  /**
   * MetaAdAccount create
   */
  export type MetaAdAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a MetaAdAccount.
     */
    data: XOR<MetaAdAccountCreateInput, MetaAdAccountUncheckedCreateInput>
  }

  /**
   * MetaAdAccount createMany
   */
  export type MetaAdAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MetaAdAccounts.
     */
    data: MetaAdAccountCreateManyInput | MetaAdAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MetaAdAccount createManyAndReturn
   */
  export type MetaAdAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * The data used to create many MetaAdAccounts.
     */
    data: MetaAdAccountCreateManyInput | MetaAdAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MetaAdAccount update
   */
  export type MetaAdAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a MetaAdAccount.
     */
    data: XOR<MetaAdAccountUpdateInput, MetaAdAccountUncheckedUpdateInput>
    /**
     * Choose, which MetaAdAccount to update.
     */
    where: MetaAdAccountWhereUniqueInput
  }

  /**
   * MetaAdAccount updateMany
   */
  export type MetaAdAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MetaAdAccounts.
     */
    data: XOR<MetaAdAccountUpdateManyMutationInput, MetaAdAccountUncheckedUpdateManyInput>
    /**
     * Filter which MetaAdAccounts to update
     */
    where?: MetaAdAccountWhereInput
    /**
     * Limit how many MetaAdAccounts to update.
     */
    limit?: number
  }

  /**
   * MetaAdAccount updateManyAndReturn
   */
  export type MetaAdAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * The data used to update MetaAdAccounts.
     */
    data: XOR<MetaAdAccountUpdateManyMutationInput, MetaAdAccountUncheckedUpdateManyInput>
    /**
     * Filter which MetaAdAccounts to update
     */
    where?: MetaAdAccountWhereInput
    /**
     * Limit how many MetaAdAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MetaAdAccount upsert
   */
  export type MetaAdAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the MetaAdAccount to update in case it exists.
     */
    where: MetaAdAccountWhereUniqueInput
    /**
     * In case the MetaAdAccount found by the `where` argument doesn't exist, create a new MetaAdAccount with this data.
     */
    create: XOR<MetaAdAccountCreateInput, MetaAdAccountUncheckedCreateInput>
    /**
     * In case the MetaAdAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MetaAdAccountUpdateInput, MetaAdAccountUncheckedUpdateInput>
  }

  /**
   * MetaAdAccount delete
   */
  export type MetaAdAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
    /**
     * Filter which MetaAdAccount to delete.
     */
    where: MetaAdAccountWhereUniqueInput
  }

  /**
   * MetaAdAccount deleteMany
   */
  export type MetaAdAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MetaAdAccounts to delete
     */
    where?: MetaAdAccountWhereInput
    /**
     * Limit how many MetaAdAccounts to delete.
     */
    limit?: number
  }

  /**
   * MetaAdAccount without action
   */
  export type MetaAdAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MetaAdAccount
     */
    select?: MetaAdAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MetaAdAccount
     */
    omit?: MetaAdAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MetaAdAccountInclude<ExtArgs> | null
  }


  /**
   * Model WhatsAppAutomation
   */

  export type AggregateWhatsAppAutomation = {
    _count: WhatsAppAutomationCountAggregateOutputType | null
    _min: WhatsAppAutomationMinAggregateOutputType | null
    _max: WhatsAppAutomationMaxAggregateOutputType | null
  }

  export type WhatsAppAutomationMinAggregateOutputType = {
    id: string | null
    name: string | null
    phoneNumberId: string | null
    automationType: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppAutomationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phoneNumberId: string | null
    automationType: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WhatsAppAutomationCountAggregateOutputType = {
    id: number
    name: number
    phoneNumberId: number
    automationJson: number
    automationType: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WhatsAppAutomationMinAggregateInputType = {
    id?: true
    name?: true
    phoneNumberId?: true
    automationType?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppAutomationMaxAggregateInputType = {
    id?: true
    name?: true
    phoneNumberId?: true
    automationType?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WhatsAppAutomationCountAggregateInputType = {
    id?: true
    name?: true
    phoneNumberId?: true
    automationJson?: true
    automationType?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WhatsAppAutomationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppAutomation to aggregate.
     */
    where?: WhatsAppAutomationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAutomations to fetch.
     */
    orderBy?: WhatsAppAutomationOrderByWithRelationInput | WhatsAppAutomationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WhatsAppAutomationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAutomations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAutomations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WhatsAppAutomations
    **/
    _count?: true | WhatsAppAutomationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WhatsAppAutomationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WhatsAppAutomationMaxAggregateInputType
  }

  export type GetWhatsAppAutomationAggregateType<T extends WhatsAppAutomationAggregateArgs> = {
        [P in keyof T & keyof AggregateWhatsAppAutomation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWhatsAppAutomation[P]>
      : GetScalarType<T[P], AggregateWhatsAppAutomation[P]>
  }




  export type WhatsAppAutomationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WhatsAppAutomationWhereInput
    orderBy?: WhatsAppAutomationOrderByWithAggregationInput | WhatsAppAutomationOrderByWithAggregationInput[]
    by: WhatsAppAutomationScalarFieldEnum[] | WhatsAppAutomationScalarFieldEnum
    having?: WhatsAppAutomationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WhatsAppAutomationCountAggregateInputType | true
    _min?: WhatsAppAutomationMinAggregateInputType
    _max?: WhatsAppAutomationMaxAggregateInputType
  }

  export type WhatsAppAutomationGroupByOutputType = {
    id: string
    name: string
    phoneNumberId: string
    automationJson: JsonValue
    automationType: string
    status: string
    createdAt: Date
    updatedAt: Date
    _count: WhatsAppAutomationCountAggregateOutputType | null
    _min: WhatsAppAutomationMinAggregateOutputType | null
    _max: WhatsAppAutomationMaxAggregateOutputType | null
  }

  type GetWhatsAppAutomationGroupByPayload<T extends WhatsAppAutomationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WhatsAppAutomationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WhatsAppAutomationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WhatsAppAutomationGroupByOutputType[P]>
            : GetScalarType<T[P], WhatsAppAutomationGroupByOutputType[P]>
        }
      >
    >


  export type WhatsAppAutomationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phoneNumberId?: boolean
    automationJson?: boolean
    automationType?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    phoneNumber?: boolean | WhatsAppPhoneNumberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppAutomation"]>

  export type WhatsAppAutomationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phoneNumberId?: boolean
    automationJson?: boolean
    automationType?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    phoneNumber?: boolean | WhatsAppPhoneNumberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppAutomation"]>

  export type WhatsAppAutomationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phoneNumberId?: boolean
    automationJson?: boolean
    automationType?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    phoneNumber?: boolean | WhatsAppPhoneNumberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["whatsAppAutomation"]>

  export type WhatsAppAutomationSelectScalar = {
    id?: boolean
    name?: boolean
    phoneNumberId?: boolean
    automationJson?: boolean
    automationType?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WhatsAppAutomationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phoneNumberId" | "automationJson" | "automationType" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["whatsAppAutomation"]>
  export type WhatsAppAutomationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    phoneNumber?: boolean | WhatsAppPhoneNumberDefaultArgs<ExtArgs>
  }
  export type WhatsAppAutomationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    phoneNumber?: boolean | WhatsAppPhoneNumberDefaultArgs<ExtArgs>
  }
  export type WhatsAppAutomationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    phoneNumber?: boolean | WhatsAppPhoneNumberDefaultArgs<ExtArgs>
  }

  export type $WhatsAppAutomationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WhatsAppAutomation"
    objects: {
      phoneNumber: Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phoneNumberId: string
      automationJson: Prisma.JsonValue
      automationType: string
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["whatsAppAutomation"]>
    composites: {}
  }

  type WhatsAppAutomationGetPayload<S extends boolean | null | undefined | WhatsAppAutomationDefaultArgs> = $Result.GetResult<Prisma.$WhatsAppAutomationPayload, S>

  type WhatsAppAutomationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WhatsAppAutomationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WhatsAppAutomationCountAggregateInputType | true
    }

  export interface WhatsAppAutomationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WhatsAppAutomation'], meta: { name: 'WhatsAppAutomation' } }
    /**
     * Find zero or one WhatsAppAutomation that matches the filter.
     * @param {WhatsAppAutomationFindUniqueArgs} args - Arguments to find a WhatsAppAutomation
     * @example
     * // Get one WhatsAppAutomation
     * const whatsAppAutomation = await prisma.whatsAppAutomation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WhatsAppAutomationFindUniqueArgs>(args: SelectSubset<T, WhatsAppAutomationFindUniqueArgs<ExtArgs>>): Prisma__WhatsAppAutomationClient<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WhatsAppAutomation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WhatsAppAutomationFindUniqueOrThrowArgs} args - Arguments to find a WhatsAppAutomation
     * @example
     * // Get one WhatsAppAutomation
     * const whatsAppAutomation = await prisma.whatsAppAutomation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WhatsAppAutomationFindUniqueOrThrowArgs>(args: SelectSubset<T, WhatsAppAutomationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WhatsAppAutomationClient<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppAutomation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAutomationFindFirstArgs} args - Arguments to find a WhatsAppAutomation
     * @example
     * // Get one WhatsAppAutomation
     * const whatsAppAutomation = await prisma.whatsAppAutomation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WhatsAppAutomationFindFirstArgs>(args?: SelectSubset<T, WhatsAppAutomationFindFirstArgs<ExtArgs>>): Prisma__WhatsAppAutomationClient<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WhatsAppAutomation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAutomationFindFirstOrThrowArgs} args - Arguments to find a WhatsAppAutomation
     * @example
     * // Get one WhatsAppAutomation
     * const whatsAppAutomation = await prisma.whatsAppAutomation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WhatsAppAutomationFindFirstOrThrowArgs>(args?: SelectSubset<T, WhatsAppAutomationFindFirstOrThrowArgs<ExtArgs>>): Prisma__WhatsAppAutomationClient<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WhatsAppAutomations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAutomationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WhatsAppAutomations
     * const whatsAppAutomations = await prisma.whatsAppAutomation.findMany()
     * 
     * // Get first 10 WhatsAppAutomations
     * const whatsAppAutomations = await prisma.whatsAppAutomation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const whatsAppAutomationWithIdOnly = await prisma.whatsAppAutomation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WhatsAppAutomationFindManyArgs>(args?: SelectSubset<T, WhatsAppAutomationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WhatsAppAutomation.
     * @param {WhatsAppAutomationCreateArgs} args - Arguments to create a WhatsAppAutomation.
     * @example
     * // Create one WhatsAppAutomation
     * const WhatsAppAutomation = await prisma.whatsAppAutomation.create({
     *   data: {
     *     // ... data to create a WhatsAppAutomation
     *   }
     * })
     * 
     */
    create<T extends WhatsAppAutomationCreateArgs>(args: SelectSubset<T, WhatsAppAutomationCreateArgs<ExtArgs>>): Prisma__WhatsAppAutomationClient<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WhatsAppAutomations.
     * @param {WhatsAppAutomationCreateManyArgs} args - Arguments to create many WhatsAppAutomations.
     * @example
     * // Create many WhatsAppAutomations
     * const whatsAppAutomation = await prisma.whatsAppAutomation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WhatsAppAutomationCreateManyArgs>(args?: SelectSubset<T, WhatsAppAutomationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WhatsAppAutomations and returns the data saved in the database.
     * @param {WhatsAppAutomationCreateManyAndReturnArgs} args - Arguments to create many WhatsAppAutomations.
     * @example
     * // Create many WhatsAppAutomations
     * const whatsAppAutomation = await prisma.whatsAppAutomation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WhatsAppAutomations and only return the `id`
     * const whatsAppAutomationWithIdOnly = await prisma.whatsAppAutomation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WhatsAppAutomationCreateManyAndReturnArgs>(args?: SelectSubset<T, WhatsAppAutomationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WhatsAppAutomation.
     * @param {WhatsAppAutomationDeleteArgs} args - Arguments to delete one WhatsAppAutomation.
     * @example
     * // Delete one WhatsAppAutomation
     * const WhatsAppAutomation = await prisma.whatsAppAutomation.delete({
     *   where: {
     *     // ... filter to delete one WhatsAppAutomation
     *   }
     * })
     * 
     */
    delete<T extends WhatsAppAutomationDeleteArgs>(args: SelectSubset<T, WhatsAppAutomationDeleteArgs<ExtArgs>>): Prisma__WhatsAppAutomationClient<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WhatsAppAutomation.
     * @param {WhatsAppAutomationUpdateArgs} args - Arguments to update one WhatsAppAutomation.
     * @example
     * // Update one WhatsAppAutomation
     * const whatsAppAutomation = await prisma.whatsAppAutomation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WhatsAppAutomationUpdateArgs>(args: SelectSubset<T, WhatsAppAutomationUpdateArgs<ExtArgs>>): Prisma__WhatsAppAutomationClient<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WhatsAppAutomations.
     * @param {WhatsAppAutomationDeleteManyArgs} args - Arguments to filter WhatsAppAutomations to delete.
     * @example
     * // Delete a few WhatsAppAutomations
     * const { count } = await prisma.whatsAppAutomation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WhatsAppAutomationDeleteManyArgs>(args?: SelectSubset<T, WhatsAppAutomationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppAutomations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAutomationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WhatsAppAutomations
     * const whatsAppAutomation = await prisma.whatsAppAutomation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WhatsAppAutomationUpdateManyArgs>(args: SelectSubset<T, WhatsAppAutomationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WhatsAppAutomations and returns the data updated in the database.
     * @param {WhatsAppAutomationUpdateManyAndReturnArgs} args - Arguments to update many WhatsAppAutomations.
     * @example
     * // Update many WhatsAppAutomations
     * const whatsAppAutomation = await prisma.whatsAppAutomation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WhatsAppAutomations and only return the `id`
     * const whatsAppAutomationWithIdOnly = await prisma.whatsAppAutomation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WhatsAppAutomationUpdateManyAndReturnArgs>(args: SelectSubset<T, WhatsAppAutomationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WhatsAppAutomation.
     * @param {WhatsAppAutomationUpsertArgs} args - Arguments to update or create a WhatsAppAutomation.
     * @example
     * // Update or create a WhatsAppAutomation
     * const whatsAppAutomation = await prisma.whatsAppAutomation.upsert({
     *   create: {
     *     // ... data to create a WhatsAppAutomation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WhatsAppAutomation we want to update
     *   }
     * })
     */
    upsert<T extends WhatsAppAutomationUpsertArgs>(args: SelectSubset<T, WhatsAppAutomationUpsertArgs<ExtArgs>>): Prisma__WhatsAppAutomationClient<$Result.GetResult<Prisma.$WhatsAppAutomationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WhatsAppAutomations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAutomationCountArgs} args - Arguments to filter WhatsAppAutomations to count.
     * @example
     * // Count the number of WhatsAppAutomations
     * const count = await prisma.whatsAppAutomation.count({
     *   where: {
     *     // ... the filter for the WhatsAppAutomations we want to count
     *   }
     * })
    **/
    count<T extends WhatsAppAutomationCountArgs>(
      args?: Subset<T, WhatsAppAutomationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WhatsAppAutomationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WhatsAppAutomation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAutomationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WhatsAppAutomationAggregateArgs>(args: Subset<T, WhatsAppAutomationAggregateArgs>): Prisma.PrismaPromise<GetWhatsAppAutomationAggregateType<T>>

    /**
     * Group by WhatsAppAutomation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WhatsAppAutomationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WhatsAppAutomationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WhatsAppAutomationGroupByArgs['orderBy'] }
        : { orderBy?: WhatsAppAutomationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WhatsAppAutomationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWhatsAppAutomationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WhatsAppAutomation model
   */
  readonly fields: WhatsAppAutomationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WhatsAppAutomation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WhatsAppAutomationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    phoneNumber<T extends WhatsAppPhoneNumberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WhatsAppPhoneNumberDefaultArgs<ExtArgs>>): Prisma__WhatsAppPhoneNumberClient<$Result.GetResult<Prisma.$WhatsAppPhoneNumberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WhatsAppAutomation model
   */
  interface WhatsAppAutomationFieldRefs {
    readonly id: FieldRef<"WhatsAppAutomation", 'String'>
    readonly name: FieldRef<"WhatsAppAutomation", 'String'>
    readonly phoneNumberId: FieldRef<"WhatsAppAutomation", 'String'>
    readonly automationJson: FieldRef<"WhatsAppAutomation", 'Json'>
    readonly automationType: FieldRef<"WhatsAppAutomation", 'String'>
    readonly status: FieldRef<"WhatsAppAutomation", 'String'>
    readonly createdAt: FieldRef<"WhatsAppAutomation", 'DateTime'>
    readonly updatedAt: FieldRef<"WhatsAppAutomation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WhatsAppAutomation findUnique
   */
  export type WhatsAppAutomationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAutomation to fetch.
     */
    where: WhatsAppAutomationWhereUniqueInput
  }

  /**
   * WhatsAppAutomation findUniqueOrThrow
   */
  export type WhatsAppAutomationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAutomation to fetch.
     */
    where: WhatsAppAutomationWhereUniqueInput
  }

  /**
   * WhatsAppAutomation findFirst
   */
  export type WhatsAppAutomationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAutomation to fetch.
     */
    where?: WhatsAppAutomationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAutomations to fetch.
     */
    orderBy?: WhatsAppAutomationOrderByWithRelationInput | WhatsAppAutomationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppAutomations.
     */
    cursor?: WhatsAppAutomationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAutomations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAutomations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppAutomations.
     */
    distinct?: WhatsAppAutomationScalarFieldEnum | WhatsAppAutomationScalarFieldEnum[]
  }

  /**
   * WhatsAppAutomation findFirstOrThrow
   */
  export type WhatsAppAutomationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAutomation to fetch.
     */
    where?: WhatsAppAutomationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAutomations to fetch.
     */
    orderBy?: WhatsAppAutomationOrderByWithRelationInput | WhatsAppAutomationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WhatsAppAutomations.
     */
    cursor?: WhatsAppAutomationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAutomations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAutomations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WhatsAppAutomations.
     */
    distinct?: WhatsAppAutomationScalarFieldEnum | WhatsAppAutomationScalarFieldEnum[]
  }

  /**
   * WhatsAppAutomation findMany
   */
  export type WhatsAppAutomationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    /**
     * Filter, which WhatsAppAutomations to fetch.
     */
    where?: WhatsAppAutomationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WhatsAppAutomations to fetch.
     */
    orderBy?: WhatsAppAutomationOrderByWithRelationInput | WhatsAppAutomationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WhatsAppAutomations.
     */
    cursor?: WhatsAppAutomationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WhatsAppAutomations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WhatsAppAutomations.
     */
    skip?: number
    distinct?: WhatsAppAutomationScalarFieldEnum | WhatsAppAutomationScalarFieldEnum[]
  }

  /**
   * WhatsAppAutomation create
   */
  export type WhatsAppAutomationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    /**
     * The data needed to create a WhatsAppAutomation.
     */
    data: XOR<WhatsAppAutomationCreateInput, WhatsAppAutomationUncheckedCreateInput>
  }

  /**
   * WhatsAppAutomation createMany
   */
  export type WhatsAppAutomationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WhatsAppAutomations.
     */
    data: WhatsAppAutomationCreateManyInput | WhatsAppAutomationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WhatsAppAutomation createManyAndReturn
   */
  export type WhatsAppAutomationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * The data used to create many WhatsAppAutomations.
     */
    data: WhatsAppAutomationCreateManyInput | WhatsAppAutomationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppAutomation update
   */
  export type WhatsAppAutomationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    /**
     * The data needed to update a WhatsAppAutomation.
     */
    data: XOR<WhatsAppAutomationUpdateInput, WhatsAppAutomationUncheckedUpdateInput>
    /**
     * Choose, which WhatsAppAutomation to update.
     */
    where: WhatsAppAutomationWhereUniqueInput
  }

  /**
   * WhatsAppAutomation updateMany
   */
  export type WhatsAppAutomationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WhatsAppAutomations.
     */
    data: XOR<WhatsAppAutomationUpdateManyMutationInput, WhatsAppAutomationUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppAutomations to update
     */
    where?: WhatsAppAutomationWhereInput
    /**
     * Limit how many WhatsAppAutomations to update.
     */
    limit?: number
  }

  /**
   * WhatsAppAutomation updateManyAndReturn
   */
  export type WhatsAppAutomationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * The data used to update WhatsAppAutomations.
     */
    data: XOR<WhatsAppAutomationUpdateManyMutationInput, WhatsAppAutomationUncheckedUpdateManyInput>
    /**
     * Filter which WhatsAppAutomations to update
     */
    where?: WhatsAppAutomationWhereInput
    /**
     * Limit how many WhatsAppAutomations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WhatsAppAutomation upsert
   */
  export type WhatsAppAutomationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    /**
     * The filter to search for the WhatsAppAutomation to update in case it exists.
     */
    where: WhatsAppAutomationWhereUniqueInput
    /**
     * In case the WhatsAppAutomation found by the `where` argument doesn't exist, create a new WhatsAppAutomation with this data.
     */
    create: XOR<WhatsAppAutomationCreateInput, WhatsAppAutomationUncheckedCreateInput>
    /**
     * In case the WhatsAppAutomation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WhatsAppAutomationUpdateInput, WhatsAppAutomationUncheckedUpdateInput>
  }

  /**
   * WhatsAppAutomation delete
   */
  export type WhatsAppAutomationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
    /**
     * Filter which WhatsAppAutomation to delete.
     */
    where: WhatsAppAutomationWhereUniqueInput
  }

  /**
   * WhatsAppAutomation deleteMany
   */
  export type WhatsAppAutomationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WhatsAppAutomations to delete
     */
    where?: WhatsAppAutomationWhereInput
    /**
     * Limit how many WhatsAppAutomations to delete.
     */
    limit?: number
  }

  /**
   * WhatsAppAutomation without action
   */
  export type WhatsAppAutomationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WhatsAppAutomation
     */
    select?: WhatsAppAutomationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WhatsAppAutomation
     */
    omit?: WhatsAppAutomationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WhatsAppAutomationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    phone: 'phone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const WhatsAppAccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    wabaid: 'wabaid',
    accessToken: 'accessToken',
    phoneNumberIds: 'phoneNumberIds',
    displayName: 'displayName',
    verified: 'verified',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WhatsAppAccountScalarFieldEnum = (typeof WhatsAppAccountScalarFieldEnum)[keyof typeof WhatsAppAccountScalarFieldEnum]


  export const WhatsAppPhoneNumberScalarFieldEnum: {
    id: 'id',
    phoneNumberId: 'phoneNumberId',
    phoneNumber: 'phoneNumber',
    name: 'name',
    codeVerificationStatus: 'codeVerificationStatus',
    isRegistered: 'isRegistered',
    isSubscribed: 'isSubscribed',
    accountId: 'accountId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WhatsAppPhoneNumberScalarFieldEnum = (typeof WhatsAppPhoneNumberScalarFieldEnum)[keyof typeof WhatsAppPhoneNumberScalarFieldEnum]


  export const WhatsAppAudienceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    accountId: 'accountId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WhatsAppAudienceScalarFieldEnum = (typeof WhatsAppAudienceScalarFieldEnum)[keyof typeof WhatsAppAudienceScalarFieldEnum]


  export const WhatsAppRecipientScalarFieldEnum: {
    id: 'id',
    phoneNumber: 'phoneNumber',
    name: 'name',
    audienceId: 'audienceId',
    whatsAppPhoneNumberId: 'whatsAppPhoneNumberId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WhatsAppRecipientScalarFieldEnum = (typeof WhatsAppRecipientScalarFieldEnum)[keyof typeof WhatsAppRecipientScalarFieldEnum]


  export const WhatsAppCampaignScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    message: 'message',
    mediaUrl: 'mediaUrl',
    templateId: 'templateId',
    templateParams: 'templateParams',
    accountId: 'accountId',
    audienceId: 'audienceId',
    status: 'status',
    scheduledAt: 'scheduledAt',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WhatsAppCampaignScalarFieldEnum = (typeof WhatsAppCampaignScalarFieldEnum)[keyof typeof WhatsAppCampaignScalarFieldEnum]


  export const WhatsAppMessageScalarFieldEnum: {
    id: 'id',
    wamid: 'wamid',
    status: 'status',
    message: 'message',
    isOutbound: 'isOutbound',
    errorMessage: 'errorMessage',
    phoneNumber: 'phoneNumber',
    sentAt: 'sentAt',
    deliveredAt: 'deliveredAt',
    readAt: 'readAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    whatsAppPhoneNumberId: 'whatsAppPhoneNumberId',
    recipientId: 'recipientId'
  };

  export type WhatsAppMessageScalarFieldEnum = (typeof WhatsAppMessageScalarFieldEnum)[keyof typeof WhatsAppMessageScalarFieldEnum]


  export const MetaAdAccountScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    accessToken: 'accessToken',
    pageId: 'pageId',
    status: 'status',
    agentId: 'agentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MetaAdAccountScalarFieldEnum = (typeof MetaAdAccountScalarFieldEnum)[keyof typeof MetaAdAccountScalarFieldEnum]


  export const WhatsAppAutomationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phoneNumberId: 'phoneNumberId',
    automationJson: 'automationJson',
    automationType: 'automationType',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WhatsAppAutomationScalarFieldEnum = (typeof WhatsAppAutomationScalarFieldEnum)[keyof typeof WhatsAppAutomationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'ActivityStatus'
   */
  export type EnumActivityStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActivityStatus'>
    


  /**
   * Reference to a field of type 'ActivityStatus[]'
   */
  export type ListEnumActivityStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ActivityStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    WhatsAppAccount?: WhatsAppAccountListRelationFilter
    MetaAdAccount?: MetaAdAccountListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    WhatsAppAccount?: WhatsAppAccountOrderByRelationAggregateInput
    MetaAdAccount?: MetaAdAccountOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    WhatsAppAccount?: WhatsAppAccountListRelationFilter
    MetaAdAccount?: MetaAdAccountListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type WhatsAppAccountWhereInput = {
    AND?: WhatsAppAccountWhereInput | WhatsAppAccountWhereInput[]
    OR?: WhatsAppAccountWhereInput[]
    NOT?: WhatsAppAccountWhereInput | WhatsAppAccountWhereInput[]
    id?: StringFilter<"WhatsAppAccount"> | string
    userId?: StringFilter<"WhatsAppAccount"> | string
    wabaid?: StringFilter<"WhatsAppAccount"> | string
    accessToken?: StringFilter<"WhatsAppAccount"> | string
    phoneNumberIds?: StringNullableListFilter<"WhatsAppAccount">
    displayName?: StringFilter<"WhatsAppAccount"> | string
    verified?: BoolFilter<"WhatsAppAccount"> | boolean
    status?: StringFilter<"WhatsAppAccount"> | string
    createdAt?: DateTimeFilter<"WhatsAppAccount"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppAccount"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    audiences?: WhatsAppAudienceListRelationFilter
    campaigns?: WhatsAppCampaignListRelationFilter
    phoneNumbers?: WhatsAppPhoneNumberListRelationFilter
  }

  export type WhatsAppAccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    wabaid?: SortOrder
    accessToken?: SortOrder
    phoneNumberIds?: SortOrder
    displayName?: SortOrder
    verified?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    audiences?: WhatsAppAudienceOrderByRelationAggregateInput
    campaigns?: WhatsAppCampaignOrderByRelationAggregateInput
    phoneNumbers?: WhatsAppPhoneNumberOrderByRelationAggregateInput
  }

  export type WhatsAppAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: WhatsAppAccountWhereInput | WhatsAppAccountWhereInput[]
    OR?: WhatsAppAccountWhereInput[]
    NOT?: WhatsAppAccountWhereInput | WhatsAppAccountWhereInput[]
    wabaid?: StringFilter<"WhatsAppAccount"> | string
    accessToken?: StringFilter<"WhatsAppAccount"> | string
    phoneNumberIds?: StringNullableListFilter<"WhatsAppAccount">
    displayName?: StringFilter<"WhatsAppAccount"> | string
    verified?: BoolFilter<"WhatsAppAccount"> | boolean
    status?: StringFilter<"WhatsAppAccount"> | string
    createdAt?: DateTimeFilter<"WhatsAppAccount"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppAccount"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    audiences?: WhatsAppAudienceListRelationFilter
    campaigns?: WhatsAppCampaignListRelationFilter
    phoneNumbers?: WhatsAppPhoneNumberListRelationFilter
  }, "id" | "userId">

  export type WhatsAppAccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    wabaid?: SortOrder
    accessToken?: SortOrder
    phoneNumberIds?: SortOrder
    displayName?: SortOrder
    verified?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WhatsAppAccountCountOrderByAggregateInput
    _max?: WhatsAppAccountMaxOrderByAggregateInput
    _min?: WhatsAppAccountMinOrderByAggregateInput
  }

  export type WhatsAppAccountScalarWhereWithAggregatesInput = {
    AND?: WhatsAppAccountScalarWhereWithAggregatesInput | WhatsAppAccountScalarWhereWithAggregatesInput[]
    OR?: WhatsAppAccountScalarWhereWithAggregatesInput[]
    NOT?: WhatsAppAccountScalarWhereWithAggregatesInput | WhatsAppAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WhatsAppAccount"> | string
    userId?: StringWithAggregatesFilter<"WhatsAppAccount"> | string
    wabaid?: StringWithAggregatesFilter<"WhatsAppAccount"> | string
    accessToken?: StringWithAggregatesFilter<"WhatsAppAccount"> | string
    phoneNumberIds?: StringNullableListFilter<"WhatsAppAccount">
    displayName?: StringWithAggregatesFilter<"WhatsAppAccount"> | string
    verified?: BoolWithAggregatesFilter<"WhatsAppAccount"> | boolean
    status?: StringWithAggregatesFilter<"WhatsAppAccount"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WhatsAppAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WhatsAppAccount"> | Date | string
  }

  export type WhatsAppPhoneNumberWhereInput = {
    AND?: WhatsAppPhoneNumberWhereInput | WhatsAppPhoneNumberWhereInput[]
    OR?: WhatsAppPhoneNumberWhereInput[]
    NOT?: WhatsAppPhoneNumberWhereInput | WhatsAppPhoneNumberWhereInput[]
    id?: StringFilter<"WhatsAppPhoneNumber"> | string
    phoneNumberId?: StringFilter<"WhatsAppPhoneNumber"> | string
    phoneNumber?: StringFilter<"WhatsAppPhoneNumber"> | string
    name?: StringNullableFilter<"WhatsAppPhoneNumber"> | string | null
    codeVerificationStatus?: StringNullableFilter<"WhatsAppPhoneNumber"> | string | null
    isRegistered?: BoolFilter<"WhatsAppPhoneNumber"> | boolean
    isSubscribed?: BoolFilter<"WhatsAppPhoneNumber"> | boolean
    accountId?: StringFilter<"WhatsAppPhoneNumber"> | string
    createdAt?: DateTimeFilter<"WhatsAppPhoneNumber"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppPhoneNumber"> | Date | string
    account?: XOR<WhatsAppAccountScalarRelationFilter, WhatsAppAccountWhereInput>
    recipients?: WhatsAppRecipientListRelationFilter
    messages?: WhatsAppMessageListRelationFilter
    automations?: WhatsAppAutomationListRelationFilter
  }

  export type WhatsAppPhoneNumberOrderByWithRelationInput = {
    id?: SortOrder
    phoneNumberId?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrderInput | SortOrder
    codeVerificationStatus?: SortOrderInput | SortOrder
    isRegistered?: SortOrder
    isSubscribed?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    account?: WhatsAppAccountOrderByWithRelationInput
    recipients?: WhatsAppRecipientOrderByRelationAggregateInput
    messages?: WhatsAppMessageOrderByRelationAggregateInput
    automations?: WhatsAppAutomationOrderByRelationAggregateInput
  }

  export type WhatsAppPhoneNumberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WhatsAppPhoneNumberWhereInput | WhatsAppPhoneNumberWhereInput[]
    OR?: WhatsAppPhoneNumberWhereInput[]
    NOT?: WhatsAppPhoneNumberWhereInput | WhatsAppPhoneNumberWhereInput[]
    phoneNumberId?: StringFilter<"WhatsAppPhoneNumber"> | string
    phoneNumber?: StringFilter<"WhatsAppPhoneNumber"> | string
    name?: StringNullableFilter<"WhatsAppPhoneNumber"> | string | null
    codeVerificationStatus?: StringNullableFilter<"WhatsAppPhoneNumber"> | string | null
    isRegistered?: BoolFilter<"WhatsAppPhoneNumber"> | boolean
    isSubscribed?: BoolFilter<"WhatsAppPhoneNumber"> | boolean
    accountId?: StringFilter<"WhatsAppPhoneNumber"> | string
    createdAt?: DateTimeFilter<"WhatsAppPhoneNumber"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppPhoneNumber"> | Date | string
    account?: XOR<WhatsAppAccountScalarRelationFilter, WhatsAppAccountWhereInput>
    recipients?: WhatsAppRecipientListRelationFilter
    messages?: WhatsAppMessageListRelationFilter
    automations?: WhatsAppAutomationListRelationFilter
  }, "id">

  export type WhatsAppPhoneNumberOrderByWithAggregationInput = {
    id?: SortOrder
    phoneNumberId?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrderInput | SortOrder
    codeVerificationStatus?: SortOrderInput | SortOrder
    isRegistered?: SortOrder
    isSubscribed?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WhatsAppPhoneNumberCountOrderByAggregateInput
    _max?: WhatsAppPhoneNumberMaxOrderByAggregateInput
    _min?: WhatsAppPhoneNumberMinOrderByAggregateInput
  }

  export type WhatsAppPhoneNumberScalarWhereWithAggregatesInput = {
    AND?: WhatsAppPhoneNumberScalarWhereWithAggregatesInput | WhatsAppPhoneNumberScalarWhereWithAggregatesInput[]
    OR?: WhatsAppPhoneNumberScalarWhereWithAggregatesInput[]
    NOT?: WhatsAppPhoneNumberScalarWhereWithAggregatesInput | WhatsAppPhoneNumberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WhatsAppPhoneNumber"> | string
    phoneNumberId?: StringWithAggregatesFilter<"WhatsAppPhoneNumber"> | string
    phoneNumber?: StringWithAggregatesFilter<"WhatsAppPhoneNumber"> | string
    name?: StringNullableWithAggregatesFilter<"WhatsAppPhoneNumber"> | string | null
    codeVerificationStatus?: StringNullableWithAggregatesFilter<"WhatsAppPhoneNumber"> | string | null
    isRegistered?: BoolWithAggregatesFilter<"WhatsAppPhoneNumber"> | boolean
    isSubscribed?: BoolWithAggregatesFilter<"WhatsAppPhoneNumber"> | boolean
    accountId?: StringWithAggregatesFilter<"WhatsAppPhoneNumber"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WhatsAppPhoneNumber"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WhatsAppPhoneNumber"> | Date | string
  }

  export type WhatsAppAudienceWhereInput = {
    AND?: WhatsAppAudienceWhereInput | WhatsAppAudienceWhereInput[]
    OR?: WhatsAppAudienceWhereInput[]
    NOT?: WhatsAppAudienceWhereInput | WhatsAppAudienceWhereInput[]
    id?: StringFilter<"WhatsAppAudience"> | string
    name?: StringFilter<"WhatsAppAudience"> | string
    accountId?: StringFilter<"WhatsAppAudience"> | string
    createdAt?: DateTimeFilter<"WhatsAppAudience"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppAudience"> | Date | string
    account?: XOR<WhatsAppAccountScalarRelationFilter, WhatsAppAccountWhereInput>
    recipients?: WhatsAppRecipientListRelationFilter
    campaigns?: WhatsAppCampaignListRelationFilter
  }

  export type WhatsAppAudienceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    account?: WhatsAppAccountOrderByWithRelationInput
    recipients?: WhatsAppRecipientOrderByRelationAggregateInput
    campaigns?: WhatsAppCampaignOrderByRelationAggregateInput
  }

  export type WhatsAppAudienceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WhatsAppAudienceWhereInput | WhatsAppAudienceWhereInput[]
    OR?: WhatsAppAudienceWhereInput[]
    NOT?: WhatsAppAudienceWhereInput | WhatsAppAudienceWhereInput[]
    name?: StringFilter<"WhatsAppAudience"> | string
    accountId?: StringFilter<"WhatsAppAudience"> | string
    createdAt?: DateTimeFilter<"WhatsAppAudience"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppAudience"> | Date | string
    account?: XOR<WhatsAppAccountScalarRelationFilter, WhatsAppAccountWhereInput>
    recipients?: WhatsAppRecipientListRelationFilter
    campaigns?: WhatsAppCampaignListRelationFilter
  }, "id">

  export type WhatsAppAudienceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WhatsAppAudienceCountOrderByAggregateInput
    _max?: WhatsAppAudienceMaxOrderByAggregateInput
    _min?: WhatsAppAudienceMinOrderByAggregateInput
  }

  export type WhatsAppAudienceScalarWhereWithAggregatesInput = {
    AND?: WhatsAppAudienceScalarWhereWithAggregatesInput | WhatsAppAudienceScalarWhereWithAggregatesInput[]
    OR?: WhatsAppAudienceScalarWhereWithAggregatesInput[]
    NOT?: WhatsAppAudienceScalarWhereWithAggregatesInput | WhatsAppAudienceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WhatsAppAudience"> | string
    name?: StringWithAggregatesFilter<"WhatsAppAudience"> | string
    accountId?: StringWithAggregatesFilter<"WhatsAppAudience"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WhatsAppAudience"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WhatsAppAudience"> | Date | string
  }

  export type WhatsAppRecipientWhereInput = {
    AND?: WhatsAppRecipientWhereInput | WhatsAppRecipientWhereInput[]
    OR?: WhatsAppRecipientWhereInput[]
    NOT?: WhatsAppRecipientWhereInput | WhatsAppRecipientWhereInput[]
    id?: StringFilter<"WhatsAppRecipient"> | string
    phoneNumber?: StringFilter<"WhatsAppRecipient"> | string
    name?: StringNullableFilter<"WhatsAppRecipient"> | string | null
    audienceId?: StringNullableFilter<"WhatsAppRecipient"> | string | null
    whatsAppPhoneNumberId?: StringNullableFilter<"WhatsAppRecipient"> | string | null
    createdAt?: DateTimeFilter<"WhatsAppRecipient"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppRecipient"> | Date | string
    audience?: XOR<WhatsAppAudienceNullableScalarRelationFilter, WhatsAppAudienceWhereInput> | null
    whatsAppPhoneNumber?: XOR<WhatsAppPhoneNumberNullableScalarRelationFilter, WhatsAppPhoneNumberWhereInput> | null
    messages?: WhatsAppMessageListRelationFilter
  }

  export type WhatsAppRecipientOrderByWithRelationInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrderInput | SortOrder
    audienceId?: SortOrderInput | SortOrder
    whatsAppPhoneNumberId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    audience?: WhatsAppAudienceOrderByWithRelationInput
    whatsAppPhoneNumber?: WhatsAppPhoneNumberOrderByWithRelationInput
    messages?: WhatsAppMessageOrderByRelationAggregateInput
  }

  export type WhatsAppRecipientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    audienceId_phoneNumber?: WhatsAppRecipientAudienceIdPhoneNumberCompoundUniqueInput
    AND?: WhatsAppRecipientWhereInput | WhatsAppRecipientWhereInput[]
    OR?: WhatsAppRecipientWhereInput[]
    NOT?: WhatsAppRecipientWhereInput | WhatsAppRecipientWhereInput[]
    phoneNumber?: StringFilter<"WhatsAppRecipient"> | string
    name?: StringNullableFilter<"WhatsAppRecipient"> | string | null
    audienceId?: StringNullableFilter<"WhatsAppRecipient"> | string | null
    whatsAppPhoneNumberId?: StringNullableFilter<"WhatsAppRecipient"> | string | null
    createdAt?: DateTimeFilter<"WhatsAppRecipient"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppRecipient"> | Date | string
    audience?: XOR<WhatsAppAudienceNullableScalarRelationFilter, WhatsAppAudienceWhereInput> | null
    whatsAppPhoneNumber?: XOR<WhatsAppPhoneNumberNullableScalarRelationFilter, WhatsAppPhoneNumberWhereInput> | null
    messages?: WhatsAppMessageListRelationFilter
  }, "id" | "audienceId_phoneNumber">

  export type WhatsAppRecipientOrderByWithAggregationInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrderInput | SortOrder
    audienceId?: SortOrderInput | SortOrder
    whatsAppPhoneNumberId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WhatsAppRecipientCountOrderByAggregateInput
    _max?: WhatsAppRecipientMaxOrderByAggregateInput
    _min?: WhatsAppRecipientMinOrderByAggregateInput
  }

  export type WhatsAppRecipientScalarWhereWithAggregatesInput = {
    AND?: WhatsAppRecipientScalarWhereWithAggregatesInput | WhatsAppRecipientScalarWhereWithAggregatesInput[]
    OR?: WhatsAppRecipientScalarWhereWithAggregatesInput[]
    NOT?: WhatsAppRecipientScalarWhereWithAggregatesInput | WhatsAppRecipientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WhatsAppRecipient"> | string
    phoneNumber?: StringWithAggregatesFilter<"WhatsAppRecipient"> | string
    name?: StringNullableWithAggregatesFilter<"WhatsAppRecipient"> | string | null
    audienceId?: StringNullableWithAggregatesFilter<"WhatsAppRecipient"> | string | null
    whatsAppPhoneNumberId?: StringNullableWithAggregatesFilter<"WhatsAppRecipient"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WhatsAppRecipient"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WhatsAppRecipient"> | Date | string
  }

  export type WhatsAppCampaignWhereInput = {
    AND?: WhatsAppCampaignWhereInput | WhatsAppCampaignWhereInput[]
    OR?: WhatsAppCampaignWhereInput[]
    NOT?: WhatsAppCampaignWhereInput | WhatsAppCampaignWhereInput[]
    id?: StringFilter<"WhatsAppCampaign"> | string
    name?: StringFilter<"WhatsAppCampaign"> | string
    type?: StringFilter<"WhatsAppCampaign"> | string
    message?: StringNullableFilter<"WhatsAppCampaign"> | string | null
    mediaUrl?: StringNullableFilter<"WhatsAppCampaign"> | string | null
    templateId?: StringNullableFilter<"WhatsAppCampaign"> | string | null
    templateParams?: JsonNullableFilter<"WhatsAppCampaign">
    accountId?: StringFilter<"WhatsAppCampaign"> | string
    audienceId?: StringFilter<"WhatsAppCampaign"> | string
    status?: StringFilter<"WhatsAppCampaign"> | string
    scheduledAt?: DateTimeNullableFilter<"WhatsAppCampaign"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"WhatsAppCampaign"> | Date | string | null
    createdAt?: DateTimeFilter<"WhatsAppCampaign"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppCampaign"> | Date | string
    account?: XOR<WhatsAppAccountScalarRelationFilter, WhatsAppAccountWhereInput>
    audience?: XOR<WhatsAppAudienceScalarRelationFilter, WhatsAppAudienceWhereInput>
  }

  export type WhatsAppCampaignOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    message?: SortOrderInput | SortOrder
    mediaUrl?: SortOrderInput | SortOrder
    templateId?: SortOrderInput | SortOrder
    templateParams?: SortOrderInput | SortOrder
    accountId?: SortOrder
    audienceId?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    account?: WhatsAppAccountOrderByWithRelationInput
    audience?: WhatsAppAudienceOrderByWithRelationInput
  }

  export type WhatsAppCampaignWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WhatsAppCampaignWhereInput | WhatsAppCampaignWhereInput[]
    OR?: WhatsAppCampaignWhereInput[]
    NOT?: WhatsAppCampaignWhereInput | WhatsAppCampaignWhereInput[]
    name?: StringFilter<"WhatsAppCampaign"> | string
    type?: StringFilter<"WhatsAppCampaign"> | string
    message?: StringNullableFilter<"WhatsAppCampaign"> | string | null
    mediaUrl?: StringNullableFilter<"WhatsAppCampaign"> | string | null
    templateId?: StringNullableFilter<"WhatsAppCampaign"> | string | null
    templateParams?: JsonNullableFilter<"WhatsAppCampaign">
    accountId?: StringFilter<"WhatsAppCampaign"> | string
    audienceId?: StringFilter<"WhatsAppCampaign"> | string
    status?: StringFilter<"WhatsAppCampaign"> | string
    scheduledAt?: DateTimeNullableFilter<"WhatsAppCampaign"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"WhatsAppCampaign"> | Date | string | null
    createdAt?: DateTimeFilter<"WhatsAppCampaign"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppCampaign"> | Date | string
    account?: XOR<WhatsAppAccountScalarRelationFilter, WhatsAppAccountWhereInput>
    audience?: XOR<WhatsAppAudienceScalarRelationFilter, WhatsAppAudienceWhereInput>
  }, "id">

  export type WhatsAppCampaignOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    message?: SortOrderInput | SortOrder
    mediaUrl?: SortOrderInput | SortOrder
    templateId?: SortOrderInput | SortOrder
    templateParams?: SortOrderInput | SortOrder
    accountId?: SortOrder
    audienceId?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WhatsAppCampaignCountOrderByAggregateInput
    _max?: WhatsAppCampaignMaxOrderByAggregateInput
    _min?: WhatsAppCampaignMinOrderByAggregateInput
  }

  export type WhatsAppCampaignScalarWhereWithAggregatesInput = {
    AND?: WhatsAppCampaignScalarWhereWithAggregatesInput | WhatsAppCampaignScalarWhereWithAggregatesInput[]
    OR?: WhatsAppCampaignScalarWhereWithAggregatesInput[]
    NOT?: WhatsAppCampaignScalarWhereWithAggregatesInput | WhatsAppCampaignScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WhatsAppCampaign"> | string
    name?: StringWithAggregatesFilter<"WhatsAppCampaign"> | string
    type?: StringWithAggregatesFilter<"WhatsAppCampaign"> | string
    message?: StringNullableWithAggregatesFilter<"WhatsAppCampaign"> | string | null
    mediaUrl?: StringNullableWithAggregatesFilter<"WhatsAppCampaign"> | string | null
    templateId?: StringNullableWithAggregatesFilter<"WhatsAppCampaign"> | string | null
    templateParams?: JsonNullableWithAggregatesFilter<"WhatsAppCampaign">
    accountId?: StringWithAggregatesFilter<"WhatsAppCampaign"> | string
    audienceId?: StringWithAggregatesFilter<"WhatsAppCampaign"> | string
    status?: StringWithAggregatesFilter<"WhatsAppCampaign"> | string
    scheduledAt?: DateTimeNullableWithAggregatesFilter<"WhatsAppCampaign"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"WhatsAppCampaign"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WhatsAppCampaign"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WhatsAppCampaign"> | Date | string
  }

  export type WhatsAppMessageWhereInput = {
    AND?: WhatsAppMessageWhereInput | WhatsAppMessageWhereInput[]
    OR?: WhatsAppMessageWhereInput[]
    NOT?: WhatsAppMessageWhereInput | WhatsAppMessageWhereInput[]
    id?: StringFilter<"WhatsAppMessage"> | string
    wamid?: StringNullableFilter<"WhatsAppMessage"> | string | null
    status?: StringFilter<"WhatsAppMessage"> | string
    message?: StringNullableFilter<"WhatsAppMessage"> | string | null
    isOutbound?: BoolFilter<"WhatsAppMessage"> | boolean
    errorMessage?: StringNullableFilter<"WhatsAppMessage"> | string | null
    phoneNumber?: StringNullableFilter<"WhatsAppMessage"> | string | null
    sentAt?: DateTimeNullableFilter<"WhatsAppMessage"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"WhatsAppMessage"> | Date | string | null
    readAt?: DateTimeNullableFilter<"WhatsAppMessage"> | Date | string | null
    createdAt?: DateTimeFilter<"WhatsAppMessage"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppMessage"> | Date | string
    whatsAppPhoneNumberId?: StringNullableFilter<"WhatsAppMessage"> | string | null
    recipientId?: StringFilter<"WhatsAppMessage"> | string
    whatsAppPhoneNumber?: XOR<WhatsAppPhoneNumberNullableScalarRelationFilter, WhatsAppPhoneNumberWhereInput> | null
    recipient?: XOR<WhatsAppRecipientScalarRelationFilter, WhatsAppRecipientWhereInput>
  }

  export type WhatsAppMessageOrderByWithRelationInput = {
    id?: SortOrder
    wamid?: SortOrderInput | SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    isOutbound?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    readAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    whatsAppPhoneNumberId?: SortOrderInput | SortOrder
    recipientId?: SortOrder
    whatsAppPhoneNumber?: WhatsAppPhoneNumberOrderByWithRelationInput
    recipient?: WhatsAppRecipientOrderByWithRelationInput
  }

  export type WhatsAppMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WhatsAppMessageWhereInput | WhatsAppMessageWhereInput[]
    OR?: WhatsAppMessageWhereInput[]
    NOT?: WhatsAppMessageWhereInput | WhatsAppMessageWhereInput[]
    wamid?: StringNullableFilter<"WhatsAppMessage"> | string | null
    status?: StringFilter<"WhatsAppMessage"> | string
    message?: StringNullableFilter<"WhatsAppMessage"> | string | null
    isOutbound?: BoolFilter<"WhatsAppMessage"> | boolean
    errorMessage?: StringNullableFilter<"WhatsAppMessage"> | string | null
    phoneNumber?: StringNullableFilter<"WhatsAppMessage"> | string | null
    sentAt?: DateTimeNullableFilter<"WhatsAppMessage"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"WhatsAppMessage"> | Date | string | null
    readAt?: DateTimeNullableFilter<"WhatsAppMessage"> | Date | string | null
    createdAt?: DateTimeFilter<"WhatsAppMessage"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppMessage"> | Date | string
    whatsAppPhoneNumberId?: StringNullableFilter<"WhatsAppMessage"> | string | null
    recipientId?: StringFilter<"WhatsAppMessage"> | string
    whatsAppPhoneNumber?: XOR<WhatsAppPhoneNumberNullableScalarRelationFilter, WhatsAppPhoneNumberWhereInput> | null
    recipient?: XOR<WhatsAppRecipientScalarRelationFilter, WhatsAppRecipientWhereInput>
  }, "id">

  export type WhatsAppMessageOrderByWithAggregationInput = {
    id?: SortOrder
    wamid?: SortOrderInput | SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    isOutbound?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    readAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    whatsAppPhoneNumberId?: SortOrderInput | SortOrder
    recipientId?: SortOrder
    _count?: WhatsAppMessageCountOrderByAggregateInput
    _max?: WhatsAppMessageMaxOrderByAggregateInput
    _min?: WhatsAppMessageMinOrderByAggregateInput
  }

  export type WhatsAppMessageScalarWhereWithAggregatesInput = {
    AND?: WhatsAppMessageScalarWhereWithAggregatesInput | WhatsAppMessageScalarWhereWithAggregatesInput[]
    OR?: WhatsAppMessageScalarWhereWithAggregatesInput[]
    NOT?: WhatsAppMessageScalarWhereWithAggregatesInput | WhatsAppMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WhatsAppMessage"> | string
    wamid?: StringNullableWithAggregatesFilter<"WhatsAppMessage"> | string | null
    status?: StringWithAggregatesFilter<"WhatsAppMessage"> | string
    message?: StringNullableWithAggregatesFilter<"WhatsAppMessage"> | string | null
    isOutbound?: BoolWithAggregatesFilter<"WhatsAppMessage"> | boolean
    errorMessage?: StringNullableWithAggregatesFilter<"WhatsAppMessage"> | string | null
    phoneNumber?: StringNullableWithAggregatesFilter<"WhatsAppMessage"> | string | null
    sentAt?: DateTimeNullableWithAggregatesFilter<"WhatsAppMessage"> | Date | string | null
    deliveredAt?: DateTimeNullableWithAggregatesFilter<"WhatsAppMessage"> | Date | string | null
    readAt?: DateTimeNullableWithAggregatesFilter<"WhatsAppMessage"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WhatsAppMessage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WhatsAppMessage"> | Date | string
    whatsAppPhoneNumberId?: StringNullableWithAggregatesFilter<"WhatsAppMessage"> | string | null
    recipientId?: StringWithAggregatesFilter<"WhatsAppMessage"> | string
  }

  export type MetaAdAccountWhereInput = {
    AND?: MetaAdAccountWhereInput | MetaAdAccountWhereInput[]
    OR?: MetaAdAccountWhereInput[]
    NOT?: MetaAdAccountWhereInput | MetaAdAccountWhereInput[]
    id?: StringFilter<"MetaAdAccount"> | string
    name?: StringNullableFilter<"MetaAdAccount"> | string | null
    email?: StringNullableFilter<"MetaAdAccount"> | string | null
    accessToken?: StringFilter<"MetaAdAccount"> | string
    pageId?: StringNullableFilter<"MetaAdAccount"> | string | null
    status?: EnumActivityStatusNullableFilter<"MetaAdAccount"> | $Enums.ActivityStatus | null
    agentId?: StringFilter<"MetaAdAccount"> | string
    createdAt?: DateTimeFilter<"MetaAdAccount"> | Date | string
    updatedAt?: DateTimeFilter<"MetaAdAccount"> | Date | string
    agent?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MetaAdAccountOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    accessToken?: SortOrder
    pageId?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    agentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    agent?: UserOrderByWithRelationInput
  }

  export type MetaAdAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MetaAdAccountWhereInput | MetaAdAccountWhereInput[]
    OR?: MetaAdAccountWhereInput[]
    NOT?: MetaAdAccountWhereInput | MetaAdAccountWhereInput[]
    name?: StringNullableFilter<"MetaAdAccount"> | string | null
    email?: StringNullableFilter<"MetaAdAccount"> | string | null
    accessToken?: StringFilter<"MetaAdAccount"> | string
    pageId?: StringNullableFilter<"MetaAdAccount"> | string | null
    status?: EnumActivityStatusNullableFilter<"MetaAdAccount"> | $Enums.ActivityStatus | null
    agentId?: StringFilter<"MetaAdAccount"> | string
    createdAt?: DateTimeFilter<"MetaAdAccount"> | Date | string
    updatedAt?: DateTimeFilter<"MetaAdAccount"> | Date | string
    agent?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type MetaAdAccountOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    accessToken?: SortOrder
    pageId?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    agentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MetaAdAccountCountOrderByAggregateInput
    _max?: MetaAdAccountMaxOrderByAggregateInput
    _min?: MetaAdAccountMinOrderByAggregateInput
  }

  export type MetaAdAccountScalarWhereWithAggregatesInput = {
    AND?: MetaAdAccountScalarWhereWithAggregatesInput | MetaAdAccountScalarWhereWithAggregatesInput[]
    OR?: MetaAdAccountScalarWhereWithAggregatesInput[]
    NOT?: MetaAdAccountScalarWhereWithAggregatesInput | MetaAdAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MetaAdAccount"> | string
    name?: StringNullableWithAggregatesFilter<"MetaAdAccount"> | string | null
    email?: StringNullableWithAggregatesFilter<"MetaAdAccount"> | string | null
    accessToken?: StringWithAggregatesFilter<"MetaAdAccount"> | string
    pageId?: StringNullableWithAggregatesFilter<"MetaAdAccount"> | string | null
    status?: EnumActivityStatusNullableWithAggregatesFilter<"MetaAdAccount"> | $Enums.ActivityStatus | null
    agentId?: StringWithAggregatesFilter<"MetaAdAccount"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MetaAdAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MetaAdAccount"> | Date | string
  }

  export type WhatsAppAutomationWhereInput = {
    AND?: WhatsAppAutomationWhereInput | WhatsAppAutomationWhereInput[]
    OR?: WhatsAppAutomationWhereInput[]
    NOT?: WhatsAppAutomationWhereInput | WhatsAppAutomationWhereInput[]
    id?: StringFilter<"WhatsAppAutomation"> | string
    name?: StringFilter<"WhatsAppAutomation"> | string
    phoneNumberId?: StringFilter<"WhatsAppAutomation"> | string
    automationJson?: JsonFilter<"WhatsAppAutomation">
    automationType?: StringFilter<"WhatsAppAutomation"> | string
    status?: StringFilter<"WhatsAppAutomation"> | string
    createdAt?: DateTimeFilter<"WhatsAppAutomation"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppAutomation"> | Date | string
    phoneNumber?: XOR<WhatsAppPhoneNumberScalarRelationFilter, WhatsAppPhoneNumberWhereInput>
  }

  export type WhatsAppAutomationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumberId?: SortOrder
    automationJson?: SortOrder
    automationType?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    phoneNumber?: WhatsAppPhoneNumberOrderByWithRelationInput
  }

  export type WhatsAppAutomationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WhatsAppAutomationWhereInput | WhatsAppAutomationWhereInput[]
    OR?: WhatsAppAutomationWhereInput[]
    NOT?: WhatsAppAutomationWhereInput | WhatsAppAutomationWhereInput[]
    name?: StringFilter<"WhatsAppAutomation"> | string
    phoneNumberId?: StringFilter<"WhatsAppAutomation"> | string
    automationJson?: JsonFilter<"WhatsAppAutomation">
    automationType?: StringFilter<"WhatsAppAutomation"> | string
    status?: StringFilter<"WhatsAppAutomation"> | string
    createdAt?: DateTimeFilter<"WhatsAppAutomation"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppAutomation"> | Date | string
    phoneNumber?: XOR<WhatsAppPhoneNumberScalarRelationFilter, WhatsAppPhoneNumberWhereInput>
  }, "id">

  export type WhatsAppAutomationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumberId?: SortOrder
    automationJson?: SortOrder
    automationType?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WhatsAppAutomationCountOrderByAggregateInput
    _max?: WhatsAppAutomationMaxOrderByAggregateInput
    _min?: WhatsAppAutomationMinOrderByAggregateInput
  }

  export type WhatsAppAutomationScalarWhereWithAggregatesInput = {
    AND?: WhatsAppAutomationScalarWhereWithAggregatesInput | WhatsAppAutomationScalarWhereWithAggregatesInput[]
    OR?: WhatsAppAutomationScalarWhereWithAggregatesInput[]
    NOT?: WhatsAppAutomationScalarWhereWithAggregatesInput | WhatsAppAutomationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WhatsAppAutomation"> | string
    name?: StringWithAggregatesFilter<"WhatsAppAutomation"> | string
    phoneNumberId?: StringWithAggregatesFilter<"WhatsAppAutomation"> | string
    automationJson?: JsonWithAggregatesFilter<"WhatsAppAutomation">
    automationType?: StringWithAggregatesFilter<"WhatsAppAutomation"> | string
    status?: StringWithAggregatesFilter<"WhatsAppAutomation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WhatsAppAutomation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WhatsAppAutomation"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    WhatsAppAccount?: WhatsAppAccountCreateNestedManyWithoutUserInput
    MetaAdAccount?: MetaAdAccountCreateNestedManyWithoutAgentInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    WhatsAppAccount?: WhatsAppAccountUncheckedCreateNestedManyWithoutUserInput
    MetaAdAccount?: MetaAdAccountUncheckedCreateNestedManyWithoutAgentInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    WhatsAppAccount?: WhatsAppAccountUpdateManyWithoutUserNestedInput
    MetaAdAccount?: MetaAdAccountUpdateManyWithoutAgentNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    WhatsAppAccount?: WhatsAppAccountUncheckedUpdateManyWithoutUserNestedInput
    MetaAdAccount?: MetaAdAccountUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAccountCreateInput = {
    id?: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWhatsAppAccountInput
    audiences?: WhatsAppAudienceCreateNestedManyWithoutAccountInput
    campaigns?: WhatsAppCampaignCreateNestedManyWithoutAccountInput
    phoneNumbers?: WhatsAppPhoneNumberCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountUncheckedCreateInput = {
    id?: string
    userId: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    audiences?: WhatsAppAudienceUncheckedCreateNestedManyWithoutAccountInput
    campaigns?: WhatsAppCampaignUncheckedCreateNestedManyWithoutAccountInput
    phoneNumbers?: WhatsAppPhoneNumberUncheckedCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWhatsAppAccountNestedInput
    audiences?: WhatsAppAudienceUpdateManyWithoutAccountNestedInput
    campaigns?: WhatsAppCampaignUpdateManyWithoutAccountNestedInput
    phoneNumbers?: WhatsAppPhoneNumberUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audiences?: WhatsAppAudienceUncheckedUpdateManyWithoutAccountNestedInput
    campaigns?: WhatsAppCampaignUncheckedUpdateManyWithoutAccountNestedInput
    phoneNumbers?: WhatsAppPhoneNumberUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppAccountCreateManyInput = {
    id?: string
    userId: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppPhoneNumberCreateInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    account: WhatsAppAccountCreateNestedOneWithoutPhoneNumbersInput
    recipients?: WhatsAppRecipientCreateNestedManyWithoutWhatsAppPhoneNumberInput
    messages?: WhatsAppMessageCreateNestedManyWithoutWhatsAppPhoneNumberInput
    automations?: WhatsAppAutomationCreateNestedManyWithoutPhoneNumberInput
  }

  export type WhatsAppPhoneNumberUncheckedCreateInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    accountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    recipients?: WhatsAppRecipientUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput
    messages?: WhatsAppMessageUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput
    automations?: WhatsAppAutomationUncheckedCreateNestedManyWithoutPhoneNumberInput
  }

  export type WhatsAppPhoneNumberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: WhatsAppAccountUpdateOneRequiredWithoutPhoneNumbersNestedInput
    recipients?: WhatsAppRecipientUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    messages?: WhatsAppMessageUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    automations?: WhatsAppAutomationUpdateManyWithoutPhoneNumberNestedInput
  }

  export type WhatsAppPhoneNumberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    accountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipients?: WhatsAppRecipientUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    messages?: WhatsAppMessageUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    automations?: WhatsAppAutomationUncheckedUpdateManyWithoutPhoneNumberNestedInput
  }

  export type WhatsAppPhoneNumberCreateManyInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    accountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppPhoneNumberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppPhoneNumberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    accountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAudienceCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    account: WhatsAppAccountCreateNestedOneWithoutAudiencesInput
    recipients?: WhatsAppRecipientCreateNestedManyWithoutAudienceInput
    campaigns?: WhatsAppCampaignCreateNestedManyWithoutAudienceInput
  }

  export type WhatsAppAudienceUncheckedCreateInput = {
    id?: string
    name: string
    accountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    recipients?: WhatsAppRecipientUncheckedCreateNestedManyWithoutAudienceInput
    campaigns?: WhatsAppCampaignUncheckedCreateNestedManyWithoutAudienceInput
  }

  export type WhatsAppAudienceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: WhatsAppAccountUpdateOneRequiredWithoutAudiencesNestedInput
    recipients?: WhatsAppRecipientUpdateManyWithoutAudienceNestedInput
    campaigns?: WhatsAppCampaignUpdateManyWithoutAudienceNestedInput
  }

  export type WhatsAppAudienceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipients?: WhatsAppRecipientUncheckedUpdateManyWithoutAudienceNestedInput
    campaigns?: WhatsAppCampaignUncheckedUpdateManyWithoutAudienceNestedInput
  }

  export type WhatsAppAudienceCreateManyInput = {
    id?: string
    name: string
    accountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppAudienceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAudienceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppRecipientCreateInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    audience?: WhatsAppAudienceCreateNestedOneWithoutRecipientsInput
    whatsAppPhoneNumber?: WhatsAppPhoneNumberCreateNestedOneWithoutRecipientsInput
    messages?: WhatsAppMessageCreateNestedManyWithoutRecipientInput
  }

  export type WhatsAppRecipientUncheckedCreateInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    audienceId?: string | null
    whatsAppPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: WhatsAppMessageUncheckedCreateNestedManyWithoutRecipientInput
  }

  export type WhatsAppRecipientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: WhatsAppAudienceUpdateOneWithoutRecipientsNestedInput
    whatsAppPhoneNumber?: WhatsAppPhoneNumberUpdateOneWithoutRecipientsNestedInput
    messages?: WhatsAppMessageUpdateManyWithoutRecipientNestedInput
  }

  export type WhatsAppRecipientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    audienceId?: NullableStringFieldUpdateOperationsInput | string | null
    whatsAppPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: WhatsAppMessageUncheckedUpdateManyWithoutRecipientNestedInput
  }

  export type WhatsAppRecipientCreateManyInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    audienceId?: string | null
    whatsAppPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppRecipientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppRecipientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    audienceId?: NullableStringFieldUpdateOperationsInput | string | null
    whatsAppPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppCampaignCreateInput = {
    id?: string
    name: string
    type: string
    message?: string | null
    mediaUrl?: string | null
    templateId?: string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    scheduledAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    account: WhatsAppAccountCreateNestedOneWithoutCampaignsInput
    audience: WhatsAppAudienceCreateNestedOneWithoutCampaignsInput
  }

  export type WhatsAppCampaignUncheckedCreateInput = {
    id?: string
    name: string
    type: string
    message?: string | null
    mediaUrl?: string | null
    templateId?: string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    accountId: string
    audienceId: string
    status?: string
    scheduledAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppCampaignUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: WhatsAppAccountUpdateOneRequiredWithoutCampaignsNestedInput
    audience?: WhatsAppAudienceUpdateOneRequiredWithoutCampaignsNestedInput
  }

  export type WhatsAppCampaignUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    accountId?: StringFieldUpdateOperationsInput | string
    audienceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppCampaignCreateManyInput = {
    id?: string
    name: string
    type: string
    message?: string | null
    mediaUrl?: string | null
    templateId?: string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    accountId: string
    audienceId: string
    status?: string
    scheduledAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppCampaignUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppCampaignUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    accountId?: StringFieldUpdateOperationsInput | string
    audienceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppMessageCreateInput = {
    id?: string
    wamid?: string | null
    status?: string
    message?: string | null
    isOutbound?: boolean
    errorMessage?: string | null
    phoneNumber?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    whatsAppPhoneNumber?: WhatsAppPhoneNumberCreateNestedOneWithoutMessagesInput
    recipient: WhatsAppRecipientCreateNestedOneWithoutMessagesInput
  }

  export type WhatsAppMessageUncheckedCreateInput = {
    id?: string
    wamid?: string | null
    status?: string
    message?: string | null
    isOutbound?: boolean
    errorMessage?: string | null
    phoneNumber?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    whatsAppPhoneNumberId?: string | null
    recipientId: string
  }

  export type WhatsAppMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    whatsAppPhoneNumber?: WhatsAppPhoneNumberUpdateOneWithoutMessagesNestedInput
    recipient?: WhatsAppRecipientUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type WhatsAppMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    whatsAppPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    recipientId?: StringFieldUpdateOperationsInput | string
  }

  export type WhatsAppMessageCreateManyInput = {
    id?: string
    wamid?: string | null
    status?: string
    message?: string | null
    isOutbound?: boolean
    errorMessage?: string | null
    phoneNumber?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    whatsAppPhoneNumberId?: string | null
    recipientId: string
  }

  export type WhatsAppMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    whatsAppPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    recipientId?: StringFieldUpdateOperationsInput | string
  }

  export type MetaAdAccountCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    accessToken: string
    pageId?: string | null
    status?: $Enums.ActivityStatus | null
    createdAt?: Date | string
    updatedAt?: Date | string
    agent: UserCreateNestedOneWithoutMetaAdAccountInput
  }

  export type MetaAdAccountUncheckedCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    accessToken: string
    pageId?: string | null
    status?: $Enums.ActivityStatus | null
    agentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MetaAdAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    pageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumActivityStatusFieldUpdateOperationsInput | $Enums.ActivityStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agent?: UserUpdateOneRequiredWithoutMetaAdAccountNestedInput
  }

  export type MetaAdAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    pageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumActivityStatusFieldUpdateOperationsInput | $Enums.ActivityStatus | null
    agentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetaAdAccountCreateManyInput = {
    id?: string
    name?: string | null
    email?: string | null
    accessToken: string
    pageId?: string | null
    status?: $Enums.ActivityStatus | null
    agentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MetaAdAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    pageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumActivityStatusFieldUpdateOperationsInput | $Enums.ActivityStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetaAdAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    pageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumActivityStatusFieldUpdateOperationsInput | $Enums.ActivityStatus | null
    agentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAutomationCreateInput = {
    id?: string
    name: string
    automationJson: JsonNullValueInput | InputJsonValue
    automationType: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    phoneNumber: WhatsAppPhoneNumberCreateNestedOneWithoutAutomationsInput
  }

  export type WhatsAppAutomationUncheckedCreateInput = {
    id?: string
    name: string
    phoneNumberId: string
    automationJson: JsonNullValueInput | InputJsonValue
    automationType: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppAutomationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    automationJson?: JsonNullValueInput | InputJsonValue
    automationType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneNumber?: WhatsAppPhoneNumberUpdateOneRequiredWithoutAutomationsNestedInput
  }

  export type WhatsAppAutomationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    automationJson?: JsonNullValueInput | InputJsonValue
    automationType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAutomationCreateManyInput = {
    id?: string
    name: string
    phoneNumberId: string
    automationJson: JsonNullValueInput | InputJsonValue
    automationType: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppAutomationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    automationJson?: JsonNullValueInput | InputJsonValue
    automationType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAutomationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    automationJson?: JsonNullValueInput | InputJsonValue
    automationType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type WhatsAppAccountListRelationFilter = {
    every?: WhatsAppAccountWhereInput
    some?: WhatsAppAccountWhereInput
    none?: WhatsAppAccountWhereInput
  }

  export type MetaAdAccountListRelationFilter = {
    every?: MetaAdAccountWhereInput
    some?: MetaAdAccountWhereInput
    none?: MetaAdAccountWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WhatsAppAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MetaAdAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type WhatsAppAudienceListRelationFilter = {
    every?: WhatsAppAudienceWhereInput
    some?: WhatsAppAudienceWhereInput
    none?: WhatsAppAudienceWhereInput
  }

  export type WhatsAppCampaignListRelationFilter = {
    every?: WhatsAppCampaignWhereInput
    some?: WhatsAppCampaignWhereInput
    none?: WhatsAppCampaignWhereInput
  }

  export type WhatsAppPhoneNumberListRelationFilter = {
    every?: WhatsAppPhoneNumberWhereInput
    some?: WhatsAppPhoneNumberWhereInput
    none?: WhatsAppPhoneNumberWhereInput
  }

  export type WhatsAppAudienceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WhatsAppCampaignOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WhatsAppPhoneNumberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WhatsAppAccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    wabaid?: SortOrder
    accessToken?: SortOrder
    phoneNumberIds?: SortOrder
    displayName?: SortOrder
    verified?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    wabaid?: SortOrder
    accessToken?: SortOrder
    displayName?: SortOrder
    verified?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppAccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    wabaid?: SortOrder
    accessToken?: SortOrder
    displayName?: SortOrder
    verified?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type WhatsAppAccountScalarRelationFilter = {
    is?: WhatsAppAccountWhereInput
    isNot?: WhatsAppAccountWhereInput
  }

  export type WhatsAppRecipientListRelationFilter = {
    every?: WhatsAppRecipientWhereInput
    some?: WhatsAppRecipientWhereInput
    none?: WhatsAppRecipientWhereInput
  }

  export type WhatsAppMessageListRelationFilter = {
    every?: WhatsAppMessageWhereInput
    some?: WhatsAppMessageWhereInput
    none?: WhatsAppMessageWhereInput
  }

  export type WhatsAppAutomationListRelationFilter = {
    every?: WhatsAppAutomationWhereInput
    some?: WhatsAppAutomationWhereInput
    none?: WhatsAppAutomationWhereInput
  }

  export type WhatsAppRecipientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WhatsAppMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WhatsAppAutomationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WhatsAppPhoneNumberCountOrderByAggregateInput = {
    id?: SortOrder
    phoneNumberId?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrder
    codeVerificationStatus?: SortOrder
    isRegistered?: SortOrder
    isSubscribed?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppPhoneNumberMaxOrderByAggregateInput = {
    id?: SortOrder
    phoneNumberId?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrder
    codeVerificationStatus?: SortOrder
    isRegistered?: SortOrder
    isSubscribed?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppPhoneNumberMinOrderByAggregateInput = {
    id?: SortOrder
    phoneNumberId?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrder
    codeVerificationStatus?: SortOrder
    isRegistered?: SortOrder
    isSubscribed?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppAudienceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppAudienceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppAudienceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    accountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppAudienceNullableScalarRelationFilter = {
    is?: WhatsAppAudienceWhereInput | null
    isNot?: WhatsAppAudienceWhereInput | null
  }

  export type WhatsAppPhoneNumberNullableScalarRelationFilter = {
    is?: WhatsAppPhoneNumberWhereInput | null
    isNot?: WhatsAppPhoneNumberWhereInput | null
  }

  export type WhatsAppRecipientAudienceIdPhoneNumberCompoundUniqueInput = {
    audienceId: string
    phoneNumber: string
  }

  export type WhatsAppRecipientCountOrderByAggregateInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrder
    audienceId?: SortOrder
    whatsAppPhoneNumberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppRecipientMaxOrderByAggregateInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrder
    audienceId?: SortOrder
    whatsAppPhoneNumberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppRecipientMinOrderByAggregateInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    name?: SortOrder
    audienceId?: SortOrder
    whatsAppPhoneNumberId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type WhatsAppAudienceScalarRelationFilter = {
    is?: WhatsAppAudienceWhereInput
    isNot?: WhatsAppAudienceWhereInput
  }

  export type WhatsAppCampaignCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    message?: SortOrder
    mediaUrl?: SortOrder
    templateId?: SortOrder
    templateParams?: SortOrder
    accountId?: SortOrder
    audienceId?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppCampaignMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    message?: SortOrder
    mediaUrl?: SortOrder
    templateId?: SortOrder
    accountId?: SortOrder
    audienceId?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppCampaignMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    message?: SortOrder
    mediaUrl?: SortOrder
    templateId?: SortOrder
    accountId?: SortOrder
    audienceId?: SortOrder
    status?: SortOrder
    scheduledAt?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type WhatsAppRecipientScalarRelationFilter = {
    is?: WhatsAppRecipientWhereInput
    isNot?: WhatsAppRecipientWhereInput
  }

  export type WhatsAppMessageCountOrderByAggregateInput = {
    id?: SortOrder
    wamid?: SortOrder
    status?: SortOrder
    message?: SortOrder
    isOutbound?: SortOrder
    errorMessage?: SortOrder
    phoneNumber?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    whatsAppPhoneNumberId?: SortOrder
    recipientId?: SortOrder
  }

  export type WhatsAppMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    wamid?: SortOrder
    status?: SortOrder
    message?: SortOrder
    isOutbound?: SortOrder
    errorMessage?: SortOrder
    phoneNumber?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    whatsAppPhoneNumberId?: SortOrder
    recipientId?: SortOrder
  }

  export type WhatsAppMessageMinOrderByAggregateInput = {
    id?: SortOrder
    wamid?: SortOrder
    status?: SortOrder
    message?: SortOrder
    isOutbound?: SortOrder
    errorMessage?: SortOrder
    phoneNumber?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    whatsAppPhoneNumberId?: SortOrder
    recipientId?: SortOrder
  }

  export type EnumActivityStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityStatus | EnumActivityStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.ActivityStatus[] | ListEnumActivityStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ActivityStatus[] | ListEnumActivityStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumActivityStatusNullableFilter<$PrismaModel> | $Enums.ActivityStatus | null
  }

  export type MetaAdAccountCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    accessToken?: SortOrder
    pageId?: SortOrder
    status?: SortOrder
    agentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MetaAdAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    accessToken?: SortOrder
    pageId?: SortOrder
    status?: SortOrder
    agentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MetaAdAccountMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    accessToken?: SortOrder
    pageId?: SortOrder
    status?: SortOrder
    agentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumActivityStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityStatus | EnumActivityStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.ActivityStatus[] | ListEnumActivityStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ActivityStatus[] | ListEnumActivityStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumActivityStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.ActivityStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumActivityStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumActivityStatusNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type WhatsAppPhoneNumberScalarRelationFilter = {
    is?: WhatsAppPhoneNumberWhereInput
    isNot?: WhatsAppPhoneNumberWhereInput
  }

  export type WhatsAppAutomationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumberId?: SortOrder
    automationJson?: SortOrder
    automationType?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppAutomationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumberId?: SortOrder
    automationType?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WhatsAppAutomationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phoneNumberId?: SortOrder
    automationType?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type WhatsAppAccountCreateNestedManyWithoutUserInput = {
    create?: XOR<WhatsAppAccountCreateWithoutUserInput, WhatsAppAccountUncheckedCreateWithoutUserInput> | WhatsAppAccountCreateWithoutUserInput[] | WhatsAppAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutUserInput | WhatsAppAccountCreateOrConnectWithoutUserInput[]
    createMany?: WhatsAppAccountCreateManyUserInputEnvelope
    connect?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
  }

  export type MetaAdAccountCreateNestedManyWithoutAgentInput = {
    create?: XOR<MetaAdAccountCreateWithoutAgentInput, MetaAdAccountUncheckedCreateWithoutAgentInput> | MetaAdAccountCreateWithoutAgentInput[] | MetaAdAccountUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: MetaAdAccountCreateOrConnectWithoutAgentInput | MetaAdAccountCreateOrConnectWithoutAgentInput[]
    createMany?: MetaAdAccountCreateManyAgentInputEnvelope
    connect?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
  }

  export type WhatsAppAccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WhatsAppAccountCreateWithoutUserInput, WhatsAppAccountUncheckedCreateWithoutUserInput> | WhatsAppAccountCreateWithoutUserInput[] | WhatsAppAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutUserInput | WhatsAppAccountCreateOrConnectWithoutUserInput[]
    createMany?: WhatsAppAccountCreateManyUserInputEnvelope
    connect?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
  }

  export type MetaAdAccountUncheckedCreateNestedManyWithoutAgentInput = {
    create?: XOR<MetaAdAccountCreateWithoutAgentInput, MetaAdAccountUncheckedCreateWithoutAgentInput> | MetaAdAccountCreateWithoutAgentInput[] | MetaAdAccountUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: MetaAdAccountCreateOrConnectWithoutAgentInput | MetaAdAccountCreateOrConnectWithoutAgentInput[]
    createMany?: MetaAdAccountCreateManyAgentInputEnvelope
    connect?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type WhatsAppAccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<WhatsAppAccountCreateWithoutUserInput, WhatsAppAccountUncheckedCreateWithoutUserInput> | WhatsAppAccountCreateWithoutUserInput[] | WhatsAppAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutUserInput | WhatsAppAccountCreateOrConnectWithoutUserInput[]
    upsert?: WhatsAppAccountUpsertWithWhereUniqueWithoutUserInput | WhatsAppAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WhatsAppAccountCreateManyUserInputEnvelope
    set?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
    disconnect?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
    delete?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
    connect?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
    update?: WhatsAppAccountUpdateWithWhereUniqueWithoutUserInput | WhatsAppAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WhatsAppAccountUpdateManyWithWhereWithoutUserInput | WhatsAppAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WhatsAppAccountScalarWhereInput | WhatsAppAccountScalarWhereInput[]
  }

  export type MetaAdAccountUpdateManyWithoutAgentNestedInput = {
    create?: XOR<MetaAdAccountCreateWithoutAgentInput, MetaAdAccountUncheckedCreateWithoutAgentInput> | MetaAdAccountCreateWithoutAgentInput[] | MetaAdAccountUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: MetaAdAccountCreateOrConnectWithoutAgentInput | MetaAdAccountCreateOrConnectWithoutAgentInput[]
    upsert?: MetaAdAccountUpsertWithWhereUniqueWithoutAgentInput | MetaAdAccountUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: MetaAdAccountCreateManyAgentInputEnvelope
    set?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
    disconnect?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
    delete?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
    connect?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
    update?: MetaAdAccountUpdateWithWhereUniqueWithoutAgentInput | MetaAdAccountUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: MetaAdAccountUpdateManyWithWhereWithoutAgentInput | MetaAdAccountUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: MetaAdAccountScalarWhereInput | MetaAdAccountScalarWhereInput[]
  }

  export type WhatsAppAccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WhatsAppAccountCreateWithoutUserInput, WhatsAppAccountUncheckedCreateWithoutUserInput> | WhatsAppAccountCreateWithoutUserInput[] | WhatsAppAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutUserInput | WhatsAppAccountCreateOrConnectWithoutUserInput[]
    upsert?: WhatsAppAccountUpsertWithWhereUniqueWithoutUserInput | WhatsAppAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WhatsAppAccountCreateManyUserInputEnvelope
    set?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
    disconnect?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
    delete?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
    connect?: WhatsAppAccountWhereUniqueInput | WhatsAppAccountWhereUniqueInput[]
    update?: WhatsAppAccountUpdateWithWhereUniqueWithoutUserInput | WhatsAppAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WhatsAppAccountUpdateManyWithWhereWithoutUserInput | WhatsAppAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WhatsAppAccountScalarWhereInput | WhatsAppAccountScalarWhereInput[]
  }

  export type MetaAdAccountUncheckedUpdateManyWithoutAgentNestedInput = {
    create?: XOR<MetaAdAccountCreateWithoutAgentInput, MetaAdAccountUncheckedCreateWithoutAgentInput> | MetaAdAccountCreateWithoutAgentInput[] | MetaAdAccountUncheckedCreateWithoutAgentInput[]
    connectOrCreate?: MetaAdAccountCreateOrConnectWithoutAgentInput | MetaAdAccountCreateOrConnectWithoutAgentInput[]
    upsert?: MetaAdAccountUpsertWithWhereUniqueWithoutAgentInput | MetaAdAccountUpsertWithWhereUniqueWithoutAgentInput[]
    createMany?: MetaAdAccountCreateManyAgentInputEnvelope
    set?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
    disconnect?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
    delete?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
    connect?: MetaAdAccountWhereUniqueInput | MetaAdAccountWhereUniqueInput[]
    update?: MetaAdAccountUpdateWithWhereUniqueWithoutAgentInput | MetaAdAccountUpdateWithWhereUniqueWithoutAgentInput[]
    updateMany?: MetaAdAccountUpdateManyWithWhereWithoutAgentInput | MetaAdAccountUpdateManyWithWhereWithoutAgentInput[]
    deleteMany?: MetaAdAccountScalarWhereInput | MetaAdAccountScalarWhereInput[]
  }

  export type WhatsAppAccountCreatephoneNumberIdsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutWhatsAppAccountInput = {
    create?: XOR<UserCreateWithoutWhatsAppAccountInput, UserUncheckedCreateWithoutWhatsAppAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutWhatsAppAccountInput
    connect?: UserWhereUniqueInput
  }

  export type WhatsAppAudienceCreateNestedManyWithoutAccountInput = {
    create?: XOR<WhatsAppAudienceCreateWithoutAccountInput, WhatsAppAudienceUncheckedCreateWithoutAccountInput> | WhatsAppAudienceCreateWithoutAccountInput[] | WhatsAppAudienceUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppAudienceCreateOrConnectWithoutAccountInput | WhatsAppAudienceCreateOrConnectWithoutAccountInput[]
    createMany?: WhatsAppAudienceCreateManyAccountInputEnvelope
    connect?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
  }

  export type WhatsAppCampaignCreateNestedManyWithoutAccountInput = {
    create?: XOR<WhatsAppCampaignCreateWithoutAccountInput, WhatsAppCampaignUncheckedCreateWithoutAccountInput> | WhatsAppCampaignCreateWithoutAccountInput[] | WhatsAppCampaignUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppCampaignCreateOrConnectWithoutAccountInput | WhatsAppCampaignCreateOrConnectWithoutAccountInput[]
    createMany?: WhatsAppCampaignCreateManyAccountInputEnvelope
    connect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
  }

  export type WhatsAppPhoneNumberCreateNestedManyWithoutAccountInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutAccountInput, WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput> | WhatsAppPhoneNumberCreateWithoutAccountInput[] | WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutAccountInput | WhatsAppPhoneNumberCreateOrConnectWithoutAccountInput[]
    createMany?: WhatsAppPhoneNumberCreateManyAccountInputEnvelope
    connect?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
  }

  export type WhatsAppAudienceUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<WhatsAppAudienceCreateWithoutAccountInput, WhatsAppAudienceUncheckedCreateWithoutAccountInput> | WhatsAppAudienceCreateWithoutAccountInput[] | WhatsAppAudienceUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppAudienceCreateOrConnectWithoutAccountInput | WhatsAppAudienceCreateOrConnectWithoutAccountInput[]
    createMany?: WhatsAppAudienceCreateManyAccountInputEnvelope
    connect?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
  }

  export type WhatsAppCampaignUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<WhatsAppCampaignCreateWithoutAccountInput, WhatsAppCampaignUncheckedCreateWithoutAccountInput> | WhatsAppCampaignCreateWithoutAccountInput[] | WhatsAppCampaignUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppCampaignCreateOrConnectWithoutAccountInput | WhatsAppCampaignCreateOrConnectWithoutAccountInput[]
    createMany?: WhatsAppCampaignCreateManyAccountInputEnvelope
    connect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
  }

  export type WhatsAppPhoneNumberUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutAccountInput, WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput> | WhatsAppPhoneNumberCreateWithoutAccountInput[] | WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutAccountInput | WhatsAppPhoneNumberCreateOrConnectWithoutAccountInput[]
    createMany?: WhatsAppPhoneNumberCreateManyAccountInputEnvelope
    connect?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
  }

  export type WhatsAppAccountUpdatephoneNumberIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutWhatsAppAccountNestedInput = {
    create?: XOR<UserCreateWithoutWhatsAppAccountInput, UserUncheckedCreateWithoutWhatsAppAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutWhatsAppAccountInput
    upsert?: UserUpsertWithoutWhatsAppAccountInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWhatsAppAccountInput, UserUpdateWithoutWhatsAppAccountInput>, UserUncheckedUpdateWithoutWhatsAppAccountInput>
  }

  export type WhatsAppAudienceUpdateManyWithoutAccountNestedInput = {
    create?: XOR<WhatsAppAudienceCreateWithoutAccountInput, WhatsAppAudienceUncheckedCreateWithoutAccountInput> | WhatsAppAudienceCreateWithoutAccountInput[] | WhatsAppAudienceUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppAudienceCreateOrConnectWithoutAccountInput | WhatsAppAudienceCreateOrConnectWithoutAccountInput[]
    upsert?: WhatsAppAudienceUpsertWithWhereUniqueWithoutAccountInput | WhatsAppAudienceUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: WhatsAppAudienceCreateManyAccountInputEnvelope
    set?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
    disconnect?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
    delete?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
    connect?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
    update?: WhatsAppAudienceUpdateWithWhereUniqueWithoutAccountInput | WhatsAppAudienceUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: WhatsAppAudienceUpdateManyWithWhereWithoutAccountInput | WhatsAppAudienceUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: WhatsAppAudienceScalarWhereInput | WhatsAppAudienceScalarWhereInput[]
  }

  export type WhatsAppCampaignUpdateManyWithoutAccountNestedInput = {
    create?: XOR<WhatsAppCampaignCreateWithoutAccountInput, WhatsAppCampaignUncheckedCreateWithoutAccountInput> | WhatsAppCampaignCreateWithoutAccountInput[] | WhatsAppCampaignUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppCampaignCreateOrConnectWithoutAccountInput | WhatsAppCampaignCreateOrConnectWithoutAccountInput[]
    upsert?: WhatsAppCampaignUpsertWithWhereUniqueWithoutAccountInput | WhatsAppCampaignUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: WhatsAppCampaignCreateManyAccountInputEnvelope
    set?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    disconnect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    delete?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    connect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    update?: WhatsAppCampaignUpdateWithWhereUniqueWithoutAccountInput | WhatsAppCampaignUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: WhatsAppCampaignUpdateManyWithWhereWithoutAccountInput | WhatsAppCampaignUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: WhatsAppCampaignScalarWhereInput | WhatsAppCampaignScalarWhereInput[]
  }

  export type WhatsAppPhoneNumberUpdateManyWithoutAccountNestedInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutAccountInput, WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput> | WhatsAppPhoneNumberCreateWithoutAccountInput[] | WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutAccountInput | WhatsAppPhoneNumberCreateOrConnectWithoutAccountInput[]
    upsert?: WhatsAppPhoneNumberUpsertWithWhereUniqueWithoutAccountInput | WhatsAppPhoneNumberUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: WhatsAppPhoneNumberCreateManyAccountInputEnvelope
    set?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
    disconnect?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
    delete?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
    connect?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
    update?: WhatsAppPhoneNumberUpdateWithWhereUniqueWithoutAccountInput | WhatsAppPhoneNumberUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: WhatsAppPhoneNumberUpdateManyWithWhereWithoutAccountInput | WhatsAppPhoneNumberUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: WhatsAppPhoneNumberScalarWhereInput | WhatsAppPhoneNumberScalarWhereInput[]
  }

  export type WhatsAppAudienceUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<WhatsAppAudienceCreateWithoutAccountInput, WhatsAppAudienceUncheckedCreateWithoutAccountInput> | WhatsAppAudienceCreateWithoutAccountInput[] | WhatsAppAudienceUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppAudienceCreateOrConnectWithoutAccountInput | WhatsAppAudienceCreateOrConnectWithoutAccountInput[]
    upsert?: WhatsAppAudienceUpsertWithWhereUniqueWithoutAccountInput | WhatsAppAudienceUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: WhatsAppAudienceCreateManyAccountInputEnvelope
    set?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
    disconnect?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
    delete?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
    connect?: WhatsAppAudienceWhereUniqueInput | WhatsAppAudienceWhereUniqueInput[]
    update?: WhatsAppAudienceUpdateWithWhereUniqueWithoutAccountInput | WhatsAppAudienceUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: WhatsAppAudienceUpdateManyWithWhereWithoutAccountInput | WhatsAppAudienceUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: WhatsAppAudienceScalarWhereInput | WhatsAppAudienceScalarWhereInput[]
  }

  export type WhatsAppCampaignUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<WhatsAppCampaignCreateWithoutAccountInput, WhatsAppCampaignUncheckedCreateWithoutAccountInput> | WhatsAppCampaignCreateWithoutAccountInput[] | WhatsAppCampaignUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppCampaignCreateOrConnectWithoutAccountInput | WhatsAppCampaignCreateOrConnectWithoutAccountInput[]
    upsert?: WhatsAppCampaignUpsertWithWhereUniqueWithoutAccountInput | WhatsAppCampaignUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: WhatsAppCampaignCreateManyAccountInputEnvelope
    set?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    disconnect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    delete?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    connect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    update?: WhatsAppCampaignUpdateWithWhereUniqueWithoutAccountInput | WhatsAppCampaignUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: WhatsAppCampaignUpdateManyWithWhereWithoutAccountInput | WhatsAppCampaignUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: WhatsAppCampaignScalarWhereInput | WhatsAppCampaignScalarWhereInput[]
  }

  export type WhatsAppPhoneNumberUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutAccountInput, WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput> | WhatsAppPhoneNumberCreateWithoutAccountInput[] | WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutAccountInput | WhatsAppPhoneNumberCreateOrConnectWithoutAccountInput[]
    upsert?: WhatsAppPhoneNumberUpsertWithWhereUniqueWithoutAccountInput | WhatsAppPhoneNumberUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: WhatsAppPhoneNumberCreateManyAccountInputEnvelope
    set?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
    disconnect?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
    delete?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
    connect?: WhatsAppPhoneNumberWhereUniqueInput | WhatsAppPhoneNumberWhereUniqueInput[]
    update?: WhatsAppPhoneNumberUpdateWithWhereUniqueWithoutAccountInput | WhatsAppPhoneNumberUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: WhatsAppPhoneNumberUpdateManyWithWhereWithoutAccountInput | WhatsAppPhoneNumberUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: WhatsAppPhoneNumberScalarWhereInput | WhatsAppPhoneNumberScalarWhereInput[]
  }

  export type WhatsAppAccountCreateNestedOneWithoutPhoneNumbersInput = {
    create?: XOR<WhatsAppAccountCreateWithoutPhoneNumbersInput, WhatsAppAccountUncheckedCreateWithoutPhoneNumbersInput>
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutPhoneNumbersInput
    connect?: WhatsAppAccountWhereUniqueInput
  }

  export type WhatsAppRecipientCreateNestedManyWithoutWhatsAppPhoneNumberInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput, WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput> | WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput[] | WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput[]
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientCreateOrConnectWithoutWhatsAppPhoneNumberInput[]
    createMany?: WhatsAppRecipientCreateManyWhatsAppPhoneNumberInputEnvelope
    connect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
  }

  export type WhatsAppMessageCreateNestedManyWithoutWhatsAppPhoneNumberInput = {
    create?: XOR<WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput, WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput> | WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput[] | WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput[]
    connectOrCreate?: WhatsAppMessageCreateOrConnectWithoutWhatsAppPhoneNumberInput | WhatsAppMessageCreateOrConnectWithoutWhatsAppPhoneNumberInput[]
    createMany?: WhatsAppMessageCreateManyWhatsAppPhoneNumberInputEnvelope
    connect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
  }

  export type WhatsAppAutomationCreateNestedManyWithoutPhoneNumberInput = {
    create?: XOR<WhatsAppAutomationCreateWithoutPhoneNumberInput, WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput> | WhatsAppAutomationCreateWithoutPhoneNumberInput[] | WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput[]
    connectOrCreate?: WhatsAppAutomationCreateOrConnectWithoutPhoneNumberInput | WhatsAppAutomationCreateOrConnectWithoutPhoneNumberInput[]
    createMany?: WhatsAppAutomationCreateManyPhoneNumberInputEnvelope
    connect?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
  }

  export type WhatsAppRecipientUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput, WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput> | WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput[] | WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput[]
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientCreateOrConnectWithoutWhatsAppPhoneNumberInput[]
    createMany?: WhatsAppRecipientCreateManyWhatsAppPhoneNumberInputEnvelope
    connect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
  }

  export type WhatsAppMessageUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput = {
    create?: XOR<WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput, WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput> | WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput[] | WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput[]
    connectOrCreate?: WhatsAppMessageCreateOrConnectWithoutWhatsAppPhoneNumberInput | WhatsAppMessageCreateOrConnectWithoutWhatsAppPhoneNumberInput[]
    createMany?: WhatsAppMessageCreateManyWhatsAppPhoneNumberInputEnvelope
    connect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
  }

  export type WhatsAppAutomationUncheckedCreateNestedManyWithoutPhoneNumberInput = {
    create?: XOR<WhatsAppAutomationCreateWithoutPhoneNumberInput, WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput> | WhatsAppAutomationCreateWithoutPhoneNumberInput[] | WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput[]
    connectOrCreate?: WhatsAppAutomationCreateOrConnectWithoutPhoneNumberInput | WhatsAppAutomationCreateOrConnectWithoutPhoneNumberInput[]
    createMany?: WhatsAppAutomationCreateManyPhoneNumberInputEnvelope
    connect?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
  }

  export type WhatsAppAccountUpdateOneRequiredWithoutPhoneNumbersNestedInput = {
    create?: XOR<WhatsAppAccountCreateWithoutPhoneNumbersInput, WhatsAppAccountUncheckedCreateWithoutPhoneNumbersInput>
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutPhoneNumbersInput
    upsert?: WhatsAppAccountUpsertWithoutPhoneNumbersInput
    connect?: WhatsAppAccountWhereUniqueInput
    update?: XOR<XOR<WhatsAppAccountUpdateToOneWithWhereWithoutPhoneNumbersInput, WhatsAppAccountUpdateWithoutPhoneNumbersInput>, WhatsAppAccountUncheckedUpdateWithoutPhoneNumbersInput>
  }

  export type WhatsAppRecipientUpdateManyWithoutWhatsAppPhoneNumberNestedInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput, WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput> | WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput[] | WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput[]
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientCreateOrConnectWithoutWhatsAppPhoneNumberInput[]
    upsert?: WhatsAppRecipientUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput[]
    createMany?: WhatsAppRecipientCreateManyWhatsAppPhoneNumberInputEnvelope
    set?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    disconnect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    delete?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    connect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    update?: WhatsAppRecipientUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput[]
    updateMany?: WhatsAppRecipientUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput[]
    deleteMany?: WhatsAppRecipientScalarWhereInput | WhatsAppRecipientScalarWhereInput[]
  }

  export type WhatsAppMessageUpdateManyWithoutWhatsAppPhoneNumberNestedInput = {
    create?: XOR<WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput, WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput> | WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput[] | WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput[]
    connectOrCreate?: WhatsAppMessageCreateOrConnectWithoutWhatsAppPhoneNumberInput | WhatsAppMessageCreateOrConnectWithoutWhatsAppPhoneNumberInput[]
    upsert?: WhatsAppMessageUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput | WhatsAppMessageUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput[]
    createMany?: WhatsAppMessageCreateManyWhatsAppPhoneNumberInputEnvelope
    set?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    disconnect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    delete?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    connect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    update?: WhatsAppMessageUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput | WhatsAppMessageUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput[]
    updateMany?: WhatsAppMessageUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput | WhatsAppMessageUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput[]
    deleteMany?: WhatsAppMessageScalarWhereInput | WhatsAppMessageScalarWhereInput[]
  }

  export type WhatsAppAutomationUpdateManyWithoutPhoneNumberNestedInput = {
    create?: XOR<WhatsAppAutomationCreateWithoutPhoneNumberInput, WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput> | WhatsAppAutomationCreateWithoutPhoneNumberInput[] | WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput[]
    connectOrCreate?: WhatsAppAutomationCreateOrConnectWithoutPhoneNumberInput | WhatsAppAutomationCreateOrConnectWithoutPhoneNumberInput[]
    upsert?: WhatsAppAutomationUpsertWithWhereUniqueWithoutPhoneNumberInput | WhatsAppAutomationUpsertWithWhereUniqueWithoutPhoneNumberInput[]
    createMany?: WhatsAppAutomationCreateManyPhoneNumberInputEnvelope
    set?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
    disconnect?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
    delete?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
    connect?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
    update?: WhatsAppAutomationUpdateWithWhereUniqueWithoutPhoneNumberInput | WhatsAppAutomationUpdateWithWhereUniqueWithoutPhoneNumberInput[]
    updateMany?: WhatsAppAutomationUpdateManyWithWhereWithoutPhoneNumberInput | WhatsAppAutomationUpdateManyWithWhereWithoutPhoneNumberInput[]
    deleteMany?: WhatsAppAutomationScalarWhereInput | WhatsAppAutomationScalarWhereInput[]
  }

  export type WhatsAppRecipientUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput, WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput> | WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput[] | WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput[]
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientCreateOrConnectWithoutWhatsAppPhoneNumberInput[]
    upsert?: WhatsAppRecipientUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput[]
    createMany?: WhatsAppRecipientCreateManyWhatsAppPhoneNumberInputEnvelope
    set?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    disconnect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    delete?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    connect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    update?: WhatsAppRecipientUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput[]
    updateMany?: WhatsAppRecipientUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput | WhatsAppRecipientUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput[]
    deleteMany?: WhatsAppRecipientScalarWhereInput | WhatsAppRecipientScalarWhereInput[]
  }

  export type WhatsAppMessageUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput = {
    create?: XOR<WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput, WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput> | WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput[] | WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput[]
    connectOrCreate?: WhatsAppMessageCreateOrConnectWithoutWhatsAppPhoneNumberInput | WhatsAppMessageCreateOrConnectWithoutWhatsAppPhoneNumberInput[]
    upsert?: WhatsAppMessageUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput | WhatsAppMessageUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput[]
    createMany?: WhatsAppMessageCreateManyWhatsAppPhoneNumberInputEnvelope
    set?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    disconnect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    delete?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    connect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    update?: WhatsAppMessageUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput | WhatsAppMessageUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput[]
    updateMany?: WhatsAppMessageUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput | WhatsAppMessageUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput[]
    deleteMany?: WhatsAppMessageScalarWhereInput | WhatsAppMessageScalarWhereInput[]
  }

  export type WhatsAppAutomationUncheckedUpdateManyWithoutPhoneNumberNestedInput = {
    create?: XOR<WhatsAppAutomationCreateWithoutPhoneNumberInput, WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput> | WhatsAppAutomationCreateWithoutPhoneNumberInput[] | WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput[]
    connectOrCreate?: WhatsAppAutomationCreateOrConnectWithoutPhoneNumberInput | WhatsAppAutomationCreateOrConnectWithoutPhoneNumberInput[]
    upsert?: WhatsAppAutomationUpsertWithWhereUniqueWithoutPhoneNumberInput | WhatsAppAutomationUpsertWithWhereUniqueWithoutPhoneNumberInput[]
    createMany?: WhatsAppAutomationCreateManyPhoneNumberInputEnvelope
    set?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
    disconnect?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
    delete?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
    connect?: WhatsAppAutomationWhereUniqueInput | WhatsAppAutomationWhereUniqueInput[]
    update?: WhatsAppAutomationUpdateWithWhereUniqueWithoutPhoneNumberInput | WhatsAppAutomationUpdateWithWhereUniqueWithoutPhoneNumberInput[]
    updateMany?: WhatsAppAutomationUpdateManyWithWhereWithoutPhoneNumberInput | WhatsAppAutomationUpdateManyWithWhereWithoutPhoneNumberInput[]
    deleteMany?: WhatsAppAutomationScalarWhereInput | WhatsAppAutomationScalarWhereInput[]
  }

  export type WhatsAppAccountCreateNestedOneWithoutAudiencesInput = {
    create?: XOR<WhatsAppAccountCreateWithoutAudiencesInput, WhatsAppAccountUncheckedCreateWithoutAudiencesInput>
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutAudiencesInput
    connect?: WhatsAppAccountWhereUniqueInput
  }

  export type WhatsAppRecipientCreateNestedManyWithoutAudienceInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutAudienceInput, WhatsAppRecipientUncheckedCreateWithoutAudienceInput> | WhatsAppRecipientCreateWithoutAudienceInput[] | WhatsAppRecipientUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutAudienceInput | WhatsAppRecipientCreateOrConnectWithoutAudienceInput[]
    createMany?: WhatsAppRecipientCreateManyAudienceInputEnvelope
    connect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
  }

  export type WhatsAppCampaignCreateNestedManyWithoutAudienceInput = {
    create?: XOR<WhatsAppCampaignCreateWithoutAudienceInput, WhatsAppCampaignUncheckedCreateWithoutAudienceInput> | WhatsAppCampaignCreateWithoutAudienceInput[] | WhatsAppCampaignUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: WhatsAppCampaignCreateOrConnectWithoutAudienceInput | WhatsAppCampaignCreateOrConnectWithoutAudienceInput[]
    createMany?: WhatsAppCampaignCreateManyAudienceInputEnvelope
    connect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
  }

  export type WhatsAppRecipientUncheckedCreateNestedManyWithoutAudienceInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutAudienceInput, WhatsAppRecipientUncheckedCreateWithoutAudienceInput> | WhatsAppRecipientCreateWithoutAudienceInput[] | WhatsAppRecipientUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutAudienceInput | WhatsAppRecipientCreateOrConnectWithoutAudienceInput[]
    createMany?: WhatsAppRecipientCreateManyAudienceInputEnvelope
    connect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
  }

  export type WhatsAppCampaignUncheckedCreateNestedManyWithoutAudienceInput = {
    create?: XOR<WhatsAppCampaignCreateWithoutAudienceInput, WhatsAppCampaignUncheckedCreateWithoutAudienceInput> | WhatsAppCampaignCreateWithoutAudienceInput[] | WhatsAppCampaignUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: WhatsAppCampaignCreateOrConnectWithoutAudienceInput | WhatsAppCampaignCreateOrConnectWithoutAudienceInput[]
    createMany?: WhatsAppCampaignCreateManyAudienceInputEnvelope
    connect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
  }

  export type WhatsAppAccountUpdateOneRequiredWithoutAudiencesNestedInput = {
    create?: XOR<WhatsAppAccountCreateWithoutAudiencesInput, WhatsAppAccountUncheckedCreateWithoutAudiencesInput>
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutAudiencesInput
    upsert?: WhatsAppAccountUpsertWithoutAudiencesInput
    connect?: WhatsAppAccountWhereUniqueInput
    update?: XOR<XOR<WhatsAppAccountUpdateToOneWithWhereWithoutAudiencesInput, WhatsAppAccountUpdateWithoutAudiencesInput>, WhatsAppAccountUncheckedUpdateWithoutAudiencesInput>
  }

  export type WhatsAppRecipientUpdateManyWithoutAudienceNestedInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutAudienceInput, WhatsAppRecipientUncheckedCreateWithoutAudienceInput> | WhatsAppRecipientCreateWithoutAudienceInput[] | WhatsAppRecipientUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutAudienceInput | WhatsAppRecipientCreateOrConnectWithoutAudienceInput[]
    upsert?: WhatsAppRecipientUpsertWithWhereUniqueWithoutAudienceInput | WhatsAppRecipientUpsertWithWhereUniqueWithoutAudienceInput[]
    createMany?: WhatsAppRecipientCreateManyAudienceInputEnvelope
    set?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    disconnect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    delete?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    connect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    update?: WhatsAppRecipientUpdateWithWhereUniqueWithoutAudienceInput | WhatsAppRecipientUpdateWithWhereUniqueWithoutAudienceInput[]
    updateMany?: WhatsAppRecipientUpdateManyWithWhereWithoutAudienceInput | WhatsAppRecipientUpdateManyWithWhereWithoutAudienceInput[]
    deleteMany?: WhatsAppRecipientScalarWhereInput | WhatsAppRecipientScalarWhereInput[]
  }

  export type WhatsAppCampaignUpdateManyWithoutAudienceNestedInput = {
    create?: XOR<WhatsAppCampaignCreateWithoutAudienceInput, WhatsAppCampaignUncheckedCreateWithoutAudienceInput> | WhatsAppCampaignCreateWithoutAudienceInput[] | WhatsAppCampaignUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: WhatsAppCampaignCreateOrConnectWithoutAudienceInput | WhatsAppCampaignCreateOrConnectWithoutAudienceInput[]
    upsert?: WhatsAppCampaignUpsertWithWhereUniqueWithoutAudienceInput | WhatsAppCampaignUpsertWithWhereUniqueWithoutAudienceInput[]
    createMany?: WhatsAppCampaignCreateManyAudienceInputEnvelope
    set?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    disconnect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    delete?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    connect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    update?: WhatsAppCampaignUpdateWithWhereUniqueWithoutAudienceInput | WhatsAppCampaignUpdateWithWhereUniqueWithoutAudienceInput[]
    updateMany?: WhatsAppCampaignUpdateManyWithWhereWithoutAudienceInput | WhatsAppCampaignUpdateManyWithWhereWithoutAudienceInput[]
    deleteMany?: WhatsAppCampaignScalarWhereInput | WhatsAppCampaignScalarWhereInput[]
  }

  export type WhatsAppRecipientUncheckedUpdateManyWithoutAudienceNestedInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutAudienceInput, WhatsAppRecipientUncheckedCreateWithoutAudienceInput> | WhatsAppRecipientCreateWithoutAudienceInput[] | WhatsAppRecipientUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutAudienceInput | WhatsAppRecipientCreateOrConnectWithoutAudienceInput[]
    upsert?: WhatsAppRecipientUpsertWithWhereUniqueWithoutAudienceInput | WhatsAppRecipientUpsertWithWhereUniqueWithoutAudienceInput[]
    createMany?: WhatsAppRecipientCreateManyAudienceInputEnvelope
    set?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    disconnect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    delete?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    connect?: WhatsAppRecipientWhereUniqueInput | WhatsAppRecipientWhereUniqueInput[]
    update?: WhatsAppRecipientUpdateWithWhereUniqueWithoutAudienceInput | WhatsAppRecipientUpdateWithWhereUniqueWithoutAudienceInput[]
    updateMany?: WhatsAppRecipientUpdateManyWithWhereWithoutAudienceInput | WhatsAppRecipientUpdateManyWithWhereWithoutAudienceInput[]
    deleteMany?: WhatsAppRecipientScalarWhereInput | WhatsAppRecipientScalarWhereInput[]
  }

  export type WhatsAppCampaignUncheckedUpdateManyWithoutAudienceNestedInput = {
    create?: XOR<WhatsAppCampaignCreateWithoutAudienceInput, WhatsAppCampaignUncheckedCreateWithoutAudienceInput> | WhatsAppCampaignCreateWithoutAudienceInput[] | WhatsAppCampaignUncheckedCreateWithoutAudienceInput[]
    connectOrCreate?: WhatsAppCampaignCreateOrConnectWithoutAudienceInput | WhatsAppCampaignCreateOrConnectWithoutAudienceInput[]
    upsert?: WhatsAppCampaignUpsertWithWhereUniqueWithoutAudienceInput | WhatsAppCampaignUpsertWithWhereUniqueWithoutAudienceInput[]
    createMany?: WhatsAppCampaignCreateManyAudienceInputEnvelope
    set?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    disconnect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    delete?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    connect?: WhatsAppCampaignWhereUniqueInput | WhatsAppCampaignWhereUniqueInput[]
    update?: WhatsAppCampaignUpdateWithWhereUniqueWithoutAudienceInput | WhatsAppCampaignUpdateWithWhereUniqueWithoutAudienceInput[]
    updateMany?: WhatsAppCampaignUpdateManyWithWhereWithoutAudienceInput | WhatsAppCampaignUpdateManyWithWhereWithoutAudienceInput[]
    deleteMany?: WhatsAppCampaignScalarWhereInput | WhatsAppCampaignScalarWhereInput[]
  }

  export type WhatsAppAudienceCreateNestedOneWithoutRecipientsInput = {
    create?: XOR<WhatsAppAudienceCreateWithoutRecipientsInput, WhatsAppAudienceUncheckedCreateWithoutRecipientsInput>
    connectOrCreate?: WhatsAppAudienceCreateOrConnectWithoutRecipientsInput
    connect?: WhatsAppAudienceWhereUniqueInput
  }

  export type WhatsAppPhoneNumberCreateNestedOneWithoutRecipientsInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutRecipientsInput, WhatsAppPhoneNumberUncheckedCreateWithoutRecipientsInput>
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutRecipientsInput
    connect?: WhatsAppPhoneNumberWhereUniqueInput
  }

  export type WhatsAppMessageCreateNestedManyWithoutRecipientInput = {
    create?: XOR<WhatsAppMessageCreateWithoutRecipientInput, WhatsAppMessageUncheckedCreateWithoutRecipientInput> | WhatsAppMessageCreateWithoutRecipientInput[] | WhatsAppMessageUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: WhatsAppMessageCreateOrConnectWithoutRecipientInput | WhatsAppMessageCreateOrConnectWithoutRecipientInput[]
    createMany?: WhatsAppMessageCreateManyRecipientInputEnvelope
    connect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
  }

  export type WhatsAppMessageUncheckedCreateNestedManyWithoutRecipientInput = {
    create?: XOR<WhatsAppMessageCreateWithoutRecipientInput, WhatsAppMessageUncheckedCreateWithoutRecipientInput> | WhatsAppMessageCreateWithoutRecipientInput[] | WhatsAppMessageUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: WhatsAppMessageCreateOrConnectWithoutRecipientInput | WhatsAppMessageCreateOrConnectWithoutRecipientInput[]
    createMany?: WhatsAppMessageCreateManyRecipientInputEnvelope
    connect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
  }

  export type WhatsAppAudienceUpdateOneWithoutRecipientsNestedInput = {
    create?: XOR<WhatsAppAudienceCreateWithoutRecipientsInput, WhatsAppAudienceUncheckedCreateWithoutRecipientsInput>
    connectOrCreate?: WhatsAppAudienceCreateOrConnectWithoutRecipientsInput
    upsert?: WhatsAppAudienceUpsertWithoutRecipientsInput
    disconnect?: WhatsAppAudienceWhereInput | boolean
    delete?: WhatsAppAudienceWhereInput | boolean
    connect?: WhatsAppAudienceWhereUniqueInput
    update?: XOR<XOR<WhatsAppAudienceUpdateToOneWithWhereWithoutRecipientsInput, WhatsAppAudienceUpdateWithoutRecipientsInput>, WhatsAppAudienceUncheckedUpdateWithoutRecipientsInput>
  }

  export type WhatsAppPhoneNumberUpdateOneWithoutRecipientsNestedInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutRecipientsInput, WhatsAppPhoneNumberUncheckedCreateWithoutRecipientsInput>
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutRecipientsInput
    upsert?: WhatsAppPhoneNumberUpsertWithoutRecipientsInput
    disconnect?: WhatsAppPhoneNumberWhereInput | boolean
    delete?: WhatsAppPhoneNumberWhereInput | boolean
    connect?: WhatsAppPhoneNumberWhereUniqueInput
    update?: XOR<XOR<WhatsAppPhoneNumberUpdateToOneWithWhereWithoutRecipientsInput, WhatsAppPhoneNumberUpdateWithoutRecipientsInput>, WhatsAppPhoneNumberUncheckedUpdateWithoutRecipientsInput>
  }

  export type WhatsAppMessageUpdateManyWithoutRecipientNestedInput = {
    create?: XOR<WhatsAppMessageCreateWithoutRecipientInput, WhatsAppMessageUncheckedCreateWithoutRecipientInput> | WhatsAppMessageCreateWithoutRecipientInput[] | WhatsAppMessageUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: WhatsAppMessageCreateOrConnectWithoutRecipientInput | WhatsAppMessageCreateOrConnectWithoutRecipientInput[]
    upsert?: WhatsAppMessageUpsertWithWhereUniqueWithoutRecipientInput | WhatsAppMessageUpsertWithWhereUniqueWithoutRecipientInput[]
    createMany?: WhatsAppMessageCreateManyRecipientInputEnvelope
    set?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    disconnect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    delete?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    connect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    update?: WhatsAppMessageUpdateWithWhereUniqueWithoutRecipientInput | WhatsAppMessageUpdateWithWhereUniqueWithoutRecipientInput[]
    updateMany?: WhatsAppMessageUpdateManyWithWhereWithoutRecipientInput | WhatsAppMessageUpdateManyWithWhereWithoutRecipientInput[]
    deleteMany?: WhatsAppMessageScalarWhereInput | WhatsAppMessageScalarWhereInput[]
  }

  export type WhatsAppMessageUncheckedUpdateManyWithoutRecipientNestedInput = {
    create?: XOR<WhatsAppMessageCreateWithoutRecipientInput, WhatsAppMessageUncheckedCreateWithoutRecipientInput> | WhatsAppMessageCreateWithoutRecipientInput[] | WhatsAppMessageUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: WhatsAppMessageCreateOrConnectWithoutRecipientInput | WhatsAppMessageCreateOrConnectWithoutRecipientInput[]
    upsert?: WhatsAppMessageUpsertWithWhereUniqueWithoutRecipientInput | WhatsAppMessageUpsertWithWhereUniqueWithoutRecipientInput[]
    createMany?: WhatsAppMessageCreateManyRecipientInputEnvelope
    set?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    disconnect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    delete?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    connect?: WhatsAppMessageWhereUniqueInput | WhatsAppMessageWhereUniqueInput[]
    update?: WhatsAppMessageUpdateWithWhereUniqueWithoutRecipientInput | WhatsAppMessageUpdateWithWhereUniqueWithoutRecipientInput[]
    updateMany?: WhatsAppMessageUpdateManyWithWhereWithoutRecipientInput | WhatsAppMessageUpdateManyWithWhereWithoutRecipientInput[]
    deleteMany?: WhatsAppMessageScalarWhereInput | WhatsAppMessageScalarWhereInput[]
  }

  export type WhatsAppAccountCreateNestedOneWithoutCampaignsInput = {
    create?: XOR<WhatsAppAccountCreateWithoutCampaignsInput, WhatsAppAccountUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutCampaignsInput
    connect?: WhatsAppAccountWhereUniqueInput
  }

  export type WhatsAppAudienceCreateNestedOneWithoutCampaignsInput = {
    create?: XOR<WhatsAppAudienceCreateWithoutCampaignsInput, WhatsAppAudienceUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: WhatsAppAudienceCreateOrConnectWithoutCampaignsInput
    connect?: WhatsAppAudienceWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type WhatsAppAccountUpdateOneRequiredWithoutCampaignsNestedInput = {
    create?: XOR<WhatsAppAccountCreateWithoutCampaignsInput, WhatsAppAccountUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: WhatsAppAccountCreateOrConnectWithoutCampaignsInput
    upsert?: WhatsAppAccountUpsertWithoutCampaignsInput
    connect?: WhatsAppAccountWhereUniqueInput
    update?: XOR<XOR<WhatsAppAccountUpdateToOneWithWhereWithoutCampaignsInput, WhatsAppAccountUpdateWithoutCampaignsInput>, WhatsAppAccountUncheckedUpdateWithoutCampaignsInput>
  }

  export type WhatsAppAudienceUpdateOneRequiredWithoutCampaignsNestedInput = {
    create?: XOR<WhatsAppAudienceCreateWithoutCampaignsInput, WhatsAppAudienceUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: WhatsAppAudienceCreateOrConnectWithoutCampaignsInput
    upsert?: WhatsAppAudienceUpsertWithoutCampaignsInput
    connect?: WhatsAppAudienceWhereUniqueInput
    update?: XOR<XOR<WhatsAppAudienceUpdateToOneWithWhereWithoutCampaignsInput, WhatsAppAudienceUpdateWithoutCampaignsInput>, WhatsAppAudienceUncheckedUpdateWithoutCampaignsInput>
  }

  export type WhatsAppPhoneNumberCreateNestedOneWithoutMessagesInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutMessagesInput, WhatsAppPhoneNumberUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutMessagesInput
    connect?: WhatsAppPhoneNumberWhereUniqueInput
  }

  export type WhatsAppRecipientCreateNestedOneWithoutMessagesInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutMessagesInput, WhatsAppRecipientUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutMessagesInput
    connect?: WhatsAppRecipientWhereUniqueInput
  }

  export type WhatsAppPhoneNumberUpdateOneWithoutMessagesNestedInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutMessagesInput, WhatsAppPhoneNumberUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutMessagesInput
    upsert?: WhatsAppPhoneNumberUpsertWithoutMessagesInput
    disconnect?: WhatsAppPhoneNumberWhereInput | boolean
    delete?: WhatsAppPhoneNumberWhereInput | boolean
    connect?: WhatsAppPhoneNumberWhereUniqueInput
    update?: XOR<XOR<WhatsAppPhoneNumberUpdateToOneWithWhereWithoutMessagesInput, WhatsAppPhoneNumberUpdateWithoutMessagesInput>, WhatsAppPhoneNumberUncheckedUpdateWithoutMessagesInput>
  }

  export type WhatsAppRecipientUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<WhatsAppRecipientCreateWithoutMessagesInput, WhatsAppRecipientUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: WhatsAppRecipientCreateOrConnectWithoutMessagesInput
    upsert?: WhatsAppRecipientUpsertWithoutMessagesInput
    connect?: WhatsAppRecipientWhereUniqueInput
    update?: XOR<XOR<WhatsAppRecipientUpdateToOneWithWhereWithoutMessagesInput, WhatsAppRecipientUpdateWithoutMessagesInput>, WhatsAppRecipientUncheckedUpdateWithoutMessagesInput>
  }

  export type UserCreateNestedOneWithoutMetaAdAccountInput = {
    create?: XOR<UserCreateWithoutMetaAdAccountInput, UserUncheckedCreateWithoutMetaAdAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutMetaAdAccountInput
    connect?: UserWhereUniqueInput
  }

  export type NullableEnumActivityStatusFieldUpdateOperationsInput = {
    set?: $Enums.ActivityStatus | null
  }

  export type UserUpdateOneRequiredWithoutMetaAdAccountNestedInput = {
    create?: XOR<UserCreateWithoutMetaAdAccountInput, UserUncheckedCreateWithoutMetaAdAccountInput>
    connectOrCreate?: UserCreateOrConnectWithoutMetaAdAccountInput
    upsert?: UserUpsertWithoutMetaAdAccountInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMetaAdAccountInput, UserUpdateWithoutMetaAdAccountInput>, UserUncheckedUpdateWithoutMetaAdAccountInput>
  }

  export type WhatsAppPhoneNumberCreateNestedOneWithoutAutomationsInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutAutomationsInput, WhatsAppPhoneNumberUncheckedCreateWithoutAutomationsInput>
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutAutomationsInput
    connect?: WhatsAppPhoneNumberWhereUniqueInput
  }

  export type WhatsAppPhoneNumberUpdateOneRequiredWithoutAutomationsNestedInput = {
    create?: XOR<WhatsAppPhoneNumberCreateWithoutAutomationsInput, WhatsAppPhoneNumberUncheckedCreateWithoutAutomationsInput>
    connectOrCreate?: WhatsAppPhoneNumberCreateOrConnectWithoutAutomationsInput
    upsert?: WhatsAppPhoneNumberUpsertWithoutAutomationsInput
    connect?: WhatsAppPhoneNumberWhereUniqueInput
    update?: XOR<XOR<WhatsAppPhoneNumberUpdateToOneWithWhereWithoutAutomationsInput, WhatsAppPhoneNumberUpdateWithoutAutomationsInput>, WhatsAppPhoneNumberUncheckedUpdateWithoutAutomationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumActivityStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityStatus | EnumActivityStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.ActivityStatus[] | ListEnumActivityStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ActivityStatus[] | ListEnumActivityStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumActivityStatusNullableFilter<$PrismaModel> | $Enums.ActivityStatus | null
  }

  export type NestedEnumActivityStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ActivityStatus | EnumActivityStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.ActivityStatus[] | ListEnumActivityStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ActivityStatus[] | ListEnumActivityStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumActivityStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.ActivityStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumActivityStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumActivityStatusNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type WhatsAppAccountCreateWithoutUserInput = {
    id?: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    audiences?: WhatsAppAudienceCreateNestedManyWithoutAccountInput
    campaigns?: WhatsAppCampaignCreateNestedManyWithoutAccountInput
    phoneNumbers?: WhatsAppPhoneNumberCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountUncheckedCreateWithoutUserInput = {
    id?: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    audiences?: WhatsAppAudienceUncheckedCreateNestedManyWithoutAccountInput
    campaigns?: WhatsAppCampaignUncheckedCreateNestedManyWithoutAccountInput
    phoneNumbers?: WhatsAppPhoneNumberUncheckedCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountCreateOrConnectWithoutUserInput = {
    where: WhatsAppAccountWhereUniqueInput
    create: XOR<WhatsAppAccountCreateWithoutUserInput, WhatsAppAccountUncheckedCreateWithoutUserInput>
  }

  export type WhatsAppAccountCreateManyUserInputEnvelope = {
    data: WhatsAppAccountCreateManyUserInput | WhatsAppAccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MetaAdAccountCreateWithoutAgentInput = {
    id?: string
    name?: string | null
    email?: string | null
    accessToken: string
    pageId?: string | null
    status?: $Enums.ActivityStatus | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MetaAdAccountUncheckedCreateWithoutAgentInput = {
    id?: string
    name?: string | null
    email?: string | null
    accessToken: string
    pageId?: string | null
    status?: $Enums.ActivityStatus | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MetaAdAccountCreateOrConnectWithoutAgentInput = {
    where: MetaAdAccountWhereUniqueInput
    create: XOR<MetaAdAccountCreateWithoutAgentInput, MetaAdAccountUncheckedCreateWithoutAgentInput>
  }

  export type MetaAdAccountCreateManyAgentInputEnvelope = {
    data: MetaAdAccountCreateManyAgentInput | MetaAdAccountCreateManyAgentInput[]
    skipDuplicates?: boolean
  }

  export type WhatsAppAccountUpsertWithWhereUniqueWithoutUserInput = {
    where: WhatsAppAccountWhereUniqueInput
    update: XOR<WhatsAppAccountUpdateWithoutUserInput, WhatsAppAccountUncheckedUpdateWithoutUserInput>
    create: XOR<WhatsAppAccountCreateWithoutUserInput, WhatsAppAccountUncheckedCreateWithoutUserInput>
  }

  export type WhatsAppAccountUpdateWithWhereUniqueWithoutUserInput = {
    where: WhatsAppAccountWhereUniqueInput
    data: XOR<WhatsAppAccountUpdateWithoutUserInput, WhatsAppAccountUncheckedUpdateWithoutUserInput>
  }

  export type WhatsAppAccountUpdateManyWithWhereWithoutUserInput = {
    where: WhatsAppAccountScalarWhereInput
    data: XOR<WhatsAppAccountUpdateManyMutationInput, WhatsAppAccountUncheckedUpdateManyWithoutUserInput>
  }

  export type WhatsAppAccountScalarWhereInput = {
    AND?: WhatsAppAccountScalarWhereInput | WhatsAppAccountScalarWhereInput[]
    OR?: WhatsAppAccountScalarWhereInput[]
    NOT?: WhatsAppAccountScalarWhereInput | WhatsAppAccountScalarWhereInput[]
    id?: StringFilter<"WhatsAppAccount"> | string
    userId?: StringFilter<"WhatsAppAccount"> | string
    wabaid?: StringFilter<"WhatsAppAccount"> | string
    accessToken?: StringFilter<"WhatsAppAccount"> | string
    phoneNumberIds?: StringNullableListFilter<"WhatsAppAccount">
    displayName?: StringFilter<"WhatsAppAccount"> | string
    verified?: BoolFilter<"WhatsAppAccount"> | boolean
    status?: StringFilter<"WhatsAppAccount"> | string
    createdAt?: DateTimeFilter<"WhatsAppAccount"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppAccount"> | Date | string
  }

  export type MetaAdAccountUpsertWithWhereUniqueWithoutAgentInput = {
    where: MetaAdAccountWhereUniqueInput
    update: XOR<MetaAdAccountUpdateWithoutAgentInput, MetaAdAccountUncheckedUpdateWithoutAgentInput>
    create: XOR<MetaAdAccountCreateWithoutAgentInput, MetaAdAccountUncheckedCreateWithoutAgentInput>
  }

  export type MetaAdAccountUpdateWithWhereUniqueWithoutAgentInput = {
    where: MetaAdAccountWhereUniqueInput
    data: XOR<MetaAdAccountUpdateWithoutAgentInput, MetaAdAccountUncheckedUpdateWithoutAgentInput>
  }

  export type MetaAdAccountUpdateManyWithWhereWithoutAgentInput = {
    where: MetaAdAccountScalarWhereInput
    data: XOR<MetaAdAccountUpdateManyMutationInput, MetaAdAccountUncheckedUpdateManyWithoutAgentInput>
  }

  export type MetaAdAccountScalarWhereInput = {
    AND?: MetaAdAccountScalarWhereInput | MetaAdAccountScalarWhereInput[]
    OR?: MetaAdAccountScalarWhereInput[]
    NOT?: MetaAdAccountScalarWhereInput | MetaAdAccountScalarWhereInput[]
    id?: StringFilter<"MetaAdAccount"> | string
    name?: StringNullableFilter<"MetaAdAccount"> | string | null
    email?: StringNullableFilter<"MetaAdAccount"> | string | null
    accessToken?: StringFilter<"MetaAdAccount"> | string
    pageId?: StringNullableFilter<"MetaAdAccount"> | string | null
    status?: EnumActivityStatusNullableFilter<"MetaAdAccount"> | $Enums.ActivityStatus | null
    agentId?: StringFilter<"MetaAdAccount"> | string
    createdAt?: DateTimeFilter<"MetaAdAccount"> | Date | string
    updatedAt?: DateTimeFilter<"MetaAdAccount"> | Date | string
  }

  export type UserCreateWithoutWhatsAppAccountInput = {
    id?: string
    name: string
    email: string
    password: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    MetaAdAccount?: MetaAdAccountCreateNestedManyWithoutAgentInput
  }

  export type UserUncheckedCreateWithoutWhatsAppAccountInput = {
    id?: string
    name: string
    email: string
    password: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    MetaAdAccount?: MetaAdAccountUncheckedCreateNestedManyWithoutAgentInput
  }

  export type UserCreateOrConnectWithoutWhatsAppAccountInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWhatsAppAccountInput, UserUncheckedCreateWithoutWhatsAppAccountInput>
  }

  export type WhatsAppAudienceCreateWithoutAccountInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    recipients?: WhatsAppRecipientCreateNestedManyWithoutAudienceInput
    campaigns?: WhatsAppCampaignCreateNestedManyWithoutAudienceInput
  }

  export type WhatsAppAudienceUncheckedCreateWithoutAccountInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    recipients?: WhatsAppRecipientUncheckedCreateNestedManyWithoutAudienceInput
    campaigns?: WhatsAppCampaignUncheckedCreateNestedManyWithoutAudienceInput
  }

  export type WhatsAppAudienceCreateOrConnectWithoutAccountInput = {
    where: WhatsAppAudienceWhereUniqueInput
    create: XOR<WhatsAppAudienceCreateWithoutAccountInput, WhatsAppAudienceUncheckedCreateWithoutAccountInput>
  }

  export type WhatsAppAudienceCreateManyAccountInputEnvelope = {
    data: WhatsAppAudienceCreateManyAccountInput | WhatsAppAudienceCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type WhatsAppCampaignCreateWithoutAccountInput = {
    id?: string
    name: string
    type: string
    message?: string | null
    mediaUrl?: string | null
    templateId?: string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    scheduledAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    audience: WhatsAppAudienceCreateNestedOneWithoutCampaignsInput
  }

  export type WhatsAppCampaignUncheckedCreateWithoutAccountInput = {
    id?: string
    name: string
    type: string
    message?: string | null
    mediaUrl?: string | null
    templateId?: string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    audienceId: string
    status?: string
    scheduledAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppCampaignCreateOrConnectWithoutAccountInput = {
    where: WhatsAppCampaignWhereUniqueInput
    create: XOR<WhatsAppCampaignCreateWithoutAccountInput, WhatsAppCampaignUncheckedCreateWithoutAccountInput>
  }

  export type WhatsAppCampaignCreateManyAccountInputEnvelope = {
    data: WhatsAppCampaignCreateManyAccountInput | WhatsAppCampaignCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type WhatsAppPhoneNumberCreateWithoutAccountInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipients?: WhatsAppRecipientCreateNestedManyWithoutWhatsAppPhoneNumberInput
    messages?: WhatsAppMessageCreateNestedManyWithoutWhatsAppPhoneNumberInput
    automations?: WhatsAppAutomationCreateNestedManyWithoutPhoneNumberInput
  }

  export type WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    recipients?: WhatsAppRecipientUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput
    messages?: WhatsAppMessageUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput
    automations?: WhatsAppAutomationUncheckedCreateNestedManyWithoutPhoneNumberInput
  }

  export type WhatsAppPhoneNumberCreateOrConnectWithoutAccountInput = {
    where: WhatsAppPhoneNumberWhereUniqueInput
    create: XOR<WhatsAppPhoneNumberCreateWithoutAccountInput, WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput>
  }

  export type WhatsAppPhoneNumberCreateManyAccountInputEnvelope = {
    data: WhatsAppPhoneNumberCreateManyAccountInput | WhatsAppPhoneNumberCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutWhatsAppAccountInput = {
    update: XOR<UserUpdateWithoutWhatsAppAccountInput, UserUncheckedUpdateWithoutWhatsAppAccountInput>
    create: XOR<UserCreateWithoutWhatsAppAccountInput, UserUncheckedCreateWithoutWhatsAppAccountInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWhatsAppAccountInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWhatsAppAccountInput, UserUncheckedUpdateWithoutWhatsAppAccountInput>
  }

  export type UserUpdateWithoutWhatsAppAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    MetaAdAccount?: MetaAdAccountUpdateManyWithoutAgentNestedInput
  }

  export type UserUncheckedUpdateWithoutWhatsAppAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    MetaAdAccount?: MetaAdAccountUncheckedUpdateManyWithoutAgentNestedInput
  }

  export type WhatsAppAudienceUpsertWithWhereUniqueWithoutAccountInput = {
    where: WhatsAppAudienceWhereUniqueInput
    update: XOR<WhatsAppAudienceUpdateWithoutAccountInput, WhatsAppAudienceUncheckedUpdateWithoutAccountInput>
    create: XOR<WhatsAppAudienceCreateWithoutAccountInput, WhatsAppAudienceUncheckedCreateWithoutAccountInput>
  }

  export type WhatsAppAudienceUpdateWithWhereUniqueWithoutAccountInput = {
    where: WhatsAppAudienceWhereUniqueInput
    data: XOR<WhatsAppAudienceUpdateWithoutAccountInput, WhatsAppAudienceUncheckedUpdateWithoutAccountInput>
  }

  export type WhatsAppAudienceUpdateManyWithWhereWithoutAccountInput = {
    where: WhatsAppAudienceScalarWhereInput
    data: XOR<WhatsAppAudienceUpdateManyMutationInput, WhatsAppAudienceUncheckedUpdateManyWithoutAccountInput>
  }

  export type WhatsAppAudienceScalarWhereInput = {
    AND?: WhatsAppAudienceScalarWhereInput | WhatsAppAudienceScalarWhereInput[]
    OR?: WhatsAppAudienceScalarWhereInput[]
    NOT?: WhatsAppAudienceScalarWhereInput | WhatsAppAudienceScalarWhereInput[]
    id?: StringFilter<"WhatsAppAudience"> | string
    name?: StringFilter<"WhatsAppAudience"> | string
    accountId?: StringFilter<"WhatsAppAudience"> | string
    createdAt?: DateTimeFilter<"WhatsAppAudience"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppAudience"> | Date | string
  }

  export type WhatsAppCampaignUpsertWithWhereUniqueWithoutAccountInput = {
    where: WhatsAppCampaignWhereUniqueInput
    update: XOR<WhatsAppCampaignUpdateWithoutAccountInput, WhatsAppCampaignUncheckedUpdateWithoutAccountInput>
    create: XOR<WhatsAppCampaignCreateWithoutAccountInput, WhatsAppCampaignUncheckedCreateWithoutAccountInput>
  }

  export type WhatsAppCampaignUpdateWithWhereUniqueWithoutAccountInput = {
    where: WhatsAppCampaignWhereUniqueInput
    data: XOR<WhatsAppCampaignUpdateWithoutAccountInput, WhatsAppCampaignUncheckedUpdateWithoutAccountInput>
  }

  export type WhatsAppCampaignUpdateManyWithWhereWithoutAccountInput = {
    where: WhatsAppCampaignScalarWhereInput
    data: XOR<WhatsAppCampaignUpdateManyMutationInput, WhatsAppCampaignUncheckedUpdateManyWithoutAccountInput>
  }

  export type WhatsAppCampaignScalarWhereInput = {
    AND?: WhatsAppCampaignScalarWhereInput | WhatsAppCampaignScalarWhereInput[]
    OR?: WhatsAppCampaignScalarWhereInput[]
    NOT?: WhatsAppCampaignScalarWhereInput | WhatsAppCampaignScalarWhereInput[]
    id?: StringFilter<"WhatsAppCampaign"> | string
    name?: StringFilter<"WhatsAppCampaign"> | string
    type?: StringFilter<"WhatsAppCampaign"> | string
    message?: StringNullableFilter<"WhatsAppCampaign"> | string | null
    mediaUrl?: StringNullableFilter<"WhatsAppCampaign"> | string | null
    templateId?: StringNullableFilter<"WhatsAppCampaign"> | string | null
    templateParams?: JsonNullableFilter<"WhatsAppCampaign">
    accountId?: StringFilter<"WhatsAppCampaign"> | string
    audienceId?: StringFilter<"WhatsAppCampaign"> | string
    status?: StringFilter<"WhatsAppCampaign"> | string
    scheduledAt?: DateTimeNullableFilter<"WhatsAppCampaign"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"WhatsAppCampaign"> | Date | string | null
    createdAt?: DateTimeFilter<"WhatsAppCampaign"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppCampaign"> | Date | string
  }

  export type WhatsAppPhoneNumberUpsertWithWhereUniqueWithoutAccountInput = {
    where: WhatsAppPhoneNumberWhereUniqueInput
    update: XOR<WhatsAppPhoneNumberUpdateWithoutAccountInput, WhatsAppPhoneNumberUncheckedUpdateWithoutAccountInput>
    create: XOR<WhatsAppPhoneNumberCreateWithoutAccountInput, WhatsAppPhoneNumberUncheckedCreateWithoutAccountInput>
  }

  export type WhatsAppPhoneNumberUpdateWithWhereUniqueWithoutAccountInput = {
    where: WhatsAppPhoneNumberWhereUniqueInput
    data: XOR<WhatsAppPhoneNumberUpdateWithoutAccountInput, WhatsAppPhoneNumberUncheckedUpdateWithoutAccountInput>
  }

  export type WhatsAppPhoneNumberUpdateManyWithWhereWithoutAccountInput = {
    where: WhatsAppPhoneNumberScalarWhereInput
    data: XOR<WhatsAppPhoneNumberUpdateManyMutationInput, WhatsAppPhoneNumberUncheckedUpdateManyWithoutAccountInput>
  }

  export type WhatsAppPhoneNumberScalarWhereInput = {
    AND?: WhatsAppPhoneNumberScalarWhereInput | WhatsAppPhoneNumberScalarWhereInput[]
    OR?: WhatsAppPhoneNumberScalarWhereInput[]
    NOT?: WhatsAppPhoneNumberScalarWhereInput | WhatsAppPhoneNumberScalarWhereInput[]
    id?: StringFilter<"WhatsAppPhoneNumber"> | string
    phoneNumberId?: StringFilter<"WhatsAppPhoneNumber"> | string
    phoneNumber?: StringFilter<"WhatsAppPhoneNumber"> | string
    name?: StringNullableFilter<"WhatsAppPhoneNumber"> | string | null
    codeVerificationStatus?: StringNullableFilter<"WhatsAppPhoneNumber"> | string | null
    isRegistered?: BoolFilter<"WhatsAppPhoneNumber"> | boolean
    isSubscribed?: BoolFilter<"WhatsAppPhoneNumber"> | boolean
    accountId?: StringFilter<"WhatsAppPhoneNumber"> | string
    createdAt?: DateTimeFilter<"WhatsAppPhoneNumber"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppPhoneNumber"> | Date | string
  }

  export type WhatsAppAccountCreateWithoutPhoneNumbersInput = {
    id?: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWhatsAppAccountInput
    audiences?: WhatsAppAudienceCreateNestedManyWithoutAccountInput
    campaigns?: WhatsAppCampaignCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountUncheckedCreateWithoutPhoneNumbersInput = {
    id?: string
    userId: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    audiences?: WhatsAppAudienceUncheckedCreateNestedManyWithoutAccountInput
    campaigns?: WhatsAppCampaignUncheckedCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountCreateOrConnectWithoutPhoneNumbersInput = {
    where: WhatsAppAccountWhereUniqueInput
    create: XOR<WhatsAppAccountCreateWithoutPhoneNumbersInput, WhatsAppAccountUncheckedCreateWithoutPhoneNumbersInput>
  }

  export type WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    audience?: WhatsAppAudienceCreateNestedOneWithoutRecipientsInput
    messages?: WhatsAppMessageCreateNestedManyWithoutRecipientInput
  }

  export type WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    audienceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: WhatsAppMessageUncheckedCreateNestedManyWithoutRecipientInput
  }

  export type WhatsAppRecipientCreateOrConnectWithoutWhatsAppPhoneNumberInput = {
    where: WhatsAppRecipientWhereUniqueInput
    create: XOR<WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput, WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput>
  }

  export type WhatsAppRecipientCreateManyWhatsAppPhoneNumberInputEnvelope = {
    data: WhatsAppRecipientCreateManyWhatsAppPhoneNumberInput | WhatsAppRecipientCreateManyWhatsAppPhoneNumberInput[]
    skipDuplicates?: boolean
  }

  export type WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput = {
    id?: string
    wamid?: string | null
    status?: string
    message?: string | null
    isOutbound?: boolean
    errorMessage?: string | null
    phoneNumber?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    recipient: WhatsAppRecipientCreateNestedOneWithoutMessagesInput
  }

  export type WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput = {
    id?: string
    wamid?: string | null
    status?: string
    message?: string | null
    isOutbound?: boolean
    errorMessage?: string | null
    phoneNumber?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    recipientId: string
  }

  export type WhatsAppMessageCreateOrConnectWithoutWhatsAppPhoneNumberInput = {
    where: WhatsAppMessageWhereUniqueInput
    create: XOR<WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput, WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput>
  }

  export type WhatsAppMessageCreateManyWhatsAppPhoneNumberInputEnvelope = {
    data: WhatsAppMessageCreateManyWhatsAppPhoneNumberInput | WhatsAppMessageCreateManyWhatsAppPhoneNumberInput[]
    skipDuplicates?: boolean
  }

  export type WhatsAppAutomationCreateWithoutPhoneNumberInput = {
    id?: string
    name: string
    automationJson: JsonNullValueInput | InputJsonValue
    automationType: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput = {
    id?: string
    name: string
    automationJson: JsonNullValueInput | InputJsonValue
    automationType: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppAutomationCreateOrConnectWithoutPhoneNumberInput = {
    where: WhatsAppAutomationWhereUniqueInput
    create: XOR<WhatsAppAutomationCreateWithoutPhoneNumberInput, WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput>
  }

  export type WhatsAppAutomationCreateManyPhoneNumberInputEnvelope = {
    data: WhatsAppAutomationCreateManyPhoneNumberInput | WhatsAppAutomationCreateManyPhoneNumberInput[]
    skipDuplicates?: boolean
  }

  export type WhatsAppAccountUpsertWithoutPhoneNumbersInput = {
    update: XOR<WhatsAppAccountUpdateWithoutPhoneNumbersInput, WhatsAppAccountUncheckedUpdateWithoutPhoneNumbersInput>
    create: XOR<WhatsAppAccountCreateWithoutPhoneNumbersInput, WhatsAppAccountUncheckedCreateWithoutPhoneNumbersInput>
    where?: WhatsAppAccountWhereInput
  }

  export type WhatsAppAccountUpdateToOneWithWhereWithoutPhoneNumbersInput = {
    where?: WhatsAppAccountWhereInput
    data: XOR<WhatsAppAccountUpdateWithoutPhoneNumbersInput, WhatsAppAccountUncheckedUpdateWithoutPhoneNumbersInput>
  }

  export type WhatsAppAccountUpdateWithoutPhoneNumbersInput = {
    id?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWhatsAppAccountNestedInput
    audiences?: WhatsAppAudienceUpdateManyWithoutAccountNestedInput
    campaigns?: WhatsAppCampaignUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppAccountUncheckedUpdateWithoutPhoneNumbersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audiences?: WhatsAppAudienceUncheckedUpdateManyWithoutAccountNestedInput
    campaigns?: WhatsAppCampaignUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppRecipientUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput = {
    where: WhatsAppRecipientWhereUniqueInput
    update: XOR<WhatsAppRecipientUpdateWithoutWhatsAppPhoneNumberInput, WhatsAppRecipientUncheckedUpdateWithoutWhatsAppPhoneNumberInput>
    create: XOR<WhatsAppRecipientCreateWithoutWhatsAppPhoneNumberInput, WhatsAppRecipientUncheckedCreateWithoutWhatsAppPhoneNumberInput>
  }

  export type WhatsAppRecipientUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput = {
    where: WhatsAppRecipientWhereUniqueInput
    data: XOR<WhatsAppRecipientUpdateWithoutWhatsAppPhoneNumberInput, WhatsAppRecipientUncheckedUpdateWithoutWhatsAppPhoneNumberInput>
  }

  export type WhatsAppRecipientUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput = {
    where: WhatsAppRecipientScalarWhereInput
    data: XOR<WhatsAppRecipientUpdateManyMutationInput, WhatsAppRecipientUncheckedUpdateManyWithoutWhatsAppPhoneNumberInput>
  }

  export type WhatsAppRecipientScalarWhereInput = {
    AND?: WhatsAppRecipientScalarWhereInput | WhatsAppRecipientScalarWhereInput[]
    OR?: WhatsAppRecipientScalarWhereInput[]
    NOT?: WhatsAppRecipientScalarWhereInput | WhatsAppRecipientScalarWhereInput[]
    id?: StringFilter<"WhatsAppRecipient"> | string
    phoneNumber?: StringFilter<"WhatsAppRecipient"> | string
    name?: StringNullableFilter<"WhatsAppRecipient"> | string | null
    audienceId?: StringNullableFilter<"WhatsAppRecipient"> | string | null
    whatsAppPhoneNumberId?: StringNullableFilter<"WhatsAppRecipient"> | string | null
    createdAt?: DateTimeFilter<"WhatsAppRecipient"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppRecipient"> | Date | string
  }

  export type WhatsAppMessageUpsertWithWhereUniqueWithoutWhatsAppPhoneNumberInput = {
    where: WhatsAppMessageWhereUniqueInput
    update: XOR<WhatsAppMessageUpdateWithoutWhatsAppPhoneNumberInput, WhatsAppMessageUncheckedUpdateWithoutWhatsAppPhoneNumberInput>
    create: XOR<WhatsAppMessageCreateWithoutWhatsAppPhoneNumberInput, WhatsAppMessageUncheckedCreateWithoutWhatsAppPhoneNumberInput>
  }

  export type WhatsAppMessageUpdateWithWhereUniqueWithoutWhatsAppPhoneNumberInput = {
    where: WhatsAppMessageWhereUniqueInput
    data: XOR<WhatsAppMessageUpdateWithoutWhatsAppPhoneNumberInput, WhatsAppMessageUncheckedUpdateWithoutWhatsAppPhoneNumberInput>
  }

  export type WhatsAppMessageUpdateManyWithWhereWithoutWhatsAppPhoneNumberInput = {
    where: WhatsAppMessageScalarWhereInput
    data: XOR<WhatsAppMessageUpdateManyMutationInput, WhatsAppMessageUncheckedUpdateManyWithoutWhatsAppPhoneNumberInput>
  }

  export type WhatsAppMessageScalarWhereInput = {
    AND?: WhatsAppMessageScalarWhereInput | WhatsAppMessageScalarWhereInput[]
    OR?: WhatsAppMessageScalarWhereInput[]
    NOT?: WhatsAppMessageScalarWhereInput | WhatsAppMessageScalarWhereInput[]
    id?: StringFilter<"WhatsAppMessage"> | string
    wamid?: StringNullableFilter<"WhatsAppMessage"> | string | null
    status?: StringFilter<"WhatsAppMessage"> | string
    message?: StringNullableFilter<"WhatsAppMessage"> | string | null
    isOutbound?: BoolFilter<"WhatsAppMessage"> | boolean
    errorMessage?: StringNullableFilter<"WhatsAppMessage"> | string | null
    phoneNumber?: StringNullableFilter<"WhatsAppMessage"> | string | null
    sentAt?: DateTimeNullableFilter<"WhatsAppMessage"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"WhatsAppMessage"> | Date | string | null
    readAt?: DateTimeNullableFilter<"WhatsAppMessage"> | Date | string | null
    createdAt?: DateTimeFilter<"WhatsAppMessage"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppMessage"> | Date | string
    whatsAppPhoneNumberId?: StringNullableFilter<"WhatsAppMessage"> | string | null
    recipientId?: StringFilter<"WhatsAppMessage"> | string
  }

  export type WhatsAppAutomationUpsertWithWhereUniqueWithoutPhoneNumberInput = {
    where: WhatsAppAutomationWhereUniqueInput
    update: XOR<WhatsAppAutomationUpdateWithoutPhoneNumberInput, WhatsAppAutomationUncheckedUpdateWithoutPhoneNumberInput>
    create: XOR<WhatsAppAutomationCreateWithoutPhoneNumberInput, WhatsAppAutomationUncheckedCreateWithoutPhoneNumberInput>
  }

  export type WhatsAppAutomationUpdateWithWhereUniqueWithoutPhoneNumberInput = {
    where: WhatsAppAutomationWhereUniqueInput
    data: XOR<WhatsAppAutomationUpdateWithoutPhoneNumberInput, WhatsAppAutomationUncheckedUpdateWithoutPhoneNumberInput>
  }

  export type WhatsAppAutomationUpdateManyWithWhereWithoutPhoneNumberInput = {
    where: WhatsAppAutomationScalarWhereInput
    data: XOR<WhatsAppAutomationUpdateManyMutationInput, WhatsAppAutomationUncheckedUpdateManyWithoutPhoneNumberInput>
  }

  export type WhatsAppAutomationScalarWhereInput = {
    AND?: WhatsAppAutomationScalarWhereInput | WhatsAppAutomationScalarWhereInput[]
    OR?: WhatsAppAutomationScalarWhereInput[]
    NOT?: WhatsAppAutomationScalarWhereInput | WhatsAppAutomationScalarWhereInput[]
    id?: StringFilter<"WhatsAppAutomation"> | string
    name?: StringFilter<"WhatsAppAutomation"> | string
    phoneNumberId?: StringFilter<"WhatsAppAutomation"> | string
    automationJson?: JsonFilter<"WhatsAppAutomation">
    automationType?: StringFilter<"WhatsAppAutomation"> | string
    status?: StringFilter<"WhatsAppAutomation"> | string
    createdAt?: DateTimeFilter<"WhatsAppAutomation"> | Date | string
    updatedAt?: DateTimeFilter<"WhatsAppAutomation"> | Date | string
  }

  export type WhatsAppAccountCreateWithoutAudiencesInput = {
    id?: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWhatsAppAccountInput
    campaigns?: WhatsAppCampaignCreateNestedManyWithoutAccountInput
    phoneNumbers?: WhatsAppPhoneNumberCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountUncheckedCreateWithoutAudiencesInput = {
    id?: string
    userId: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    campaigns?: WhatsAppCampaignUncheckedCreateNestedManyWithoutAccountInput
    phoneNumbers?: WhatsAppPhoneNumberUncheckedCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountCreateOrConnectWithoutAudiencesInput = {
    where: WhatsAppAccountWhereUniqueInput
    create: XOR<WhatsAppAccountCreateWithoutAudiencesInput, WhatsAppAccountUncheckedCreateWithoutAudiencesInput>
  }

  export type WhatsAppRecipientCreateWithoutAudienceInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    whatsAppPhoneNumber?: WhatsAppPhoneNumberCreateNestedOneWithoutRecipientsInput
    messages?: WhatsAppMessageCreateNestedManyWithoutRecipientInput
  }

  export type WhatsAppRecipientUncheckedCreateWithoutAudienceInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    whatsAppPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: WhatsAppMessageUncheckedCreateNestedManyWithoutRecipientInput
  }

  export type WhatsAppRecipientCreateOrConnectWithoutAudienceInput = {
    where: WhatsAppRecipientWhereUniqueInput
    create: XOR<WhatsAppRecipientCreateWithoutAudienceInput, WhatsAppRecipientUncheckedCreateWithoutAudienceInput>
  }

  export type WhatsAppRecipientCreateManyAudienceInputEnvelope = {
    data: WhatsAppRecipientCreateManyAudienceInput | WhatsAppRecipientCreateManyAudienceInput[]
    skipDuplicates?: boolean
  }

  export type WhatsAppCampaignCreateWithoutAudienceInput = {
    id?: string
    name: string
    type: string
    message?: string | null
    mediaUrl?: string | null
    templateId?: string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    status?: string
    scheduledAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    account: WhatsAppAccountCreateNestedOneWithoutCampaignsInput
  }

  export type WhatsAppCampaignUncheckedCreateWithoutAudienceInput = {
    id?: string
    name: string
    type: string
    message?: string | null
    mediaUrl?: string | null
    templateId?: string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    accountId: string
    status?: string
    scheduledAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppCampaignCreateOrConnectWithoutAudienceInput = {
    where: WhatsAppCampaignWhereUniqueInput
    create: XOR<WhatsAppCampaignCreateWithoutAudienceInput, WhatsAppCampaignUncheckedCreateWithoutAudienceInput>
  }

  export type WhatsAppCampaignCreateManyAudienceInputEnvelope = {
    data: WhatsAppCampaignCreateManyAudienceInput | WhatsAppCampaignCreateManyAudienceInput[]
    skipDuplicates?: boolean
  }

  export type WhatsAppAccountUpsertWithoutAudiencesInput = {
    update: XOR<WhatsAppAccountUpdateWithoutAudiencesInput, WhatsAppAccountUncheckedUpdateWithoutAudiencesInput>
    create: XOR<WhatsAppAccountCreateWithoutAudiencesInput, WhatsAppAccountUncheckedCreateWithoutAudiencesInput>
    where?: WhatsAppAccountWhereInput
  }

  export type WhatsAppAccountUpdateToOneWithWhereWithoutAudiencesInput = {
    where?: WhatsAppAccountWhereInput
    data: XOR<WhatsAppAccountUpdateWithoutAudiencesInput, WhatsAppAccountUncheckedUpdateWithoutAudiencesInput>
  }

  export type WhatsAppAccountUpdateWithoutAudiencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWhatsAppAccountNestedInput
    campaigns?: WhatsAppCampaignUpdateManyWithoutAccountNestedInput
    phoneNumbers?: WhatsAppPhoneNumberUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppAccountUncheckedUpdateWithoutAudiencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    campaigns?: WhatsAppCampaignUncheckedUpdateManyWithoutAccountNestedInput
    phoneNumbers?: WhatsAppPhoneNumberUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppRecipientUpsertWithWhereUniqueWithoutAudienceInput = {
    where: WhatsAppRecipientWhereUniqueInput
    update: XOR<WhatsAppRecipientUpdateWithoutAudienceInput, WhatsAppRecipientUncheckedUpdateWithoutAudienceInput>
    create: XOR<WhatsAppRecipientCreateWithoutAudienceInput, WhatsAppRecipientUncheckedCreateWithoutAudienceInput>
  }

  export type WhatsAppRecipientUpdateWithWhereUniqueWithoutAudienceInput = {
    where: WhatsAppRecipientWhereUniqueInput
    data: XOR<WhatsAppRecipientUpdateWithoutAudienceInput, WhatsAppRecipientUncheckedUpdateWithoutAudienceInput>
  }

  export type WhatsAppRecipientUpdateManyWithWhereWithoutAudienceInput = {
    where: WhatsAppRecipientScalarWhereInput
    data: XOR<WhatsAppRecipientUpdateManyMutationInput, WhatsAppRecipientUncheckedUpdateManyWithoutAudienceInput>
  }

  export type WhatsAppCampaignUpsertWithWhereUniqueWithoutAudienceInput = {
    where: WhatsAppCampaignWhereUniqueInput
    update: XOR<WhatsAppCampaignUpdateWithoutAudienceInput, WhatsAppCampaignUncheckedUpdateWithoutAudienceInput>
    create: XOR<WhatsAppCampaignCreateWithoutAudienceInput, WhatsAppCampaignUncheckedCreateWithoutAudienceInput>
  }

  export type WhatsAppCampaignUpdateWithWhereUniqueWithoutAudienceInput = {
    where: WhatsAppCampaignWhereUniqueInput
    data: XOR<WhatsAppCampaignUpdateWithoutAudienceInput, WhatsAppCampaignUncheckedUpdateWithoutAudienceInput>
  }

  export type WhatsAppCampaignUpdateManyWithWhereWithoutAudienceInput = {
    where: WhatsAppCampaignScalarWhereInput
    data: XOR<WhatsAppCampaignUpdateManyMutationInput, WhatsAppCampaignUncheckedUpdateManyWithoutAudienceInput>
  }

  export type WhatsAppAudienceCreateWithoutRecipientsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    account: WhatsAppAccountCreateNestedOneWithoutAudiencesInput
    campaigns?: WhatsAppCampaignCreateNestedManyWithoutAudienceInput
  }

  export type WhatsAppAudienceUncheckedCreateWithoutRecipientsInput = {
    id?: string
    name: string
    accountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    campaigns?: WhatsAppCampaignUncheckedCreateNestedManyWithoutAudienceInput
  }

  export type WhatsAppAudienceCreateOrConnectWithoutRecipientsInput = {
    where: WhatsAppAudienceWhereUniqueInput
    create: XOR<WhatsAppAudienceCreateWithoutRecipientsInput, WhatsAppAudienceUncheckedCreateWithoutRecipientsInput>
  }

  export type WhatsAppPhoneNumberCreateWithoutRecipientsInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    account: WhatsAppAccountCreateNestedOneWithoutPhoneNumbersInput
    messages?: WhatsAppMessageCreateNestedManyWithoutWhatsAppPhoneNumberInput
    automations?: WhatsAppAutomationCreateNestedManyWithoutPhoneNumberInput
  }

  export type WhatsAppPhoneNumberUncheckedCreateWithoutRecipientsInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    accountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: WhatsAppMessageUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput
    automations?: WhatsAppAutomationUncheckedCreateNestedManyWithoutPhoneNumberInput
  }

  export type WhatsAppPhoneNumberCreateOrConnectWithoutRecipientsInput = {
    where: WhatsAppPhoneNumberWhereUniqueInput
    create: XOR<WhatsAppPhoneNumberCreateWithoutRecipientsInput, WhatsAppPhoneNumberUncheckedCreateWithoutRecipientsInput>
  }

  export type WhatsAppMessageCreateWithoutRecipientInput = {
    id?: string
    wamid?: string | null
    status?: string
    message?: string | null
    isOutbound?: boolean
    errorMessage?: string | null
    phoneNumber?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    whatsAppPhoneNumber?: WhatsAppPhoneNumberCreateNestedOneWithoutMessagesInput
  }

  export type WhatsAppMessageUncheckedCreateWithoutRecipientInput = {
    id?: string
    wamid?: string | null
    status?: string
    message?: string | null
    isOutbound?: boolean
    errorMessage?: string | null
    phoneNumber?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    whatsAppPhoneNumberId?: string | null
  }

  export type WhatsAppMessageCreateOrConnectWithoutRecipientInput = {
    where: WhatsAppMessageWhereUniqueInput
    create: XOR<WhatsAppMessageCreateWithoutRecipientInput, WhatsAppMessageUncheckedCreateWithoutRecipientInput>
  }

  export type WhatsAppMessageCreateManyRecipientInputEnvelope = {
    data: WhatsAppMessageCreateManyRecipientInput | WhatsAppMessageCreateManyRecipientInput[]
    skipDuplicates?: boolean
  }

  export type WhatsAppAudienceUpsertWithoutRecipientsInput = {
    update: XOR<WhatsAppAudienceUpdateWithoutRecipientsInput, WhatsAppAudienceUncheckedUpdateWithoutRecipientsInput>
    create: XOR<WhatsAppAudienceCreateWithoutRecipientsInput, WhatsAppAudienceUncheckedCreateWithoutRecipientsInput>
    where?: WhatsAppAudienceWhereInput
  }

  export type WhatsAppAudienceUpdateToOneWithWhereWithoutRecipientsInput = {
    where?: WhatsAppAudienceWhereInput
    data: XOR<WhatsAppAudienceUpdateWithoutRecipientsInput, WhatsAppAudienceUncheckedUpdateWithoutRecipientsInput>
  }

  export type WhatsAppAudienceUpdateWithoutRecipientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: WhatsAppAccountUpdateOneRequiredWithoutAudiencesNestedInput
    campaigns?: WhatsAppCampaignUpdateManyWithoutAudienceNestedInput
  }

  export type WhatsAppAudienceUncheckedUpdateWithoutRecipientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    campaigns?: WhatsAppCampaignUncheckedUpdateManyWithoutAudienceNestedInput
  }

  export type WhatsAppPhoneNumberUpsertWithoutRecipientsInput = {
    update: XOR<WhatsAppPhoneNumberUpdateWithoutRecipientsInput, WhatsAppPhoneNumberUncheckedUpdateWithoutRecipientsInput>
    create: XOR<WhatsAppPhoneNumberCreateWithoutRecipientsInput, WhatsAppPhoneNumberUncheckedCreateWithoutRecipientsInput>
    where?: WhatsAppPhoneNumberWhereInput
  }

  export type WhatsAppPhoneNumberUpdateToOneWithWhereWithoutRecipientsInput = {
    where?: WhatsAppPhoneNumberWhereInput
    data: XOR<WhatsAppPhoneNumberUpdateWithoutRecipientsInput, WhatsAppPhoneNumberUncheckedUpdateWithoutRecipientsInput>
  }

  export type WhatsAppPhoneNumberUpdateWithoutRecipientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: WhatsAppAccountUpdateOneRequiredWithoutPhoneNumbersNestedInput
    messages?: WhatsAppMessageUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    automations?: WhatsAppAutomationUpdateManyWithoutPhoneNumberNestedInput
  }

  export type WhatsAppPhoneNumberUncheckedUpdateWithoutRecipientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    accountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: WhatsAppMessageUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    automations?: WhatsAppAutomationUncheckedUpdateManyWithoutPhoneNumberNestedInput
  }

  export type WhatsAppMessageUpsertWithWhereUniqueWithoutRecipientInput = {
    where: WhatsAppMessageWhereUniqueInput
    update: XOR<WhatsAppMessageUpdateWithoutRecipientInput, WhatsAppMessageUncheckedUpdateWithoutRecipientInput>
    create: XOR<WhatsAppMessageCreateWithoutRecipientInput, WhatsAppMessageUncheckedCreateWithoutRecipientInput>
  }

  export type WhatsAppMessageUpdateWithWhereUniqueWithoutRecipientInput = {
    where: WhatsAppMessageWhereUniqueInput
    data: XOR<WhatsAppMessageUpdateWithoutRecipientInput, WhatsAppMessageUncheckedUpdateWithoutRecipientInput>
  }

  export type WhatsAppMessageUpdateManyWithWhereWithoutRecipientInput = {
    where: WhatsAppMessageScalarWhereInput
    data: XOR<WhatsAppMessageUpdateManyMutationInput, WhatsAppMessageUncheckedUpdateManyWithoutRecipientInput>
  }

  export type WhatsAppAccountCreateWithoutCampaignsInput = {
    id?: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWhatsAppAccountInput
    audiences?: WhatsAppAudienceCreateNestedManyWithoutAccountInput
    phoneNumbers?: WhatsAppPhoneNumberCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountUncheckedCreateWithoutCampaignsInput = {
    id?: string
    userId: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    audiences?: WhatsAppAudienceUncheckedCreateNestedManyWithoutAccountInput
    phoneNumbers?: WhatsAppPhoneNumberUncheckedCreateNestedManyWithoutAccountInput
  }

  export type WhatsAppAccountCreateOrConnectWithoutCampaignsInput = {
    where: WhatsAppAccountWhereUniqueInput
    create: XOR<WhatsAppAccountCreateWithoutCampaignsInput, WhatsAppAccountUncheckedCreateWithoutCampaignsInput>
  }

  export type WhatsAppAudienceCreateWithoutCampaignsInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    account: WhatsAppAccountCreateNestedOneWithoutAudiencesInput
    recipients?: WhatsAppRecipientCreateNestedManyWithoutAudienceInput
  }

  export type WhatsAppAudienceUncheckedCreateWithoutCampaignsInput = {
    id?: string
    name: string
    accountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    recipients?: WhatsAppRecipientUncheckedCreateNestedManyWithoutAudienceInput
  }

  export type WhatsAppAudienceCreateOrConnectWithoutCampaignsInput = {
    where: WhatsAppAudienceWhereUniqueInput
    create: XOR<WhatsAppAudienceCreateWithoutCampaignsInput, WhatsAppAudienceUncheckedCreateWithoutCampaignsInput>
  }

  export type WhatsAppAccountUpsertWithoutCampaignsInput = {
    update: XOR<WhatsAppAccountUpdateWithoutCampaignsInput, WhatsAppAccountUncheckedUpdateWithoutCampaignsInput>
    create: XOR<WhatsAppAccountCreateWithoutCampaignsInput, WhatsAppAccountUncheckedCreateWithoutCampaignsInput>
    where?: WhatsAppAccountWhereInput
  }

  export type WhatsAppAccountUpdateToOneWithWhereWithoutCampaignsInput = {
    where?: WhatsAppAccountWhereInput
    data: XOR<WhatsAppAccountUpdateWithoutCampaignsInput, WhatsAppAccountUncheckedUpdateWithoutCampaignsInput>
  }

  export type WhatsAppAccountUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWhatsAppAccountNestedInput
    audiences?: WhatsAppAudienceUpdateManyWithoutAccountNestedInput
    phoneNumbers?: WhatsAppPhoneNumberUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppAccountUncheckedUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audiences?: WhatsAppAudienceUncheckedUpdateManyWithoutAccountNestedInput
    phoneNumbers?: WhatsAppPhoneNumberUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppAudienceUpsertWithoutCampaignsInput = {
    update: XOR<WhatsAppAudienceUpdateWithoutCampaignsInput, WhatsAppAudienceUncheckedUpdateWithoutCampaignsInput>
    create: XOR<WhatsAppAudienceCreateWithoutCampaignsInput, WhatsAppAudienceUncheckedCreateWithoutCampaignsInput>
    where?: WhatsAppAudienceWhereInput
  }

  export type WhatsAppAudienceUpdateToOneWithWhereWithoutCampaignsInput = {
    where?: WhatsAppAudienceWhereInput
    data: XOR<WhatsAppAudienceUpdateWithoutCampaignsInput, WhatsAppAudienceUncheckedUpdateWithoutCampaignsInput>
  }

  export type WhatsAppAudienceUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: WhatsAppAccountUpdateOneRequiredWithoutAudiencesNestedInput
    recipients?: WhatsAppRecipientUpdateManyWithoutAudienceNestedInput
  }

  export type WhatsAppAudienceUncheckedUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipients?: WhatsAppRecipientUncheckedUpdateManyWithoutAudienceNestedInput
  }

  export type WhatsAppPhoneNumberCreateWithoutMessagesInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    account: WhatsAppAccountCreateNestedOneWithoutPhoneNumbersInput
    recipients?: WhatsAppRecipientCreateNestedManyWithoutWhatsAppPhoneNumberInput
    automations?: WhatsAppAutomationCreateNestedManyWithoutPhoneNumberInput
  }

  export type WhatsAppPhoneNumberUncheckedCreateWithoutMessagesInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    accountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    recipients?: WhatsAppRecipientUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput
    automations?: WhatsAppAutomationUncheckedCreateNestedManyWithoutPhoneNumberInput
  }

  export type WhatsAppPhoneNumberCreateOrConnectWithoutMessagesInput = {
    where: WhatsAppPhoneNumberWhereUniqueInput
    create: XOR<WhatsAppPhoneNumberCreateWithoutMessagesInput, WhatsAppPhoneNumberUncheckedCreateWithoutMessagesInput>
  }

  export type WhatsAppRecipientCreateWithoutMessagesInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    audience?: WhatsAppAudienceCreateNestedOneWithoutRecipientsInput
    whatsAppPhoneNumber?: WhatsAppPhoneNumberCreateNestedOneWithoutRecipientsInput
  }

  export type WhatsAppRecipientUncheckedCreateWithoutMessagesInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    audienceId?: string | null
    whatsAppPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppRecipientCreateOrConnectWithoutMessagesInput = {
    where: WhatsAppRecipientWhereUniqueInput
    create: XOR<WhatsAppRecipientCreateWithoutMessagesInput, WhatsAppRecipientUncheckedCreateWithoutMessagesInput>
  }

  export type WhatsAppPhoneNumberUpsertWithoutMessagesInput = {
    update: XOR<WhatsAppPhoneNumberUpdateWithoutMessagesInput, WhatsAppPhoneNumberUncheckedUpdateWithoutMessagesInput>
    create: XOR<WhatsAppPhoneNumberCreateWithoutMessagesInput, WhatsAppPhoneNumberUncheckedCreateWithoutMessagesInput>
    where?: WhatsAppPhoneNumberWhereInput
  }

  export type WhatsAppPhoneNumberUpdateToOneWithWhereWithoutMessagesInput = {
    where?: WhatsAppPhoneNumberWhereInput
    data: XOR<WhatsAppPhoneNumberUpdateWithoutMessagesInput, WhatsAppPhoneNumberUncheckedUpdateWithoutMessagesInput>
  }

  export type WhatsAppPhoneNumberUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: WhatsAppAccountUpdateOneRequiredWithoutPhoneNumbersNestedInput
    recipients?: WhatsAppRecipientUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    automations?: WhatsAppAutomationUpdateManyWithoutPhoneNumberNestedInput
  }

  export type WhatsAppPhoneNumberUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    accountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipients?: WhatsAppRecipientUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    automations?: WhatsAppAutomationUncheckedUpdateManyWithoutPhoneNumberNestedInput
  }

  export type WhatsAppRecipientUpsertWithoutMessagesInput = {
    update: XOR<WhatsAppRecipientUpdateWithoutMessagesInput, WhatsAppRecipientUncheckedUpdateWithoutMessagesInput>
    create: XOR<WhatsAppRecipientCreateWithoutMessagesInput, WhatsAppRecipientUncheckedCreateWithoutMessagesInput>
    where?: WhatsAppRecipientWhereInput
  }

  export type WhatsAppRecipientUpdateToOneWithWhereWithoutMessagesInput = {
    where?: WhatsAppRecipientWhereInput
    data: XOR<WhatsAppRecipientUpdateWithoutMessagesInput, WhatsAppRecipientUncheckedUpdateWithoutMessagesInput>
  }

  export type WhatsAppRecipientUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: WhatsAppAudienceUpdateOneWithoutRecipientsNestedInput
    whatsAppPhoneNumber?: WhatsAppPhoneNumberUpdateOneWithoutRecipientsNestedInput
  }

  export type WhatsAppRecipientUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    audienceId?: NullableStringFieldUpdateOperationsInput | string | null
    whatsAppPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutMetaAdAccountInput = {
    id?: string
    name: string
    email: string
    password: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    WhatsAppAccount?: WhatsAppAccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMetaAdAccountInput = {
    id?: string
    name: string
    email: string
    password: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    WhatsAppAccount?: WhatsAppAccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMetaAdAccountInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMetaAdAccountInput, UserUncheckedCreateWithoutMetaAdAccountInput>
  }

  export type UserUpsertWithoutMetaAdAccountInput = {
    update: XOR<UserUpdateWithoutMetaAdAccountInput, UserUncheckedUpdateWithoutMetaAdAccountInput>
    create: XOR<UserCreateWithoutMetaAdAccountInput, UserUncheckedCreateWithoutMetaAdAccountInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMetaAdAccountInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMetaAdAccountInput, UserUncheckedUpdateWithoutMetaAdAccountInput>
  }

  export type UserUpdateWithoutMetaAdAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    WhatsAppAccount?: WhatsAppAccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMetaAdAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    WhatsAppAccount?: WhatsAppAccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WhatsAppPhoneNumberCreateWithoutAutomationsInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    account: WhatsAppAccountCreateNestedOneWithoutPhoneNumbersInput
    recipients?: WhatsAppRecipientCreateNestedManyWithoutWhatsAppPhoneNumberInput
    messages?: WhatsAppMessageCreateNestedManyWithoutWhatsAppPhoneNumberInput
  }

  export type WhatsAppPhoneNumberUncheckedCreateWithoutAutomationsInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    accountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    recipients?: WhatsAppRecipientUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput
    messages?: WhatsAppMessageUncheckedCreateNestedManyWithoutWhatsAppPhoneNumberInput
  }

  export type WhatsAppPhoneNumberCreateOrConnectWithoutAutomationsInput = {
    where: WhatsAppPhoneNumberWhereUniqueInput
    create: XOR<WhatsAppPhoneNumberCreateWithoutAutomationsInput, WhatsAppPhoneNumberUncheckedCreateWithoutAutomationsInput>
  }

  export type WhatsAppPhoneNumberUpsertWithoutAutomationsInput = {
    update: XOR<WhatsAppPhoneNumberUpdateWithoutAutomationsInput, WhatsAppPhoneNumberUncheckedUpdateWithoutAutomationsInput>
    create: XOR<WhatsAppPhoneNumberCreateWithoutAutomationsInput, WhatsAppPhoneNumberUncheckedCreateWithoutAutomationsInput>
    where?: WhatsAppPhoneNumberWhereInput
  }

  export type WhatsAppPhoneNumberUpdateToOneWithWhereWithoutAutomationsInput = {
    where?: WhatsAppPhoneNumberWhereInput
    data: XOR<WhatsAppPhoneNumberUpdateWithoutAutomationsInput, WhatsAppPhoneNumberUncheckedUpdateWithoutAutomationsInput>
  }

  export type WhatsAppPhoneNumberUpdateWithoutAutomationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: WhatsAppAccountUpdateOneRequiredWithoutPhoneNumbersNestedInput
    recipients?: WhatsAppRecipientUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    messages?: WhatsAppMessageUpdateManyWithoutWhatsAppPhoneNumberNestedInput
  }

  export type WhatsAppPhoneNumberUncheckedUpdateWithoutAutomationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    accountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipients?: WhatsAppRecipientUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    messages?: WhatsAppMessageUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput
  }

  export type WhatsAppAccountCreateManyUserInput = {
    id?: string
    wabaid: string
    accessToken: string
    phoneNumberIds?: WhatsAppAccountCreatephoneNumberIdsInput | string[]
    displayName: string
    verified?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MetaAdAccountCreateManyAgentInput = {
    id?: string
    name?: string | null
    email?: string | null
    accessToken: string
    pageId?: string | null
    status?: $Enums.ActivityStatus | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppAccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audiences?: WhatsAppAudienceUpdateManyWithoutAccountNestedInput
    campaigns?: WhatsAppCampaignUpdateManyWithoutAccountNestedInput
    phoneNumbers?: WhatsAppPhoneNumberUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppAccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audiences?: WhatsAppAudienceUncheckedUpdateManyWithoutAccountNestedInput
    campaigns?: WhatsAppCampaignUncheckedUpdateManyWithoutAccountNestedInput
    phoneNumbers?: WhatsAppPhoneNumberUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type WhatsAppAccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    wabaid?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    phoneNumberIds?: WhatsAppAccountUpdatephoneNumberIdsInput | string[]
    displayName?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetaAdAccountUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    pageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumActivityStatusFieldUpdateOperationsInput | $Enums.ActivityStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetaAdAccountUncheckedUpdateWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    pageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumActivityStatusFieldUpdateOperationsInput | $Enums.ActivityStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MetaAdAccountUncheckedUpdateManyWithoutAgentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    pageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumActivityStatusFieldUpdateOperationsInput | $Enums.ActivityStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAudienceCreateManyAccountInput = {
    id?: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppCampaignCreateManyAccountInput = {
    id?: string
    name: string
    type: string
    message?: string | null
    mediaUrl?: string | null
    templateId?: string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    audienceId: string
    status?: string
    scheduledAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppPhoneNumberCreateManyAccountInput = {
    id?: string
    phoneNumberId: string
    phoneNumber: string
    name?: string | null
    codeVerificationStatus?: string | null
    isRegistered?: boolean
    isSubscribed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppAudienceUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipients?: WhatsAppRecipientUpdateManyWithoutAudienceNestedInput
    campaigns?: WhatsAppCampaignUpdateManyWithoutAudienceNestedInput
  }

  export type WhatsAppAudienceUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipients?: WhatsAppRecipientUncheckedUpdateManyWithoutAudienceNestedInput
    campaigns?: WhatsAppCampaignUncheckedUpdateManyWithoutAudienceNestedInput
  }

  export type WhatsAppAudienceUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppCampaignUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: WhatsAppAudienceUpdateOneRequiredWithoutCampaignsNestedInput
  }

  export type WhatsAppCampaignUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    audienceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppCampaignUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    audienceId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppPhoneNumberUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipients?: WhatsAppRecipientUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    messages?: WhatsAppMessageUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    automations?: WhatsAppAutomationUpdateManyWithoutPhoneNumberNestedInput
  }

  export type WhatsAppPhoneNumberUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipients?: WhatsAppRecipientUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    messages?: WhatsAppMessageUncheckedUpdateManyWithoutWhatsAppPhoneNumberNestedInput
    automations?: WhatsAppAutomationUncheckedUpdateManyWithoutPhoneNumberNestedInput
  }

  export type WhatsAppPhoneNumberUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumberId?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    codeVerificationStatus?: NullableStringFieldUpdateOperationsInput | string | null
    isRegistered?: BoolFieldUpdateOperationsInput | boolean
    isSubscribed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppRecipientCreateManyWhatsAppPhoneNumberInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    audienceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppMessageCreateManyWhatsAppPhoneNumberInput = {
    id?: string
    wamid?: string | null
    status?: string
    message?: string | null
    isOutbound?: boolean
    errorMessage?: string | null
    phoneNumber?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    recipientId: string
  }

  export type WhatsAppAutomationCreateManyPhoneNumberInput = {
    id?: string
    name: string
    automationJson: JsonNullValueInput | InputJsonValue
    automationType: string
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppRecipientUpdateWithoutWhatsAppPhoneNumberInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audience?: WhatsAppAudienceUpdateOneWithoutRecipientsNestedInput
    messages?: WhatsAppMessageUpdateManyWithoutRecipientNestedInput
  }

  export type WhatsAppRecipientUncheckedUpdateWithoutWhatsAppPhoneNumberInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    audienceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: WhatsAppMessageUncheckedUpdateManyWithoutRecipientNestedInput
  }

  export type WhatsAppRecipientUncheckedUpdateManyWithoutWhatsAppPhoneNumberInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    audienceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppMessageUpdateWithoutWhatsAppPhoneNumberInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipient?: WhatsAppRecipientUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type WhatsAppMessageUncheckedUpdateWithoutWhatsAppPhoneNumberInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipientId?: StringFieldUpdateOperationsInput | string
  }

  export type WhatsAppMessageUncheckedUpdateManyWithoutWhatsAppPhoneNumberInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    recipientId?: StringFieldUpdateOperationsInput | string
  }

  export type WhatsAppAutomationUpdateWithoutPhoneNumberInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    automationJson?: JsonNullValueInput | InputJsonValue
    automationType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAutomationUncheckedUpdateWithoutPhoneNumberInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    automationJson?: JsonNullValueInput | InputJsonValue
    automationType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppAutomationUncheckedUpdateManyWithoutPhoneNumberInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    automationJson?: JsonNullValueInput | InputJsonValue
    automationType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppRecipientCreateManyAudienceInput = {
    id?: string
    phoneNumber: string
    name?: string | null
    whatsAppPhoneNumberId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppCampaignCreateManyAudienceInput = {
    id?: string
    name: string
    type: string
    message?: string | null
    mediaUrl?: string | null
    templateId?: string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    accountId: string
    status?: string
    scheduledAt?: Date | string | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WhatsAppRecipientUpdateWithoutAudienceInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    whatsAppPhoneNumber?: WhatsAppPhoneNumberUpdateOneWithoutRecipientsNestedInput
    messages?: WhatsAppMessageUpdateManyWithoutRecipientNestedInput
  }

  export type WhatsAppRecipientUncheckedUpdateWithoutAudienceInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    whatsAppPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: WhatsAppMessageUncheckedUpdateManyWithoutRecipientNestedInput
  }

  export type WhatsAppRecipientUncheckedUpdateManyWithoutAudienceInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    whatsAppPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppCampaignUpdateWithoutAudienceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: WhatsAppAccountUpdateOneRequiredWithoutCampaignsNestedInput
  }

  export type WhatsAppCampaignUncheckedUpdateWithoutAudienceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    accountId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppCampaignUncheckedUpdateManyWithoutAudienceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateParams?: NullableJsonNullValueInput | InputJsonValue
    accountId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scheduledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WhatsAppMessageCreateManyRecipientInput = {
    id?: string
    wamid?: string | null
    status?: string
    message?: string | null
    isOutbound?: boolean
    errorMessage?: string | null
    phoneNumber?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    whatsAppPhoneNumberId?: string | null
  }

  export type WhatsAppMessageUpdateWithoutRecipientInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    whatsAppPhoneNumber?: WhatsAppPhoneNumberUpdateOneWithoutMessagesNestedInput
  }

  export type WhatsAppMessageUncheckedUpdateWithoutRecipientInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    whatsAppPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WhatsAppMessageUncheckedUpdateManyWithoutRecipientInput = {
    id?: StringFieldUpdateOperationsInput | string
    wamid?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    isOutbound?: BoolFieldUpdateOperationsInput | boolean
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    whatsAppPhoneNumberId?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}