export const reflow = (node: Element) => node.scrollTop;

interface ComponentProps {
  easing: string | { enter?: string; exit?: string } | undefined;
  style: React.CSSProperties | undefined;
  timeout: number | { enter?: number; exit?: number };
}

interface Options {
  mode: 'enter' | 'exit';
}

interface TransitionProps {
  duration: string | number;
  easing: string | undefined;
  delay: string | undefined;
}

export function getTransitionProps(
  props: ComponentProps,
  options: Options
): TransitionProps {
  const { timeout, easing, style = {} } = props;

  return {
    duration:
      style.transitionDuration ??
      (typeof timeout === 'number' ? timeout : timeout[options.mode] || 0),
    easing:
      style.transitionTimingFunction ??
      (typeof easing === 'object' ? easing[options.mode] : easing),
    delay: style.transitionDelay,
  };
}

function formatMs(milliseconds: number) {
  return `${Math.round(milliseconds)}ms`;
}

export function createTransition(animatedProp: string, props: TransitionProps) {
  const { delay = 0, duration, easing } = props;

  return `${animatedProp} ${
    typeof duration === 'string' ? duration : formatMs(duration)
  } ${easing} ${typeof delay === 'string' ? delay : formatMs(delay)}`;
}
