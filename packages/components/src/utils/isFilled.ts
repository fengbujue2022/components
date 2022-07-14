import hasValue from './hasValue';

export type TargetObject = {
  value?: string;
};

export default function isFilled(obj: TargetObject) {
  return obj && hasValue(obj.value) && obj.value !== '';
}
