const AIInsightsCard = ({ insights = [] }) => {

    if (insights.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-5">
                <h3 className="text-lg font-semibold mb-4">
                    AI Marketplace Insights
                </h3>

                <p className="text-slate-500">
                    No insights available.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4">
                AI Marketplace Insights
            </h3>

            {insights.map((item, index) => (
                <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-3 mb-4"
                >
                    <h4 className="font-semibold">
                        {item.title}
                    </h4>

                    <p className="text-gray-600 text-sm">
                        {item.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default AIInsightsCard;