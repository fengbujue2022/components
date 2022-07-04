import React from 'react';
import isClient from '@components/core/src/utils/isClient';

const useEnhancedEffect = isClient ? React.useLayoutEffect : React.useEffect;

export default useEnhancedEffect;
