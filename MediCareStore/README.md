# 💊 MediCare Store - Full Stack Medical Ecommerce

A production-ready full-stack medical ecommerce application built with React.js, Node.js, Express.js, and MySQL.

## 🚀 Features

- **Authentication**: JWT-based auth with Email OTP verification
- **Role-Based Access**: Admin and User roles
- **Product Management**: Full CRUD with image uploads via Cloudinary
- **Cart & Wishlist**: Real-time cart management
- **Checkout**: Razorpay payment gateway + Cash on Delivery
- **Order Management**: Full order lifecycle tracking
- **Coupon System**: Percentage and fixed discount coupons
- **Review System**: Product reviews with admin approval
- **Admin Dashboard**: Charts, analytics, and management panels
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Animations**: Framer Motion throughout

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS + Framer Motion |
| Sliders | Swiper.js |
| Backend | Node.js + Express.js |
| Database | MySQL 8.0+ |
| Auth | JWT + Email OTP |
| Payment | Razorpay |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer (Gmail SMTP) |

## 📁 Project Structure

```
MediCareStore/
├── frontend/          # React.js application
├── backend/           # Node.js API server
├── database/          # MySQL schema & seed data
├── README.md
└── deployment-guide.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Database Setup
```sql
mysql -u root -p < database/medicarestore.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
# Edit .env with your credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Edit .env with your API URL
npm run dev
```

## 🔑 Default Credentials

- **Admin Email**: admin@medicarestore.com
- **Admin Password**: Admin@123

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/verify-otp | Verify email OTP |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| GET | /api/categories | Get categories |
| POST | /api/cart/add | Add to cart |
| POST | /api/orders | Place order |
| POST | /api/orders/verify-payment | Verify Razorpay payment |
| GET | /api/admin/dashboard | Admin dashboard stats |

## 🔒 Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=medicarestore
JWT_SECRET=your_jwt_secret
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
CLOUDINARY_CLOUD_NAME=your_cloud
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_key_id
```

## 📱 Pages

| Page | Route |
|------|-------|
| Home | / |
| Products | /products |
| Product Details | /products/:id |
| Categories | /categories |
| Cart | /cart |
| Checkout | /checkout |
| Orders | /orders |
| Profile | /profile |
| Admin Dashboard | /admin |
| Admin Products | /admin/products |
| Admin Orders | /admin/orders |

## 🚢 Deployment

See [deployment-guide.md](./deployment-guide.md) for production deployment instructions.

## 📄 License

MIT License - Free to use for personal and commercial projects.
