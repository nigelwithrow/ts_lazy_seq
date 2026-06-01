import { fast } from "../src/lib.js";
import assert from "node:assert";

assert.deepStrictEqual(
  fast.to_array<number>(fast.take(5, fast.ints(0))),
  [0, 1, 2, 3, 4]
);
