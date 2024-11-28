import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatISO, format } from 'date-fns';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { CalendarIcon, ClockIcon } from 'lucide-react';

const DatePicker = ({ form, name, label = "Date", design, withTime = false }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState("12:00"); 

  const handleDateChange = (date) => {
    if (date) {
      let finalValue = formatISO(date, { representation: "date" });

      if (withTime) {
        const [hours, minutes] = selectedTime.split(":");
        date.setHours(hours, minutes);
        finalValue = date.toISOString();
      }

      form.setValue(name, finalValue);
      form.trigger(name);
      setTimeout(() => setShowPicker(false), 50);
    }
  };

  const handleTimeChange = (event) => {
    const time = event.target.value;
    setSelectedTime(time);

    if (form.getValues(name)) {
      const date = new Date(form.getValues(name));
      const [hours, minutes] = time.split(":");
      date.setHours(hours, minutes);
      form.setValue(name, date.toISOString());
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div>
            <Popover open={showPicker} onOpenChange={setShowPicker}>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => setShowPicker(!showPicker)}
                  variant="outline"
                  className={cn(
                    design ? design : "justify-start w-full",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    withTime
                      ? format(new Date(field.value), "MMM dd, yyyy - h:mm a")
                      : format(new Date(field.value), "MMM dd, yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>

              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={handleDateChange}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                  disabled={(date) => date > new Date()}
                />
                {withTime && (
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="border p-2 rounded-md w-full"
                      />
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePicker;
