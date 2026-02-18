import './FilterTabs.css';

export default function FilterTabs({ tabs, active, onChange }) {
    return (
        <div className="filter-tabs">
            {tabs.map(tab => (
                <button
                    key={tab}
                    className={`filter-tab ${active === tab ? 'active' : ''}`}
                    onClick={() => onChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
