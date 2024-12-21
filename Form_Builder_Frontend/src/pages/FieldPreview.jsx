import { useEffect, useState } from "react";
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
  const [validatePerPage, setValidatePerPage] = useState(true); // Added validation preference

  console.log(templateId);

  const getTemplateHeading = async () => {
    try {
      const response = await axios.get(`/forms/${templateId}`);
      setHeading(response.data.heading || "Form Preview");
      setSubmitLabel(response.data.submitLabel || "Submit");
      setValidatePerPage(response.data.validatePerPage ?? true); // Get validation preference
    } catch (error) {
      console.error("Error fetching heading and submit label:", error);
    }
  };

  // Save changes to backend
  const saveToBackend = async (newHeading, newSubmitLabel, newValidatePerPage) => {
    try {
      const payload = { 
        heading: newHeading, 
        submitLabel: newSubmitLabel,
        validatePerPage: newValidatePerPage // Add validation preference to payload
      };
      await axios.post(`/forms/${templateId}`, payload);
      console.log("Form settings updated successfully!");
    } catch (error) {
      console.error("Error updating form settings:", error);
    }
  };

  useEffect(() => {
    getTemplateHeading();
  }, [templateId]);

  const openModal = (type) => {
    setEditType(type);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    saveToBackend(heading, submitLabel, validatePerPage);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2
          className="text-lg font-bold cursor-pointer"
          onClick={() => openModal("heading")}
        >
          {heading}
        </h2>
        
        {/* Added validation preference toggle */}
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={validatePerPage}
            onChange={(e) => {
              setValidatePerPage(e.target.checked);
              saveToBackend(heading, submitLabel, e.target.checked);
            }}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span>Validate each page before proceeding</span>
        </label>
      </div>

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

      <div className="text-center mt-8">
        <button
          className="bg-green-500 text-white px-6 py-2 rounded cursor-pointer"
          onClick={() => openModal("button")}
        >
          {submitLabel}
        </button>
      </div>

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