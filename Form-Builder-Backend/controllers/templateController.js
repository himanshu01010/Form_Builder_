import Template from '../models/Template.js';

export const createTemplate = async (req, res) => {
  try {
    const template = new Template();
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await Template.findByIdAndDelete(id);
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body; 
    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      { name },
      { new: true } 
    );
    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(updatedTemplate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};