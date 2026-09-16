import {
  FaWallet,
  FaShoppingBag,
  FaReceipt,
  FaTags,
  FaCrown,
  FaHeart,
  FaRedoAlt,
  FaFire,
} from "react-icons/fa";

function CustomerSummaryCards({ summary }) {
  const primaryCards = [
    {
      title: "Total Spend",
      value: `₹${Number(
        summary?.total_spent || 0
      ).toLocaleString("en-IN")}`,
      icon: <FaWallet size={22} />,
      bg: "bg-indigo-50/70 border-indigo-100",
      iconBg: "bg-indigo-600",
    },
    {
      title: "Total Orders",
      value: summary?.total_orders || 0,
      icon: <FaShoppingBag size={22} />,
      bg: "bg-emerald-50/70 border-emerald-100",
      iconBg: "bg-emerald-600",
    },
    {
      title: "Average Order Value",
      value: `₹${Number(
        summary?.average_order || 0
      ).toLocaleString("en-IN")}`,
      icon: <FaReceipt size={22} />,
      bg: "bg-amber-50/70 border-amber-100",
      iconBg: "bg-amber-500",
    },
    {
      title: "Categories Explored",
      value: summary?.categories_purchased || 0,
      icon: <FaTags size={22} />,
      bg: "bg-rose-50/70 border-rose-100",
      iconBg: "bg-rose-500",
    },
  ];

  const secondaryCards = [
    {
      title: "Customer Segment",
      value: summary?.customer_segment || "Active Shopper",
      icon: <FaCrown size={20} />,
      bg: "bg-purple-50/70 border-purple-100 text-purple-700",
      iconBg: "bg-purple-600",
    },
    {
      title: "Top Category",
      value: summary?.favorite_category || "N/A",
      icon: <FaHeart size={20} />,
      bg: "bg-blue-50/70 border-blue-100 text-blue-700",
      iconBg: "bg-blue-600",
    },
    {
      title: "Preferred Brand",
      value: summary?.favorite_brand || "N/A",
      icon: <FaFire size={20} />,
      bg: "bg-orange-50/70 border-orange-100 text-orange-700",
      iconBg: "bg-orange-500",
    },
    {
      title: "Repeat Order Rate",
      value: `${summary?.repeat_purchase_rate || 0}%`,
      icon: <FaRedoAlt size={20} />,
      bg: "bg-teal-50/70 border-teal-100 text-teal-700",
      iconBg: "bg-teal-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {primaryCards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} rounded-2xl shadow-sm border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {card.value}
                </h2>
              </div>
              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-md ${card.iconBg}`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {secondaryCards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} rounded-xl border p-4 flex items-center gap-4 transition hover:shadow-sm`}
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ${card.iconBg}`}>
              {card.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 truncate">{card.title}</p>
              <p className="text-sm font-bold text-slate-900 truncate">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerSummaryCards;