const typeDefs = `

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

type UnknownError implements Error {
  """Error message"""
  message: String!

  """Error name"""
  name: String!

  """Stack trace"""
  stack: String
}
`
export default typeDefs
