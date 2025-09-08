import React, { forwardRef } from "react";
import PropTypes from "prop-types";

export const TextArea = forwardRef(
  (
    {
      id,
      label,
      value = "",
      onChange,
      placeholder,
      rows = 4,
      error,
      hint,
      required = false,
      disabled = false,
      maxLength,
      className = "",
      textareaClassName = "",
      ...rest
    },
    ref
  ) => {
    const hintId = hint && id ? `${id}-hint` : undefined;
    const errId = error && id ? `${id}-error` : undefined;
    const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={`grid gap-2 font-poppins ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="text-[14px] font-semibold text-text-900"
          >
            {label}
            {required && <span aria-hidden="true" className="text-red-500"> *</span>}
          </label>
        )}

        <textarea
          id={id}
          ref={ref}
          className={[
            "w-full min-h-[90px] rounded-xl border px-3 py-2 text-[14px] leading-5",
            "placeholder:text-text-400",
            disabled ? "cursor-not-allowed opacity-60" : "focus:outline-none focus:ring-2 focus:ring-primary-400",
            error ? "border-red-500" : "border-text-300",
            textareaClassName
          ].join(" ")}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...rest}
        />

        {hint && (
          <p id={hintId} className="text-[12px] leading-4 text-text-400">
            {hint}
          </p>
        )}

        {error && (
          <p id={errId} className="text-[14px] text-red-600" role="alert">
            {error}
          </p>
        )}

        {typeof maxLength === "number" && (
          <div className="text-right text-[12px] leading-4 text-text-400">
            {(value ?? "").length}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

TextArea.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  textareaClassName: PropTypes.string,
};

export default TextArea;