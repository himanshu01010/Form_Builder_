
import {
  Type,
  CheckSquare,
  List,
  Radio,
  Upload,
  Calendar,
  Star,
  MapPin,
  Hash,
  AlignLeft,
  Heading,
} from "lucide-react";

const FIELD_TYPES = [
  { type: "text", label: "Text Field", icon: <Type /> },
  { type: "checkbox", label: "Checkbox", icon: <CheckSquare /> },
  { type: "dropdown", label: "Dropdown", icon: <List /> },
  { type: "radio", label: "Radio Buttons", icon: <Radio /> },
  { type: "file", label: "File Upload", icon: <Upload /> },
  { type: "sectionHeading", label: "Section Heading", icon: <Heading /> },
  { type: "description", label: "Description", icon: <AlignLeft /> },
  { type: "dateTime", label: "Date & Time Picker", icon: <Calendar /> },
  { type: "starRating", label: "Star Rating", icon: <Star /> },
  { type: "pincode", label: "Pincode", icon: <Hash /> },
  { type: "location", label: "Location Picker", icon: <MapPin /> },
];

const FieldTypes = ({ onDragStart }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Field Types</h2>
      {FIELD_TYPES.map((field) => (
        <div
          key={field.type}
          draggable
          onDragStart={() => onDragStart(field.type)}
          className="flex items-center bg-white p-2 mb-2 rounded cursor-move border hover:border-blue-500"
        >
          {field.icon}
          <span className="ml-2">{field.label}</span>
        </div>
      ))}
    </div>
  );
};

export default FieldTypes;
