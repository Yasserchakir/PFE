import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ service, onDelete, onUpdate }) => {
  // Handle image URL creation if service has an image
  let imageUrl = '';
  if (service.image && service.image instanceof Blob) {
    imageUrl = URL.createObjectURL(service.image);
  } else if (service.image) {
    imageUrl = service.image; // Assuming it's already a valid URL
  }

  return (
    <div className="service-card">
      <div className="service-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={service.servicename} />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>
      <div className="service-card-details">
        <h3>{service.servicename}</h3>
        <p>{service.description}</p>
        <p>Price: {service.price}</p>
        <p>Availability: {service.availability}</p>
        <p>State: {service.state}</p>
        <button onClick={() => onUpdate(service)}>Update</button>
        <button onClick={() => onDelete(service._id)}>Delete</button>
      </div>
    </div>
  );
};

export default ServiceCard;