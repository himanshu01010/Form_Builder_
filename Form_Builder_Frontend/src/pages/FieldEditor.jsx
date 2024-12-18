// import React from "react";
import TextFieldEditor from "../components/TextFieldEditor";
import CheckboxFieldEditor from "../components/CheckboxFieldEditor";
import DropdownFieldEditor from "../components/DropdownFieldEditor";
import RadioFieldEditor from "../components/RadiobuttonEditor";
import ImageFieldEditor from "../components/ImageFieldEditor";
import FileFieldEditor from "../components/FileFieldEditor";
import SectionHeadingEditor from "../components/SectionHeadingEditor";
import DescriptionFieldEditor from "../components/DescriptionFieldEditor";
import DateTimeFieldEditor from "../components/DateTimeFieldEditor";
import StarRatingEditor from "../components/StarRatingEditor";
import PincodeFieldEditor from "../components/PincodeFieldEditor";
import LocationPickerEditor from "../components/LocationPickerEditor";

const FieldEditor = ({ field, onSave, onDelete }) => {
  // console.log("Printing this:",field);
  const renderEditor = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "textarea":
      case "number":
      case "phone":
      case "website":
        return <TextFieldEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "checkbox":
        return <CheckboxFieldEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "dropdown":
        return <DropdownFieldEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "radio":
        return <RadioFieldEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "image":
        return <ImageFieldEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "file":
        return <FileFieldEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "sectionHeading":
        return <SectionHeadingEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "description":
        return <DescriptionFieldEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "dateTime":
        return <DateTimeFieldEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "starRating":
        return <StarRatingEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "pincode":
        return <PincodeFieldEditor field={field} onSave={onSave} onDelete={onDelete} />;
      case "location":
        return <LocationPickerEditor field={field} onSave={onSave} onDelete={onDelete} />;
      default:
        return <div>Unsupported field type</div>;
    }
  };

  return <div>{renderEditor()}</div>;
};

export default FieldEditor;
