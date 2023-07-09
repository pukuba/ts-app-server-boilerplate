import { app } from "../../src/app";
import { gql } from "../common";

describe("POST /graphql", () => {
  it("should return 200 OK", async() => {
    const query = gql`
        query {
          ping
        }
    `;
    const response = await app.inject({
      method: "POST",
      url: "/graphql",
      payload: { query },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ data: { ping: true } });
  });
});
