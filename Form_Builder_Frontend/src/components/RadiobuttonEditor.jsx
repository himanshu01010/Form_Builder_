import { useState } from "react";

const RadioFieldEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "Radio Button Field");
  const [defaultValue, setDefaultValue] = useState(field.defaultValue || "");
  const [values, setValues] = useState(field.values || ["Option 1", "Option 2"]);
  const [required, setRequired] = useState(field.required || false);

  // Add a new radio option
  const addValue = () => setValues([...values, `Option ${values.length + 1}`]);

  // Update an existing option
  const updateValue = (index, value) => {
    const updatedValues = [...values];
    updatedValues[index] = value;
    setValues(updatedValues);
  };

  // Remove a specific option
  const removeValue = (index) => {
    const updatedValues = values.filter((_, i) => i !== index);
    setValues(updatedValues);
    // If the removed value is the default, clear the defaultValue
    if (values[index] === defaultValue) setDefaultValue("");
  };

  // Save the changes
  const handleSave = () => {
    onSave({
      label,
      defaultValue,
      values,
      required,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Radio Button Field</h2>

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

      {/* Radio Button Options */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Options</label>
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
          Add Option
        </button>
      </div>

      {/* Required Validation */}
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

export default RadioFieldEditor;
