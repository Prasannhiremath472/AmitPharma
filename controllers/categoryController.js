const Category = require('../models/Category');
const { uploadBuffer } = require('../config/cloudinary');

const getCategories = async (req, res) => {
  try {
    const { tree } = req.query;
    const categories = tree === 'true' ? await Category.getTree() : await Category.getAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, parent_id, sort_order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let image = null;

    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'medicarestore/categories');
      image = result.url;
    }

    const id = await Category.create({ name, slug, description, image, parent_id, sort_order });
    const category = await Category.findById(id);
    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const updateData = { ...req.body };
    if (req.body.name) {
      updateData.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'medicarestore/categories');
      updateData.image = result.url;
    }

    const updated = await Category.update(req.params.id, updateData);
    res.json({ success: true, message: 'Category updated successfully', data: updated });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await Category.delete(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
