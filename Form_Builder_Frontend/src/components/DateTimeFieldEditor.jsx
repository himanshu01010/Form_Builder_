import { useState } from "react";

const DateTimeFieldEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "Date & Time Picker");
  const [visible, setVisible] = useState(field.visible !== false); // Default to visible
  const [enabled, setEnabled] = useState(field.enabled !== false); // Default to enabled
  const [pickerType, setPickerType] = useState(field.pickerType || "date"); // Default: "date"
  const [defaultValue, setDefaultValue] = useState(field.defaultValue || "");
  const [required, setRequired] = useState(field.required || false);

  // Save handler
  const handleSave = () =>
    onSave({
      label,
      visible,
      enabled,
      pickerType,
      defaultValue,
      required,
    });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Date & Time Picker</h2>

      {/* Field Label */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter field label (e.g., Choose Date)"
        />
      </div>

      {/* Visibility and Enable Options */}
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

      {/* Picker Type Dropdown */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Picker Type</label>
        <select
          value={pickerType}
          onChange={(e) => {
            setPickerType(e.target.value);
            setDefaultValue(""); // Clear default value when picker type changes
          }}
          className="w-full p-2 border rounded"
        >
          <option value="date">Date</option>
          <option value="time">Time</option>
          <option value="date-time">Date & Time</option>
        </select>
      </div>

      {/* Default Value Input */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Default Value</label>
        <input
          type={pickerType === "time" ? "time" : pickerType === "date" ? "date" : "datetime-local"}
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder={`Enter default ${pickerType} value`}
        />
      </div>

      {/* Validation - Required */}
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

export default DateTimeFieldEditor;
