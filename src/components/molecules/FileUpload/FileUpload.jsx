// src/components/molecules/FileUpload/index.jsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import Button from "@/components/atoms/Button";

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
}

function normalizeAccept(accept) {
  if (!accept) return null;
  if (Array.isArray(accept)) return accept;
  return String(accept).split(",").map((s) => s.trim()).filter(Boolean);
}

/**
 * FileUpload (Tailwind-only, palette & typo respectées)
 * - Pas de label ici : envelopper dans <FormField>.
 */
export default function FileUpload({
  id,
  files,
  onChange,
  accept,
  maxFiles = 4,
  maxSizeMB = 8,
  disabled = false,
  onRejected,
  className = "",
  inputProps = {},
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptList = useMemo(() => normalizeAccept(accept), [accept]);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const remaining = Math.max(0, maxFiles - files.length);

  const validateFiles = useCallback((incoming) => {
    const next = [];
    const rejected = [];
    const reasons = [];
    for (const f of incoming) {
      const typeOk = !acceptList || acceptList.includes(f.type);
      const sizeOk = f.size <= maxSizeBytes;
      if (!typeOk) { rejected.push(f); reasons.push(`Type non autorisé: ${f.name}`); continue; }
      if (!sizeOk) { rejected.push(f); reasons.push(`Taille > ${maxSizeMB} Mo: ${f.name}`); continue; }
      next.push(f);
    }
    return { next, rejected, reasons };
  }, [acceptList, maxSizeBytes, maxSizeMB]);

  const addFiles = useCallback((list) => {
    if (!list || disabled) return;
    const picked = Array.from(list);
    const { next, rejected, reasons } = validateFiles(picked);
    const slots = Math.max(0, remaining);
    const toAdd = next.slice(0, slots);
    const extraCut = next.slice(slots);

    const newFiles = [...files, ...toAdd];
    onChange(newFiles);

    if ((rejected && rejected.length) || (extraCut && extraCut.length)) {
      const reasonsAll = [...reasons, ...(extraCut.length ? [`Maximum ${maxFiles} fichiers atteint`] : [])];
      onRejected?.([...rejected, ...extraCut], reasonsAll);
    }
  }, [disabled, files, remaining, maxFiles, onChange, onRejected, validateFiles]);

  const onInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = ""; // re-pick same file if needed
  };

  // DnD handlers
  const onDragOver = (e) => { if (disabled) return; e.preventDefault(); e.dataTransfer.dropEffect = "copy"; setIsDragging(true); };
  const onDragLeave = (e) => { if (disabled) return; e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => { if (disabled) return; e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); };

  return (
    <div className={`grid gap-2 font-poppins ${className}`}>
      {/* Dropzone */}
      <div
        id={id}
        className={[
          "relative rounded-xl border border-text-200 bg-white p-4 outline-none",
          "transition-colors duration-150",
          "focus-visible:ring-2 focus-visible:ring-primary-400",
          isDragging ? "border-primary-400 bg-primary-100/40" : "",
          disabled ? "opacity-60 pointer-events-none" : "",
        ].join(" ")}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        aria-disabled={disabled}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text text-text-500">Glissez vos fichiers ici ou</span>
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || remaining === 0}
            className="!bg-buttonColor-500 hover:!bg-buttonColor-400 !text-white"
          >
            Parcourir
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          disabled={disabled || remaining === 0}
          accept={acceptList ? acceptList.join(",") : undefined}
          onChange={onInputChange}
          className="absolute inset-0 h-px w-px opacity-0"
          {...inputProps}
        />

        <div className="mt-2 text-[12px] leading-4 text-text-400">
          {acceptList ? acceptList.join(", ") : "Tous formats"} — ≤ {maxSizeMB} Mo / fichier — {maxFiles} fichiers max
          {remaining < maxFiles && <span> — {remaining} restant(s)</span>}
        </div>
      </div>

      {/* Liste */}
      {files.length > 0 && (
        <ul className="overflow-hidden rounded-xl border border-text-200">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${f.size}-${i}`}
              className="flex items-center justify-between gap-3 border-t border-text-100 px-3 py-2 first:border-t-0"
            >
              <div className="min-w-0">
                <span className="truncate font-semibold text-text-600 max-w-[28ch] inline-block" title={f.name}>
                  {f.name}
                </span>
                <span className="ml-2 text-text text-text-400">({formatBytes(f.size)})</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                disabled={disabled}
                className="!text-buttonColor-600 hover:!text-buttonColor-500"
                aria-label={`Retirer ${f.name}`}
                title={`Retirer ${f.name}`}
              >
                Retirer
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

FileUpload.propTypes = {
  id: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  maxFiles: PropTypes.number,
  maxSizeMB: PropTypes.number,
  disabled: PropTypes.bool,
  onRejected: PropTypes.func,
  className: PropTypes.string,
  inputProps: PropTypes.object,
};