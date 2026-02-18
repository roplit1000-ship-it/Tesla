import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#141417',
                border: '1px solid #1F1F23',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: '0.8rem',
            }}>
                <p style={{ color: '#A1A1AA', marginBottom: 2 }}>{label}</p>
                <p style={{ color: '#F5F5F7', fontWeight: 600 }}>${payload[0].value.toFixed(2)}</p>
            </div>
        );
    }
    return null;
};

export default function ChartWidget({ data, height = 240 }) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F23" />
                <XAxis
                    dataKey="time"
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    axisLine={{ stroke: '#1F1F23' }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={v => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#blueGradient)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
