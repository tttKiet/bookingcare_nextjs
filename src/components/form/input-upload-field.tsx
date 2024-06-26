import { Image } from "@nextui-org/image";
import { UploadFile } from "antd";
import type { UploadProps } from "antd/es/upload";
import Upload, { RcFile } from "antd/es/upload";
import React, { useEffect, useState } from "react";
import { Control, useController } from "react-hook-form";
import toast from "react-hot-toast";
import { ModalFadeInNextUi } from "../modal/ModalFadeInNextUi";

export interface InputUploadFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  type?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  col?: number;
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
  console.log("fileExisted", fileExisted);
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

  console.log("value img", value);

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
    "image/webp",
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

  useEffect(() => {
    setFileList(value);
  }, [value]);

  return (
    <div>
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
          {fileList.length >= 5 ? null : (
            <div className={`${error?.message && "text-danger-500"}`}>
              Tải ảnh lên
            </div>
          )}
        </Upload>
        <ModalFadeInNextUi
          show={previewOpen}
          title={previewTitle}
          backdrop="opaque"
          footer={false}
          id="show"
          toggle={handleCancel}
          body={
            <Image alt="example" style={{ width: "100%" }} src={previewImage} />
          }
        ></ModalFadeInNextUi>
        <span className="flex items-center absolute right-1 text-xl">
          {icon}
        </span>
      </div>
      {error?.message && (
        <span className="text-base text-red-400 font-medium">
          {error?.message}
        </span>
      )}
    </div>
  );
}
