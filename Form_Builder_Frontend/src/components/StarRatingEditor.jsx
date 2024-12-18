import React, { useState } from "react";

const StarRatingEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "Star Rating Field");
  const [visible, setVisible] = useState(field.visible !== false); // Default to visible
  const [enabled, setEnabled] = useState(field.enabled !== false); // Default to enabled
  const [starCount, setStarCount] = useState(field.starCount || 5); // Default 5 stars
  const [defaultValue, setDefaultValue] = useState(field.defaultValue || 0); // Default value is 0
  const [required, setRequired] = useState(field.required || false);

  const handleSave = () => {
    onSave({
      label,
      visible,
      enabled,
      starCount,
      defaultValue,
      required,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Star Rating Field</h2>

      {/* Field Label */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter field label"
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

      {/* Data Section */}
      <div className="mb-4">
        {/* Star Count */}
        <label className="block font-bold mb-1">Star Count</label>
        <input
          type="number"
          value={starCount}
          onChange={(e) => setStarCount(Number(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="e.g., 5"
        />
      </div>

      <div className="mb-4">
        {/* Default Value */}
        <label className="block font-bold mb-1">Default Value</label>
        <input
          type="number"
          value={defaultValue}
          onChange={(e) => setDefaultValue(Number(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="Default star rating (e.g., 3)"
          min={0}
          max={starCount}
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

export default StarRatingEditor;
