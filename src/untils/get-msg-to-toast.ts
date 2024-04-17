import { ResData } from "@/types";
import axios from "axios";
import { toast } from "react-toastify";
// import toast from "react-hot-toast";

export async function toastMsgFromPromise(api: Promise<ResData>): Promise<any> {
  try {
    const res = await api;
    if (res.statusCode === 0 || res.statusCode === 200) {
      toast.success(res.msg || "Thành công", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // toast.success(res.msg || "Thành công");
    } else if (res.statusCode === 201) {
      toast.warning(res.msg || "Thành công", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    return res;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const errorMsg = err.response.data.msg;
        toast.error(errorMsg);
      } else {
        toast.error("Lỗi không có phản hồi từ server");
      }
    } else {
      const errorWithMsg = err as { msg?: string };
      const errorMsg = errorWithMsg.msg || "Lỗi không xác định";
      toast.error(errorMsg);
    }
    return false;
  }
}
