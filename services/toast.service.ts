import toast, { ToastOptions } from "react-hot-toast";

class ToastService {
  //  Success
  success(message: string, options?: ToastOptions) {
    return toast.success(message, options);
  }

  //  Error
  error(message: string, options?: ToastOptions) {
    return toast.error(message, options);
  }

  //  Info
  info(message: string, options?: ToastOptions) {
    return toast(message, options);
  }

  //  Loading
  loading(message: string, options?: ToastOptions) {
    return toast.loading(message, options);
  }

  //  Dismiss
  dismiss(id?: string) {
    toast.dismiss(id);
  }

  //  Promise Handler (UPDATED )
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error?: string | ((err: any) => string); //  FIXED TYPE
    },
    options?: ToastOptions
  ) {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: (err: any) => {
          //  if custom function provided
          if (typeof messages.error === "function") {
            return messages.error(err);
          }

          //  fallback priority
          return (
            err?.response?.data?.message ||
            messages.error ||
            "Something went wrong"
          );
        },
      },
      options
    );
  }

  //  API Error Handler
  apiError(error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    this.error(message);
  }
}

export const toastService = new ToastService();