import React from "react";
import { Icon } from "@iconify/react";

interface ConflictWarningModalProps {
  message: string;
  onClose: () => void;
}

const ConflictWarningModal:
  React.FC<
    ConflictWarningModalProps
  > = ({
    message,
    onClose,
  }) => {

  const lines =
    message
      .split("\n")
      .map(
        (item) =>
          item.trim()
      )
      .filter(
        Boolean
      );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4"
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div className="flex items-start gap-4 p-6">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">

            <Icon
              icon="lucide:triangle-alert"
              className="text-2xl"
            />

          </div>


          <div className="flex-1">

            <h2 className="text-xl font-bold text-gray-950">
              Timetable conflict detected
            </h2>


            <p className="mt-2 text-sm leading-6 text-gray-600">
              The timetable could not be saved exactly as requested because one or more scheduling rules failed.
            </p>


            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">

              {lines.length >
              1 ? (

                <ul className="list-disc space-y-2 pl-5 text-sm text-amber-900">

                  {lines.map(
                    (
                      line,
                      index
                    ) => (
                      <li
                        key={`${line}-${index}`}
                      >
                        {line}
                      </li>
                    )
                  )}

                </ul>

              ) : (

                <p className="text-sm font-medium text-amber-900">
                  {message}
                </p>
              )}

            </div>


            <p className="mt-4 text-xs text-gray-500">
              Change the teacher, time, room, subject assignment or weekly period allocation and try again.
            </p>

          </div>

        </div>


        <div className="flex justify-end border-t border-gray-200 p-5">

          <button
            type="button"
            onClick={
              onClose
            }
            className="min-h-11 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Review Schedule
          </button>

        </div>

      </div>

    </div>
  );
};


export default ConflictWarningModal;
