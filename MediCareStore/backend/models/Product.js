const { query } = require('../config/db');

class Product {
  static async findById(id) {
    const products = await query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);
    return products[0] || null;
  }

  static async findBySlug(slug) {
    const products = await query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
      WHERE p.slug = ? AND p.is_active = 1
      GROUP BY p.id
    `, [slug]);
    return products[0] || null;
  }

  static async getImages(productId) {
    return query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order', [productId]);
  }

  static async getAll({ page = 1, limit = 12, search = '', category = '', minPrice = 0, maxPrice = 999999, sortBy = 'created_at', sortOrder = 'DESC', featured = '', inStock = '' } = {}) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE p.is_active = 1';
    const params = [];

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      whereClause += ' AND (c.slug = ? OR c.id = ?)';
      params.push(category, category);
    }
    if (minPrice) {
      whereClause += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice < 999999) {
      whereClause += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (featured === 'true') {
      whereClause += ' AND p.is_featured = 1';
    }
    if (inStock === 'true') {
      whereClause += ' AND p.stock > 0';
    }

    const validSortFields = { price: 'p.price', name: 'p.name', created_at: 'p.created_at', rating: 'avg_rating' };
    const sortField = validSortFields[sortBy] || 'p.created_at';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const [products, total] = await Promise.all([
      query(`
        SELECT p.*, c.name as category_name, c.slug as category_slug,
               COALESCE(AVG(r.rating), 0) as avg_rating,
               COUNT(DISTINCT r.id) as review_count,
               (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
        ${whereClause}
        GROUP BY p.id
        ORDER BY ${sortField} ${order}
        LIMIT ? OFFSET ?
      `, [...params, parseInt(limit), parseInt(offset)]),
      query(`
        SELECT COUNT(DISTINCT p.id) as count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ${whereClause}
      `, params)
    ]);

    return { products, total: total[0].count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total[0].count / limit) };
  }

  static async create(data) {
    const { name, slug, description, short_description, price, compare_price, cost_price, stock, sku, brand, category_id, is_featured, is_prescription_required, dosage_form, strength, manufacturer, expiry_date, storage_instructions } = data;
    const result = await query(
      `INSERT INTO products (name, slug, description, short_description, price, compare_price, cost_price, stock, sku, brand, category_id, is_featured, is_prescription_required, dosage_form, strength, manufacturer, expiry_date, storage_instructions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, short_description || null, price, compare_price || null, cost_price || null, stock || 0, sku || null, brand || null, category_id, is_featured ? 1 : 0, is_prescription_required ? 1 : 0, dosage_form || null, strength || null, manufacturer || null, expiry_date || null, storage_instructions || null]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const allowed = ['name', 'slug', 'description', 'short_description', 'price', 'compare_price', 'cost_price', 'stock', 'sku', 'brand', 'category_id', 'is_featured', 'is_active', 'is_prescription_required', 'dosage_form', 'strength', 'manufacturer', 'expiry_date', 'storage_instructions'];
    const fields = Object.keys(data).filter(k => allowed.includes(k));
    if (!fields.length) return null;

    const sql = `UPDATE products SET ${fields.map(f => `${f} = ?`).join(', ')}, updated_at = NOW() WHERE id = ?`;
    await query(sql, [...fields.map(f => data[f]), id]);
    return this.findById(id);
  }

  static async delete(id) {
    await query('UPDATE products SET is_active = 0, updated_at = NOW() WHERE id = ?', [id]);
  }

  static async addImage(productId, url, publicId, sortOrder = 0) {
    const result = await query(
      'INSERT INTO product_images (product_id, url, public_id, sort_order) VALUES (?, ?, ?, ?)',
      [productId, url, publicId, sortOrder]
    );
    return result.insertId;
  }

  static async deleteImage(imageId, productId) {
    const images = await query('SELECT * FROM product_images WHERE id = ? AND product_id = ?', [imageId, productId]);
    if (!images.length) return null;
    await query('DELETE FROM product_images WHERE id = ?', [imageId]);
    return images[0];
  }

  static async getFeatured(limit = 8) {
    return query(`
      SELECT p.*, c.name as category_name,
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(DISTINCT r.id) as review_count,
             (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
      WHERE p.is_featured = 1 AND p.is_active = 1
      GROUP BY p.id
      LIMIT ?
    `, [parseInt(limit)]);
  }

  static async getRelated(productId, categoryId, limit = 4) {
    return query(`
      SELECT p.*, (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) as primary_image
      FROM products p
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
      LIMIT ?
    `, [categoryId, productId, parseInt(limit)]);
  }

  static async updateStock(id, quantity) {
    await query('UPDATE products SET stock = stock - ?, updated_at = NOW() WHERE id = ?', [quantity, id]);
  }
}

module.exports = Product;
