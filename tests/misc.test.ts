import { to_array, take, ints, forever, once, map } from "../src/lib.js";
import assert from "node:assert";

assert.deepStrictEqual(
  to_array<number>(take(5, ints(0))),
  [0, 1, 2, 3, 4]
);

// tests for `forever`
assert.deepStrictEqual(
  to_array<number>(take(5, forever(() => 0))),
  [0, 0, 0, 0, 0]
);
assert.deepStrictEqual(
  to_array<number>(take(5, once(() => { // recreating `ints(0)`
    let i = -1;
    return forever(() => ++i);
  }))),
  [0, 1, 2, 3, 4]
);

// tests for `map`
assert.deepStrictEqual(
  to_array<string>(take(5, map(ints(0), n => (n + 1).toString()))),
  ["1", "2", "3", "4", "5"]
);

