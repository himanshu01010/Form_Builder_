import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  label: { type: String, required: true },
  defaultValue: { type: String },
  required: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  enabled: { type: Boolean, default: true },
  values: { type: [String] }, 
  pickerType: { type: String }, 
  fileType: { type: String }, 
  maxFiles: { type: Number }, 
  starCount: { type: Number }, 
  buttonText: { type: String }, 
});

const pageSchema = new mongoose.Schema({
  fields: [fieldSchema], // Fields specific to the page
  title: { type: String, default: "Untitled Page" }, // Page title
});

const formSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
  formName:{type:String,default:"untiled Form"},
  pages: [pageSchema],
  heading: { type: String, default: "Form Preview" }, // New field for form heading
  submitLabel: { type: String, default: "Submit" }, 
  validatePerPage: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('Form', formSchema);
