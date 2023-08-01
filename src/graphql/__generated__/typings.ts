import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLError, GraphQLErrorWithSuggestion, GraphQLAuthenticationError } from '../utils';
import { User as PrismaUser } from '~/services/__generated__/prisma';
import { MercuriusContext } from '../types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date|string; output: Date|string; }
  Email: { input: any; output: any; }
  ObjectID: { input: any; output: any; }
};

/** Errors that can occur during authentication. */
export type AuthenticationError = Error & {
  __typename?: 'AuthenticationError';
  /** The type of error that occurred. */
  case: AuthenticationErrorCase;
  message: Scalars['String']['output'];
  /** Suggested actions or corrections for the error. */
  suggestion: Scalars['String']['output'];
};

export enum AuthenticationErrorCase {
  /** The provided authentication token is in the blacklist (i.e., the user has logged out). */
  BlacklistedToken = 'BLACKLISTED_TOKEN',
  /** The user is authenticated, but the authentication has expired. */
  Expired = 'EXPIRED',
  /** The provided authentication token is invalid. */
  InvalidToken = 'INVALID_TOKEN',
  /** There is no 'auth-token' provided in the headers. */
  MissingAuthToken = 'MISSING_AUTH_TOKEN',
  /** The user corresponding to the provided authentication token no longer exists. */
  NonExistentUser = 'NON_EXISTENT_USER',
  /** Unknown error. */
  Unknown = 'UNKNOWN'
}

/** Input type to define the information needed to create a User. */
export type CreateUserInput = {
  /** The email of the User to be created. */
  email: Scalars['Email']['input'];
  /** The password for the User to be created. */
  password: Scalars['String']['input'];
};

/** The payload returned when a User is successfully created. */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  /** The access token that can be used to authenticate as the newly created User. */
  accessToken: Scalars['String']['output'];
  /** The refresh token that can be used to refresh the token of the newly created User. */
  refreshToken: Scalars['String']['output'];
  /** The newly created User object. */
  user: User;
};

/** The result of the createUser mutation. It can be either a successful payload or an error. */
export type CreateUserResult = CreateUserPayload | UnknownError | UserDuplicateError;

export type Error = {
  /** Detailed error message. */
  message: Scalars['String']['output'];
};

/** Payload for the logout mutation. */
export type LogoutPayload = {
  __typename?: 'LogoutPayload';
  /** The user who logged out. */
  user: User;
};

/** The result of the logout mutation. */
export type LogoutResult = AuthenticationError | LogoutPayload;

