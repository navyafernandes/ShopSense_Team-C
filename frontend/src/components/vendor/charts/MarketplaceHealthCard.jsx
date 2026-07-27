const MarketplaceHealthCard = ({ health = {} }) => {

    const score = health.score ?? 0;
    const status = health.status ?? "Loading";

    return (
        <div className="bg-white rounded-xl shadow p-6 text-center">

            <h3 className="text-lg font-semibold">
                Marketplace Health
            </h3>

            <h1 className="text-5xl font-bold text-green-600 mt-6">
                {score}%
            </h1>

            <p className="mt-3 text-gray-600">
                {status}
            </p>

        </div>
    );
};

export default MarketplaceHealthCard;