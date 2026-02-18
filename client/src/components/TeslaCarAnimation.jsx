import { useEffect, useRef } from 'react';
import './TeslaCarAnimation.css';

export default function TeslaCarAnimation() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Skip particles on mobile for performance
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        // Create dynamic particles behind the car (reduced rate for perf)
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'car-anim-particle';
            particle.style.top = `${30 + Math.random() * 40}%`;
            particle.style.right = `${5 + Math.random() * 25}%`;
            particle.style.animationDuration = `${1 + Math.random() * 2}s`;
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 3000);
        };

        const interval = setInterval(createParticle, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="tesla-car-anim" ref={containerRef}>
            {/* Road surface */}
            <div className="car-anim-road">
                <div className="car-anim-road-line" />
                <div className="car-anim-road-line delay" />
            </div>

            {/* Underglow */}
            <div className="car-anim-underglow" />

            {/* The Car Image */}
            <img
                className="car-anim-img"
                src="/images/hero/tesla-cyber-car.png"
                alt="Tesla"
                draggable={false}
                loading="lazy"
            />

            {/* Speed lines (behind the car / trailing) */}
            <div className="car-anim-speed-lines">
                <div className="speed-line sl-1" />
                <div className="speed-line sl-2" />
                <div className="speed-line sl-3" />
                <div className="speed-line sl-4" />
                <div className="speed-line sl-5" />
            </div>
        </div>
    );
}
