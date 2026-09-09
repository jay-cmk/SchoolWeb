import Swal from "sweetalert2";

export interface ConfirmAlertOptions {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: "warning" | "question" | "info";
  confirmButtonColor?: string;
}

export const showConfirmAlert = async ({
  title,
  text,
  confirmButtonText = "Yes, Continue",
  cancelButtonText = "Cancel",
  icon = "warning",
  confirmButtonColor = "#1F5FAE",
}: ConfirmAlertOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor: "#64748B",
    reverseButtons: true,
    focusCancel: true,
    allowOutsideClick: () => !Swal.isLoading(),
    customClass: {
      popup: "rounded-2xl",
      confirmButton: "rounded-lg px-5 py-2.5 font-semibold",
      cancelButton: "rounded-lg px-5 py-2.5 font-semibold",
    },
  });

  return result.isConfirmed;
};

export const showSuccessAlert = async (
  title: string,
  text: string,
): Promise<void> => {
  await Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: "Done",
    confirmButtonColor: "#1F5FAE",
    timer: 2200,
    timerProgressBar: true,
    customClass: {
      popup: "rounded-2xl",
      confirmButton: "rounded-lg px-5 py-2.5 font-semibold",
    },
  });
};

export const showErrorAlert = async (
  title: string,
  text: string,
): Promise<void> => {
  await Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "Close",
    confirmButtonColor: "#DC2626",
    customClass: {
      popup: "rounded-2xl",
      confirmButton: "rounded-lg px-5 py-2.5 font-semibold",
    },
  });
};

