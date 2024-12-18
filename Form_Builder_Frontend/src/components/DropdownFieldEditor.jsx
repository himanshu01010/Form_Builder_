import React, { useState } from "react";

const DropdownFieldEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "Dropdown Field");
  const [visible, setVisible] = useState(field.visible !== false); // Default to visible
  const [enabled, setEnabled] = useState(field.enabled !== false); // Default to enabled
  const [values, setValues] = useState(field.values || ["Yes", "No"]); // Default "Yes" and "No"
  const [defaultValue, setDefaultValue] = useState(field.defaultValue || "");
  const [required, setRequired] = useState(field.required || false);

  // Add a new value
  const addValue = () => setValues([...values, "New Value"]);

  // Update an existing value
  const updateValue = (index, value) => {
    const updatedValues = [...values];
    updatedValues[index] = value;
    setValues(updatedValues);
  };

  // Remove a value
  const removeValue = (index) => setValues(values.filter((_, i) => i !== index));

  // Save handler
  const handleSave = () => {
    onSave({
      label,
      visible,
      enabled,
      values,
      defaultValue,
      required,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Dropdown Field</h2>

      {/* Label Input */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Visibility and Enablement */}
      <div className="mb-4">
        <label className="block font-bold">
          <input
            type="checkbox"
            checked={visible}
            onChange={() => setVisible(!visible)}
            className="mr-2"
          />
          Visible
        </label>
        <label className="block font-bold">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            className="mr-2"
          />
          Enabled
        </label>
      </div>

      {/* Value Management Section */}
      <div className="mb-4">
        <label className="block font-bold mb-2">Values</label>
        {values.map((value, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={value}
              onChange={(e) => updateValue(index, e.target.value)}
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

      {/* Default Value Dropdown */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Default Value</label>
        <select
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Default Value</option>
          {values.map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {/* Required Validation */}
      <div className="mb-4">
        <label className="block font-bold">
          <input
            type="checkbox"
            checked={required}
            onChange={() => setRequired(!required)}
            className="mr-2"
          />
          Required
        </label>
      </div>

      {/* Save and Delete Buttons */}
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

export default DropdownFieldEditor;
