import React, { cloneElement, isValidElement, useId } from "react";
import PropTypes from "prop-types";

export default function FormField({
  label,
  htmlFor,                 // id du champ (optionnel)
  children,                 // <Input/>, <TextArea/>, <Select/>...
  hint,
  error,                    // string | string[]
  required = false,
  orientation = "vertical", // "vertical" | "horizontal"
  className = "",
  labelClassName = "",
  bodyClassName = "",
  idPrefix = "ff",
}) {
  const autoId = useId().replace(/:/g, "");
  const inputId = htmlFor || `${idPrefix}-${autoId}`;
  const hintId  = hint  ? `${inputId}-hint`  : undefined;
  const errId   = error ? `${inputId}-error` : undefined;

  const errorText = Array.isArray(error) ? error.filter(Boolean).join(" • ") : error;

  // Injecter id / aria-* / required dans le child
  const enhancedChild = isValidElement(children)
    ? cloneElement(children, {
        id: children.props.id ?? inputId,
        "aria-invalid": children.props["aria-invalid"] ?? !!errorText,
        "aria-describedby": [
          children.props["aria-describedby"],
          hintId,
          errId,
        ].filter(Boolean).join(" ") || undefined,
        required: children.props.required ?? required,
      })
    : children;

  const isRow = orientation === "horizontal";

  return (
    <div
      className={[
        "font-poppins",
        isRow ? "grid grid-cols-[200px_1fr] items-start gap-3" : "grid gap-2",
        className
      ].join(" ")}
      data-invalid={!!errorText || undefined}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={[
            "text-[14px] font-semibold",
            errorText ? "text-red-700" : "text-text-900",
            isRow ? "pt-2" : "",
            labelClassName
          ].join(" ")}
        >
          {label}
          {required && <span className="text-red-500" aria-hidden="true"> *</span>}
        </label>
      )}

      <div className={["grid gap-1.5", bodyClassName].join(" ")}>
        {enhancedChild}

        {hint && (
          <p id={hintId} className="text-[12px] leading-4 text-text-400">
            {hint}
          </p>
        )}

        {errorText && (
          <p id={errId} className="text-[14px] text-red-600" role="alert">
            {errorText}
          </p>
        )}
      </div>
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string,
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  hint: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  required: PropTypes.bool,
  orientation: PropTypes.oneOf(["vertical", "horizontal"]),
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  idPrefix: PropTypes.string,
};
