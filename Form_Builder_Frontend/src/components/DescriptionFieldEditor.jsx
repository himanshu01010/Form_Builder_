import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE Editor

const DescriptionFieldEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "");
  const [defaultValue, setDefaultValue] = useState(field.defaultValue || "");

  const handleSave = () => onSave({ label, defaultValue });

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Description Field</h2>

      {/* Field Label */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Field Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., Description"
        />
      </div>

      {/* TinyMCE Editor for Default Value */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Default Value</label>
        <Editor
          apiKey="ccsp3fryww123ozctsohuk0zlfs3zmzr58w9l7w3jp6bw4ts" // Optional: Add your TinyMCE API key here
          value={defaultValue}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist autolink lists link charmap preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime table paste help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          }}
          onEditorChange={(content) => setDefaultValue(content)}
        />
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

export default DescriptionFieldEditor;
