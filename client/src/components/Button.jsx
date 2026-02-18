import './Button.css';

export default function Button({ children, variant = 'primary', size = '', className = '', onClick, type = 'button', full }) {
    const classes = [
        'btn',
        `btn-${variant}`,
        size && `btn-${size}`,
        full && 'btn-full',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button className={classes} onClick={onClick} type={type}>
            {children}
        </button>
    );
}
