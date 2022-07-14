export const generateKey = function (...params: Object[]) {
  return params.map((_) => _.toString()).join('-');
};
