import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const showToast = (message, type) => {
    switch (type) {
        case ToastTypes.SUCCESS:
            toast.success(message);
            break;
        case ToastTypes.ERROR:
            toast.error(message);
            break;
        default:
            toast(message);
            break;
    }
};

export const ToastTypes = {
    SUCCESS: "success",
    ERROR: "error",
};

export const ToastContainer = toast.ToastContainer;