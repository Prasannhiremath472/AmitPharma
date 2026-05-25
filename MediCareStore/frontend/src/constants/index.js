export const APP_NAME = 'Amit R. Medical';
export const APP_TAGLINE = 'Your Trusted Online Pharmacy';

export const ORDER_STATUSES = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700', icon: '‚è≥' },
  confirmed:  { label: 'Confirmed',  color: 'bg-blue-100 text-blue-700',     icon: '' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-700', icon: 'ô' },
  shipped:    { label: 'Shipped',    color: 'bg-indigo-100 text-indigo-700', icon: '=ö' },
  delivered:  { label: 'Delivered',  color: 'bg-green-100 text-green-700',   icon: '=Ê' },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-700',       icon: 'L' },
  refunded:   { label: 'Refunded',   color: 'bg-orange-100 text-orange-700', icon: '=∞' },
};

export const PAYMENT_METHODS = {
  razorpay: { label: 'Online Payment',    icon: '=≥', description: 'Credit/Debit Card, UPI, Net Banking' },
  cod:      { label: 'Cash on Delivery',  icon: '=µ', description: 'Pay when you receive' },
};

export const SORT_OPTIONS = [
  { value: 'created_at-DESC', label: 'Newest First' },
  { value: 'created_at-ASC',  label: 'Oldest First' },
  { value: 'price-ASC',       label: 'Price: Low to High' },
  { value: 'price-DESC',      label: 'Price: High to Low' },
  { value: 'name-ASC',        label: 'Name: A to Z' },
  { value: 'name-DESC',       label: 'Name: Z to A' },
  { value: 'rating-DESC',     label: 'Top Rated' },
];

export const PRODUCT_CATEGORIES = [
  { name: 'Medicines',            slug: 'medicines',     icon: '=ä', color: '#84cc16' },
  { name: 'Vitamins & Supplements', slug: 'vitamins',   icon: '<?', color: '#22c55e' },
  { name: 'Personal Care',        slug: 'personal-care', icon: '>Ù', color: '#f97316' },
  { name: 'Baby Care',            slug: 'baby-care',     icon: '=v', color: '#ec4899' },
  { name: 'Ayurveda',             slug: 'ayurveda',      icon: '<1', color: '#84cc16' },
  { name: 'Devices',              slug: 'devices',       icon: '>z', color: '#8b5cf6' },
  { name: 'COVID Care',           slug: 'covid-care',    icon: '=7', color: '#ef4444' },
  { name: 'Fitness',              slug: 'fitness',       icon: '=™', color: '#f59e0b' },
];

export const TESTIMONIALS = [
  { id: 1, name: 'Priya Sharma',   role: 'Regular Customer',       text: 'Amit R. Medical has been my go-to pharmacy for over a year. The quality is genuine and delivery is always fast!',              rating: 5, avatar: null },
  { id: 2, name: 'Rajesh Kumar',   role: 'Verified Buyer',          text: 'Excellent service! Got my medicines delivered same day. The prices are much better than local pharmacies.',                    rating: 5, avatar: null },
  { id: 3, name: 'Anita Patel',    role: 'Health Enthusiast',       text: 'The vitamin supplements are authentic and the customer support team is very helpful. Highly recommended!',                    rating: 4, avatar: null },
  { id: 4, name: 'Dr. Suresh Nair', role: 'Medical Professional',   text: 'I recommend Amit R. Medical to my patients. They stock genuine medications and the prescription handling is proper.',          rating: 5, avatar: null },
];

export const FEATURES = [
  { icon: '<∆', title: '100% Genuine',    description: 'All medicines are sourced from authorized distributors' },
  { icon: '=ö', title: 'Fast Delivery',   description: 'Same day delivery available in select cities' },
  { icon: '=ä', title: '50,000+ Products', description: 'Largest selection of healthcare products' },
  { icon: '=', title: 'Secure Payments', description: 'Your payment information is always safe' },
  { icon: '=ﬁ', title: '24/7 Support',    description: 'Expert pharmacists available round the clock' },
  { icon: '©', title: 'Easy Returns',    description: '7-day hassle-free return policy' },
];

export const BRANDS = [
  'Abbott', 'Cipla', 'Sun Pharma', "Dr. Reddy's", 'Himalaya',
  'Dabur', 'Patanjali', 'Mankind', 'Pfizer', 'Zydus',
];

export const STATES_IN = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export const DOSAGE_FORMS = [
  'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment',
  'Drops', 'Inhaler', 'Patch', 'Suppository', 'Powder', 'Gel',
  'Lotion', 'Solution', 'Suspension', 'Other',
];
