"use client";

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    const checkPlatform = () => {
      const mobileWidth = window.innerWidth < breakpoint;
      const touchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobileWidth);
      setIsTouch(touchCapable);
    };

    checkPlatform();
    window.addEventListener("resize", checkPlatform);
    return () => window.removeEventListener("resize", checkPlatform);
  }, [breakpoint]);

  return { isMobile, isTouch };
}
