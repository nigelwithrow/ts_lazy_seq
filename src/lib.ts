
export type list<t> = [
  ...t[], // contiguous list of elements before the next pull
  null | (() => null | list<t>)
];

export const contiguous_part = <t>(l: list<t>): t[] =>
  l.slice(0, l.length - 1) as t[];
export const linked_part = <t>(l: list<t>): null | (() => null | list<t>) =>
  l[l.length - 1] as unknown as null | (() => null | list<t>);

const _length = <t>(l: list<t>): Exclude<number, 0> => l.length;

export const empty: list<never> = [null];

export const return_ = <t>(elem: t): list<t> => [elem, null];

export const ints = (i: number): list<number> =>
  [i, () => ints(i + 1)];

export const take = <t>(n: number, list: list<t>): list<t> => {
  if (n === 0 || linked_part(list) === null) {
    return empty;
  }
  // else if (_length(list) - 1 <= n) {
  //   if (list[list.length - 1] === null) {
  //     return list;
  //   }
  //   return [...contiguous_part(list), null];
  // }
  else if (_length(list) > 1) {
    const took = contiguous_part(list);
    const link = linked_part(list);
    return [...took, link && (() => take(n - took.length, [link]))];
  }
  else {
    const link = linked_part(list);
    if (link === null)
      return empty;

    const next = link();
    if (next === null)
      return empty;

    return take(n, next);
  }
};
// export const take_now = <t>

export const to_array = <t>(list: list<t>) => {
  const arr: Array<t> = [...contiguous_part(list)];
  let link = linked_part(list);
  while (link !== null) {
    const next = link();
    if (next === null)
      break;

    for (const elem of contiguous_part(next)) {
      arr.push(elem);
    }
    link = linked_part(next);
  }
  return arr;
};
