import { API_ADMIN_CEDICINE } from "@/api-services/constant-api";
import { Cedicine, PrescriptionDetail } from "@/models";
import { ResDataPaginations } from "@/types";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import debounce from "lodash.debounce";
import { FormEvent, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export interface IBodyPrescriptionDetailsProps {
  handleSubmitForm: (data: Partial<PrescriptionDetail>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEdit: PrescriptionDetail | undefined;
  isLoading?: boolean;
}

export default function BodyPrescriptionDetails({
  clickCancel,
  handleSubmitForm,
  obEdit,
  loading,
  isLoading,
}: IBodyPrescriptionDetailsProps) {
  const [nameSearch, setNameSearch] = useState<string>("");
  const { data: dataCedicine, mutate: mutateCedicine } = useSWR<
    ResDataPaginations<Cedicine>
  >(`${API_ADMIN_CEDICINE}?limit=6&offset=0&name${nameSearch}`);

  const [key, setKey] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [usage, setUsage] = useState<string>("");
  const [unit, setUnit] = useState<string>("v");
  const [morning, setMorning] = useState<number | undefined>(0);
  const [noon, setNoon] = useState<number | undefined>(0);
  const [affterNoon, setAffterNoon] = useState<number | undefined>(0);
  const [evening, setEvening] = useState<number | undefined>(0);

  function setDetfaultInput() {
    setKey(undefined);
    setQuantity(undefined);
    setUsage("");
    setUnit("v");
    setMorning(0);
    setNoon(0);
    setAffterNoon(0);
    setEvening(0);
  }

  const options: {
    label: string;
    value: string;
  }[] = useMemo(() => {
    return (
      dataCedicine?.rows?.map((d: Cedicine) => ({
        label: d.name,
        value: d.id,
      })) || []
    );
  }, [dataCedicine]);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = {
      id: obEdit ? obEdit.id : undefined,
      cedicineId: key,
      unit: unit,
      morning: morning,
      quantity,
      noon: noon,
      afterNoon: affterNoon,
      evening: evening,
      usage,
    };
    const isOk = await handleSubmitForm(data);
    if (isOk) {
      clickCancel();
    }
  }

  useEffect(() => {
    if (obEdit) {
      setKey(obEdit.cedicineId);
      setQuantity(obEdit.quantity);
      setUsage(obEdit.usage);
      setUnit(obEdit.unit == "Viên" ? "v" : "h");
      setMorning(obEdit.morning);
      setNoon(obEdit.noon);
      setAffterNoon(obEdit.afterNoon);
      setEvening(obEdit.evening);
      setNameSearch("");
    }
  }, [obEdit]);
  return (
    <form onSubmit={handleSubmit} action={""} method="post">
      <div className="grid md:grid-cols-12 gap-5 grid-cols-1">
        <Autocomplete
          className="col-span-12"
          aria-labelledby=""
          label={"Thuốc"}
          selectedKey={key}
          isRequired
          onInputChange={debounce(function (e) {
            setNameSearch(e);
          }, 400)}
          onSelectionChange={(e) => setKey(e?.toString())}
          color={"primary"}
          // value={value}
          defaultItems={options}
          labelPlacement="inside"
          isClearable={false}
          size="lg"
          placeholder={"Chọn dịch vụ"}
          onKeyDown={(e: any) => e.continuePropagation()}
          classNames={{}}
        >
          {(option) => (
            <AutocompleteItem
              key={option?.value || ""}
              value={option?.value || ""}
              textValue={option?.label || ""}
            >
              {option.label}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Input
          className="col-span-6"
          size="lg"
          label={"Cách dùng"}
          onChange={(e) => setUsage(e.target.value)}
          placeholder="Nhập cách dùng"
          value={usage}
        />
        <Input
          type="number"
          className="col-span-3"
          size="lg"
          label={"Số lượng"}
          onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
          placeholder="Nhập số lượng thuốc"
          isInvalid={quantity != undefined && quantity <= 0}
          errorMessage={
            quantity != undefined && quantity <= 0 && "Hãy chọn số lượng thuốc"
          }
          classNames={{ errorMessage: "text-base" }}
          isRequired
          value={quantity?.toString()}
        />

        <Select
          size="lg"
          label="Đơn vị"
          placeholder="Chọn đơn vị"
          className="col-span-3"
          defaultSelectedKeys={"v"}
          value={unit}
          isRequired
          onChange={(e) => setUnit(e.target.value)}
        >
          <SelectItem key={"v"} value={"Viên"}>
            Viên
          </SelectItem>
          <SelectItem key={"h"} value={"Hộp"}>
            Hộp
          </SelectItem>
        </Select>
        <Input
          type="number"
          className="col-span-3"
          size="lg"
          label={"Sáng"}
          value={morning?.toString()}
          placeholder="Số lượng"
          isRequired
          onChange={(e) => setMorning(Number.parseInt(e.target.value))}
        />
        <Input
          type="number"
          className="col-span-3"
          size="lg"
          label={"Trưa"}
          placeholder="Số lượng"
          value={noon?.toString()}
          isRequired
          onChange={(e) => setNoon(Number.parseInt(e.target.value))}
        />
        <Input
          type="number"
          className="col-span-3"
          size="lg"
          value={affterNoon?.toString()}
          label={"Chiều"}
          placeholder="Số lượng"
          isRequired
          onChange={(e) => setAffterNoon(Number.parseInt(e.target.value))}
        />
        <Input
          type="number"
          className="col-span-3"
          size="lg"
          label={"Tối"}
          placeholder="Số lượng"
          value={evening?.toString()}
          isRequired
          onChange={(e) => setEvening(Number.parseInt(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2 justify-end mt-2 py-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button color="primary" isLoading={isLoading} type="submit">
          {obEdit?.id ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
