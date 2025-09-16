"use client";

import { motion } from "framer-motion";
import { ReactElement } from "react";

type Props = {
  text?: string;
  className?: string;
};

export default function AnimatedLoadingMessage({
  text = "Generating",
  className = "",
}: Props): ReactElement {



  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 ${className}`}
    >
      {/* Label + dots */}
      <span className="tracking-wide">{text}</span>
      <span className="inline-flex w-4 justify-between pl-0.5 align-bottom items-baseline justify-self-end self-end pb-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-[0.25em] w-[0.25em] rounded-full bg-slate-500/70 dark:bg-slate-300/80"
            initial={{ scale: 0.6, opacity: 0.4 }}
            animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1,
              delay: i * 0.12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
    </div>
  );
}
