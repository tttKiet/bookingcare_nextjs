"use client";

import {
  Button,
  Checkbox,
  Divider,
  Input,
  InputRef,
  Select,
  Space,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { DefaultOptionType } from "antd/es/select";
import { Control, useController } from "react-hook-form";
import debounce from "lodash.debounce";
import { PlusOutlined } from "@ant-design/icons";
import { ChangeEvent, MouseEvent, ReactNode, useRef, useState } from "react";
export interface SelectFieldAddOptionProps {
  className?: string;
  name: string;
  label: string | ReactNode;
  control: Control<any>;
  icon?: ReactNode;
  width?: number | string;
  placeholder?: string;
  options: string[] | undefined;
  onChangeParent?: (e: Event) => void;
  debounceSeconds?: number;
  onSearchSelect?: (value: string) => void;
}

export function SelectFieldAddOption({
  name,
  label,
  control,
  className,
  options,
  icon,
  width,
  placeholder,
  onChangeParent,
  debounceSeconds,
  onSearchSelect,
}: SelectFieldAddOptionProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const onSearch = (value: string) => {
    onSearchSelect && onSearchSelect(value);
  };

  const filterOption: any = (
    input: string,
    option: { label: string; value: string }
  ) => {
    return !!onSearchSelect
      ? true
      : (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  };
  const [items, setItems] = useState(options || []);
  const [nameInput, setNameInput] = useState("");
  const inputRef = useRef<InputRef>(null);
  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };
  const addItem = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!nameInput) return;
    e.preventDefault();
    setItems([...items, nameInput]);
    setNameInput("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div
      className={`border rounded-lg border-while py-2 px-3 pt-8 relative col-span-1 ${
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
        <Select
          // defaultValue={""}
          onSearch={debounce(onSearch, debounceSeconds || 0)}
          value={value || placeholder}
          placement="bottomLeft"
          style={{ width: width || 160 }}
          size="large"
          onChange={(e) => {
            onChange(e);
            onChangeParent && onChangeParent(e);
          }}
          placeholder={
            placeholder ||
            `Chọn ${
              typeof label === "string" ? label?.toLocaleLowerCase() : label
            } ...`
          }
          virtual={false}
          showSearch
          optionFilterProp="children"
          notFoundContent={<div>Khônng tìm thây...</div>}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          options={items.map((item) => ({ label: item, value: item }))}
          filterOption={filterOption}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Space style={{ padding: "0 8px 4px" }}>
                <Input
                  placeholder="Điền tên mới...."
                  ref={inputRef}
                  value={nameInput}
                  onChange={onNameChange}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                  Thêm tên
                </Button>
              </Space>
            </>
          )}
        />
        <span className="flex items-center absolute right-1 text-xl">
          {icon}
        </span>
      </div>
      {error && (
        <p className="text-red-500 font-medium text-xs pt-1">
          {error?.message}
        </p>
      )}
    </div>
  );
}
