import { ManagerAccount } from "@/components/admin-box";
import { Select, Space } from "antd";

export interface AccountAdmimProps {}

export default function AccountAdmin(props: AccountAdmimProps) {
  return (
    <div>
      <ManagerAccount />
    </div>
  );
}
