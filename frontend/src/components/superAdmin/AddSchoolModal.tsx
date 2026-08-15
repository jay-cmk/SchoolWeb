import React from "react";
import { X, School } from "lucide-react";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172033]/30 px-4">

      {/* Modal */}
      <div className="w-full max-w-[420px] rounded-xl bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#2563EB]">
              <School
                size={18}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2 className="text-[13px] font-semibold text-[#172033]">
                Add new school
              </h2>

              <p className="mt-0.5 text-[9px] text-[#60708A]">
                Register a new school on the platform
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#60708A] hover:bg-[#F5F7FA]"
          >
            <X
              size={15}
              strokeWidth={1.8}
            />
          </button>

        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>

          <div className="space-y-3 px-5 pb-5">

            {/* School Name */}
            <div>
              <label
                htmlFor="schoolName"
                className="mb-1 block text-[9px] font-medium text-[#172033]"
              >
                School name
              </label>

              <input
                id="schoolName"
                name="schoolName"
                type="text"
                required
                placeholder="Enter school name"
                className="
                  h-[34px]
                  w-full
                  rounded-lg
                  bg-[#F5F7FA]
                  px-3
                  text-[10px]
                  text-[#172033]
                  outline-none
                  placeholder:text-[#8A97A8]
                  focus:bg-[#EEF3F8]
                "
              />
            </div>

            {/* School Code */}
            <div>
              <label
                htmlFor="schoolCode"
                className="mb-1 block text-[9px] font-medium text-[#172033]"
              >
                School code
              </label>

              <input
                id="schoolCode"
                name="schoolCode"
                type="text"
                required
                placeholder="Enter school code"
                className="
                  h-[34px]
                  w-full
                  rounded-lg
                  bg-[#F5F7FA]
                  px-3
                  text-[10px]
                  uppercase
                  text-[#172033]
                  outline-none
                  placeholder:normal-case
                  placeholder:text-[#8A97A8]
                  focus:bg-[#EEF3F8]
                "
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="schoolEmail"
                className="mb-1 block text-[9px] font-medium text-[#172033]"
              >
                Email
              </label>

              <input
                id="schoolEmail"
                name="schoolEmail"
                type="email"
                placeholder="school@example.com"
                className="
                  h-[34px]
                  w-full
                  rounded-lg
                  bg-[#F5F7FA]
                  px-3
                  text-[10px]
                  text-[#172033]
                  outline-none
                  placeholder:text-[#8A97A8]
                  focus:bg-[#EEF3F8]
                "
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="schoolPhone"
                className="mb-1 block text-[9px] font-medium text-[#172033]"
              >
                Phone
              </label>

              <input
                id="schoolPhone"
                name="schoolPhone"
                type="tel"
                placeholder="Enter phone number"
                className="
                  h-[34px]
                  w-full
                  rounded-lg
                  bg-[#F5F7FA]
                  px-3
                  text-[10px]
                  text-[#172033]
                  outline-none
                  placeholder:text-[#8A97A8]
                  focus:bg-[#EEF3F8]
                "
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">

              <div>
                <label
                  htmlFor="city"
                  className="mb-1 block text-[9px] font-medium text-[#172033]"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  className="
                    h-[34px]
                    w-full
                    rounded-lg
                    bg-[#F5F7FA]
                    px-3
                    text-[10px]
                    text-[#172033]
                    outline-none
                    placeholder:text-[#8A97A8]
                    focus:bg-[#EEF3F8]
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="mb-1 block text-[9px] font-medium text-[#172033]"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="State"
                  className="
                    h-[34px]
                    w-full
                    rounded-lg
                    bg-[#F5F7FA]
                    px-3
                    text-[10px]
                    text-[#172033]
                    outline-none
                    placeholder:text-[#8A97A8]
                    focus:bg-[#EEF3F8]
                  "
                />
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 bg-[#FAFBFC] px-5 py-3">

            <button
              type="button"
              onClick={onClose}
              className="
                h-[30px]
                rounded-lg
                px-4
                text-[9px]
                font-medium
                text-[#60708A]
                hover:bg-[#F0F3F7]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                h-[30px]
                rounded-lg
                bg-[#2563EB]
                px-4
                text-[9px]
                font-semibold
                text-white
                hover:bg-[#1D4ED8]
              "
            >
              Add school
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddSchoolModal;