import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import React from 'react';

const ComboBox = ({ list, subject, value, onChange, styles }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", !styles ? "bg-[#0e4028] border-2 border-[#0b864a] hover:bg-[#0e5a35]" : styles)}
        >
          <span className="truncate">{value ? list.find((item) => item.value === value)?.label : `Select ${subject}...`}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Select ${subject}...`} />
          <CommandList>
            <CommandEmpty>No {subject} found.</CommandEmpty>
            <CommandGroup>
              {list.map((item, index) => (
                <CommandItem
                  key={index}
                  value={item.value}
                  onSelect={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
