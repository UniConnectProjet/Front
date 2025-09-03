import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const clamp = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));

export const ProgressBar = forwardRef(
  (
    {
      value,                  // number 0..100 → déterminée ; undefined/null → indéterminée
      min = 0,
      max = 100,
      label = "Progression",
      showValue = false,
      size = "md",            // "sm" | "md" | "lg"
      className = "",
      trackClassName = "",
      ...rest
    },
    ref
  ) => {
    const isIndeterminate = value === undefined || value === null;
    const pct = clamp(value);

    const sizeCls =
      size === "sm" ? "h-1.5" :
      size === "lg" ? "h-3"   :
                      "h-2";

    return (
      <div className={`grid grid-cols-[1fr_auto] items-center gap-2 font-poppins ${className}`} {...rest}>
        <div
          ref={ref}
          role="progressbar"
          aria-label={label}
          aria-valuemin={isIndeterminate ? undefined : min}
          aria-valuemax={isIndeterminate ? undefined : max}
          aria-valuenow={isIndeterminate ? undefined : pct}
          className={`w-full overflow-hidden rounded-full bg-text-200 ${sizeCls} ${trackClassName}`}
        >
          <div
            className={[
              "h-full rounded-full bg-primary-500 transition-[width] duration-200",
              isIndeterminate ? "w-2/5 animate-pulse" : ""
            ].join(" ")}
            style={isIndeterminate ? undefined : { width: `${pct}%` }}
          />
        </div>

        {showValue && !isIndeterminate && (
          <div className="text-[12px] leading-4 text-text-500" aria-hidden="true">
            {pct}%
          </div>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

ProgressBar.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  label: PropTypes.string,
  showValue: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  trackClassName: PropTypes.string,
};

export default ProgressBar;