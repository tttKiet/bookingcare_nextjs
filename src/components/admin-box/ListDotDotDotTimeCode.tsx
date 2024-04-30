import { Code, HealthExaminationSchedule } from "@/models";
import { Chip } from "@nextui-org/react";

export interface IListDotDotDotTimeCodeProps {
  timeCodeArray: HealthExaminationSchedule[];
}

export default function ListDotDotDotTimeCode({
  timeCodeArray,
}: IListDotDotDotTimeCodeProps) {
  const length = timeCodeArray.length;

  if (length > 2) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {[timeCodeArray[0], timeCodeArray[1]].map(
          (t: HealthExaminationSchedule, index: number) => {
            return (
              <Chip
                key={t.id}
                color="primary"
                radius="sm"
                size="sm"
                variant="solid"
              >
                {t?.TimeCode?.value}
              </Chip>
            );
          }
        )}
        <span className="">...</span>
        <Chip color="primary" radius="sm" size="sm" variant="solid">
          +{length - 2}
        </Chip>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {timeCodeArray.map((t: HealthExaminationSchedule, index: number) => {
        return (
          <Chip
            key={t?.id}
            color="primary"
            radius="sm"
            size="sm"
            variant="solid"
          >
            {t?.TimeCode?.value}
          </Chip>
        );
      })}
    </div>
  );
}
