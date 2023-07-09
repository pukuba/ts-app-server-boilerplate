import { execute, gql } from "../../common";

describe("Mutation > throw", () => {
  it("should return an error", async() => {
    const query = gql`
      mutation {
        throw {
          __typename
          ... on Error {
            name
            message
          }
          ... on UnknownError {
            stack
          }
        }
      }
    `;
    const [data, errors] = await execute(query, null);
    expect(errors).toBeNull();
    expect(data).toEqual({
      throw: {
        __typename: "UnknownError",
        name: "UnknownError",
        message: "UnknownError",
        stack: "throw > Mutation",
      },
    });
  });
});
