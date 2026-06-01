
type node<t> = null | {x: t, xs: list<t>};

const is_node = <t>(value: unknown): value is node<t> => {
  return (typeof value === 'object' &&
          (value === null ||
           (Array.isArray(value) &&
            value.length === 2 &&
            is_list(value[1]))));
}

type list<t, fast = never> = () => node<t>;

const is_list = <t, fast>(value: unknown): value is list<t, fast> => {
  return typeof value === 'function';
}

export namespace fast {

  class node<t, fast=never> {
    x: t;
    xs: list<t, fast>;
    constructor(x: t, xs: list<t, fast>) {
      this.x = x;
      this.xs = xs;
    }
  }

  export const is_node = <t, fast=never>(value: unknown): value is node<t, fast> => {
    return value instanceof node;
  }

  export type list<t, fast = never> = () => null | fast | node<t, fast>;

  export const is_list = <t, fast>(value: unknown): value is list<t, fast> => {
    return typeof value === 'function';
  }

  export const empty: list<never, never> =
    () => null;

  export const return_ = <t>(elem: t): list<t, never> =>
    () => new node(elem, empty);

  export const ints = (i: number): list<number, never> =>
    () => {
      return new node(i, ints(i + 1));
    }

  export const take = <t, fast>(n: number, list: list<t, fast>): list<t, fast> => {
    if (n === 0)
      return empty;
    return () => {
      const next = list();
      if (!is_node<t, fast>(next)) {
        return next;
      }
      else if (next === null) {
        return null;
      }
      return new node(next.x, take(n - 1, next.xs));
    }
  };

  export const to_array = <t>(list: list<t, t[]>) => {
    const arr: Array<t> = [];
    while (true) {
      const next = list();
      if (is_node<t, unknown>(next)) {
        arr.push(next.x);
        list = next.xs;
      } else if (next === null) {
        return arr;
      } else {
        arr.concat(next);
        return arr;
      }
    }
  };
}
