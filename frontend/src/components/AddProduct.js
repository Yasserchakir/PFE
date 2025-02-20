import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: 1,
    state: "Available",
    media: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prevProduct) => ({
      ...prevProduct,
      media: [...prevProduct.media, ...files],
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setProduct((prevProduct) => ({
      ...prevProduct,
      media: [...prevProduct.media, ...files],
    }));
  };

  const handleRemoveFile = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      media: prevProduct.media.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      formData.append("state", product.state);
      product.media.forEach((file) => formData.append("media", file));

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");
      setProduct({
        name: "",
        description: "",
        price: "",
        quantity: 1,
        state: "Available",
        media: [],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h2>Add New Product</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        required
        min="0"
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={product.quantity}
        onChange={handleChange}
        min="1"
        required
      />
      <select name="state" value={product.state} onChange={handleChange}>
        <option value="Available">Available</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>

      <div
        className="file-upload"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p>Drag & Drop images or videos here</p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="file-preview">
        {product.media.map((file, index) => (
          <div key={index} className="file-item">
            {file.type.startsWith("image") ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="preview-img"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="preview-video"
              />
            )}
            <button type="button" onClick={() => handleRemoveFile(index)}>
              ✖
            </button>
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProduct;
