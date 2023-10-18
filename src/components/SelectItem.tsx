import React from "react";

interface ItemProps {
  Descritivo: string;
  Id: number;
}

interface SelectItemProps {
  label: string;
  id: string;
  items: ItemProps[];
  onSelect: ({
    target: { name, value },
  }: {
    target: { name: any; value: any };
  }) => void;
}

const SelectItem = ({ label, id, items, onSelect }: SelectItemProps) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select name={id} id={id} onChange={onSelect}>
        <option value="">Qualquer um</option>
        {items.map((item) => (
          <option key={item.Id} value={item.Id}>
            {item.Descritivo}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectItem;
