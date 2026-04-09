const Organization = require('../models/Organization');

// Get all organizations
const getOrganizations = async (req, res) => {
    try {
        const query = req.query.admin === 'true' ? {} : { isActive: true };
        const orgs = await Organization.find(query).sort({ order: 1, date: -1 });
        res.status(200).json(orgs);
    } catch (error) {
        res.status(500).json({ message: 'Organizasyonlar listelenirken hata oluştu.', error: error.message });
    }
};

// Get single organization by slug
const getOrganizationBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const org = await Organization.findOne({ slug });
        if (!org) {
            return res.status(404).json({ message: 'Organizasyon bulunamadı.' });
        }
        res.status(200).json(org);
    } catch (error) {
        res.status(500).json({ message: 'Detaylar getirilirken hata oluştu.', error: error.message });
    }
};

// Create organization
const createOrganization = async (req, res) => {
    try {
        const { title, description, mainImage, gallery, location, date, order, isActive } = req.body;
        
        const newOrg = new Organization({
            title,
            description,
            mainImage,
            gallery,
            location,
            date,
            order,
            isActive
        });

        await newOrg.save();
        res.status(201).json(newOrg);
    } catch (error) {
        res.status(500).json({ message: 'Organizasyon eklenirken hata oluştu.', error: error.message });
    }
};

// Update organization
const updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedOrg = await Organization.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedOrg) {
            return res.status(404).json({ message: 'Organizasyon bulunamadı.' });
        }

        res.status(200).json(updatedOrg);
    } catch (error) {
        res.status(500).json({ message: 'Güncelleme sırasında hata oluştu.', error: error.message });
    }
};

// Delete organization
const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrg = await Organization.findByIdAndDelete(id);
        
        if (!deletedOrg) {
            return res.status(404).json({ message: 'Organizasyon bulunamadı.' });
        }

        res.status(200).json({ message: 'Organizasyon silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Silme işlemi sırasında hata oluştu.', error: error.message });
    }
};

module.exports = {
    getOrganizations,
    getOrganizationBySlug,
    createOrganization,
    updateOrganization,
    deleteOrganization
};
