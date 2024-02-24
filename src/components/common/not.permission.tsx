import { Button } from "antd";
import Link from "next/link";

export interface NotPermissionProps {}

export function NotPermission(props: NotPermissionProps) {
  return (
    <div className="p-3 min-h-screen flex items-center gap-2 justify-center">
      <div className="rounded-md h-full  text-red-500">
        Bạn không có quyền truy cập vào trang này
      </div>
      <Link href="/" className="p-2 px-4 rounded-sm  text-blue-500 text-base">
        Đăng nhập
      </Link>
    </div>
  );
}
