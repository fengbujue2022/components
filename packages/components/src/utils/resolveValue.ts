const resolveValue = <T extends {}>(container: T | (() => T)) => {
  return typeof container === 'function'
    ? // @ts-ignore
      container()
    : container;
};

export default resolveValue;
