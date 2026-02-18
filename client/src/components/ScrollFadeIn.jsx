import { useEffect, useRef, useState } from 'react';

export default function ScrollFadeIn({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) translateZ(0)' : 'translateY(24px) translateZ(0)',
                transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
                willChange: visible ? 'auto' : 'transform, opacity',
            }}
        >
            {children}
        </div>
    );
}
