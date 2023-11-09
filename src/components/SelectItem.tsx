import { Select } from "antd";
import React from "react";

interface ItemProps {
  Descritivo: string;
  Id: number;
}

interface SelectItemProps {
  label: string;
  id: string;
  items: ItemProps[];
  onSelect: (value: number, name: string) => void;
  isMultiple?: boolean;
  isDisabled?: boolean;
}

const SelectItem = ({
  label,
  id,
  items,
  onSelect,
  isMultiple,
  isDisabled,
}: SelectItemProps) => {
  const handleSelect = (item) => {
    onSelect(item, id);
  };

  return (
    <Select
      style={{ width: '100%' }}
      placeholder="Qualquer um"
      onChange={handleSelect}
      allowClear
      disabled={isDisabled}
      {...(isMultiple && {mode: "multiple"})}
    >
      {items.map((item) => (
          <Select.Option key={item.Id} value={item.Id}>
            {item.Descritivo}
          </Select.Option>
        ))}
      </Select>
  );
};

export default SelectItem;
