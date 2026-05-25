import { PAYMENT_METHODS } from '../../constants';

const PaymentOptions = ({ selected, onSelect }) => {
  return (
    <div className="space-y-3">
      {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
        <label
          key={key}
          className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            selected === key
              ? 'border-primary-500 bg-primary-50'
              : 'border-slate-200 hover:border-primary-200'
          }`}
        >
          <input
            type="radio"
            name="payment"
            value={key}
            checked={selected === key}
            onChange={() => onSelect(key)}
            className="mt-0.5 accent-primary-500"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{method.icon}</span>
              <span className="font-semibold text-slate-800 text-sm">{method.label}</span>
              {key === 'razorpay' && (
                <span className="bg-primary-100 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Recommended</span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 ml-7">{method.description}</p>
          </div>
        </label>
      ))}

      {selected === 'razorpay' && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-2">
          <p className="text-xs text-blue-700 font-medium">
            = Secured by Razorpay. Supports UPI, Cards, Net Banking & Wallets.
          </p>
        </div>
      )}

      {selected === 'cod' && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mt-2">
          <p className="text-xs text-amber-700 font-medium">
            💡 Pay with cash when your order is delivered. Available for orders below ₹5,000.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
