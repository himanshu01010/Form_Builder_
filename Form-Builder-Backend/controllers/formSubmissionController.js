import Submission from '../models/ Submission.js'

export const submitForm = async (req, res) => {
  try {
    const { templateId, formData } = req.body;

    const submission = new Submission({ templateId, formData });
    await submission.save();

    res.status(201).json({ message: "Form submitted successfully", submission });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
