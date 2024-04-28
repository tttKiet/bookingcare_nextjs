"use client";

import { userApi } from "@/api-services";
import { API_REVIEW_DOCTOR } from "@/api-services/constant-api";
import { Review } from "@/models";
import { schemaReview } from "@/schema-validate";
import { ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Button,
  Checkbox,
  CheckboxGroup,
  Textarea,
} from "@nextui-org/react";
import { Form, Rate } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import { BiMessageSquareEdit } from "react-icons/bi";
import useSWR from "swr";
import ReviewItem from "./ReviewItem";
import ReviewItemMeMe from "./ReviewItemMe";
import { InputTextareaField } from "@/components/form";

export interface IReviewItemProps {
  staffId: string;
  review: Review | undefined;
  loading?: boolean;
  handleSubmitCreate: (data: {
    starNumber: number;
    description: string;
  }) => void;
}

export default function ReviewItemForm({
  staffId,
  review,
  loading,
  handleSubmitCreate,
}: IReviewItemProps) {
  const {
    control,
    handleSubmit,
    register,
    getValues,
    formState: { isSubmitting, isValid, errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      description: "",
      check: false,
      starNumber: 4,
    },
    resolver: yupResolver(schemaReview),
  });

  const {
    field: {
      onChange: onChangeDescription,
      value: valueDescription,
      ref: refDescription,
    },
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name: "description",
    control,
  });

  const {
    field: { onChange: onChangeCheck, value: valueCheck, ref: refCheck },
  } = useController({
    name: "check",
    control,
  });

  async function handleSubmitLocal({
    starNumber,
    description,
  }: {
    starNumber: number;
    description: string;
  }) {
    handleSubmitCreate({
      starNumber,
      description,
    });
  }

  useEffect(() => {
    reset({
      check: true,
      description: review?.description,
      starNumber: review?.starNumber,
    });
  }, [review]);

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitLocal)}>
        <h4 className="text-lg font-medium mb-2 flex items-center gap-1">
          <BiMessageSquareEdit /> Đánh giá chất lượng dịch vụ
        </h4>
        <p className="text-sm font-medium text-[rgb(60,66,83)]">
          Mức độ hài lòng
        </p>
        <div className="text-center mt-4">
          <Controller
            name="starNumber"
            control={control}
            render={({ field }) => (
              // <Input {...field} className="my-2" placeholder="First Name *" />
              <Rate
                {...field}
                className={`text-2xl`}
                // onChange={(v) => setValue("starNumber", v)}
              />
            )}
          ></Controller>
        </div>
        <div className="mt-2">
          <div>
            <p className="text-sm font-medium text-[rgb(60,66,83)]">
              Cảm nghỉ của bạn
            </p>
            <Textarea
              onChange={(e) => onChangeDescription(e)}
              required
              value={valueDescription}
              ref={refDescription}
              className="mt-3"
              size="lg"
              placeholder="Nhập nội dung đánh giá..."
            />
            <p className="text-danger-500 text-left font-medium h-6 mt-2">
              {errors.description?.message}
            </p>

            {/* <InputTextareaField control={control} name="description" /> */}
          </div>
          <div className="mt-0 ">
            <CheckboxGroup value={valueCheck ? ["check"] : []}>
              <Checkbox
                value={"check"}
                color="primary"
                classNames={{
                  label: `ml-1 text-[rgb(60,66,83)]`,
                }}
                ref={refCheck}
                // checked={valueCheck || false}
                onChange={onChangeCheck}
              >
                {/* {console.log('{...register("check")}', {
                    ...register("check"),
                  })} */}
                Tôi đồng ý công bố đánh giá này trên web.
              </Checkbox>
            </CheckboxGroup>
            <p className="text-danger-500 text-left font-medium h-6 mt-1">
              {errors.check?.message}
            </p>
          </div>
        </div>
        <div className="mt-1">
          <Button
            size="md"
            variant="flat"
            color="primary"
            className="w-full"
            type="submit"
            isLoading={loading}
          >
            Viết đánh giá
          </Button>
        </div>
      </form>
    </>
  );
}
