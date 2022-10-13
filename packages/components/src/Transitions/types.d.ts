import type {
  TransitionProps as OriginalTransitionProps,
  EndHandler,
} from 'react-transition-group/Transition';

type EasingProp =
  | string
  | {
      enter?: string | undefined;
      exit?: string | undefined;
    };

type TransitionProps = Omit<OriginalTransitionProps, 'addEndListener'> & {};
