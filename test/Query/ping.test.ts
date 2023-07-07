import { execute, gql } from "../common";

describe("Query > ping",() => {
  it("should return true",async() => {
    const query = gql`
      query {
        ping
      }
    `;
    const [data,errors]  =await  execute(query, null);
    expect(errors).toBeNull();
    expect(data).toBe({ ping:true });
  });
});
