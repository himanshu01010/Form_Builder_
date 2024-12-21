import  { useState } from 'react';


const FormPreview = ({ 
  pages, 
  currentPageIndex, 
  onPageChange, 
  onSubmit, 
  formName,
  validatePerPage,
  initialErrors = {},
  isStandalone = false
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(initialErrors);
  const [attemptedNext, setAttemptedNext] = useState(false);

  const validateFields = (fields) => {
    const newErrors = {};
    let firstErrorField = null;
    
    fields.forEach(field => {
      // Skip validation for non-input fields
      if (field.type === 'description' || field.type === 'sectionHeading') {
        return;
      }

      // Required field validation
      if (field.required) {
        const fieldValue = formData[field.id];
        const isEmpty = 
          fieldValue === undefined || 
          fieldValue === '' || 
          (Array.isArray(fieldValue) && fieldValue.length === 0);

        if (isEmpty) {
          newErrors[field.id] = 'This field is required';
          if (!firstErrorField) firstErrorField = field.id;
          return; // Skip other validations if field is empty and required
        }
      }

      // Type-specific validation (only if field has a value)
      if (!field.required) {
        switch (field.type) {
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData[field.id])) {
              newErrors[field.id] = 'Please enter a valid email address';
              if (!firstErrorField) firstErrorField = field.id;
            }
            break;

          case 'phone':
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(formData[field.id])) {
              newErrors[field.id] = 'Please enter a valid 10-digit phone number';
              if (!firstErrorField) firstErrorField = field.id;
            }
            break;

          case 'website':
            try {
              new URL(formData[field.id]);
            } catch {
              newErrors[field.id] = 'Please enter a valid URL';
              if (!firstErrorField) firstErrorField = field.id;
            }
            break;

          case 'number':
            const num = Number(formData[field.id]);
            if (isNaN(num)) {
              newErrors[field.id] = 'Please enter a valid number';
              if (!firstErrorField) firstErrorField = field.id;
            }
            break;
        }
      }
    });

    return { errors: newErrors, firstErrorField };
  };

  const handlePageChange = (nextIndex) => {
    // When moving forward and validatePerPage is true, validate current page
    if (nextIndex > currentPageIndex && validatePerPage && nextIndex!=Object.keys(pages).length) {
      setAttemptedNext(true);
      const currentPageFields = pages[currentPageIndex].fields;
      const { errors: pageErrors, firstErrorField } = validateFields(currentPageFields);
      
      if (Object.keys(pageErrors).length > 0) {
        setErrors(pageErrors);
        if (firstErrorField) {
          const errorElement = document.getElementById(firstErrorField);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return; // Prevent navigation if there are errors
      }
    }
    
    // If validation passes or not needed, proceed with navigation
    setAttemptedNext(false);
    setErrors({});
    onPageChange(nextIndex);
  };

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error for the field when it's changed
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedNext(true);

    let fieldsToValidate;
    if (validatePerPage) {
      // If validatePerPage is true, only validate the current page
      fieldsToValidate = pages[currentPageIndex].fields;
    } else {
      // If validatePerPage is false, validate all pages
      fieldsToValidate = pages.flatMap(page => page.fields);
    }

    const { errors: validationErrors, firstErrorField } = validateFields(fieldsToValidate);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }


    // If validation passes, proceed with form submission
    try {
      await onSubmit(formData);
      setFormData({});
      setErrors({});
      setAttemptedNext(false);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    }
  };
  const renderField = (field) => {
        if (!field.visible) return null;
    
        const isErrorVisible = errors[field.id] && (attemptedNext || formData[field.id] !== undefined);
        
        const commonInputProps = {
          id: field.id,
          className: `w-full p-3 border rounded-lg transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            ${isErrorVisible ? 'border-red-500 bg-red-50' : 'border-gray-300'}`,
          placeholder: field.label,
          defaultValue: field.defaultValue,
          required: field.required,
          disabled: field.enabled === false,
          onChange: (e) => handleFieldChange(field.id, e.target.value),
          value: formData[field.id] || '',
          'aria-invalid': isErrorVisible ? 'true' : 'false',
          'aria-describedby': isErrorVisible ? `${field.id}-error` : undefined
        };
    
        switch (field.type) {
          case "textarea":
            return (
              <textarea
                {...commonInputProps}
                rows={5}
              />
            );
        
          case "checkbox":
            return (
              <div className="space-y-2">
                {field.values?.map((value, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      defaultChecked={field.defaultValue?.includes(value)}
                      required={field.required}
                      disabled={field.enabled === false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.selectedValue = [...(field.selectedValue || []), value];
                        } else {
                          field.selectedValue = (field.selectedValue || []).filter((v) => v !== value);
                        }
                      }}
                    />
                    <span className="text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            );
        
          case "dropdown":
            return (
              <select {...commonInputProps}>
                <option value="" disabled>Select an option</option>
                {field.values?.map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))}
              </select>
            );
        
          case "radio":
            return (
              <div className="space-y-2">
                {field.values?.map((value, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`radio_${field.id}`}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      defaultChecked={field.defaultValue === value}
                      required={field.required}
                      disabled={field.enabled === false}
                      onChange={() => (field.selectedValue = value)}
                    />
                    <span className="text-gray-700">{value}</span>
                  </label>
                ))}
              </div>
            );
        
          case "file":
            return (
              <input
                type="file"
                accept={field.fileType === "all" ? "*" : field.fileType}
                multiple={field.maxFiles > 1}
                className="w-full p-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required={field.required}
                disabled={field.enabled === false}
                onChange={(e) => (field.selectedValue = e.target.value)}
              />
            );
        
          case "dateTime":
            return (
              <input
                type={field.pickerType === "date" ? "date" : field.pickerType === "time" ? "time" : "datetime-local"}
                {...commonInputProps}
              />
            );
        
          case "description":
            return (
              <div
                dangerouslySetInnerHTML={{ __html: field.defaultValue }}
                className="p-4 border rounded-lg bg-gray-50"
              />
            );
        
          case "sectionHeading":
            return (
              <h3
                dangerouslySetInnerHTML={{ __html: field.label }}
                className="text-xl font-bold mb-4"
              />
            );
    
            case 'location':
            return (
              <div>
                <button
                  type="button"
                  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        handleFieldChange(field.id, {
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude
                        });
                      },
                      () => alert('Error fetching location')
                    );
                  }}
                >
                  {field.buttonText}
                </button>
                {formData[field.id] && (
                  <div>
                    Latitude: {formData[field.id].latitude}, Longitude: {formData[field.id].longitude}
                  </div>
                )}
              </div>
            );
    
        
          default:
            return (
              <input
                type={
                  field.type === "email" ? "email" :
                  field.type === "number" ? "number" :
                  field.type === "phone" ? "tel" :
                  field.type === "website" ? "url" :
                  "text"
                }
                {...commonInputProps}
              />
            );
        }
      };

  return (
    <div className="space-y-6">
      <div className={`${isStandalone ? 'max-w-3xl mx-auto mt-8' : ''}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{formName}</h2>
        <div className="text-sm text-gray-500">
          Page {currentPageIndex + 1} of {pages.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {pages[currentPageIndex]?.title || "Untitled Page"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {pages[currentPageIndex]?.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block font-medium text-gray-700">
                  {field.type!='sectionHeading'?field.label:""}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.id] && (attemptedNext || formData[field.id] !== undefined) && (
                  <p id={`${field.id}-error`} className="text-red-500 text-sm mt-1 animate-shake">
                    {errors[field.id]}
                  </p>
                )}
              </div>
            ))}

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => handlePageChange(currentPageIndex - 1)}
                disabled={currentPageIndex === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPageIndex === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>

              {currentPageIndex === pages.length - 1 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Form
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPageIndex + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FormPreview;