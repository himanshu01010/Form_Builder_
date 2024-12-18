import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  formData: { type: Object, required: true }, 
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Submission", submissionSchema);
