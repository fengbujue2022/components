import React from 'react';
import isClient from '../utils/isClient';

const useEnhancedEffect = isClient ? React.useLayoutEffect : React.useEffect;

export default useEnhancedEffect;
