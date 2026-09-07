import React, {
  useEffect,
  useRef,
} from "react";


interface ModalComponentProps {
  isOpen: boolean;

  title: string;

  message?: string;

  primaryLabel?: string;

  secondaryLabel?: string;

  onPrimary: () => void;

  onSecondary?: () => void;

  onClose?: () => void;
}


const ModalComponent: React.FC<
  ModalComponentProps
> = ({
  isOpen,
  title,
  message,
  primaryLabel = "Yes, Continue",
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
}) => {
  const dialogRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const previousFocusedElementRef =
    useRef<HTMLElement | null>(
      null
    );


  /* ===================================================
     ACCESSIBILITY

     - Initial focus
     - Escape close
     - Tab trapping
     - Restore previous focus
     - Body scroll lock
  =================================================== */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusedElementRef.current =
      document.activeElement instanceof
      HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);


    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape"
      ) {
        if (onClose) {
          event.preventDefault();
          onClose();
        }

        return;
      }

      if (
        event.key !== "Tab" ||
        !dialogRef.current
      ) {
        return;
      }

      const focusableElements =
        dialogRef.current
          .querySelectorAll<HTMLElement>(
            `
              button:not([disabled]),
              [href],
              input:not([disabled]),
              select:not([disabled]),
              textarea:not([disabled]),
              [tabindex]:not([tabindex="-1"])
            `
          );

      if (
        focusableElements.length ===
        0
      ) {
        event.preventDefault();

        return;
      }

      const firstElement =
        focusableElements.item(0);

      const lastElement =
        focusableElements.item(
          focusableElements.length -
            1
        );

      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {
        event.preventDefault();

        lastElement.focus();

        return;
      }

      if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {
        event.preventDefault();

        firstElement.focus();
      }
    };


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.setTimeout(() => {
        previousFocusedElementRef
          .current
          ?.focus();
      }, 0);
    };
  }, [
    isOpen,
    onClose,
  ]);


  if (!isOpen) {
    return null;
  }


  return (
    <div
      className="
        fixed
        inset-0
        z-[1000]
        flex
        h-full
        w-full
        items-center
        justify-center
        bg-black/50
        p-4
      "
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          onClose
        ) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={
          message
            ? "modal-message"
            : undefined
        }
        tabIndex={-1}
        className="
          relative
          max-h-[95vh]
          w-full
          max-w-md
          overflow-y-auto
          rounded-lg
          border
          border-slate-100
          bg-white
          p-4
          shadow-lg
          outline-none
          md:p-6
          dark:border-neutral-700
          dark:bg-neutral-800
        "
      >
        {onClose && (
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="
              absolute
              right-6
              top-6
              flex
              items-center
              rounded
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="
                size-3
                cursor-pointer
                fill-slate-500
                hover:fill-red-600
                dark:fill-slate-400
                dark:hover:fill-red-500
              "
              aria-hidden="true"
              viewBox="0 0 329.269 329"
            >
              <path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.27 21.27 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164z" />
            </svg>
          </button>
        )}


        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-50 p-3 dark:bg-green-300/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline size-full fill-green-500"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22.514 5.037a1.22 1.22 0 0 1 0 1.726l-12.2 12.2a1.22 1.22 0 0 1-1.725 0l-6.1-6.1a1.22 1.22 0 1 1 1.725-1.726l5.237 5.238L20.79 5.037a1.22 1.22 0 0 1 1.725 0"
                clipRule="evenodd"
              />
            </svg>
          </div>


          <h3
            id="modal-title"
            className="text-base font-semibold text-slate-900 dark:text-slate-50"
          >
            {title}
          </h3>


          {message && (
            <p
              id="modal-message"
              className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
            >
              {message}
            </p>
          )}
        </div>


        <div
          className={`
            mt-6
            flex
            flex-col-reverse
            gap-2
            ${
              secondaryLabel &&
              onSecondary
                ? "sm:flex-row"
                : ""
            }
          `}
        >
          {secondaryLabel &&
            onSecondary && (
              <button
                type="button"
                onClick={
                  onSecondary
                }
                className="
                  min-h-10
                  flex-1
                  rounded-md
                  border
                  border-slate-300
                  bg-white
                  px-3.5
                  py-2
                  text-sm
                  font-semibold
                  text-slate-700
                  transition-colors
                  hover:bg-slate-50
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-500
                  dark:border-neutral-600
                  dark:bg-neutral-800
                  dark:text-slate-100
                "
              >
                {secondaryLabel}
              </button>
            )}


          <button
            type="button"
            onClick={onPrimary}
            autoFocus
            className="
              min-h-10
              flex-1
              cursor-pointer
              rounded-md
              border
              border-blue-600
              bg-blue-600
              px-3.5
              py-2
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-blue-700
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500
            "
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};


export default ModalComponent;
