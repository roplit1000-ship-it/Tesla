import './GlassCard.css';

export default function GlassCard({ children, className = '', onClick, style }) {
    return (
        <div
            className={`glass-card ${onClick ? 'glass-card-clickable' : ''} ${className}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
}
