import { app } from "./app";

app.listen({ port: 3000 }).then((value) => {
  console.log(`Server listening on ${value}`);
});
