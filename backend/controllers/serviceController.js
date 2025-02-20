const multer = require("multer");
const Service = require('../models/Service');

// Set up storage and multer configuration
const storage = multer.memoryStorage();  // Store files in memory (or use diskStorage for saving to the server)
const upload = multer({ storage });

// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Error fetching services", error: error.message });
    }
};

// Get a single service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Error fetching service", error: error.message });
    }
};

// Create a new service (with file upload handling)
const createService = async (req, res) => {
    try {
        const { servicename, description, price, availability, state, createdBy } = req.body;

        // Check if required fields are present
        if (!servicename || !description || !price || !availability || !state || !createdBy) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate availability and state enums
        const validAvailability = ["ouvert", "fermé"];
        const validStates = ["à faire", "en cours", "terminé"];

        if (!validAvailability.includes(availability)) {
            return res.status(400).json({ message: "Invalid availability value" });
        }

        if (!validStates.includes(state)) {
            return res.status(400).json({ message: "Invalid state value" });
        }

        // Handle media files (if present)
        const mediaFiles = req.files ? req.files.map(file => file.buffer.toString("base64")) : [];

        // Create and save the new service
        const newService = new Service({
            servicename,
            description,
            price,
            availability,
            state,
            media: mediaFiles,
            createdBy,
        });

        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        console.error("Error creating service:", error);
        res.status(500).json({ message: "Error creating service", error: error.message });
    }
};

// Update a service
const updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: "Error updating service", error: error.message });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id);

        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service", error: error.message });
    }
};

// Export the controller functions
module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
