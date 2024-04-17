import { ServiceDetails } from "@/models";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export interface IModalUpdateServiceDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  handleClickSubmit: ({ id, result }: { id: string; result: string }) => void;
  objectEdit?: ServiceDetails;
}

export default function ModalUpdateServiceDetails({
  handleClickSubmit,
  isOpen,
  onClose,
  objectEdit,
}: IModalUpdateServiceDetailsProps) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(objectEdit?.descriptionResult || "");
  }, [objectEdit]);
  return (
    <>
      <Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {objectEdit?.HospitalService?.ExaminationService?.name}
              </ModalHeader>
              <ModalBody>
                <Textarea
                  size="lg"
                  label="Nhập kết quả..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Thoát
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleClickSubmit({
                      id: objectEdit?.id || "",
                      result: value,
                    });
                    setValue("");
                  }}
                >
                  Ghi kết quả
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
