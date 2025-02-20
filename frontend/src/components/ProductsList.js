import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductMediaSlider from './ProductMediaSlider';
import './ProductsList.css';
import ServiceList from '../components/services/ServiceList';
import AddServiceForm from './services/AddServiceForm';
const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [services, setServices] = useState([]);

  const handleServiceAdded = (newService) => {
    setServices([...services, newService]);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(products.filter((product) => product._id !== productId));
      alert("Product deleted successfully!");
    } catch (err) {
      setError("Error deleting product");
    }
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setFormVisible(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const { _id, ...updatedProduct } = selectedProduct;
      const response = await axios.put(
        `http://localhost:5000/api/products/${_id}`,
        updatedProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts(products.map((prod) => (prod._id === _id ? response.data : prod)));
      setFormVisible(false);
      alert("Product updated successfully!");
    } catch (err) {
      setError("Error updating product");
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const mediaArray = Array.from(files).map((file) => URL.createObjectURL(file));
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      media: [...prevProduct.media, ...mediaArray],
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list-container">
      <h1>Product List</h1>
      <h1>Service Management</h1>
      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Quantity:</strong> {product.quantity}
              </p>
              <p>
                <strong>Seller:</strong> {product.createdBy ? product.createdBy.name : "Unknown"}
              </p>
              {product.media && product.media.length > 0 && (
                <ProductMediaSlider mediaItems={product.media} />
              )}
              <div className="card-actions">
                <button onClick={() => handleUpdateClick(product)} className="btn-update">
                  Update
                </button>
                <button onClick={() => handleDelete(product._id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {formVisible && (
        <div className="update-form-container">
          <form className="update-form" onSubmit={handleUpdateSubmit}>
            <h2>Update Product</h2>
            <label>Name:</label>
            <input
              type="text"
              value={selectedProduct.name}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
            />

            <label>Description:</label>
            <textarea
              value={selectedProduct.description}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, description: e.target.value })
              }
            />

            <label>Price:</label>
            <input
              type="number"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, price: e.target.value })
              }
            />

            <label>Quantity:</label>
            <input
              type="number"
              value={selectedProduct.quantity}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, quantity: e.target.value })
              }
            />

            <label>Media:</label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />

            <div className="media-preview">
              {selectedProduct.media && selectedProduct.media.length > 0 && (
                selectedProduct.media.map((media, index) => (
                  <div key={index} className="media-item">
                    <img
                      src={media}
                      alt={`Media ${index}`}
                      className="media-thumbnail"
                    />
                  </div>
                ))
              )}
            </div>

            <button type="submit" className="btn-save">
              Save
            </button>
            <button type="button" onClick={() => setFormVisible(false)} className="btn-cancel">
              Cancel
            </button>
          </form>
        
        </div>
      )}
      <AddServiceForm/>
      <ServiceList/>

    </div>
  );
};

export default ProductsList;
