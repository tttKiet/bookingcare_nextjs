import { API_REVIEW_DOCTOR } from "@/api-services/constant-api";
import { Review, ReviewDoctorIndex } from "@/models";
import { ResDataPaginations } from "@/types";
import { useMemo, useState } from "react";
import useSWR from "swr";
import ReviewItemForm from "./ReviewItemForm";
import { userApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import ReviewItemMe from "./ReviewItemMe";
import { ModalFadeInNextUi } from "@/components/modal/ModalFadeInNextUi";
import { useDisclosure } from "@nextui-org/react";

export interface IReviewMetProps {
  staffId: string;
}

export default function ReviewMe({ staffId }: IReviewMetProps) {
  const { data: resReviewIndexDoctor, mutate: matateReviewIndexDoctor } =
    useSWR<ReviewDoctorIndex>(`${API_REVIEW_DOCTOR}/index?staffId=${staffId}`);

  // state
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure({ id: "Confirm" });

  // fetch
  const { data: resReview, mutate: matateReview } = useSWR<
    ResDataPaginations<Review>
  >(API_REVIEW_DOCTOR + `?staffId=${staffId}`);
  const reviewDoctorExits: Review | undefined = useMemo(
    () => resReview?.rows?.[0],
    [resReview]
  );

  function onclickReviewEdit() {
    setIsEdit(true);
  }

  function onclickReviewDelete() {
    onOpenConfirm();
  }

  async function handleSubmitDelete() {
    const api = userApi.deleteReview(reviewDoctorExits?.id || "");
    setLoading(true);
    const res = await toastMsgFromPromise(api);
    if (res?.statusCode === 0 || res?.statusCode === 200) {
      //fet
      matateReview();
      setIsEdit(false);
      onCloseConfirm();
      matateReviewIndexDoctor();
    }
    setLoading(false);
  }

  async function handleSubmit({
    starNumber,
    description,
  }: {
    starNumber: number;
    description: string;
  }) {
    const api = userApi.createOrUpdateReview({
      staffId: staffId,
      description,
      starNumber,
      id: reviewDoctorExits?.id,
    });
    setLoading(true);
    const res = await toastMsgFromPromise(api);
    if (res?.statusCode === 0 || res?.statusCode === 200) {
      //fet
      matateReview();
      matateReviewIndexDoctor();
      setIsEdit(false);
    }
    setLoading(false);
  }

  return (
    <div>
      <ModalFadeInNextUi
        id="text"
        show={isOpenConfirm}
        title="Bạn chắc chắn hành động này?"
        toggle={onCloseConfirm}
        isLoading={loading}
        body={
          <div>
            Hành động này sẽ xóa đánh giá của bạn và không thể khôi phục.
          </div>
        }
        footer={true}
        handleSubmit={handleSubmitDelete}
        contentBtnSubmit="Đồng ý"
      />
      {reviewDoctorExits && !isEdit ? (
        <ReviewItemMe
          onclickReviewDelete={onclickReviewDelete}
          review={reviewDoctorExits}
          onclickReviewEdit={onclickReviewEdit}
        />
      ) : (
        <ReviewItemForm
          loading={loading}
          review={reviewDoctorExits}
          handleSubmitCreate={handleSubmit}
          staffId={staffId}
        />
      )}
    </div>
  );
}
