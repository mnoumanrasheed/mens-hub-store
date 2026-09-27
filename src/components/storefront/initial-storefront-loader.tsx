"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { LoadingIndicator } from "@/components/ui/loading-indicator";

const minimumVisibleTime = 900;
const videoTimeout = 4000;

export function InitialStorefrontLoader() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.documentElement.style.overflow;
    let dismissTimer = 0;
    let fallbackTimer = 0;
    let finished = false;

    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      if (finished) return;
      finished = true;
      dismissTimer = window.setTimeout(() => {
        document.documentElement.style.overflow = previousOverflow;
        setVisible(false);
      }, minimumVisibleTime);
    };

    const heroVideo = document.querySelector<HTMLVideoElement>(".mh-campaign-video");
    const videoReady = () => finish();

    if (heroVideo) {
      if (heroVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) finish();
      else {
        heroVideo.addEventListener("canplay", videoReady, { once: true });
        heroVideo.addEventListener("error", videoReady, { once: true });
      }
      fallbackTimer = window.setTimeout(finish, videoTimeout);
    } else if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      window.removeEventListener("load", finish);
      heroVideo?.removeEventListener("canplay", videoReady);
      heroVideo?.removeEventListener("error", videoReady);
      window.clearTimeout(dismissTimer);
      window.clearTimeout(fallbackTimer);
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
          <LoadingIndicator label="Opening the collection" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
