import { Helmet } from 'react-helmet-async';
import PharmHero from '../../components/home/PharmHero';
import SecondaryBanners from '../../components/home/SecondaryBanners';
import ShopByCategory from '../../components/home/ShopByCategory';
import ProductScrollRow from '../../components/home/ProductScrollRow';
import PLUSBanner from '../../components/home/PLUSBanner';
import FeaturedBrands from '../../components/home/FeaturedBrands';
import DealsOfTheDay from '../../components/home/DealsOfTheDay';
import InTheSpotlight from '../../components/home/InTheSpotlight';
import HealthArticles from '../../components/home/HealthArticles';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import Testimonials2 from '../../components/home/Testimonials2';
import SEOContent from '../../components/home/SEOContent';

const SAMPLE_PRODUCTS = [
  { id: 1,  name: 'Shelcal 500mg Strip of 15 Tablets',             mrp: 164,  price: 151,  discount: 8,  emoji: '=Š', category: 'Calcium' },
  { id: 2,  name: 'Evion 400mg Vitamin E Strip of 20 Capsules',    mrp: 90,   price: 86,   discount: 5,  emoji: '<?', category: 'Vitamins' },
  { id: 3,  name: 'Supradyn Daily Multivitamin Strip of 15',       mrp: 69,   price: 68,   discount: 2,  emoji: '=Š', category: 'Vitamins' },
  { id: 4,  name: 'Zincovit Strip of 15 Tablets',                  mrp: 108,  price: 105,  discount: 3,  emoji: '=Š', category: 'Vitamins' },
  { id: 5,  name: 'I Pill Emergency Contraceptive Pill',           mrp: 77,   price: 76,   discount: 2,  emoji: '=Š', category: 'Women Care' },
  { id: 6,  name: 'Durex Extra Time Packet of 10 Condoms',         mrp: 324,  price: 260,  discount: 20, emoji: 'â¤ï¸', category: 'Sexual Wellness' },
  { id: 7,  name: 'Dr. Morepen BG-03 Glucometer Kit (50 Strips)', mrp: 1415, price: 750,  discount: 47, emoji: '>z', category: 'Diabetes' },
  { id: 8,  name: 'Himalaya Ashwagandha Immunity Booster 60 Tabs',mrp: 260,  price: 253,  discount: 3,  emoji: '<?', category: 'Ayurveda' },
  { id: 9,  name: 'Cetaphil Moisturizing Cream 250g',              mrp: 499,  price: 499,  discount: 0,  emoji: '>ô', category: 'Skin Care' },
  { id: 10, name: 'Omron BP Monitor HEM-7120',                     mrp: 2499, price: 2499, discount: 0,  emoji: '>z', category: 'Devices' },
  { id: 11, name: 'Vitamin C 1000mg Effervescent Tablets',         mrp: 299,  price: 265,  discount: 11, emoji: 'ðŸŠ', category: 'Vitamins' },
  { id: 12, name: 'Abzorb Antifungal Powder 120g',                 mrp: 164,  price: 161,  discount: 2,  emoji: '>ô', category: 'Skin Care' },
  { id: 13, name: 'Liveasy Wellness Calcium Magnesium D3 60 Tabs', mrp: 533,  price: 304,  discount: 43, emoji: '=Š', category: 'Vitamins' },
  { id: 14, name: 'Himalaya Partysmart Hangover 5 Gummies',        mrp: 112,  price: 105,  discount: 7,  emoji: '<?', category: 'Wellness' },
  { id: 15, name: 'Cos-IQ Daily Sunscreen SPF 30 PA++++ 30ml',    mrp: 599,  price: 264,  discount: 56, emoji: 'â˜€ï¸', category: 'Skin Care' },
  { id: 16, name: 'Protein Whey Chocolate 1kg',                    mrp: 1299, price: 1299, discount: 0,  emoji: '=ª', category: 'Fitness' },
];

const NEW_LAUNCHES = SAMPLE_PRODUCTS.slice(0, 8);
const TRENDING     = [...SAMPLE_PRODUCTS].reverse().slice(0, 8);
const WELLNESS     = SAMPLE_PRODUCTS.slice(4, 12);

const HomePage = () => (
  <>
    <Helmet>
      <title>Amit R. Medical - Online Pharmacy | Medicines, Vitamins & Healthcare Products</title>
      <meta
        name="description"
        content="Buy genuine medicines, vitamins, supplements & healthcare products online at Amit R. Medical. Best prices, 100% genuine products, fast delivery above â‚¹299. Shop now!"
      />
    </Helmet>

    {/* 1. Hero Slider */}
    <PharmHero />

    {/* 2. Category Banner Strip */}
    <SecondaryBanners />

    {/* 3. Shop by Category */}
    <ShopByCategory />

    {/* 4. New Launches */}
    <ProductScrollRow
      title="New Launches"
      subtitle="Fresh wellness products just for you!"
      products={NEW_LAUNCHES}
      viewAllLink="/products"
    />

    {/* 5. Trending Near You */}
    <div className="bg-gray-50">
      <ProductScrollRow
        title="Trending Near You"
        subtitle="Most popular in your city"
        products={TRENDING}
        viewAllLink="/products"
      />
    </div>

    {/* 6. PLUS Member Banner */}
    <PLUSBanner />

    {/* 7. Wellness Essentials */}
    <ProductScrollRow
      title="Wellness Essentials of the Week"
      subtitle="Supercharge your health & immunity"
      products={WELLNESS}
      viewAllLink="/products"
    />

    {/* 8. Featured Brands */}
    <FeaturedBrands />

    {/* 9. Deals of the Day */}
    <DealsOfTheDay />

    {/* 10. In The Spotlight */}
    <InTheSpotlight />

    {/* 11. Health Articles */}
    <HealthArticles />

    {/* 12. Why Choose Us */}
    <WhyChooseUs />

    {/* 13. Customer Testimonials */}
    <Testimonials2 />

    {/* 14. SEO Content */}
    <SEOContent />
  </>
);

export default HomePage;
