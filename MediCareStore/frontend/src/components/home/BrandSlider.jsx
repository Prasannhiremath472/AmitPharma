import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { BRANDS } from '../../constants';

const BrandSlider = () => {
  return (
    <section className="py-10 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">
          Trusted Brands Available
        </p>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={3}
          spaceBetween={24}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={3000}
          loop={true}
          allowTouchMove={false}
          breakpoints={{
            480: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 7 },
          }}
        >
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <SwiperSlide key={i}>
              <div className="flex items-center justify-center h-14 bg-white rounded-xl border border-slate-100 px-4 shadow-sm">
                <span className="text-slate-600 font-semibold text-sm">{brand}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BrandSlider;
