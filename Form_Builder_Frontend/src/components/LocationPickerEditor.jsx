import React, { useState } from "react";

const LocationPickerEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "Choose a location");
  const [buttonText, setButtonText] = useState(field.buttonText || "Pick Location");
  const [required, setRequired] = useState(field.required || false);

  const handleSave = () => onSave({ label, buttonText, required });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Location Picker Field</h2>

      {/* Field Label */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., Choose a location"
        />
      </div>

      {/* Button Text */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Button Text</label>
        <input
          type="text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., Pick Location"
        />
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

export default LocationPickerEditor;
