import { Review } from "@/models";
import { Avatar, Chip } from "@nextui-org/react";
import { Rate } from "antd";
import moment from "moment";
import { FaCaretRight } from "react-icons/fa";

export interface IReviewItemProps {
  review: Review;
  showDoctor?: false;
}

export default function ReviewItem({ review, showDoctor }: IReviewItemProps) {
  return (
    <div className="">
      <div className="">
        <div className="flex items-start gap-8">
          <Avatar
            isBordered
            radius="md"
            size="lg"
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
            className="flex-shrink-0"
          />
          <div className="flex flex-col gap-1 items-start justify-center w-full">
            <div className="text-lg font-medium text-[#000] flex justify-between items-center flex-1 w-full">
              <div className="flex items-center gap-2">
                {review?.User?.fullName}

                {showDoctor && (
                  <>
                    <FaCaretRight />
                    <div>
                      {review?.Staff?.fullName}{" "}
                      <Chip
                        className="ml-1 font-medium"
                        size="sm"
                        variant="flat"
                        color="secondary"
                        radius="sm"
                      >
                        bác sĩ
                      </Chip>
                    </div>
                  </>
                )}
              </div>
              <span className="text-sm text-[rgb(60,66,83)]">
                {moment(review.createdAt).fromNow()}
              </span>
            </div>
            <div
              className="text-base font-medium
           flex gap-3 items-center text-[#000]"
            >
              <span className="">{review?.starNumber}</span>
              <Rate
                disabled
                defaultValue={4}
                className="text-base relative top-[-1px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="mt-5 text-base text-[rgb(60,66,83)]">
          {review?.description}
        </div>
      </div>
    </div>
  );
}
