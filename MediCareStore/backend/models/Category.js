const { query } = require('../config/db');

class Category {
  static async findById(id) {
    const cats = await query('SELECT * FROM categories WHERE id = ?', [id]);
    return cats[0] || null;
  }

  static async findBySlug(slug) {
    const cats = await query('SELECT * FROM categories WHERE slug = ?', [slug]);
    return cats[0] || null;
  }

  static async getAll({ includeInactive = false } = {}) {
    const where = includeInactive ? '' : 'WHERE c.is_active = 1';
    return query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      ${where}
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `);
  }

  static async getTree() {
    const categories = await this.getAll();
    const tree = [];
    const map = {};

    categories.forEach(cat => {
      map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
      if (cat.parent_id && map[cat.parent_id]) {
        map[cat.parent_id].children.push(map[cat.id]);
      } else {
        tree.push(map[cat.id]);
      }
    });

    return tree;
  }

  static async create(data) {
    const { name, slug, description, image, parent_id, sort_order } = data;
    const result = await query(
      'INSERT INTO categories (name, slug, description, image, parent_id, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, slug, description || null, image || null, parent_id || null, sort_order || 0]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const allowed = ['name', 'slug', 'description', 'image', 'parent_id', 'sort_order', 'is_active'];
    const fields = Object.keys(data).filter(k => allowed.includes(k));
    if (!fields.length) return null;

    const sql = `UPDATE categories SET ${fields.map(f => `${f} = ?`).join(', ')}, updated_at = NOW() WHERE id = ?`;
    await query(sql, [...fields.map(f => data[f]), id]);
    return this.findById(id);
  }

  static async delete(id) {
    await query('UPDATE categories SET is_active = 0 WHERE id = ?', [id]);
  }
}

module.exports = Category;
