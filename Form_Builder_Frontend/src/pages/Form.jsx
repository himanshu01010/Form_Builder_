import { useState, useEffect } from "react";
import Modal from "react-modal";
import { Share2 } from "lucide-react";
import FieldTypes from "./FieldTypes";
import FieldPreview from "./FieldPreview";
import FieldEditor from "./FieldEditor";
import FormPreview from "./FormPreview";
import { useParams } from "react-router-dom";
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
    height: "50%",
    borderRadius: "8px",
    padding: "20px",
    overflow: "auto",
  },
};

const FormBuilder = () => {
  const { templateId } = useParams();
  const [pages, setPages] = useState([{ title: "Page 1", fields: [] }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [draggedField, setDraggedField] = useState(null);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [formName, setFormName] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [validatePerPage, setValidatePerPage] = useState(true);

  const [topFormName, setTopFormname] = useState("");
  const [bottomButtonName, setBottomButtonName] = useState("");
  const [previewPageIndex, setPreviewPageIndex] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const [templateDetails, setTemplateDetails] = useState({
    name: "Untitled Form",
    createdAt: "",
    lastEdited: "",
  });

  // const [errors, setErrors] = useState({});

  const fetchForm = async () => {
    if (!templateId) {
      console.error("Template ID is undefined or invalid");
      return;
    }

    try {
      const response = await axios.get(`/forms/${templateId}`);
      setFormName(response.data.formName || "Untitled Form");
      setPages(response.data.pages || [{ title: "Page 1", fields: [] }]);
      setValidatePerPage(response.data.validatePerPage ?? true);
    } catch (error) {
      console.error("Error fetching form:", error);
    }
  };

  const saveForm = async () => {
    if (!templateId) {
      console.error("Template ID is undefined or invalid");
      return;
    }

    try {
      const payload = { formName, pages };

      await updateTemplateName(formName);
      
      await axios.post(`/forms/${templateId}`, payload);
      console.log("Form saved successfully");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [templateId]);

  const addPage = () => {
    setPages([...pages, { title: `Page ${pages.length + 1}`, fields: [] }]);
    setCurrentPageIndex(pages.length);
  };

  const removePage = async (index) => {
    if (pages.length === 1) {
      alert("Cannot delete the last page");
      return; 
    }
  
    try {
      const response = await axios.put(`/forms/${templateId}/delete-page`, { pageIndex: index });
      setPages(response.data.pages); // Update the pages with the response
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
      alert("Page deleted successfully");
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("Failed to delete page. Please try again.");
    }
  };

  const handleDragStart = (type) => setDraggedField(type);

  const handleDrop = () => {
    if (!draggedField) return;

    const newField = {
      id: Date.now().toString(),
      type: draggedField,
      label: `${draggedField} Field`,
      required: false,
      defaultValue: "",
    };

    const updatedPages = [...pages];
    updatedPages[currentPageIndex].fields.push(newField);
    setPages(updatedPages);

    setDraggedField(null);
    saveForm();
  };

  const updateField = (index, updates) => {
    const updatedPages = [...pages];
    const updatedFields = [...updatedPages[currentPageIndex].fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    updatedPages[currentPageIndex].fields = updatedFields;
    setPages(updatedPages);
    saveForm();
  };

  const removeField = (index) => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex].fields.splice(index, 1);
    setPages(updatedPages);
    saveForm();
  };

  const handleFormSubmit = async (e) => {
    console.log(e);
    if(!e) return;

    const formData = {};
    pages.forEach((page, pageIndex) => {
      page.fields.forEach((field) => {
        formData[`${pageIndex}-${field.label}`] = field.selectedValue || field.defaultValue || "";
      });
    });

    try {
      await axios.post(`/forms/${templateId}/submit`, { templateId, formData });
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    }
  };
  

  const fetchPreviewForm = async () => {
    if (!templateId) {
      console.error("Template ID is undefined or invalid");
      return;
    }

    try {
      const response = await axios.get(`/forms/${templateId}`);
      setTopFormname(response.data.heading);
      setBottomButtonName(response.data.submitLabel);
      // setPreviewFields(response.data?.fields || []);
    } catch (error) {
      console.error("Error fetching preview form:", error);
    }
  };


  const fetchTemplateDetails = async () => {
    if (!templateId) {
      console.error("Template ID is undefined or invalid");
      return;
    }

    try {
      const response = await axios.get(`/templates`);
      setTemplateDetails(response.data);
      setFormName(response.data.name); // Update form name from template
    } catch (error) {
      console.error("Error fetching template details:", error);
    }
  };

  // Function to update template name
  const updateTemplateName = async (newName) => {
    if (!templateId) {
      console.error("Template ID is undefined or invalid");
      return;
    }

    try {
      const response = await axios.put(`/templates/${templateId}`, {
        name: newName,
      });
      setTemplateDetails(response.data);
      console.log("Template name updated successfully");
    } catch (error) {
      console.error("Error updating template name:", error);
    }
  };


  useEffect(() => {
    fetchTemplateDetails();
  }, [templateId]);


  const openPreview = () => {
    fetchPreviewForm();
    setIsPreviewOpen(true);
  };

  const handleShare = () => {
    // Assuming your site is hosted on Vercel
    console.log(window.location.origin)
    const shareLink = `${window.location.origin}/form-preview/${templateId}`;
    setShareUrl(shareLink);
    setShareModalOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };


  const downloadJSON = () => {
    const formFields = pages.flatMap((page) => page.fields); // Flatten all fields from all pages
    const blob = new Blob(
      [JSON.stringify({ formName, fields: formFields }, null, 2)],
      {
        type: "application/json",
      }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `form_${templateId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="p-4 mx-auto">
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          onBlur={saveForm}
          className="w-full p-2 border rounded"
          placeholder="Enter form name"
        />
        <button
          onClick={saveForm}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>

        
      </div>

      <div className="mb-4">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => setCurrentPageIndex(index)}
            className={`px-4 py-2 border ${
              index === currentPageIndex ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {page.title}
          </button>
        ))}
        <button onClick={addPage} className="px-4 py-2 bg-green-500 text-white ml-2 rounded">
          Add Page
        </button>
        {pages.length > 1 && (
          <button
            onClick={() => removePage(currentPageIndex)}
            className="px-4 py-2 bg-red-500 text-white ml-2 rounded"
          >
            Delete Current Page
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 bg-gray-100 p-4 rounded">
          <FieldTypes onDragStart={handleDragStart} />
        </div>

        <div
          className="col-span-3 bg-gray-50 p-4 rounded min-h-[400px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <FieldPreview
            fields={pages[currentPageIndex]?.fields || []}
            onFieldClick={(index) => setSelectedFieldIndex(index)}
            templateId={templateId}
          />
        </div>

        {/* <div className="mt-4 flex justify-between"> */}
       <button
          onClick={openPreview}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Preview
        </button>
        <button
          onClick={handleShare}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Share2 size={18} /> Share
        </button>

        <button
        onClick={downloadJSON}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Download JSON
      </button>
      </div>

      {selectedFieldIndex !== null && (
        <Modal
          isOpen={selectedFieldIndex !== null}
          onRequestClose={() => setSelectedFieldIndex(null)}
          style={customModalStyles}
          ariaHideApp={false}
        >
          <FieldEditor
            field={pages[currentPageIndex]?.fields[selectedFieldIndex]}
            onSave={(updates) => {
              updateField(selectedFieldIndex, updates);
              setSelectedFieldIndex(null);
            }}
            onDelete={() => {
              removeField(selectedFieldIndex);
              setSelectedFieldIndex(null);
            }}
          />
        </Modal>
      )}

    {isPreviewOpen && (
      <Modal
        isOpen={isPreviewOpen}
        onRequestClose={() => {
          setIsPreviewOpen(false);
          setPreviewPageIndex(0);
        }}
        style={customModalStyles}
        ariaHideApp={false}
      >
        <FormPreview
          pages={pages}
          currentPageIndex={previewPageIndex}
          onPageChange={setPreviewPageIndex}
          onSubmit={handleFormSubmit}
          formName={formName}
          validatePerPage={validatePerPage}
          errors={errors}
        />
      </Modal>
    )}

      <Modal
        isOpen={shareModalOpen}
        onRequestClose={() => setShareModalOpen(false)}
        style={customModalStyles}
        ariaHideApp={false}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Share Form</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={copyToClipboard}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Copy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FormBuilder;
