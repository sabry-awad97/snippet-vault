import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useImmerReducer } from 'use-immer';

interface ComboboxState {
  open: boolean;
  values: string[];
}

type ComboboxAction =
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'TOGGLE_VALUE'; payload: string };

const comboboxReducer = (draft: ComboboxState, action: ComboboxAction) => {
  switch (action.type) {
    case 'SET_OPEN':
      draft.open = action.payload;
      break;
    case 'TOGGLE_VALUE':
      const index = draft.values.indexOf(action.payload);
      if (index > -1) {
        draft.values.splice(index, 1);
      } else {
        draft.values.push(action.payload);
      }
      break;
    default:
      break;
  }
};

interface Option {
  label: string;
  value: string;
}

interface ComboboxProps<T extends Option> {
  options: T[];
  values: T[];
  onSelect: (option: T) => void;
  onUnselect: (option: T) => void;
  renderTrigger?: (selectedOptions: T[]) => React.ReactNode;
  placeholder?: string;
  filter?: (value: string, search: string) => number;
}

const ComboboxMultiSelect = <T extends Option>({
  options,
  values,
  onSelect,
  onUnselect,
  renderTrigger,
  placeholder = 'Search...',
  filter,
}: ComboboxProps<T>) => {
  const [{ open, values: selectedValues }, dispatch] = useImmerReducer(
    comboboxReducer,
    {
      open: false,
      values: values.map(val => val.value),
    },
  );

  const selectedOptions = selectedValues
    .map(val => options.find(option => option.value === val)!)
    .filter(Boolean);

  const handleSelect = (option: Option) => {
    const isSelected = selectedValues.includes(option.value);

    dispatch({ type: 'TOGGLE_VALUE', payload: option.value });

    if (isSelected) {
      onUnselect(option as T);
    } else {
      onSelect(option as T);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={isOpen => dispatch({ type: 'SET_OPEN', payload: isOpen })}
    >
      <PopoverTrigger asChild>
        {renderTrigger ? (
          renderTrigger(selectedOptions)
        ) : (
          <DefaultTrigger selectedOptions={selectedOptions} />
        )}
      </PopoverTrigger>
      <PopoverContent className="mt-2 w-[12rem] p-0">
        <Command filter={filter}>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-72">
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValues.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const DefaultTrigger: React.FC<{ selectedOptions: Option[] }> = ({
  selectedOptions,
}) => {
  const selectedLabels = selectedOptions.map(option => option.label).join(', ');
  return (
    <div className="flex cursor-pointer items-center text-slate-400 hover:text-purple-600">
      <span>{selectedLabels || 'Select items...'}</span>
    </div>
  );
};

export default ComboboxMultiSelect;
