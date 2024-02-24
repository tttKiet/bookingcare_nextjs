import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

import { Calendar } from "react-date-range";

import moment from "moment";

export interface DateCalendarProps {
  date: Date;
  handleSelect: ((date: Date) => void) | undefined;
}

export default function DateCalendar({
  handleSelect,
  date,
}: DateCalendarProps) {
  return (
    <div className="">
      <span>{date && moment(date).format("ll")}</span>
      <div className="absolute top-full left-1 p-2 rounded-lg shadow-lg bg-white">
        <Calendar
          minDate={new Date()}
          date={date || new Date()}
          onChange={handleSelect}
        />
      </div>
    </div>
  );
}
