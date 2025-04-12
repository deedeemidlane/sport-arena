import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const goToPreviousDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);
    setDate(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    setDate(nextDay);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousDay}
        className="h-9 w-9 rounded-full p-0"
        disabled={date.toLocaleDateString() === new Date().toLocaleDateString()}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "sm:w-[240px] justify-center font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date, "dd/MM/yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            initialFocus
            className="p-3 pointer-events-auto"
            fromDate={new Date()}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextDay}
        className="h-9 w-9 rounded-full p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
