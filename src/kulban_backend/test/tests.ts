import { expect, it, Test } from "azle/test";

export function getTests(canisterId: string): Test {
  const origin = `http://${canisterId}.raw.localhost:4943`;
  console.log(origin);
  return () => {
    it("gets a simple hello world database", async () => {
      const response = await fetch(`${origin}`);
      const responseJson = await response.json();
      console.log(response);

      expect(responseJson).toEqual({ hello: "" });
    });
  };
}
