export interface Cancelable {
  clear(): void;
}

export default function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait?: number
): T & Cancelable {
  let timeout: any;
  function debounced(...args: any[]) {
    const later = () => {
      // @ts-ignore
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }

  debounced.clear = () => {
    clearTimeout(timeout);
  };

  return debounced as T & Cancelable;
}
