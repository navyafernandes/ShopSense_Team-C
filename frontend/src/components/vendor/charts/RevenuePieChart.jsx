import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
];

const RevenuePieChart = ({ data }) => {
    return (
        <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-4">
                Revenue by Category
            </h3>

            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="revenue"
                        nameKey="category"
                        outerRadius={100}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={
                                    COLORS[
                                        index % COLORS.length
                                    ]
                                }
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenuePieChart;