import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";
import debounce from "lodash.debounce";

export default function Select({ ...props }: AutocompleteProps) {
  return (
    <Autocomplete allowsEmptyCollection {...props}>
      {(item: any) => (
        <AutocompleteItem
          key={item.value || ""}
          value={item?.value || ""}
          textValue={item?.label || ""}
        >
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
