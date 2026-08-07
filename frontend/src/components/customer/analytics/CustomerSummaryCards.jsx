import {
  FaWallet,
  FaShoppingBag,
  FaReceipt,
  FaTags,
} from "react-icons/fa";

function CustomerSummaryCards({ summary }) {

  const cards = [
    {
      title: "Total Spend",
      value: `₹${Number(
        summary?.total_spent || 0
      ).toLocaleString("en-IN")}`,
      icon: <FaWallet size={24} />,
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-600",
    },
    {
      title: "Orders",
      value: summary?.total_orders || 0,
      icon: <FaShoppingBag size={24} />,
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-600",
    },
    {
      title: "Average Order",
      value: `₹${Number(
        summary?.average_order || 0
      ).toLocaleString("en-IN")}`,
      icon: <FaReceipt size={24} />,
      bg: "bg-amber-50",
      iconBg: "bg-amber-500",
    },
    {
      title: "Categories",
      value: summary?.categories_purchased || 0,
      icon: <FaTags size={24} />,
      bg: "bg-rose-50",
      iconBg: "bg-rose-500",
    },
  ];

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => (

        <div
          key={card.title}
          className={`${card.bg} rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {card.value}
              </h2>

            </div>

            <div
              className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-md ${card.iconBg}`}
            >
              {card.icon}
            </div>

          </div>

        </div>

      ))}

    </div>

  );

}

export default CustomerSummaryCards;