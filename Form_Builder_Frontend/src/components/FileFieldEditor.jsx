import React, { useState } from "react";

const FileFieldEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "File Upload Field");
  const [visible, setVisible] = useState(field.visible !== false); // Default to visible
  const [enabled, setEnabled] = useState(field.enabled !== false); // Default to enabled
  const [fileType, setFileType] = useState(field.fileType || "all"); // Default: "All"
  const [maxFiles, setMaxFiles] = useState(field.maxFiles || 1); // Default: 1 file
  const [required, setRequired] = useState(field.required || false);

  // Save handler
  const handleSave = () =>
    onSave({
      label,
      visible,
      enabled,
      fileType,
      maxFiles,
      required,
    });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit File Upload Field</h2>

      {/* Field Label */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter field label (e.g., Upload Files)"
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

      {/* File Type Dropdown */}
      <div className="mb-4">
        <label className="block font-bold mb-1">File Type</label>
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="image">Image</option>
          <option value="pdf">PDF</option>
          <option value="doc">Document</option>
          <option value="video">Video</option>
        </select>
      </div>

      {/* Max Files Uploadable */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Max Files Uploadable</label>
        <input
          type="number"
          value={maxFiles}
          onChange={(e) => setMaxFiles(Number(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="e.g., 5"
          min={1}
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

export default FileFieldEditor;
