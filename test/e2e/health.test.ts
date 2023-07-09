import { app } from "../../src/app";

describe("GET /healthz", () => {
  it("should return 200 OK", async() => {
    const response = await app.inject({
      method: "GET",
      url: "/healthz",
    });
    expect(response.statusCode).toBe(200);
  });
});
