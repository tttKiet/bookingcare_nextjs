import { API_TYPE_HEALTH_FACILITIES } from "@/api-services/constant-api";
import { HealthFacility, TypeHealthFacility } from "@/models";
import { schemaHealthFacilityBody } from "@/schema-validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { UploadFile } from "antd";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { InputField, InputTextareaField, InputUploadField } from "../form";

import { AiOutlinePhone } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { GiHospitalCross } from "react-icons/gi";
import { GoRepoForked } from "react-icons/go";
import { MdOutlineMail } from "react-icons/md";
import { HealthFacilityColumns } from "../admin-box";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { SelectFieldNext } from "../form/SelectFieldNext";
import { AddressCodeOption } from "./BodyAddEditPatient";
import axios from "axios";
import toast from "react-hot-toast";
import { Divider } from "@nextui-org/react";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
const mdParser = new MarkdownIt();
export interface BodyAddEditMarkdownProps {
  onSubmit: (data: { text: string; html: string }) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEdit?: { text: string; html: string } | null;
}

export default function BodyAddEditMarkdown({
  clickCancel,
  onSubmit,
  loading,
  obEdit,
}: BodyAddEditMarkdownProps) {
  const [data, setData] = useState<{ text: string; html: string }>({
    html: "",
    text: "",
  });
  function handleEditorChange({ html, text }: { text: string; html: string }) {
    setData({ html, text });
  }

  useEffect(() => {
    setData({ html: obEdit?.html || "", text: obEdit?.text || "" });
  }, [obEdit?.html, obEdit?.text]);
  return (
    <div className="pt-4">
      <div className="overflow-y-auto max-h-[500px] px-1">
        <MdEditor
          value={data.text}
          style={{ height: "500px" }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
        />
      </div>
      <div className="flex items-center gap-2 justify-end mt-2 py-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button
          color="primary"
          isLoading={loading}
          onPress={async () => {
            const isOk = await onSubmit(data);
            if (isOk) clickCancel();
          }}
        >
          {obEdit ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </div>
  );
}
