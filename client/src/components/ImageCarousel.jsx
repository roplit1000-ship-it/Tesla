import { useState, useRef, useCallback } from 'react';
import './ImageCarousel.css';

export default function ImageCarousel({ images, alt, category }) {
    const [current, setCurrent] = useState(0);
    const touchRef = useRef({ startX: 0, startY: 0 });
    const containerRef = useRef(null);

    const fallbackEmoji = category === 'Vehicles' ? '🚗' :
        category === 'Robotics' ? '🤖' :
            category === 'Tech' ? '📱' :
                category === 'Energy' ? '⚡' :
                    category === 'Software' ? '💻' :
                        category === 'Lifestyle' ? '🎁' : '🔌';

    const count = images?.length || 0;

    const goTo = useCallback((idx) => {
        if (idx < 0) idx = count - 1;
        if (idx >= count) idx = 0;
        setCurrent(idx);
    }, [count]);

    const handleTouchStart = (e) => {
        touchRef.current.startX = e.touches[0].clientX;
        touchRef.current.startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        const dx = e.changedTouches[0].clientX - touchRef.current.startX;
        const dy = e.changedTouches[0].clientY - touchRef.current.startY;
        // Only swipe if horizontal movement > vertical (prevents scroll hijack)
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            if (dx < 0) goTo(current + 1);
            else goTo(current - 1);
        }
    };

    if (!images || images.length === 0) {
        return (
            <div className="img-carousel">
                <div className="img-carousel-fallback">{fallbackEmoji}</div>
            </div>
        );
    }

    return (
        <div
            className="img-carousel"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="img-carousel-track"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {images.map((src, i) => (
                    <div className="img-carousel-slide" key={i}>
                        <img
                            src={src}
                            alt={`${alt} - view ${i + 1}`}
                            loading="lazy"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="img-carousel-fallback" style={{ display: 'none' }}>
                            {fallbackEmoji}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation arrows (desktop) */}
            {count > 1 && (
                <>
                    <button
                        className="img-carousel-arrow img-carousel-prev"
                        onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}
                        aria-label="Previous image"
                    >
                        ‹
                    </button>
                    <button
                        className="img-carousel-arrow img-carousel-next"
                        onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}
                        aria-label="Next image"
                    >
                        ›
                    </button>
                </>
            )}

            {/* Dot indicators */}
            {count > 1 && (
                <div className="img-carousel-dots">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            className={`img-carousel-dot ${i === current ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); goTo(i); }}
                            aria-label={`View image ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
