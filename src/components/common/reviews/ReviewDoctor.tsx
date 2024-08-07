"use client";

import { Avatar, Chip, Divider } from "@nextui-org/react";
import { Rate } from "antd";
import { CiStar } from "react-icons/ci";
import ReviewItem from "./ReviewItem";
import ReviewItemForm from "./ReviewItemForm";
import ReviewMe from "./ReviewMe";
import useSWR from "swr";
import { ResDataPaginations } from "@/types";
import { API_REVIEW_DOCTOR } from "@/api-services/constant-api";
import { Review, ReviewDoctorIndex } from "@/models";
import { Progress } from "antd";
import { useAuth } from "@/hooks";
import { FaStar } from "react-icons/fa";
export interface IReviewDoctorProps {
  staffId: string;
}

export default function ReviewDoctor({ staffId }: IReviewDoctorProps) {
  // fetch
  const { profile } = useAuth();
  const { data: resReview, mutate: matateReview } = useSWR<
    ResDataPaginations<Review>
  >(`${API_REVIEW_DOCTOR}?type=notme&staffId=${staffId}`);

  const { data: resReviewIndexDoctor, mutate: matateReviewIndexDoctor } =
    useSWR<ReviewDoctorIndex>(`${API_REVIEW_DOCTOR}/index?staffId=${staffId}`);

  return (
    <div>
      <div className="flex items-center justify-evenly gap-20 pb-8">
        <div className=" flex-1">
          <h4 className="font-medium text-lg">Tổng số đánh giá</h4>
          <div
            className="text-3xl font-medium
           flex gap-2 items-center mt-3 text-[#000]"
          >
            {resReviewIndexDoctor?.countReview}

            <Chip color="success" size="sm" radius="sm">
              / {resReviewIndexDoctor?.countReview}
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
              {resReviewIndexDoctor?.avg == 0
                ? "5.0"
                : resReviewIndexDoctor?.avg?.toPrecision(2)}
            </span>
            <Rate
              disabled
              defaultValue={
                resReviewIndexDoctor?.avg == 0 ? 5 : resReviewIndexDoctor?.avg
              }
              value={
                resReviewIndexDoctor?.avg == 0 ? 5 : resReviewIndexDoctor?.avg
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
                  ((resReviewIndexDoctor?.star?.star5 || 0) * 100) /
                  (resReviewIndexDoctor?.countReview || 1)
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
                  ((resReviewIndexDoctor?.star?.star4 || 0) * 100) /
                  (resReviewIndexDoctor?.countReview || 1)
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
                  ((resReviewIndexDoctor?.star?.star3 || 0) * 100) /
                  (resReviewIndexDoctor?.countReview || 1)
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
                  ((resReviewIndexDoctor?.star.star2 || 0) * 100) /
                  (resReviewIndexDoctor?.countReview || 1)
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
                  ((resReviewIndexDoctor?.star.star1 || 0) * 100) /
                  (resReviewIndexDoctor?.countReview || 1)
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
          {profile?.id ? (
            <ReviewMe staffId={staffId} />
          ) : (
            <div className="font-medium">
              Vui lòng đăng nhập để xem đánh giá của bạn!
            </div>
          )}
        </div>
        <div className="col-span-8">
          <div className="ml-8">
            <h3 className="text-lg justify-center font-medium flex items-center gap-2">
              Các đánh giá khác
            </h3>
            <div className="mt-6 max-h-[500px] overflow-y-auto pr-6">
              {resReview?.rows.map((r: Review) => (
                <div key={r.id} className="">
                  <ReviewItem review={r} key={r.id} />
                  <Divider className="my-6" />
                </div>
              ))}
            </div>
            {resReview?.rows.length === 0 && (
              <div
                className="mt-2 
              flex items-center justify-center font-medium text-[rgb(60,66,83)]/90"
              >
                Chưa có đánh giá khác!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
