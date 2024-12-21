import Form from '../models/Form.js';

export const getForm = async (req, res) => {
  try {
    const { templateId } = req.params;
    const form = await Form.findOne({ templateId });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.status(200).json({
      formName:form.formName,
      pages: form.pages,
      heading: form.heading,
      submitLabel: form.submitLabel,
      validatePerPage:form.validatePerPage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const saveForm = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { pages, heading, submitLabel,validatePerPage,formName } = req.body;

    const form = await Form.findOneAndUpdate(
      { templateId },
      { pages, heading, submitLabel,validatePerPage ,formName},
      { new: true, upsert: true }
    );

    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteForm = async (req, res) => {
  try {
    const { templateId } = req.params;
    await Form.findOneAndDelete({ templateId });
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePage = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { pageIndex } = req.body;

    // Fetch the form by templateId
    const form = await Form.findOne({ templateId });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Check if the pageIndex is valid
    if (pageIndex < 0 || pageIndex >= form.pages.length) {
      return res.status(400).json({ message: "Invalid page index" });
    }

    // Remove the page
    form.pages.splice(pageIndex, 1);

    // Save the updated form
    await form.save();

    res.status(200).json({ message: "Page deleted successfully", pages: form.pages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

