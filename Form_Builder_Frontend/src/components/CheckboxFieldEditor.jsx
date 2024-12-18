import React, { useState } from "react";

const CheckboxFieldEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "");
  const [values, setValues] = useState(
    field.values || ["Yes, I agree", "Yes, this as well"]
  );
  const [visible, setVisible] = useState(field.visible !== false); // Default to visible
  const [enabled, setEnabled] = useState(field.enabled !== false); // Default to enabled
  const [required, setRequired] = useState(field.required || false);

  // Function to update specific value in the dropdown
  const handleValueChange = (index, newValue) => {
    const updatedValues = [...values];
    updatedValues[index] = newValue;
    setValues(updatedValues);
  };

  // Add a new value to the dropdown
  const addValue = () => {
    setValues([...values, "New Option"]);
  };

  // Remove a specific value from the dropdown
  const removeValue = (index) => {
    const updatedValues = values.filter((_, i) => i !== index);
    setValues(updatedValues);
  };

  // Save changes
  const handleSave = () => {
    onSave({ label, values, visible, enabled, required });
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Checkbox Field</h2>

      {/* Field Label */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Visibility and Enable/Disable Checkboxes */}
      <div className="mb-4">
        <label className="block font-bold mb-1">
          <input
            type="checkbox"
            checked={visible}
            onChange={() => setVisible(!visible)}
            className="mr-2"
          />
          Visible
        </label>
        <label className="block font-bold mb-1">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            className="mr-2"
          />
          Enabled
        </label>
      </div>

      {/* Dropdown Section */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Dropdown Values</label>
        {values.map((value, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => removeValue(index)}
              className="text-red-500 ml-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addValue}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Add Value
        </button>
      </div>

      {/* Validator Dropdown Section */}
      <div className="mb-4">
        <label className="block font-bold mb-1">
          <input
            type="checkbox"
            checked={required}
            onChange={() => setRequired(!required)}
            className="mr-2"
          />
          Required
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CheckboxFieldEditor;
