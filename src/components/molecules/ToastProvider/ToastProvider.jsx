import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

const ToastCtx = createContext(null);

let idSeq = 0;
const nextId = () => `t_${Date.now()}_${idSeq++}`;


export function ToastProvider({
  children,
  position = "top-right",
  max = 4, // nombre max à l'écran (les autres attendent en file)
}) {
  const [queue, setQueue] = useState([]);     // file d’attente
  const [visible, setVisible] = useState([]); // visibles (0..max)
  const timersRef = useRef(new Map());        // id -> timeout
  const rafRef = useRef(null);

  const push = useCallback(({ text, type = "info", duration = 3000 }) => {
    const id = nextId();
    setQueue(q => [...q, { id, text, type, duration, createdAt: Date.now() }]);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    if (!id) {
      // dismiss all
      setVisible([]);
      setQueue([]);
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
      return;
    }
    setVisible(v => v.filter(t => t.id !== id));
    setQueue(q => q.filter(t => t.id !== id));
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
  }, []);

  // Hydrate `visible` depuis la file, et pose les timers d’auto-dismiss
  useEffect(() => {
    if (visible.length >= max || queue.length === 0) return;

    const toTake = Math.min(max - visible.length, queue.length);
    const next = queue.slice(0, toTake);
    setVisible(v => [...v, ...next]);
    setQueue(q => q.slice(toTake));

    next.forEach(toast => {
      // timer auto-dismiss
      const timeout = setTimeout(() => {
        setVisible(v => v.filter(t => t.id !== toast.id));
        timersRef.current.delete(toast.id);
      }, toast.duration);
      timersRef.current.set(toast.id, timeout);
    });
  }, [queue, visible, max]);

  // Nettoyage
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const ctx = useMemo(() => ({ push, dismiss }), [push, dismiss]);
  const posCls = {
    "top-right": "top-3 right-3",
    "top-left": "top-3 left-3",
    "bottom-right": "bottom-3 right-3",
    "bottom-left": "bottom-3 left-3",
  }[position];

  return (
    <ToastCtx.Provider value={ctx}>
      {children}

      {/* Viewport */}
      <div className={`pointer-events-none fixed z-[60] flex max-w-sm flex-col gap-2 ${posCls}`}>
        {visible.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["top-right", "top-left", "bottom-right", "bottom-left"]),
  max: PropTypes.number,
};

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider />");
  return ctx;
}

/** Un item de toast (visuel + accessibilité) */
function ToastItem({ toast, onClose }) {
  const { id, text, type, duration } = toast;
  const barRef = useRef(null);

  // petite barre de progression (optionnelle) qui “descend” avec le timeout
  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.width = "100%";
    // animer la width sur `duration` (respecte prefers-reduced-motion)
    barRef.current.style.transition = `width ${duration}ms linear`;
    requestAnimationFrame(() => {
      barRef.current && (barRef.current.style.width = "0%");
    });
  }, [duration]);

  // styles par type (alignés avec ta palette)
  const tone = {
    success: {
      box: "bg-emerald-600 text-white",
      bar: "bg-emerald-400",
      icon: "✓",
    },
    error: {
      box: "bg-red-600 text-white",
      bar: "bg-red-400",
      icon: "⚠",
    },
    warning: {
      box: "bg-amber-500 text-text-900",
      bar: "bg-amber-300",
      icon: "!",
    },
    info: {
      box: "bg-text-900 text-white",
      bar: "bg-primary-400",
      icon: "i",
    },
  }[type] || {
    box: "bg-text-900 text-white",
    bar: "bg-primary-400",
    icon: "i",
  };

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`pointer-events-auto flex w-[min(92vw,28rem)] flex-col overflow-hidden rounded-xl shadow-lg ${tone.box} font-poppins`}
    >
      <div className="flex items-start gap-2 px-4 py-3">
        <span className="select-none text-[14px] leading-5">{tone.icon}</span>
        <p className="flex-1 text-[14px] leading-5">{text}</p>
        <button
          onClick={onClose}
          className="ml-2 inline-flex shrink-0 rounded-md px-2 py-1 text-[12px] leading-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-400"
          aria-label="Fermer la notification"
        >
          Fermer
        </button>
      </div>

      {/* barre de durée */}
      <div className="h-1 w-full bg-black/10">
        <div ref={barRef} className={`h-full ${tone.bar}`} />
      </div>
    </div>
  );
}

ToastItem.propTypes = {
  toast: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["info", "success", "error", "warning"]),
    duration: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
