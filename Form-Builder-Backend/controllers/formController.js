import Form from '../models/Form.js';

export const getForm = async (req, res) => {
   try {
    const { templateId } = req.params;
    const form = await Form.findOne({ templateId });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.status(200).json({
      fields: form.fields,
      heading: form.heading,
      submitLabel: form.submitLabel,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveForm = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { fields, heading, submitLabel } = req.body; 

    const form = await Form.findOneAndUpdate(
      { templateId },
      { fields, heading, submitLabel }, 
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
