import { Select, Typography } from "antd";
import React from "react";

interface ItemProps {
  Descritivo: string;
  Id: number;
}

interface SelectItemProps {
  label: string;
  id: string;
  items: ItemProps[];
  onSelect: (value: string, name: string) => void;
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
  const options = items.map(item => {return {value: item.Id.toString(), label: item.Descritivo}});
  
  const handleSelect = (item) => {
    onSelect(item, id);
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <>
    <Typography.Text>{label}</Typography.Text>
    <Select
      style={{ width: '100%' }}
      placeholder="Qualquer um"
      onChange={handleSelect}
      allowClear
      showSearch
      options={options}
      filterOption={filterOption}
      disabled={isDisabled}
      {...(isMultiple && {mode: "multiple"})}
    />
    </>
  );
};

export default SelectItem;
