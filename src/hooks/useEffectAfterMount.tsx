import { useEffect, useRef } from "react";

export const useEffectAfterMount = (
  effect: () => void,
  deps: unknown[]
): void => {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      effect();
    } else {
      didMountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);
  return;
};
