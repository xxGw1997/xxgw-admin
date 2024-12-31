import { cva, VariantProps } from "class-variance-authority";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ButtonHTMLAttributes, useState } from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

const dateTimePickerVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface DateTimePickerProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dateTimePickerVariants> {
  defaultDate?: Date;
  onDateChange: (date: Date) => void;
}

const DateTimePicker = ({
  variant,
  defaultDate,
  onDateChange,
  className,
  ...props
}: DateTimePickerProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedDate, setSelectDate] = useState<Date | undefined>(defaultDate);

  const handleDateChange = (date: Date | undefined, isNow?: boolean) => {
    if (date) {
      if (!isNow) {
        const selectedHour = selectedDate?.getHours();
        const selectedMins = selectedDate?.getMinutes();
        selectedHour && date.setHours(selectedHour);
        selectedMins && date.setMinutes(selectedMins);
      }
      setSelectDate(date);
      onDateChange(date);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    const currentDate = selectedDate || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    setSelectDate(newDate);
    onDateChange(newDate);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant={"outline"}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          {selectedDate ? (
            format(selectedDate, "yyyy年MM月dd日 HH:mm:ss")
          ) : (
            <span>选择时间</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col" align="start">
        <div className="flex">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(value) => handleDateChange(value, false)}
            disabled={(date) => {
              const threeYearsLater = new Date();
              threeYearsLater.setFullYear(threeYearsLater.getFullYear() + 3);
              return date < new Date() || date > threeYearsLater;
            }}
            initialFocus
            fromYear={new Date().getFullYear() - 5}
            toYear={new Date().getFullYear() + 5}
          />
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:h-[330px] divide-y sm:divide-y-0 sm:divide-x">
              <Separator orientation="vertical" />
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i).map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        selectedDate &&
                        selectedDate.getHours() % 12 === hour % 12
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={
                        selectedDate && selectedDate.getMinutes() === minute
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        handleTimeChange("minute", minute.toString())
                      }
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="">
                <div className="flex sm:flex-col p-2">
                  {["AM", "PM"].map((ampm) => (
                    <Button
                      key={ampm}
                      size="icon"
                      variant={
                        selectedDate &&
                        ((ampm === "AM" && selectedDate.getHours() < 12) ||
                          (ampm === "PM" && selectedDate.getHours() >= 12))
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("ampm", ampm)}
                    >
                      {ampm}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        <Separator className="" />
        <div className="flex justify-between p-2">
          <Button
            size="sm"
            variant="link"
            onClick={() => handleDateChange(new Date(), true)}
          >
            现在
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => setIsPopoverOpen(false)}
          >
            确定
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimePicker;
