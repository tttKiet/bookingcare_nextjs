"use client";

import { Avatar, Chip, Divider } from "@nextui-org/react";
import { Rate } from "antd";
import { CiStar } from "react-icons/ci";
import ReviewItem from "./ReviewItem";
import ReviewItemForm from "./ReviewItemForm";
import ReviewMe from "./ReviewMe";
import useSWR from "swr";
import { ResDataPaginations } from "@/types";
import {
  API_REVIEW_DOCTOR,
  API_REVIEW_HEALTH,
} from "@/api-services/constant-api";
import { Review, ReviewDoctorIndex, ReviewHealthIndex } from "@/models";
import { Progress } from "antd";
import { FaStar } from "react-icons/fa";
import ChartReviewCommon from "./ChartReviewCommon";

export default function ReviewDoctorHealthFacility({
  healthFacilityId,
}: {
  healthFacilityId: string;
}) {
  // fetch

  const { data: resReviewsHealth, mutate } = useSWR<ResDataPaginations<Review>>(
    `${API_REVIEW_HEALTH}?healthFacilityId=${healthFacilityId}`
  );

  const { data: resReviews, mutate: matateReview } = useSWR<ReviewHealthIndex>(
    `${API_REVIEW_HEALTH}/index?healthFacilityId=${healthFacilityId}`
  );

  return (
    <div>
      <div className="flex items-center justify-evenly gap-20 pb-8">
        <div className=" flex-1">
          <h4 className="font-medium text-lg">Tổng số đánh giá</h4>
          <div
            className="text-3xl font-medium
         flex gap-2 items-center mt-3 text-[#000]"
          >
            {resReviews?.reviewIndex?.countReview}

            <Chip color="success" size="sm" radius="sm">
              / {resReviews?.reviewIndex?.countReview}
            </Chip>
          </div>
          <div className="mt-1 text-sm text-[rgb(60,66,83)]">
            Lớn lên theo từng ngày
          </div>
        </div>
        <Divider orientation="vertical" className="h-20" />
        <div className=" flex-1">
          <h4 className="font-medium text-lg">Trung bình</h4>
          <div
            className="text-3xl font-medium
         flex gap-4 items-center mt-3 text-[#000]"
          >
            <span className="text-3xl">
              {resReviews?.reviewIndex?.avg == 0
                ? "5.0"
                : resReviews?.reviewIndex?.avg?.toPrecision(2)}
            </span>
            <Rate
              disabled
              defaultValue={
                resReviews?.reviewIndex?.avg == 0
                  ? 5
                  : resReviews?.reviewIndex?.avg
              }
              value={
                resReviews?.reviewIndex?.avg == 0
                  ? 5
                  : resReviews?.reviewIndex?.avg
              }
              className="text-lg"
            />
          </div>
          <div className="mt-1 text-sm text-[rgb(60,66,83)]">
            Lớn lên theo từng ngày
          </div>
        </div>
        <Divider orientation="vertical" className="h-20" />

        <div className="flex-1">
          <div className="flex flex-col gpa-4" style={{ width: 280 }}>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2   min-w-12 text-[18px] font-medium ">
                <FaStar className="text-[#e6c514]  text-[18px] flex-shrink-0" />
                <span>5</span>
              </span>
              <Progress
                percent={
                  ((resReviews?.reviewIndex?.star?.star5 || 0) * 100) /
                  (resReviews?.reviewIndex?.countReview || 1)
                }
                rootClassName={"mb-0"}
                status="active"
                size="default"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2   min-w-12 text-[18px] font-medium ">
                <FaStar className="text-[#e6c514]  text-[18px] flex-shrink-0" />
                <span>4</span>
              </span>
              <Progress
                percent={
                  ((resReviews?.reviewIndex?.star?.star4 || 0) * 100) /
                  (resReviews?.reviewIndex?.countReview || 1)
                }
                status="active"
                size="default"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2   min-w-12 text-[18px] font-medium ">
                <FaStar className="text-[#e6c514]  text-[18px] flex-shrink-0" />
                <span>3</span>
              </span>
              <Progress
                percent={
                  ((resReviews?.reviewIndex?.star?.star3 || 0) * 100) /
                  (resReviews?.reviewIndex?.countReview || 1)
                }
                status="active"
                size="default"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2   min-w-12 text-[18px] font-medium ">
                <FaStar className="text-[#e6c514]  text-[18px] flex-shrink-0" />
                <span>2</span>
              </span>
              <Progress
                percent={
                  ((resReviews?.reviewIndex?.star.star2 || 0) * 100) /
                  (resReviews?.reviewIndex?.countReview || 1)
                }
                status="active"
                size="default"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2   min-w-12 text-[18px] font-medium ">
                <FaStar className="text-[#e6c514]  text-[18px] flex-shrink-0" />
                <span>1</span>
              </span>

              <Progress
                percent={
                  ((resReviews?.reviewIndex?.star.star1 || 0) * 100) /
                  (resReviews?.reviewIndex?.countReview || 1)
                }
                status="active"
                size="default"
              />
            </div>
          </div>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="grid grid-cols-12  mt-10 gap-16">
        <div className="col-span-4">
          <ChartReviewCommon healthFacilityId={healthFacilityId} />
        </div>
        <div className="col-span-8">
          <div className="ml-8">
            <h3 className="text-lg justify-center font-medium flex items-center gap-2">
              {/* Các đánh giá khác */}
            </h3>
            <div className="mt-6 max-h-[500px] overflow-y-auto pr-6">
              {resReviewsHealth?.rows.map((r: Review) => (
                <div key={r.id} className="">
                  <ReviewItem showDoctor={true} review={r} key={r.id} />
                  <Divider className="my-6" />
                </div>
              ))}
            </div>
            {resReviewsHealth?.rows.length === 0 && (
              <div
                className="mt-2 
            flex items-center justify-center font-medium text-[rgb(60,66,83)]/90"
              >
                Chưa có đánh giá !
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
