import { ManagerAccount } from "@/components/admin-box";
import { Select, Space } from "antd";
import * as React from "react";

export interface AccountAdmimProps {}

export default function AccountAdmin(props: AccountAdmimProps) {
  return (
    <div>
      <ManagerAccount />
    </div>
  );
}
