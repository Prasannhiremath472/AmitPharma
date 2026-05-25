const { query } = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      recentOrders,
      topProducts,
      ordersByStatus,
      revenueByMonth,
      lowStockProducts
    ] = await Promise.all([
      query('SELECT COUNT(*) as count FROM orders'),
      query("SELECT COALESCE(SUM(final_amount), 0) as total FROM orders WHERE status NOT IN ('cancelled', 'pending')"),
      query('SELECT COUNT(*) as count FROM users WHERE role = "user"'),
      query('SELECT COUNT(*) as count FROM products WHERE is_active = 1'),
      query(`
        SELECT o.order_id, o.final_amount, o.status, o.created_at, u.name as customer_name
        FROM orders o LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC LIMIT 10
      `),
      query(`
        SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.total) as revenue,
               (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) as image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status NOT IN ('cancelled')
        GROUP BY p.id ORDER BY total_sold DESC LIMIT 5
      `),
      query(`
        SELECT status, COUNT(*) as count FROM orders GROUP BY status
      `),
      query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month,
               SUM(final_amount) as revenue, COUNT(*) as orders
        FROM orders
        WHERE status NOT IN ('cancelled', 'pending')
        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
      `),
      query(`
        SELECT id, name, stock, (SELECT url FROM product_images WHERE product_id = products.id ORDER BY sort_order LIMIT 1) as image
        FROM products WHERE is_active = 1 AND stock < 10 ORDER BY stock ASC LIMIT 5
      `)
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders: totalOrders[0].count,
          totalRevenue: parseFloat(totalRevenue[0].total),
          totalUsers: totalUsers[0].count,
          totalProducts: totalProducts[0].count
        },
        recentOrders,
        topProducts,
        ordersByStatus: ordersByStatus.reduce((acc, item) => ({ ...acc, [item.status]: item.count }), {}),
        revenueByMonth,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
};

module.exports = { getDashboardStats };
