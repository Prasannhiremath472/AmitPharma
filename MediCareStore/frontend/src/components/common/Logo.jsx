/**
 * Logo component  renders the actual logo.jpeg image.
 * The white card background in the image is removed via mix-blend-multiply
 * so the logo text floats naturally over any background.
 *
 * Props:
 *   size    "sm" | "md" | "lg" | "xl"   (default: "md")
 *   dark    bool   on dark backgrounds pass true to invert blend mode
 *   showTagline  bool  show "Your Trusted Pharmacy" beneath (default: false)
 *   className    extra classes on wrapper
 */
const sizeMap = {
  sm: { img: 'h-8 w-8',  text: 'text-base',  sub: 'text-[9px]'  },
  md: { img: 'h-10 w-10', text: 'text-xl',   sub: 'text-[10px]' },
  lg: { img: 'h-14 w-14', text: 'text-2xl',  sub: 'text-xs'     },
  xl: { img: 'h-20 w-20', text: 'text-4xl',  sub: 'text-sm'     },
};

const Logo = ({ size = 'md', dark = false, showTagline = false, className = '' }) => {
  const s = sizeMap[size] ?? sizeMap.md;

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Logo image  mix-blend-multiply removes the white background on light bg */}
      <img
        src="/logo.jpeg"
        alt="Amit R. Medical logo"
        className={`${s.img} object-contain rounded-xl flex-shrink-0`}
        style={{ mixBlendMode: dark ? 'screen' : 'multiply' }}
      />
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-black tracking-tight ${dark ? 'text-white' : 'text-slate-800'} font-heading`}>
          Amit R.<span className="text-primary-500"> Medical</span>
        </span>
        {showTagline && (
          <span className={`${s.sub} font-medium ${dark ? 'text-white/60' : 'text-slate-500'} mt-0.5`}>
            Your Trusted Pharmacy
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
