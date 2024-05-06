"use client";

import {
  API_HEALTH_FACILITIES,
  API_TYPE_HEALTH_FACILITIES,
} from "@/api-services/constant-api";
import { AddressCodeOption } from "@/components/body-modal/BodyAddEditPatient";
import { ListHealthFacilities, SeachHealthFacility } from "@/components/common";
import { SelectFieldNext } from "@/components/form/SelectFieldNext";
import {
  HealthFacility,
  HealthFacilityStar,
  TypeHealthFacility,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR, { BareFetcher } from "swr";
import instance from "../../axios";
import queryString from "query-string";
import { filterNonEmptyValues } from "@/untils/common";
import { useDisPlay } from "@/hooks";
export default function HealthFacilities() {
  const url = usePathname();
  const { scrollTo } = useDisPlay();
  const boxListRef = useRef(null);
  const router = useRouter();
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
  }>({
    current: 1,
    pageSize: 12,
  });

  // filter
  const [searchNameHealthValue, setSearchNameHealthValue] =
    useState<string>("");
  const [type, settype] = useState<string>("");

  // GET type
  const { data: typeData, mutate: mutateTypeHealth } = useSWR<
    Array<TypeHealthFacility>
  >(API_TYPE_HEALTH_FACILITIES, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  // address state
  const [optionProvinces, setOptionProvinces] = useState<
    AddressCodeOption[] | undefined
  >([]);
  const [optionDistricts, setOptionDistricts] = useState<
    AddressCodeOption[] | undefined
  >();

  const [optionWards, setOptionWards] = useState<
    AddressCodeOption[] | undefined
  >();

  // state form
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      ward: "",
      district: "",
      province: "",
    },
  });

  const [valueAddress, setValueAddress] = useState<{
    ward: string;
    district: string;
    province: string;
  }>({
    ward: "",
    district: "",
    province: "",
  });

  function onChangeSelectProvince(value: string) {
    setValue("ward", "");
    setValue("district", "");
    setValueAddress((pr) => {
      return { province: value, ward: "", district: "" };
    });
    setOptionDistricts([
      {
        label: "-- Tất cả --",
        value: "",
      },
    ]);
    setOptionWards([
      {
        label: "-- Tất cả --",
        value: "",
      },
    ]);

    if (value) {
      axios
        .get(`https://vapi.vnappmob.com/api/province/district/${value}`)
        .then((data) => {
          const options = data.data.results.map((e: any) => {
            return {
              label: e.district_name.toString(),
              value: e.district_id.toString(),
            };
          });
          setOptionDistricts([
            {
              label: "-- Tất cả --",
              value: "",
            },
            ...options,
          ]);
        })
        .catch((err) => {
          toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
          setValue("district", "");
          setValue("ward", "");

          setValueAddress((pr) => {
            return { ...pr, ward: "", district: "" };
          });
        });
    }
  }

  function onChangeSelectDistrict(value: string): void {
    setValue("ward", "");
    setValueAddress((pr) => {
      return { ...pr, district: value, ward: "" };
    });
    // setOptionWards([
    //   {
    //     label: "-- Tất cả --",
    //     value: "",
    //   },
    // ]);
    if (value)
      axios
        .get(`https://vapi.vnappmob.com/api/province/ward/${value}`)
        .then((data) => {
          setOptionWards([
            {
              label: "-- Tất cả --",
              value: "",
            },
            ...data.data.results.map((e: any) => {
              return {
                label: e.ward_name.toString(),
                value: e.ward_id.toString(),
              };
            }),
          ]);
        })
        .catch((err) => {
          toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
          setValue("ward", "");
          setValueAddress((pr) => {
            return { ...pr, ward: "" };
          });
          setOptionWards([
            {
              label: "-- Tất cả --",
              value: "",
            },
          ]);
        });
  }

  useEffect(() => {
    axios
      .get("https://vapi.vnappmob.com/api/province")
      .then((data) => {
        const options = data.data.results.map((e: any) => {
          return {
            label: e.province_name.toString(),
            value: e.province_id.toString(),
          };
        });
        setOptionProvinces([
          {
            label: "-- Tất cả --",
            value: "",
          },
          ...options,
        ]);
      })
      .catch((err) => {
        console.log("err", err);
        toast("Lỗi lấy api tỉnh thành [Tinh]. Vui lòng nhấn F5 tải lại!");
      });
  }, []);

  // end
  const optionTypes: { label: string; value: string }[] = useMemo(() => {
    const data = [
      {
        label: "-- Tất cả --",
        value: "",
      },
    ];
    const res =
      typeData?.map((t) => ({
        label: t.name,
        value: t.id,
      })) || [];
    return [...data, ...res];
  }, [typeData]);

  const paramsUrl = useMemo(() => {
    const stringOb = filterNonEmptyValues({
      name: searchNameHealthValue,
      typeHealthFacilityId: type,
      ...valueAddress,
    });

    const stringified = queryString.stringify(stringOb);
    router.replace(`${url}?` + stringified, {
      scroll: false,
    });
    return stringOb;
  }, [type, valueAddress, searchNameHealthValue]);

  // GET health facilities
  const fetcher: BareFetcher<ResDataPaginations<HealthFacility>> = async ([
    url,
    token,
  ]) =>
    (
      await instance.get(url, {
        params: {
          ...token,
        },
      })
    ).data;
  const {
    data: healthFacilities,
    mutate: mutateHealthFacilities,
    isLoading,
  } = useSWR<ResDataPaginations<HealthFacilityStar>>(
    [
      `${API_HEALTH_FACILITIES}`,
      {
        // name: searchNameHealthValue,
        // typeHealthFacilityId: type,
        limit: pagination.pageSize, // 4 page 2 => 3, 4 page 6 => 21
        offset: ((pagination.current || 0) - 1) * (pagination.pageSize || 0),
        ...paramsUrl,
      },
    ],
    fetcher,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  function handleClickSearchHealth(value: string): void {
    scrollTo(boxListRef.current);
    setSearchNameHealthValue(value);
    settype("");
  }
  function onChangePagination(page: number, pageSize: number): void {
    // scrollTo(listHealRef?.current, {
    //   top: 270,
    // });
    setPagination(() => {
      return {
        current: page,
        pageSize: pageSize,
      };
    });
  }

  return (
    <main className="mt-[-80px]">
      <div
        className="relative  h-[200px] pt-[80px] "
        style={{
          backgroundImage:
            "linear-gradient(270.3deg, rgb(84, 212, 228) 0.2%, rgb(68, 36, 164) 100%)",
        }}
      >
        <div className="absolute right-0 top-0 w-full h-full overflow-hidden">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute right-0 top-0 z-10 h-[64rem] w-[64rem]  [mask-image:radial-gradient(closest-side,white,transparent)] translate-x-[50%] translate-y-[-50%]"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#000" />
                <stop offset={1} stopColor="blue" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <SeachHealthFacility handleClickSearch={handleClickSearchHealth} />
      </div>
      <div className="flex justify-center gap-2 flex-col mt-16 mb-3 ">
        <h3 className="text-4xl font-bold text-black text-center">
          CƠ SỞ Y TẾ
        </h3>

        <p className="text-base font-medium text-center text-gray-700 my-3">
          Với những cơ sở Y Tế hàng đầu sẽ giúp trải nghiệm khám, chữa bệnh của
          bạn tốt hơn
        </p>
      </div>
      <div className="flex justify-center ">
        <div className="container my-4">
          {/* <Breadcrumb items={breadcrumbArray} /> */}
          <div className="my-4 mb-2 grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <Autocomplete
                // onInputChange={debounce(handleSearch, debounceSeconds || 300)}
                onSelectionChange={(e) => {
                  settype(e?.toString() || "");
                }}
                label="Loại cơ sở"
                value={"all"}
                size="lg"
                selectedKey={type}
                labelPlacement="inside"
              >
                {optionTypes?.map((item) => (
                  <AutocompleteItem
                    key={item.value || ""}
                    value={item?.value || ""}
                    textValue={item?.label || ""}
                  >
                    {item.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className="col-span-3">
              <SelectFieldNext
                isClearable={true}
                onChangeCustom={onChangeSelectProvince}
                control={control}
                name="province"
                placeholder="Chọn tỉnh"
                label="Tỉnh"
                options={optionProvinces || []}
              />
            </div>
            <div className="col-span-3">
              <SelectFieldNext
                isClearable={true}
                onChangeCustom={onChangeSelectDistrict}
                control={control}
                name="district"
                placeholder="Chọn quận, huyện"
                label="Quận, huyện"
                options={optionDistricts || []}
              />
            </div>
            <div className="col-span-3">
              <SelectFieldNext
                isClearable={true}
                control={control}
                onChangeCustom={(v) =>
                  setValueAddress((pre) => {
                    return {
                      ...pre,
                      ward: v,
                    };
                  })
                }
                name="ward"
                placeholder="Chọn xã, phường"
                label="Xã, phường"
                options={optionWards || []}
              />
            </div>
          </div>
          <div ref={boxListRef}></div>
          <ListHealthFacilities
            searchNameHealthValue={searchNameHealthValue}
            isLoading={isLoading}
            pageSize={pagination.pageSize}
            page={pagination.current}
            onChangePagination={onChangePagination}
            data={healthFacilities}
          />
        </div>
      </div>
    </main>
  );
}
