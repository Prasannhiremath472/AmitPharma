const Product = require('../models/Product');
const { uploadBuffer } = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { page, limit, search, category, minPrice, maxPrice, sortBy, sortOrder, featured, inStock } = req.query;
    const result = await Product.getAll({ page, limit, search, category, minPrice, maxPrice, sortBy, sortOrder, featured, inStock });

    res.json({
      success: true,
      data: result.products,
      pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const param = req.params.id;
    const isNumeric = /^\d+$/.test(param);
    const product = isNumeric
      ? await Product.findById(param)
      : await Product.findBySlug(param);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const images = await Product.getImages(product.id);
    const related = await Product.getRelated(product.id, product.category_id);

    res.json({ success: true, data: { ...product, images, related } });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.getFeatured(req.query.limit || 8);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch featured products' });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, ...rest } = req.body;

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const productId = await Product.create({ name, slug, ...rest });

    // Handle image upload
    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'medicarestore/products');
      await Product.addImage(productId, result.url, result.publicId, 0);
    }

    const product = await Product.findById(productId);
    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.name && req.body.name !== product.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    }

    const updated = await Product.update(req.params.id, req.body);

    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'medicarestore/products');
      await Product.addImage(req.params.id, result.url, result.publicId, 0);
    }

    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.delete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

// @desc    Upload product image
// @route   POST /api/products/:id/images
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file required' });
    }

    const result = await uploadBuffer(req.file.buffer, 'medicarestore/products');
    const imageId = await Product.addImage(req.params.id, result.url, result.publicId, req.body.sortOrder || 0);

    res.json({ success: true, message: 'Image uploaded successfully', data: { id: imageId, url: result.url } });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
const deleteProductImage = async (req, res) => {
  try {
    const { deleteImage } = require('../config/cloudinary');
    const image = await Product.deleteImage(req.params.imageId, req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    if (image.public_id) {
      await deleteImage(image.public_id).catch(console.error);
    }

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};

module.exports = { getProducts, getProduct, getFeaturedProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, deleteProductImage };
