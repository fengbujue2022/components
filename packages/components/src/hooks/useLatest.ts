import { MutableRefObject, useRef } from 'react';

function useLatest<T>(val: T): MutableRefObject<T>  {
  const ref = useRef(val);
  ref.current = val;
  return ref;
}

export default useLatest;
