import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const RevenueLineChart = ({ data }) => {
    return (
        <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-4">
                Revenue Trend
            </h3>

            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueLineChart;