import * as React from "react";
import {
  CaptionProps,
  DayPicker,
  FooterProps,
  useDayPicker,
  useNavigation,
} from "react-day-picker";

import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Separator } from "./separator";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const getYear = (
  curDate: Date,
  compareYear: number | undefined,
  num: number
): Date | null => {
  const curYear = curDate.getFullYear() + num;
  const curYearDate = new Date(curDate);
  curYearDate.setFullYear(curYear);
  if (!compareYear) return curYearDate;
  if (num > 0) {
    return curYear < compareYear ? curYearDate : null;
  } else {
    return curYear > compareYear ? curYearDate : null;
  }
};

const CustomCaption = ({ displayMonth }: CaptionProps) => {
  const { goToMonth, nextMonth, previousMonth, goToDate, currentMonth } =
    useNavigation();
  const { fromYear, toYear } = useDayPicker();

  const previousYear = getYear(currentMonth, fromYear, -1);
  const nextYear = getYear(currentMonth, toYear, 1);

  return (
    <div className="flex justify-between items-center">
      <div>
        <Button
          variant="ghost"
          disabled={!previousYear}
          className="size-3 p-3"
          onClick={() => previousYear && goToDate(previousYear)}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="ghost"
          disabled={!previousMonth}
          className="size-3 p-3"
          onClick={() => previousMonth && goToMonth(previousMonth)}
        >
          <ChevronLeftIcon />
        </Button>
      </div>
      <div className="flex-1 text-center">
        {format(displayMonth, "yyyy年MMM", { locale: zhCN })}
      </div>
      <div>
        <Button
          variant="ghost"
          disabled={!nextMonth}
          className="size-3 py-3"
          onClick={() => nextMonth && goToMonth(nextMonth)}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          variant="ghost"
          disabled={!nextYear}
          className="size-3 py-3"
          onClick={() => nextYear && goToDate(nextYear)}
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
};

export type HandleSetToday = {
  handleSetToday?: (value: Date | undefined, isNow?: boolean) => void;
};

const CustomFooter = ({ handleSetToday }: FooterProps & HandleSetToday) => {
  return (
    <>
      <Button
        size="sm"
        className="w-full"
        onClick={() => handleSetToday?.(new Date(), true)}
      >
        现在
      </Button>
    </>
  );
};
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  handleSetToday,
  ...props
}: CalendarProps & HandleSetToday) {
  return (
    <DayPicker
      locale={zhCN}
      captionLayout="dropdown-buttons"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
        Footer: (props) => (
          <tfoot>
            <tr>
              <td>
                <CustomFooter handleSetToday={handleSetToday} {...props} />
              </td>
            </tr>
          </tfoot>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
