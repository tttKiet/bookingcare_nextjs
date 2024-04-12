import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { HealthRecord } from "@/models";
import { Button, Divider, Modal } from "antd";
import moment from "moment";
import { AiOutlineFieldTime } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
import { MdCancel } from "react-icons/md";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { staffApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";

const { confirm } = Modal;

export interface IHealthRecordItemDetailsProps {
  healthRecord: HealthRecord | undefined;
  fetchData: () => void;
}

export function HealthRecordItemDetails({
  healthRecord,
  fetchData,
}: IHealthRecordItemDetailsProps) {
  return <div></div>;
}
