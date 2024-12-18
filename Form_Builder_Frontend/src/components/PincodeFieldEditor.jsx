import { useState } from "react";

const PincodeFieldEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "Pincode Field");
  const [defaultValue, setDefaultValue] = useState(field.defaultValue || "");
  const [visible, setVisible] = useState(field.visible !== false); // Default to visible
  const [enabled, setEnabled] = useState(field.enabled !== false); // Default to enabled
  const [required, setRequired] = useState(field.required || false);

  const handleSave = () =>
    onSave({
      label,
      defaultValue,
      visible,
      enabled,
      required,
    });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Pincode Field</h2>

      {/* Field Label */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter field label (e.g., Pincode)"
        />
      </div>

      {/* Default Value */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Default Value</label>
        <input
          type="text"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., 123456"
        />
      </div>

      {/* Visibility and Enable/Disable Options */}
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

      {/* Validation: Required */}
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

      {/* Buttons */}
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

export default PincodeFieldEditor;
