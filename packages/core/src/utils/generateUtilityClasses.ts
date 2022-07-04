const defaultGenerator = (componentName: string) => componentName;

const createClassNameGenerator = () => {
  let generate = defaultGenerator;
  return {
    configure(generator: typeof generate) {
      generate = generator;
    },
    generate(componentName: string) {
      return generate(componentName);
    },
    reset() {
      generate = defaultGenerator;
    }
  };
};

const ClassNameGenerator = createClassNameGenerator();

export function generateUtilityClass(
  componentName: string,
  slot: string
): string {
  return `${ClassNameGenerator.generate(componentName)}-${slot}`;
}

export function generateUtilityClasses<T extends string>(
  componentName: string,
  slots: T[]
): Record<T, string> {
  const result: Record<string, string> = {};

  slots.forEach((slot) => {
    result[slot] = generateUtilityClass(componentName, slot);
  });

  return result;
}

export function makeGetUtilityClass<T extends string>(
  componentName: string
): (slot: T) => string {
  return (slot: T) => generateUtilityClass(componentName, slot);
}
