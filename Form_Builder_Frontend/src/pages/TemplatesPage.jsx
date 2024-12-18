import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  
  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handle adding a new template
  const addTemplate = async () => {
    try {
      const response = await axios.post('/templates');
      setTemplates([...templates, response.data]);
    } catch (error) {
      console.error('Error adding template:', error);
    }
  };

  // Handle deleting a template
  const deleteTemplate = async (templateId) => {
    try {
      await axios.delete(`/templates/${templateId}`);
      setTemplates(templates.filter((template) => template._id !== templateId));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  // Navigate to FormBuilder
  const handleTemplateClick = (templateId) => {
    navigate(`/form-builder/${templateId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Site Survey Forms</h1>

      <div className="grid grid-cols-4 gap-4">
        {/* Add New Template Card */}
        <div
          className="bg-gray-100 border-dashed border-2 border-gray-400 p-4 flex flex-col items-center justify-center rounded cursor-pointer hover:bg-gray-200"
          onClick={addTemplate}
        >
          <div className="text-4xl text-teal-500 font-bold">+</div>
          <div className="text-teal-500 mt-2">New Template</div>
        </div>

        {/* Template Cards */}
        {templates.map((template) => (
          <div
            key={template._id}
            className="bg-white p-4 rounded shadow-md relative cursor-pointer hover:shadow-lg"
          >
            {/* Navigate to FormBuilder */}
            <div onClick={() => handleTemplateClick(template._id)}>
              <div className="text-xl font-semibold">{template.name}</div>
              <div className="text-gray-500 text-sm mt-2">
                <div>Created: {new Date(template.createdAt).toLocaleDateString()}</div>
                <div>Edited: {template.lastEdited}</div>
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => deleteTemplate(template._id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
