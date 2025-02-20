import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const AddService = () => {
  const [serviceData, setServiceData] = useState({
    servicename: "",
    description: "",
    price: "",
    availability: "ouvert",
    state: "à faire",
    createdBy: "60d5f9b6fc13ae456789abcd", // Replace with actual user ID (from auth)
  });

  const [mediaFiles, setMediaFiles] = useState([]);

  // Handle form input change
  const handleChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const onDrop = (acceptedFiles) => {
    setMediaFiles([...mediaFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*,video/*",
    onDrop,
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare form data
    const formData = new FormData();
    formData.append("servicename", serviceData.servicename);
    formData.append("description", serviceData.description);
    formData.append("price", serviceData.price);
    formData.append("availability", serviceData.availability);
    formData.append("state", serviceData.state);
    formData.append("createdBy", serviceData.createdBy);
  
    // Append media files
    mediaFiles.forEach((file) => {
      formData.append("media", file);
    });
  
    try {
      const response = await axios.post("http://localhost:5000/api/services", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("Service added successfully!");
      setServiceData({
        servicename: "",
        description: "",
        price: "",
        availability: "ouvert",
        state: "à faire",
        createdBy: "60d5f9b6fc13ae456789abcd",
      });
      setMediaFiles([]);
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service.");
    }
  };
  

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Service</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Name */}
        <input
          type="text"
          name="servicename"
          value={serviceData.servicename}
          onChange={handleChange}
          placeholder="Service Name"
          required
          className="w-full p-2 border rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          value={serviceData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={serviceData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full p-2 border rounded"
        />

        {/* Availability */}
        <select name="availability" value={serviceData.availability} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="ouvert">Ouvert</option>
          <option value="fermé">Fermé</option>
        </select>

        {/* State */}
        <select name="state" value={serviceData.state} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="à faire">À Faire</option>
          <option value="en cours">En Cours</option>
          <option value="terminé">Terminé</option>
        </select>

        {/* Drag & Drop Media Upload */}
        <div {...getRootProps()} className="border-dashed border-2 p-4 text-center cursor-pointer bg-gray-100 rounded">
          <input {...getInputProps()} />
          <p>Drag & drop images/videos here, or click to select</p>
        </div>

        {/* Preview Uploaded Media */}
        <div className="flex flex-wrap gap-4 mt-2">
          {mediaFiles.map((file, index) => (
            <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
              {file.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video src={URL.createObjectURL(file)} controls className="w-full h-full object-cover"></video>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddService;
