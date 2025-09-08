import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Title from "../../atoms/Title/Title";

/**
 * ModalShell (organism)
 * - Gère overlay, fermeture ESC, clic sur backdrop, scroll-lock, focus initial.
 * - Ne connaît pas le contenu (slot via children).
 */
export default function ModalShell({
  open,
  onClose,
  title,           // string | ReactNode
  labelledById,    // si tu fournis un titre custom, passe son id pour aria-labelledby
  children,
  size = "md",     // sm | md | lg
  hideHeader = false,
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  // ESC pour fermer
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Focus initial
  useEffect(() => {
    if (open) setTimeout(() => contentRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  const maxW =
    size === "sm" ? "max-w-[420px]" :
    size === "lg" ? "max-w-[720px]" :
                    "max-w-[560px]";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose?.();
      }}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        ref={contentRef}
        tabIndex={-1}
        className={`w-[92vw] ${maxW} rounded-2xl bg-white shadow-xl outline-none font-poppins`}
      >
        {!hideHeader && (
          <div className="px-6 pt-6">
            {typeof title === "string" ? <Title>{title}</Title> : title}
          </div>
        )}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}

ModalShell.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelledById: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  hideHeader: PropTypes.bool,
};
