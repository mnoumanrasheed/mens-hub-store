"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { LoadingIndicator } from "@/components/ui/loading-indicator";

const minimumVisibleTime = 1100;

export function InitialStorefrontLoader() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.documentElement.style.overflow;
    let timer = 0;

    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      timer = window.setTimeout(() => {
        document.documentElement.style.overflow = previousOverflow;
        setVisible(false);
      }, minimumVisibleTime);
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(timer);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="initial-storefront-loader"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, visibility: "hidden" }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          aria-busy="true"
        >
          <LoadingIndicator label="Opening the boutique" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}