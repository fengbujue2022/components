export const isClient = typeof window !== 'undefined';
export const isObject = (val: any): val is object =>
  toString.call(val) === '[object Object]';
