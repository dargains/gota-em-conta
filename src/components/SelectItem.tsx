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
  const options = items.map(item => {return {value: item.Id, label: item.Descritivo}});
  
  const handleSelect = (item) => {
    onSelect(item, id);
  };

  return (
    <Select
    style={{ width: '100%' }}
    placeholder="Qualquer um"
    onChange={handleSelect}
    options={options}
    {...(isMultiple && {mode: "multiple"})}
    disabled={isDisabled}
    />
    // <div>
    //   <label htmlFor={id}>{label}</label>
    //   <select name={id} id={id} onChange={onSelect} isMultiple={isMultiple}>
    //     <option value="">Qualquer um</option>
    //     {items.map((item) => (
    //       <option key={item.Id} value={item.Id}>
    //         {item.Descritivo}
    //       </option>
    //     ))}
    //   </select>
    // </div>
  );
};

export default SelectItem;
