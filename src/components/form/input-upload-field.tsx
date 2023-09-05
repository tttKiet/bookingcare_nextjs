import { s3 } from "@/config";
import { Modal, UploadFile } from "antd";
import type { UploadProps } from "antd/es/upload";
import Upload, { RcFile } from "antd/es/upload";
import { PromiseResult } from "aws-sdk/lib/request";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Control, useController } from "react-hook-form";
import toast from "react-hot-toast";
import S3 from "aws-sdk/clients/s3";

export interface InputUploadFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  type?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  col: number;
  fileExisted?: Array<string> | null;
  resetFiles?: (arr: Array<any>) => void;
}

export function InputUploadField({
  name,
  label,
  control,
  placeholder,
  type = "text",
  icon,
  col,
  fileExisted,
  resetFiles,
}: InputUploadFieldProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
  });

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
  ];
  function isValidFormatFiles(files: UploadFile[]) {
    if (!files || files.length === 0) return true; // Bỏ qua nếu không có tệp ảnh
    const isValid = files.every((file) => {
      return file.type && SUPPORTED_FORMATS.includes(file.type);
    });
    return isValid;
  }
  const handleChange: UploadProps["onChange"] = ({
    fileList: newFileList,
    file,
  }) => {
    if (newFileList.length > 3) {
      // return toast.error("Chỉ được tải lên 3 ảnh");
    } else if (!isValidFormatFiles(newFileList)) {
      return toast.error("Vui lòng chỉ tải lên ảnh");
    }
    onChange(newFileList);
    setFileList(newFileList);
  };

  useEffect(() => {
    if (!fileExisted || !resetFiles) return setFileList([]);
    const files: UploadFile[] = fileExisted.map((file, index) => {
      return {
        uid: `${file.split("/").pop()}`,
        name: "image.png",
        status: "done",
        url: file,
        type: "image/jpeg",
      };
    });
    setFileList(files);
    resetFiles(files);
  }, [fileExisted]);

  return (
    <div
      className={`border  ${col ? `col-span-${col}` : "col-span-2"} 
      rounded-lg border-while py-2 px-3 pt-8 relative ${
        error?.message && "border-red-400"
      }`}
    >
      <label
        className="absolute top-1 text-sm font-medium flex items-center gap-2"
        htmlFor=""
      >
        {label}
      </label>
      <div className="flex items-center gap-1 relative">
        <Upload
          accept="image/*"
          listType="picture-card"
          fileList={fileList}
          multiple={true}
          beforeUpload={() => {
            /* update state here */
            return false;
          }}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 3 ? null : "Tải ảnh lên"}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
        <span className="flex items-center absolute right-1 text-xl">
          {icon}
        </span>
      </div>
      {error?.message && (
        <span className="text-xs text-red-500 font-medium">
          {error?.message}
        </span>
      )}
    </div>
  );
}
