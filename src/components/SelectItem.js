import React from "react";

const SelectItem = ({ label, id, items, onSelect }) => {
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
