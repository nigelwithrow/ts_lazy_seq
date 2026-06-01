import { to_array, take, ints } from "../src/lib.js";
import assert from "node:assert";

assert.deepStrictEqual(
  to_array<number>(take(5, ints(0))),
  [0, 1, 2, 3, 4]
);
