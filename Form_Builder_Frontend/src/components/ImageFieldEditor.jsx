import React, { useState } from "react";

const ImageFieldEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "");
  const [required, setRequired] = useState(field.required || false);

  const handleSave = () => onSave({ label, required });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Image Upload Field</h2>

      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-1">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="mr-2"
          />
          Required
        </label>
      </div>

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

export default ImageFieldEditor;
