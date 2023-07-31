const typeDefs = `

"""Input type to define the information needed to create a User."""
input CreateUserInput {
  """The email of the User to be created."""
  email: Email!

  """The password for the User to be created."""
  password: String!
}

"""The payload returned when a User is successfully created."""
type CreateUserPayload {
  """
  The access token that can be used to authenticate as the newly created User.
  """
  accessToken: String!

  """
  The refresh token that can be used to refresh the token of the newly created User.
  """
  refreshToken: String!

  """The newly created User object."""
  user: User!
}

"""
The result of the createUser mutation. It can be either a successful payload or an error.
"""
union CreateUserResult = CreateUserPayload | UnknownError | UserDuplicateError

scalar DateTime

scalar Email

interface Error {
  """Detailed error message."""
  message: String!
}

type Mutation {
  """Mutation to create a new User with the provided input."""
  createUser(
    """The input needed to create a new User."""
    input: CreateUserInput!
  ): CreateUserResult!

  """Throw an error"""
  throw: Error!
}

"""Node interface"""
interface Node {
  """Global Object Identifier"""
  id: ID!
}

scalar ObjectID

type Query {
  """
  Fetches an object given its ID. This is a generic method, used to fetch any type of object
  implementing the Node interface with its unique identifier.
  """
  node(id: ID!): Node

  """
  The 'ping' field serves as a simple health check for the GraphQL server.
  """
  ping: Boolean!
}

"""
UnknownError represents a type of error that cannot be categorized into a more specific type.
This is the fallback error type for unforeseen issues.
"""
type UnknownError implements Error {
  """
  createdAt is the timestamp at which the error was thrown.
  This can be useful for logging, debugging, and tracing error occurrences over time.
  """
  createdAt: DateTime!
  message: String!

  """
  stack represents the stack trace of the error.
  It gives more technical details about where and why the error was thrown, which can be helpful for debugging.
  """
  stack: String
}

"""User type."""
type User implements Node {
  """
  The date and time when the User was created. This is typically set by the server when the User is created.
  """
  createdAt: DateTime!

  """The email address of the User."""
  email: Email!

  """
  A unique identifier for the User generated by the database. It is typically used internally.
  """
  externalId: ObjectID!
  id: ID!

  """
  The date and time when the User was last updated. This is typically set by the server when the User is updated.
  """
  updatedAt: DateTime!
}

"""
An error type to represent when a duplicate user is attempted to be created.
"""
type UserDuplicateError implements Error {
  message: String!

  """Suggested actions or corrections for the error."""
  suggestion: String!
}
`
export default typeDefs
