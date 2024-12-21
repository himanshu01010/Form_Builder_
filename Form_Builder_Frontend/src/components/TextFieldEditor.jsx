import { useState, useEffect } from "react";

const fieldTypes = [
  { value: "text", label: "Single Line Text" },
  { value: "textarea", label: "Multiline Text" },
  { value: "phone", label: "Phone Number" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "website", label: "Website" },
];

const TextFieldEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "");
  const [type, setType] = useState(field.type || "text");
  const [defaultValue, setDefaultValue] = useState(field.defaultValue || "");
  const [required, setRequired] = useState(field.required || false);
  const [enabled, setEnabled] = useState(field.enabled !== false); 
  const [visible, setVisible] = useState(field.visible !== false); 
  const [error, setError] = useState("");
  const validateDefaultValue = (value, fieldType) => {
    let validationError = "";
    if (value) {
      switch (fieldType) {
        case "phone":
          validationError = /^\d{10}$/.test(value)
            ? ""
            : "Phone number must be 10 digits.";
          break;
        case "email":
          validationError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ""
            : "Invalid email format.";
          break;
        case "number":
          validationError = !isNaN(value) ? "" : "Value must be a number.";
          break;
        case "website":
          validationError = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+.*$/.test(value)
            ? ""
            : "Invalid website URL.";
          break;
        default:
          validationError = ""; 
      }
    }
    setError(validationError);
  };

  useEffect(() => {
    validateDefaultValue(defaultValue, type);
  }, [defaultValue, type]);

  const handleSave = () => {
    if (!error) {
      const updatedField = {
        label,
        type, 
        defaultValue,
        required,
        enabled,
        visible,
      };

      
      onSave(updatedField);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Text Field</h2>

      {/* Label Field */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Field Type Dropdown */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {fieldTypes.map((fieldType) => (
            <option key={fieldType.value} value={fieldType.value}>
              {fieldType.label}
            </option>
          ))}
        </select>
      </div>

      {/* Default Value Input */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Default Value</label>
        <input
          type="text"
          value={defaultValue}
          onChange={(e) => {
            setDefaultValue(e.target.value);
            validateDefaultValue(e.target.value, type);
          }}
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {/* Configuration Checkboxes */}
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
        <label className="block font-bold mb-1">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            className="mr-2"
          />
          Enabled
        </label>
        <label className="block font-bold mb-1">
          <input
            type="checkbox"
            checked={visible}
            onChange={() => setVisible(!visible)}
            className="mr-2"
          />
          Visible
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleSave}
          disabled={!!error}
          className={`px-4 py-2 rounded ${
            error ? "bg-gray-400" : "bg-blue-500 text-white"
          }`}
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

export default TextFieldEditor;