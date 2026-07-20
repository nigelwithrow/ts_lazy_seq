import { to_array, take, ints, forever, once, map, append, forever_list, of_array, fold_while } from "../src/lib.js";
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

// tests for `append`
assert.deepStrictEqual(
  to_array<number>(append(take(5, ints(0)),
                          take(5, ints(0)))),
  [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]
);

// tests for `forever_list`
assert.deepStrictEqual(
  to_array<number>(take(11, once(() => {
    let lower = 0, upper = 0;
    return [0, () => forever_list(() => of_array([++upper, --lower]))];
  }))),
  [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5]
);

// tests for `fold_while`
assert.deepStrictEqual(
  'stop' in fold_while<number>(
    ints(0),
    (_, n) => n > 10 ? { stop: null } : { continue: null },
    null
  ),
  true
);
