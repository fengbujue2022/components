import * as React from 'react';

export interface UseControlledProps<T = unknown> {
    /**
     * Holds the component value when it's controlled.
     */
    controlled: T | undefined;
    /**
     * The default value when uncontrolled.
     */
    default: T | undefined;
}

export default function useControlled<T = unknown>({ controlled, default: defaultProp }: UseControlledProps<T>): [T, (newValue: T | ((prevValue: T) => T)) => void] {
    // isControlled is ignored in the hook dependency lists as it should never change.
    const { current: isControlled } = React.useRef(controlled !== undefined);
    const [valueState, setValue] = React.useState(defaultProp);
    const value = isControlled ? controlled : valueState;

    const setValueIfUncontrolled = React.useCallback((newValue: T | ((prevValue: T) => T)) => {
        if (!isControlled) {
            setValue(newValue as any);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [value, setValueIfUncontrolled] as unknown as [T, (newValue: T | ((prevValue: T) => T)) => void];
}