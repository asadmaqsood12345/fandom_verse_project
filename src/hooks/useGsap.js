import { useLayoutEffect } from "react";
import gsap from "gsap";

export default function useGsap(setup, deps = []) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => setup());
    return () => ctx.revert();
  }, deps);
}
