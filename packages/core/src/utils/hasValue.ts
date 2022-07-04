export default function hasValue(value: any) {
  return value != null && !(Array.isArray(value) && value.length === 0);
}
