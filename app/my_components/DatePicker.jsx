import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatISO, format } from 'date-fns';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { CalendarDays, CalendarIcon } from 'lucide-react';
import { formatDate } from '../signup/page';

const DatePicker = ({ form, name, label = "Date", design }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (date) => {
    if (date) {
      form.setValue(name, formatISO(date, { representation: 'date' }));
      form.trigger(name);
      setTimeout(() => {
        setShowPicker(false);
      }, 50);
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
            <Popover open={showPicker}>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => setShowPicker(!showPicker)}
                  variant="outline"
                  className={cn(
                    design ? design : "justify-start w-full",
                    // "justify-start w-full text-left font-normal bg-[#0e4028] hover:bg-[#0e5a35] border-2 border-[#0b864a]",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? formatDate(new Date(field.value), "yyyy-MM-dd") : <span>Pick a date</span>}
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