export type Mutation = {
  __typename?: 'Mutation';
  /** Mutation to create a new User with the provided input. */
  createUser: CreateUserResult;
  /** Logs out the user and deactivates the token. */
  logout: LogoutResult;
  /** Issues a new access token using a refresh token. */
  refreshAccessToken: RefreshAccessTokenResult;
  /** Throw an error */
  throw: Error;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

/** Node interface */
export type Node = {
  /** Global Object Identifier */
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  /**
   * Fetches an object given its ID. This is a generic method, used to fetch any type of object
   * implementing the Node interface with its unique identifier.
   */
  node?: Maybe<Node>;
  /** The 'ping' field serves as a simple health check for the GraphQL server. */
  ping: Scalars['Boolean']['output'];
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};

/** Payload for the refreshAccessToken mutation. */
export type RefreshAccessTokenPayload = {
  __typename?: 'RefreshAccessTokenPayload';
  /** The new access token. */
  accessToken: Scalars['String']['output'];
};

/** The result of the refreshAccessToken mutation. */
export type RefreshAccessTokenResult = AuthenticationError | RefreshAccessTokenPayload;

/**
 * UnknownError represents a type of error that cannot be categorized into a more specific type.
 * This is the fallback error type for unforeseen issues.
 */
export type UnknownError = Error & {
  __typename?: 'UnknownError';
  /**
   * createdAt is the timestamp at which the error was thrown.
   * This can be useful for logging, debugging, and tracing error occurrences over time.
   */
  createdAt: Scalars['DateTime']['output'];
  message: Scalars['String']['output'];
  /**
   * stack represents the stack trace of the error.
   * It gives more technical details about where and why the error was thrown, which can be helpful for debugging.
   */
  stack?: Maybe<Scalars['String']['output']>;
};

/** User type. */
export type User = Node & {
  __typename?: 'User';
  /** The date and time when the User was created. This is typically set by the server when the User is created. */
  createdAt: Scalars['DateTime']['output'];
  /** The email address of the User. */
  email: Scalars['Email']['output'];
  /** A unique identifier for the User generated by the database. It is typically used internally. */
  externalId: Scalars['ObjectID']['output'];
  id: Scalars['ID']['output'];
  /** The date and time when the User was last updated. This is typically set by the server when the User is updated. */
  updatedAt: Scalars['DateTime']['output'];
};

/** An error type to represent when a duplicate user is attempted to be created. */
export type UserDuplicateError = Error & {
  __typename?: 'UserDuplicateError';
  message: Scalars['String']['output'];
  /** Suggested actions or corrections for the error. */
  suggestion: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = {
  CreateUserResult: ( Omit<CreateUserPayload, 'user'> & { user: RefType['User'] } ) | ( GraphQLError ) | ( GraphQLErrorWithSuggestion );
  LogoutResult: ( GraphQLAuthenticationError ) | ( Omit<LogoutPayload, 'user'> & { user: RefType['User'] } );
  RefreshAccessTokenResult: ( GraphQLAuthenticationError ) | ( RefreshAccessTokenPayload );
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  Error: ( GraphQLAuthenticationError ) | ( GraphQLError ) | ( GraphQLErrorWithSuggestion );
  Node: ( PrismaUser );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthenticationError: ResolverTypeWrapper<GraphQLAuthenticationError>;
  AuthenticationErrorCase: AuthenticationErrorCase;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateUserInput: CreateUserInput;
  CreateUserPayload: ResolverTypeWrapper<Omit<CreateUserPayload, 'user'> & { user: ResolversTypes['User'] }>;
  CreateUserResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateUserResult']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Email: ResolverTypeWrapper<Scalars['Email']['output']>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  LogoutPayload: ResolverTypeWrapper<Omit<LogoutPayload, 'user'> & { user: ResolversTypes['User'] }>;
  LogoutResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LogoutResult']>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  ObjectID: ResolverTypeWrapper<Scalars['ObjectID']['output']>;
  Query: ResolverTypeWrapper<{}>;
  RefreshAccessTokenPayload: ResolverTypeWrapper<RefreshAccessTokenPayload>;
  RefreshAccessTokenResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RefreshAccessTokenResult']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UnknownError: ResolverTypeWrapper<GraphQLError>;
  User: ResolverTypeWrapper<PrismaUser>;
  UserDuplicateError: ResolverTypeWrapper<GraphQLErrorWithSuggestion>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthenticationError: GraphQLAuthenticationError;
  Boolean: Scalars['Boolean']['output'];
  CreateUserInput: CreateUserInput;
  CreateUserPayload: Omit<CreateUserPayload, 'user'> & { user: ResolversParentTypes['User'] };
  CreateUserResult: ResolversUnionTypes<ResolversParentTypes>['CreateUserResult'];
  DateTime: Scalars['DateTime']['output'];
  Email: Scalars['Email']['output'];
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  ID: Scalars['ID']['output'];
  LogoutPayload: Omit<LogoutPayload, 'user'> & { user: ResolversParentTypes['User'] };
  LogoutResult: ResolversUnionTypes<ResolversParentTypes>['LogoutResult'];
  Mutation: {};
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  ObjectID: Scalars['ObjectID']['output'];
  Query: {};
  RefreshAccessTokenPayload: RefreshAccessTokenPayload;
  RefreshAccessTokenResult: ResolversUnionTypes<ResolversParentTypes>['RefreshAccessTokenResult'];
  String: Scalars['String']['output'];
  UnknownError: GraphQLError;
  User: PrismaUser;
  UserDuplicateError: GraphQLErrorWithSuggestion;
};

export type AuthDirectiveArgs = { };

export type AuthDirectiveResolver<Result, Parent, ContextType = MercuriusContext, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthenticationErrorResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['AuthenticationError'] = ResolversParentTypes['AuthenticationError']> = {
  case?: Resolver<ResolversTypes['AuthenticationErrorCase'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  suggestion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserPayloadResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['CreateUserPayload'] = ResolversParentTypes['CreateUserPayload']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateUserResultResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['CreateUserResult'] = ResolversParentTypes['CreateUserResult']> = {
  __resolveType: TypeResolveFn<'CreateUserPayload' | 'UnknownError' | 'UserDuplicateError', ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface EmailScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Email'], any> {
  name: 'Email';
}

export type ErrorResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  __resolveType: TypeResolveFn<'AuthenticationError' | 'UnknownError' | 'UserDuplicateError', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type LogoutPayloadResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['LogoutPayload'] = ResolversParentTypes['LogoutPayload']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LogoutResultResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['LogoutResult'] = ResolversParentTypes['LogoutResult']> = {
  __resolveType: TypeResolveFn<'AuthenticationError' | 'LogoutPayload', ParentType, ContextType>;
};

export type MutationResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createUser?: Resolver<ResolversTypes['CreateUserResult'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['LogoutResult'], ParentType, ContextType>;
  refreshAccessToken?: Resolver<ResolversTypes['RefreshAccessTokenResult'], ParentType, ContextType>;
  throw?: Resolver<ResolversTypes['Error'], ParentType, ContextType>;
};

export type NodeResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'User', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export interface ObjectIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ObjectID'], any> {
  name: 'ObjectID';
}

export type QueryResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  ping?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type RefreshAccessTokenPayloadResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['RefreshAccessTokenPayload'] = ResolversParentTypes['RefreshAccessTokenPayload']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RefreshAccessTokenResultResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['RefreshAccessTokenResult'] = ResolversParentTypes['RefreshAccessTokenResult']> = {
  __resolveType: TypeResolveFn<'AuthenticationError' | 'RefreshAccessTokenPayload', ParentType, ContextType>;
};

export type UnknownErrorResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['UnknownError'] = ResolversParentTypes['UnknownError']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stack?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['Email'], ParentType, ContextType>;
  externalId?: Resolver<ResolversTypes['ObjectID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDuplicateErrorResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['UserDuplicateError'] = ResolversParentTypes['UserDuplicateError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  suggestion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MercuriusContext> = {
  AuthenticationError?: AuthenticationErrorResolvers<ContextType>;
  CreateUserPayload?: CreateUserPayloadResolvers<ContextType>;
  CreateUserResult?: CreateUserResultResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Email?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  LogoutPayload?: LogoutPayloadResolvers<ContextType>;
  LogoutResult?: LogoutResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  ObjectID?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  RefreshAccessTokenPayload?: RefreshAccessTokenPayloadResolvers<ContextType>;
  RefreshAccessTokenResult?: RefreshAccessTokenResultResolvers<ContextType>;
  UnknownError?: UnknownErrorResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserDuplicateError?: UserDuplicateErrorResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = MercuriusContext> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
};
