import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const TopProductsChart = ({ data }) => {
    return (
        <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-4">
                Top Selling Products
            </h3>

            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="product_name" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="units_sold"
                        fill="#10B981"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopProductsChart;