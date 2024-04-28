import { ActionBox, ActionGroup } from "@/components/box";
import { Review } from "@/models";
import { Avatar } from "@nextui-org/react";
import { Rate } from "antd";
import moment from "moment";
import { BiMessageSquareEdit } from "react-icons/bi";

export interface IReviewItemMeProps {
  review: Review;
  onclickReviewEdit: () => void;
  onclickReviewDelete: () => void;
}

export default function ReviewItemMe({
  review,
  onclickReviewEdit,
  onclickReviewDelete,
}: IReviewItemMeProps) {
  return (
    <div className="">
      <div className="">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Đánh giá của bạn
          <ActionGroup className="justify-start">
            <ActionBox
              type="edit"
              content="sửa đánh giá"
              onClick={() => onclickReviewEdit()}
            />
            <ActionBox type="delete" onClick={() => onclickReviewDelete()} />
          </ActionGroup>
        </h3>
        <div className="">
          <div
            className="text-base font-medium
           flex gap-4 items-center mt-5 text-[#000]"
          >
            <Avatar
              isBordered
              radius="md"
              size="md"
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-0 items-start justify-center w-full">
              <div className="text-base font-medium text-[#000] flex justify-between items-center flex-1 w-full">
                {review?.User?.fullName}
                <span className=" text-sm">
                  {moment(review.createdAt).startOf("hour").fromNow()}
                </span>
              </div>
              <div
                className="text-base font-medium
           flex gap-3 items-center text-[#000]"
              >
                <span className="">
                  {review?.starNumber && review?.starNumber.toPrecision(2)}
                </span>
                <Rate
                  disabled
                  value={review?.starNumber}
                  defaultValue={review?.starNumber}
                  className="text-base relative top-[-1px]"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 text-base text-gray-500">
            {review?.description}
          </div>
        </div>
      </div>
    </div>
  );
}
