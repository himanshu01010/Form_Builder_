import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FormPreview from "./FormPreview";
import axios from "../api/axios";

const StandaloneFormPreview = () => {
  const { templateId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // Add this state

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`/forms/${templateId}`);
        setFormData(response.data);
        // console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form:", error);
        setLoading(false);
      }
    };

    fetchForm();
  }, [templateId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!formData) {
    return <div className="flex justify-center items-center h-screen">Form not found</div>;
  }
  console.log(formData);

  return (
    <FormPreview
      pages={formData.pages}
      currentPageIndex={currentPageIndex}
      onPageChange={setCurrentPageIndex} // Pass the state updater function
      onSubmit={async (data) => {
        try {
            console.log(data);
          await axios.post(`/forms/${templateId}/submit`, { templateId, formData: data });
          alert("Form submitted successfully!");
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("Error submitting form.");
        }
      }}
      formName={formData.formName}
      validatePerPage={formData.validatePerPage}
      isStandalone={true}
    />
  );
};

export default StandaloneFormPreview;