const typeDefs = `

scalar DateTime

interface Error {
  """Error message"""
  message: String!

  """Error name"""
  name: String!
}

type Mutation {
  """Throw an error"""
  throw: Error!
}

type Query {
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

  """
  message is a detailed human-readable explanation of the error.
  It's intended to help developers understand and address the error.
  """
  message: String!

  """name is the name of the error."""
  name: String!

  """
  stack represents the stack trace of the error.
  It gives more technical details about where and why the error was thrown, which can be helpful for debugging.
  """
  stack: String
}
`
export default typeDefs
