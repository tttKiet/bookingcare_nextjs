import { ResData } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";

export async function toastMsgFromPromise(
  api: Promise<ResData>
): Promise<boolean> {
  try {
    const res = await api;
    if (res.statusCode === 0) {
      toast.success(res.msg || "Thành công");
    }
    return true;
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
