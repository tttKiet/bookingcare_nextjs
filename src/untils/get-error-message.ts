import axios from "axios";

function getErrorMessage(err: unknown): string {
  let msg = "";
  if (axios.isAxiosError(err)) {
    if (err.response) {
      msg = err.response.data.msg;
    } else {
      msg = "Lỗi không có phản hồi từ server";
    }
  } else {
    const errorWithMsg = err as { msg?: string };
    msg = errorWithMsg.msg || "Lỗi không xác định";
  }

  return msg;
}

export { getErrorMessage };
