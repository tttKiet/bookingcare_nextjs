import { Button } from "@nextui-org/button";
import { Result } from "antd";
import Link from "next/link";

export interface NotPermissionProps {}

export function NotPermission(props: NotPermissionProps) {
  return (
    <div className="p-3 min-h-screen flex items-center gap-2 justify-center">
      <Result
        status="403"
        title="403"
        subTitle="Sori, bạn không có quyền truy cập vào trang này!"
        extra={
          <Link href="/">
            <Button color="primary" size="lg">
              Về trang chủ
            </Button>
          </Link>
        }
      />
    </div>
  );
}
