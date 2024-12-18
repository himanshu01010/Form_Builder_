import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE Editor

const SectionHeadingEditor = ({ field, onSave, onDelete }) => {
  const [label, setLabel] = useState(field.label || "");

  const handleSave = () => {
    onSave({ label });
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Edit Section Heading</h2>

      {/* TinyMCE Editor for Rich Text */}
      <div className="mb-4">
        <label className="block font-bold mb-1">Heading Text</label>
        <Editor
          apiKey="ccsp3fryww123ozctsohuk0zlfs3zmzr58w9l7w3jp6bw4ts" // Optional: Add your TinyMCE API key here
          value={label}
          init={{
            height: 200,
            menubar: false,
            plugins: [
              "advlist autolink lists link charmap preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime table paste help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          }}
          onEditorChange={(content) => setLabel(content)}
        />
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

export default SectionHeadingEditor;
