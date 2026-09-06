import React, { useEffect, useRef } from "react";

import { Icon } from "@iconify/react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  onClose?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  title,
  message,
  primaryLabel = "Continue",
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 pt-10 shadow-xl outline-none"
      >
        <div className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-sm">
          <Icon icon="lucide:check" className="h-7 w-7" />
        </div>

        {onClose && (
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Icon icon="lucide:x" className="h-5 w-5" />
          </button>
        )}

        <div className="text-center">
          <h3
            id="success-modal-title"
            className="text-lg font-semibold text-slate-900"
          >
            {title}
          </h3>

          {message && (
            <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              className="min-h-10 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {secondaryLabel}
            </button>
          )}

          <button
            type="button"
            onClick={onPrimary}
            autoFocus
            className="min-h-10 flex-1 rounded-lg border border-blue-600 bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
