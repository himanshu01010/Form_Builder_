import { useState, useEffect } from "react";
import Modal from "react-modal";
import FieldTypes from "./FieldTypes";
import FieldPreview from "./FieldPreview";
import FieldEditor from "./FieldEditor";
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
  const [formFields, setFormFields] = useState([]);
  const [draggedField, setDraggedField] = useState(null);
  const [topFormName, setTopFormname] = useState("");
  const [bottomButtonName, setBottomButtonName] = useState("");
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [formName, setFormName] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFields, setPreviewFields] = useState([]);
  const [errors, setErrors] = useState({});
  

  const validateForm = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      const value = field.selectedValue || field.defaultValue || "";
      if (field.required && !value) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (field.type === "pincode" && value && !/^\d{6}$/.test(value)) {
        newErrors[field.id] = `${field.label} must be a 6-digit number`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch form fields from the backend
  const fetchForm = async () => {
    if (!templateId) {
      console.error("Template ID is undefined or invalid");
      return;
    }

    try {
      console.log("Fetching form for template ID:", templateId);

      const response = await axios.get(`/forms/${templateId}`);
      setTopFormname(response.data.heading);
      setBottomButtonName(response.data.submitLabel);
      setFormFields(response.data?.fields || []); 
    } catch (error) {
      console.error("Error fetching form:", error);
    }
  };

  // Fetch form for preview
  const fetchPreviewForm = async () => {
    if (!templateId) {
      console.error("Template ID is undefined or invalid");
      return;
    }

    try {
      const response = await axios.get(`/forms/${templateId}`);
      setTopFormname(response.data.heading);
      setBottomButtonName(response.data.submitLabel);
      setPreviewFields(response.data?.fields || []);
    } catch (error) {
      console.error("Error fetching preview form:", error);
    }
  };

  // Save form fields to the backend
  const saveForm = async (updatedFields) => {
    if (!templateId) {
      console.error("Template ID is undefined or invalid");
      return;
    }

    try {
      const payload = {
        fields: updatedFields || formFields,
        formName: formName,
      };
      const response = await axios.post(`/forms/${templateId}`, payload);
      console.log("Form saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const nameFetch = async () => {
    try {
      const response = await axios.get(`/templates`);
      const matchedTemplate = response.data.find(item => item._id === templateId);
      if (matchedTemplate) {
        setFormName(matchedTemplate.name || "");
      } else {
        console.log("Template not found");
        setFormName("");
      }
    }
    catch (error) {
      console.error("Error name", error)
    }
  }


  useEffect(() => {
    fetchForm();
  }, [templateId]);

  useEffect(() => {
    nameFetch();
  }, []);

  const handleDragStart = (type) => setDraggedField(type);

  const handleDrop = async () => {
    if (!draggedField) return;

    const newField = {
      id: Date.now().toString(),
      type: draggedField,
      label: draggedField + " Field",
      required: false,
      defaultValue: "",
    };


    const updatedFields = [...formFields, newField];
    setFormFields(updatedFields);


    await saveForm(updatedFields);


    setDraggedField(null);
  };

  const updateField = (index, updates) => {
    const updatedFields = [...formFields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFormFields(updatedFields);
    saveForm(updatedFields);
  };

  const removeField = (index) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
    saveForm(updatedFields);
  };

  
  const downloadJSON = () => {
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix the validation errors before submitting.");
      return;
    }
  
    const formData = {};
    formFields.forEach((field) => {
      formData[field.label] =
        field.type === "location"
          ? field.selectedValue // Ensure location is included as an object
          : field.selectedValue || field.defaultValue || "";
    });
  
    // Debugging log
    console.log("Payload being submitted:", formData);
  
    try {
      const response = await axios.post(`/forms/${templateId}/submit`, {
        templateId,
        formData,
      });
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    }
  };
  

  const updateFormName = async (newName) => {
    if (!templateId) {
      console.error("Template ID is undefined or invalid");
      return;
    }

    try {
      const response = await axios.put(`/templates/${templateId}`, { name: newName });
      setFormName(response.data.name);
      console.log("Form name updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating form name:", error);
    }
  };

  const openPreview = () => {
    fetchPreviewForm();
    setIsPreviewOpen(true);
  };

  return (
    <div className="p-4 mx-auto">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          onBlur={() => updateFormName(formName)}
          className="w-full p-2 border rounded"
          placeholder="Enter form name"
        />
        <button
          onClick={() => updateFormName(formName)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Save
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 bg-gray-100 p-4 rounded">
          <FieldTypes onDragStart={handleDragStart} />
        </div>

        <div
          className="col-span-3 min-h-[400px] bg-gray-50 p-4 rounded"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <FieldPreview
            fields={formFields}
            onFieldClick={(index) => setSelectedFieldIndex(index)}
            templateId={templateId}
          />
        </div>
      </div>

      {/* Buttons for Preview and Download */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={openPreview}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Preview
        </button>
        <button
          onClick={downloadJSON}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Download
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
            field={formFields[selectedFieldIndex]}
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

      {/* Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={isPreviewOpen}
          onRequestClose={() => setIsPreviewOpen(false)}
          style={customModalStyles}
          ariaHideApp={false}
        >
          <div>
            <h2 className="text-lg font-bold mb-4">{topFormName}</h2>
            <form onSubmit={handleFormSubmit}>
              {formFields.map((field) => (

                <div key={field.id} className="mb-6">

                  {field.visible === false && null}
                  {field.visible !== false && field.type !== "sectionHeading" && (
                    <label className="block font-bold mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                  )}

                  {/* Handle Text Fields */}
                  {field.visible !== false &&
                    (field.type === "text" ||
                      field.type === "email" ||
                      field.type === "phone" ||
                      field.type === "textarea" ||
                      field.type === "number" ||
                      field.type === "website") && (
                      <>
                        {field.type === "textarea" ? (
                          // Render textarea for "textarea" type
                          <textarea
                            className="w-full p-2 border rounded"
                            placeholder={field.label}
                            defaultValue={field.defaultValue}
                            required={field.required}
                            disabled={field.enabled === false}
                            rows={5} // Adjust rows for textarea
                            onChange={(e) => (field.selectedValue = e.target.value)}
                          />
                        ) : (
                          // Render input for other types
                          <input
                            type={
                              field.type === "email"
                                ? "email"
                                : field.type === "number"
                                  ? "number"
                                  : field.type === "phone"
                                    ? "tel"
                                    : field.type === "website"
                                      ? "url"
                                      : "text"
                            }
                            className="w-full p-2 border rounded"
                            placeholder={field.label}
                            defaultValue={field.defaultValue}
                            required={field.required}
                            disabled={field.enabled === false}
                            pattern={
                              field.type === "email"
                                ? "^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$" 
                                : field.type === "phone"
                                  ? "^[0-9]{10}$" 
                                  : field.type === "website"
                                    ? "https?://.+\\..+" 
                                    : undefined
                            }
                            onChange={(e) => (field.selectedValue = e.target.value)}
                            title={
                              field.type === "email"
                                ? "Enter a valid email address."
                                : field.type === "phone"
                                  ? "Enter a valid 10-digit phone number."
                                  : field.type === "website"
                                    ? "Enter a valid website URL starting with http or https."
                                    : undefined
                            }
                          />
                        )}
                      </>
                    )}

                  {/* Handle Checkbox Fields */}
                  {field.visible !== false && field.type === "checkbox" && (
                    <div>
                      {field.values?.map((value, index) => (
                        <label key={index} className="block mb-1">
                          <input
                            type="checkbox"
                            className="mr-2"
                            defaultChecked={field.defaultValue?.includes(value)}
                            required={field.required}
                            disabled={field.enabled === false} // Disable field
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.selectedValue = [...(field.selectedValue || []), value];
                              } else {
                                field.selectedValue = (field.selectedValue || []).filter((v) => v !== value);
                              }
                            }}
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Handle Dropdown Fields */}
                  {field.visible !== false && field.type === "dropdown" && (
                    <select
                      className="w-full p-2 border rounded"
                      defaultValue={field.defaultValue || ""}
                      required={field.required}
                      disabled={field.enabled === false} // Disable dropdown
                      onChange={(e) => (field.selectedValue = e.target.value)}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {field.values?.map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Handle Radio Button Fields */}
                  {field.visible !== false && field.type === "radio" && (
                    <div>
                      {field.values?.map((value, index) => (
                        <label key={index} className="block mb-1">
                          <input
                            type="radio"
                            name={`radio_${field.id}`}
                            className="mr-2"
                            defaultChecked={field.defaultValue === value}
                            required={field.required}
                            disabled={field.enabled === false} // Disable radio buttons
                            onChange={() => (field.selectedValue = value)}
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Handle File Upload Fields */}
                  {field.visible !== false && field.type === "file" && (
                    <input
                      type="file"
                      accept={field.fileType === "all" ? "*" : field.fileType}
                      multiple={field.maxFiles > 1}
                      className="w-full p-2 border rounded"
                      required={field.required}
                      disabled={field.enabled === false} // Disable file input
                      onChange={(e) => (field.selectedValue = e.target.value)}
                    />
                  )}

                  {/* Handle Star Rating */}
                  {field.visible !== false && field.type === "starRating" && (
                    <div className="flex items-center">
                      {[...Array(field.starCount || 5)].map((_, index) => (
                        <span
                          key={index}
                          className={`inline-block mr-1 cursor-pointer ${index < (field.selectedValue || field.defaultValue)
                            ? "text-yellow-500"
                            : "text-gray-400"
                            }`}
                          onClick={() => {
                            if (field.enabled === false) return; // Ignore clicks if disabled
                            const updatedFields = formFields.map((f) =>
                              f.id === field.id ? { ...f, selectedValue: index + 1 } : f
                            );
                            setFormFields(updatedFields);
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}


                  {field.visible !== false && field.type === "dateTime" && (
                    <input
                      type={
                        field.pickerType === "date"
                          ? "date"
                          : field.pickerType === "time"
                            ? "time"
                            : "datetime-local"
                      }
                      className="w-full p-2 border rounded"
                      defaultValue={field.defaultValue}
                      required={field.required}
                      disabled={field.enabled === false}
                      onChange={(e) => (field.selectedValue = e.target.value)}
                    />
                  )}


{field.visible !== false && field.type === "location" && (
  <div>
    <button
      type="button"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };

              // Log coordinates for debugging
              console.log("Fetched Coordinates:", coords);

              // Update the specific field's `selectedValue`
              const updatedFields = formFields.map((f) =>
                f.id === field.id ? { ...f, selectedValue: coords } : f
              );

              // Update state with updated fields
              setFormFields(updatedFields);

              alert(`Location saved: Latitude ${coords.latitude}, Longitude ${coords.longitude}`);
            },
            () => alert("Error fetching location. Please allow location access.")
          );
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }}
      disabled={field.enabled === false}
    >
      {field.buttonText || "Pick Location"}
    </button>
    {field.selectedValue && (
      <div className="mt-2 text-gray-600">
        Latitude: {field.selectedValue.latitude}, Longitude: {field.selectedValue.longitude}
      </div>
    )}
  </div>
)}

                  {field.visible !== false && field.type === "description" && (
                    <div
                      dangerouslySetInnerHTML={{ __html: field.defaultValue }}
                      className="p-2 border rounded bg-gray-100"
                    ></div>
                  )}

                  {/* Handle Pincode Fields */}
                  {field.visible !== false && field.type === "pincode" && (
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder={field.label}
                      defaultValue={field.defaultValue}
                      required={field.required}
                      disabled={field.enabled === false}
                      onChange={(e) => (field.selectedValue = e.target.value)}
                    />
                  )}

                  {/* Handle Section Heading */}
                  {field.type === "sectionHeading" && (
                    <h3
                      dangerouslySetInnerHTML={{ __html: field.label }}
                      className="text-xl font-bold mb-4"
                    ></h3>
                  )}

                  {/* Display validation errors */}
                  {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
                </div>

              ))}

              <div className="mt-6 text-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded"
                >
                  {bottomButtonName}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FormBuilder;



