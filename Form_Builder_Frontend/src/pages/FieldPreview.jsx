import  { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "../api/axios";

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "auto",
    borderRadius: "8px",
    padding: "20px",
    overflow: "auto",
  },
};

const FieldPreview = ({ fields, onFieldClick, templateId }) => {
  const [heading, setHeading] = useState("Form Preview");
  const [submitLabel, setSubmitLabel] = useState("submit");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editType, setEditType] = useState(null);

  const getTemplateHeading = async () => {
    try {
      const response = await axios.get(`/forms/${templateId}`);
      setHeading(response.data.heading || "Form Preview");
      setSubmitLabel(response.data.submitLabel || "Submit");
    } catch (error) {
      console.error("Error fetching heading and submit label:", error);
    }
  };

  // Save changes to backend
  const saveToBackend = async (newHeading, newSubmitLabel) => {
    try {
      const payload = { heading: newHeading, submitLabel: newSubmitLabel };
      await axios.post(`/forms/${templateId}`, payload);
      console.log("Heading and submit label updated successfully!");
    } catch (error) {
      console.error("Error updating heading and submit label:", error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    getTemplateHeading();
  }, [templateId]);

  // Open modal to edit
  const openModal = (type) => {
    setEditType(type);
    setIsModalOpen(true);
  };

  // Save handler for modal
  const handleSave = () => {
    saveToBackend(heading, submitLabel);
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Editable Form Heading */}
      <h2
        className="text-lg font-bold mb-4 cursor-pointer"
        onClick={() => openModal("heading")}
      >
        {heading}
      </h2>

      {/* Field List */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="bg-white p-4 mb-4 rounded border cursor-pointer"
          onClick={() => onFieldClick(index)}
        >
          {field.type === "sectionHeading" ? (
            <div
              dangerouslySetInnerHTML={{ __html: field.label }}
              className="text-2xl font-semibold"
            ></div>
          ) : (
            <span>{field.label}</span>
          )}
          {field.required && <span className="text-red-500 ml-2">*</span>}
        </div>
      ))}

      {fields.length === 0 && (
        <div className="text-center text-gray-500 py-8">Drag and drop fields here</div>
      )}

      {/* Editable Submit Button */}
      <div className="text-center mt-8">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded cursor-pointer"
          onClick={() => openModal("button")}
        >
          {submitLabel}
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={customModalStyles}
          ariaHideApp={false}
        >
          <div>
            <h2 className="text-lg font-bold mb-4">
              {editType === "heading" ? "Edit Form Heading" : "Edit Submit Button Label"}
            </h2>
            <label className="block font-bold mb-1">
              {editType === "heading" ? "Form Heading" : "Button Label"}
            </label>
            <input
              type="text"
              value={editType === "heading" ? heading : submitLabel}
              onChange={(e) =>
                editType === "heading"
                  ? setHeading(e.target.value)
                  : setSubmitLabel(e.target.value)
              }
              className="w-full p-2 border rounded mb-4"
              placeholder={`Enter ${editType === "heading" ? "heading" : "button"} text`}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FieldPreview;
