import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import ScrollFadeIn from '../components/ScrollFadeIn';
import ImageCarousel from '../components/ImageCarousel';
import PurchaseForm from '../components/PurchaseForm';
import './Marketplace.css';

const categories = [
    { id: 'All', label: 'All Products', icon: '🏠' },
    { id: 'Vehicles', label: 'Vehicles', icon: '🚗' },
    { id: 'Robotics', label: 'Optimus Robots', icon: '🤖' },
    { id: 'Tech', label: 'Phones & Tech', icon: '📱' },
    { id: 'Energy', label: 'Energy', icon: '⚡' },
    { id: 'Accessories', label: 'Accessories', icon: '🔌' },
    { id: 'Software', label: 'Software', icon: '💻' },
    { id: 'Lifestyle', label: 'Lifestyle', icon: '🎁' },
];

/* ── Full product catalog with multi-image arrays ── */
const allProducts = [
    {
        id: 1, name: 'Model S', category: 'Vehicles', conditionTag: 'New', price: '$74,990',
        description: 'Dual Motor AWD, 405-mile range, 0-60 in 3.1s, 17" cinematic display, Autopilot included.',
        images: ['/images/products/model-s.png', '/images/products/model-s-interior.png', '/images/products/model-s-rear.png'],
        specs: { range: '405 mi', topSpeed: '149 mph', acceleration: '3.1s 0-60' },
    },
    {
        id: 2, name: 'Model S Plaid', category: 'Vehicles', conditionTag: 'New', price: '$89,990',
        description: 'Tri Motor AWD, 1,020 hp, 396-mile range, 0-60 in 1.99s. The fastest accelerating production car.',
        images: ['/images/products/model-s-plaid.png', '/images/products/model-s-interior.png', '/images/products/model-s-rear.png'],
        specs: { range: '396 mi', topSpeed: '200 mph', acceleration: '1.99s 0-60' },
    },
    {
        id: 3, name: 'Model 3', category: 'Vehicles', conditionTag: 'New', price: '$38,990',
        description: 'Rear-Wheel Drive, 272-mile range, 0-60 in 5.8s. Tesla\'s most affordable sedan with premium tech.',
        images: ['/images/products/model-3.png', '/images/products/model-3-interior.png'],
        specs: { range: '272 mi', topSpeed: '125 mph', acceleration: '5.8s 0-60' },
    },
    {
        id: 4, name: 'Model 3 Long Range', category: 'Vehicles', conditionTag: 'New', price: '$45,990',
        description: 'Dual Motor AWD, 358-mile range, 0-60 in 4.2s, refreshed Highland interior with ambient lighting.',
        images: ['/images/products/model-3-lr.png', '/images/products/model-3-interior.png'],
        specs: { range: '358 mi', topSpeed: '145 mph', acceleration: '4.2s 0-60' },
    },
    {
        id: 5, name: 'Model X', category: 'Vehicles', conditionTag: 'New', price: '$79,990',
        description: 'Dual Motor AWD, falcon wing doors, 348-mile range, seating for up to 7, 17" display.',
        images: ['/images/products/model-x.png', '/images/products/model-s-interior.png'],
        specs: { range: '348 mi', topSpeed: '155 mph', acceleration: '3.8s 0-60' },
    },
    {
        id: 6, name: 'Model X Plaid', category: 'Vehicles', conditionTag: 'New', price: '$94,990',
        description: 'Tri Motor AWD, 1,020 hp, falcon wing doors, 0-60 in 2.5s. The ultimate SUV performance.',
        images: ['/images/products/model-x-plaid.png', '/images/products/model-s-interior.png'],
        specs: { range: '326 mi', topSpeed: '163 mph', acceleration: '2.5s 0-60' },
    },
    {
        id: 7, name: 'Model Y', category: 'Vehicles', conditionTag: 'New', price: '$36,990',
        description: 'Rear-Wheel Drive, 260-mile range, panoramic glass roof, 76 cu ft cargo. World\'s best-selling car.',
        images: ['/images/products/model-y.png', '/images/products/model-3-interior.png'],
        specs: { range: '260 mi', topSpeed: '135 mph', acceleration: '6.5s 0-60' },
    },
    {
        id: 8, name: 'Model Y Long Range AWD', category: 'Vehicles', conditionTag: 'New', price: '$44,990',
        description: 'Dual Motor AWD, 330-mile range, 0-60 in 4.8s, premium connectivity, tow package available.',
        images: ['/images/products/model-y-lr.png', '/images/products/model-3-interior.png'],
        specs: { range: '330 mi', topSpeed: '135 mph', acceleration: '4.8s 0-60' },
    },
    {
        id: 9, name: 'Cybertruck AWD', category: 'Vehicles', conditionTag: 'New', price: '$79,990',
        description: 'Dual Motor AWD, stainless steel exoskeleton, armor glass, 340-mile range, 11,000 lb towing.',
        images: ['/images/products/cybertruck.png'],
        specs: { range: '340 mi', topSpeed: '112 mph', acceleration: '4.1s 0-60' },
    },
    {
        id: 10, name: 'Cybertruck Cyberbeast', category: 'Vehicles', conditionTag: 'Limited', price: '$99,990',
        description: 'Tri Motor AWD, 845 hp, 0-60 in 2.6s, 320-mile range. The ultimate Cybertruck configuration.',
        images: ['/images/products/cyberbeast.png'],
        specs: { range: '320 mi', topSpeed: '130 mph', acceleration: '2.6s 0-60' },
    },
    {
        id: 11, name: 'Tesla Semi', category: 'Vehicles', conditionTag: 'Limited', price: '$150,000',
        description: 'Class 8 electric truck, 500-mile range, 0-60 in 20s (loaded), Megacharger compatible.',
        images: ['/images/products/semi.png'],
        specs: { range: '500 mi', payload: '82,000 lbs', acceleration: '20s loaded' },
    },
    {
        id: 12, name: 'Tesla Roadster', category: 'Vehicles', conditionTag: 'Limited', price: '$200,000',
        description: 'Next-gen all-electric supercar. 620-mile range, 0-60 in 1.9s, 250+ mph top speed.',
        images: ['/images/products/roadster.png'],
        specs: { range: '620 mi', topSpeed: '250+ mph', acceleration: '1.9s 0-60' },
    },
    {
        id: 13, name: 'Optimus Gen 1', category: 'Robotics', conditionTag: 'New', price: '$20,000',
        description: 'Tesla\'s humanoid robot. 5\'8", 125 lbs, 40+ DOF, AI-powered vision and navigation.',
        images: ['/images/products/optimus.png'],
        specs: { height: '5\'8"', weight: '125 lbs', battery: '2.3 kWh' },
    },
    {
        id: 14, name: 'Optimus Gen 2', category: 'Robotics', conditionTag: 'Limited', price: '$25,000',
        description: 'Next-gen humanoid robot. 30% faster, 10 kg lighter, Tesla-designed actuators, 11 DOF hands.',
        images: ['/images/products/optimus-gen2.png'],
        specs: { height: '5\'8"', weight: '115 lbs', battery: '2.3 kWh' },
    },
    {
        id: 15, name: 'Optimus Home Edition', category: 'Robotics', conditionTag: 'New', price: '$18,000',
        description: 'Consumer variant optimized for household tasks. Cooking, cleaning, laundry, and companionship.',
        images: ['/images/products/optimus-home.png'],
        specs: { height: '5\'8"', weight: '120 lbs', battery: 'All-day' },
    },
    {
        id: 16, name: 'Tesla Phone Model Pi', category: 'Tech', conditionTag: 'New', price: '$1,199',
        description: '6.7" AMOLED, Snapdragon 8 Gen 3, Starlink connectivity, solar charging, vehicle integration.',
        images: ['/images/products/phone.png'],
        specs: { display: '6.7" AMOLED', chip: 'SD 8 Gen 3', storage: '256 GB' },
    },
    {
        id: 17, name: 'Tesla Phone Model Pi Pro', category: 'Tech', conditionTag: 'Limited', price: '$1,499',
        description: '6.9" AMOLED 120Hz, 512 GB, Neuralink pairing-ready, crypto mining, astrophotography mode.',
        images: ['/images/products/phone-pro.png'],
        specs: { display: '6.9" AMOLED', chip: 'SD 8 Gen 3+', storage: '512 GB' },
    },
    {
        id: 18, name: 'Powerwall 3', category: 'Energy', conditionTag: 'New', price: '$9,200',
        description: '13.5 kWh home battery, 11.5 kW continuous, solar integration, whole-home backup, storm watch.',
        images: ['/images/products/powerwall.png'],
        specs: { capacity: '13.5 kWh', power: '11.5 kW', warranty: '10 years' },
    },
    {
        id: 19, name: 'Megapack', category: 'Energy', conditionTag: 'New', price: '$1,700,000',
        description: 'Commercial-scale battery storage. 3.9 MWh capacity, integrated inverter, 20-year lifespan.',
        images: ['/images/products/megapack.png'],
        specs: { capacity: '3.9 MWh', power: '1.9 MW', warranty: '20 years' },
    },
    {
        id: 20, name: 'Solar Roof', category: 'Energy', conditionTag: 'New', price: 'From $35,000',
        description: 'Architectural glass solar tiles replacing your entire roof. 25-year tile + performance warranty.',
        images: ['/images/products/solar-roof.png'],
        specs: { warranty: '25 years', output: 'Up to 14 kW', style: 'Textured glass' },
    },
    {
        id: 21, name: 'Solar Panel System', category: 'Energy', conditionTag: 'New', price: 'From $12,000',
        description: 'Traditional solar panels, 340W per panel, low-profile design, integrated Powerwall support.',
        images: ['/images/products/solar-panel.png'],
        specs: { perPanel: '340W', warranty: '25 years', type: 'Monocrystalline' },
    },
    {
        id: 22, name: 'Wall Connector Gen 3', category: 'Accessories', conditionTag: 'New', price: '$475',
        description: 'Up to 48 amps, 11.5 kW, Wi-Fi enabled, power sharing, sleek indoor/outdoor design.',
        images: ['/images/products/wall-connector.png'],
        specs: { power: '11.5 kW', cord: '24 ft', connectivity: 'Wi-Fi' },
    },
    {
        id: 23, name: 'Mobile Connector', category: 'Accessories', conditionTag: 'New', price: '$200',
        description: 'Portable charging solution, NEMA 14-50 adapter included, 32A / 7.7 kW, fits any outlet.',
        images: ['/images/products/mobile-connector.png'],
        specs: { power: '7.7 kW', cord: '20 ft', adapter: 'NEMA 14-50' },
    },
    {
        id: 24, name: 'Tesla Wireless Charging Platform', category: 'Accessories', conditionTag: 'New', price: '$300',
        description: 'FreePower technology, charges up to 3 devices simultaneously, premium aluminum finish.',
        images: ['/images/products/charger.png'],
        specs: { devices: '3 simultaneous', material: 'Aluminum', type: 'Qi2' },
    },
    {
        id: 25, name: 'Full Self-Driving (FSD)', category: 'Software', conditionTag: 'New', price: '$8,000',
        description: 'Software upgrade. Navigate on Autopilot, Auto Lane Change, Autopark, Smart Summon, city driving.',
        images: ['/images/products/fsd.png'],
        specs: { type: 'OTA Upgrade', includes: 'City Streets', subscription: '$99/mo' },
    },
    {
        id: 26, name: 'Premium Connectivity', category: 'Software', conditionTag: 'New', price: '$9.99/mo',
        description: 'Satellite-view maps, live traffic, video streaming, music streaming, internet browser in-car.',
        images: ['/images/products/premium-connect.png'],
        specs: { type: 'Subscription', streaming: 'Yes', traffic: 'Live' },
    },
    {
        id: 27, name: 'Cybertruck Matte Black Wrap', category: 'Accessories', conditionTag: 'Limited', price: '$2,500',
        description: 'Factory-authorized matte black vinyl wrap, precision-cut panels, professional installation.',
        images: ['/images/products/wrap-kit.png'],
        specs: { material: '3M Vinyl', finish: 'Matte Black', install: 'Professional' },
    },
    {
        id: 28, name: 'Tesla Tequila', category: 'Lifestyle', conditionTag: 'Limited', price: '$250',
        description: 'Limited edition Tesla-shaped lightning bolt bottle. Premium small-batch añejo tequila.',
        images: ['/images/products/tequila.png'],
        specs: { volume: '750 ml', type: 'Añejo', edition: 'Limited' },
    },
    {
        id: 29, name: 'Cyberquad for Kids', category: 'Lifestyle', conditionTag: 'New', price: '$1,900',
        description: 'All-electric ATV for kids. 15 mph top speed, adjustable speed limiter, steel frame, LED lights.',
        images: ['/images/products/cyberquad.png'],
        specs: { speed: '15 mph', range: '15 mi', ages: '8+' },
    },
    {
        id: 30, name: 'Cyberwhistle', category: 'Lifestyle', conditionTag: 'Limited', price: '$50',
        description: 'Premium collectible whistle inspired by Cybertruck. Medical-grade stainless steel, polished finish.',
        images: ['/images/products/cyberwhistle.png'],
        specs: { material: 'Stainless Steel', finish: 'Polished', type: 'Collectible' },
    },
];

export default function Marketplace() {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const filtered = allProducts.filter(p => {
        const matchCategory = filter === 'All' || p.category === filter;
        const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const categoryCounts = {};
    allProducts.forEach(p => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleAction = (product) => {
        setSelectedProduct(product);
    };

    return (
        <div className="marketplace-page">
            {/* Hero */}
            <section className="mp-hero">
                <div className="mp-hero-bg" />
                <div className="mp-hero-content">
                    <ScrollFadeIn>
                        <span className="mp-hero-badge">Tesla Product Catalog</span>
                        <h1 className="mp-hero-title">
                            Explore Every <span>Tesla Product</span>
                        </h1>
                        <p className="mp-hero-subtitle">
                            From vehicles to robots, energy solutions to lifestyle — discover the full Tesla ecosystem.
                        </p>
                        <div className="mp-hero-stats">
                            <div className="mp-hero-stat">
                                <span className="mp-hero-stat-value">{allProducts.length}</span>
                                <span className="mp-hero-stat-label">Products</span>
                            </div>
                            <div className="mp-hero-stat">
                                <span className="mp-hero-stat-value">{Object.keys(categoryCounts).length}</span>
                                <span className="mp-hero-stat-label">Categories</span>
                            </div>
                            <div className="mp-hero-stat">
                                <span className="mp-hero-stat-value">2026</span>
                                <span className="mp-hero-stat-label">Catalog</span>
                            </div>
                        </div>
                    </ScrollFadeIn>
                </div>
            </section>

            {/* Search + Filter Bar */}
            <section className="mp-filters">
                <div className="mp-search-wrap">
                    <svg className="mp-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        className="mp-search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="mp-category-pills">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`mp-pill ${filter === cat.id ? 'active' : ''}`}
                            onClick={() => setFilter(cat.id)}
                        >
                            <span className="mp-pill-icon">{cat.icon}</span>
                            <span>{cat.label}</span>
                            {cat.id !== 'All' && categoryCounts[cat.id] && (
                                <span className="mp-pill-count">{categoryCounts[cat.id]}</span>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Results count */}
            <section className="mp-results-bar">
                <span className="mp-results-count">
                    {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
                </span>
            </section>

            {/* Product Grid */}
            <section className="mp-body">
                <div className="mp-grid">
                    {filtered.map((product, i) => (
                        <ScrollFadeIn key={product.id} delay={i * 0.03}>
                            <GlassCard className="mp-card">
                                <div className="mp-card-img">
                                    <ImageCarousel
                                        images={product.images}
                                        alt={product.name}
                                        category={product.category}
                                    />
                                    <span className={`mp-tag ${product.conditionTag}`}>
                                        {product.conditionTag}
                                    </span>
                                </div>
                                <div className="mp-card-body">
                                    <span className="mp-card-category">{product.category}</span>
                                    <h3 className="mp-card-name">{product.name}</h3>
                                    <p className="mp-card-desc">{product.description}</p>

                                    {product.specs && (
                                        <div className="mp-specs">
                                            {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                                                <div className="mp-spec" key={key}>
                                                    <span className="mp-spec-val">{val}</span>
                                                    <span className="mp-spec-key">{key}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mp-card-footer">
                                        <span className="mp-price">{product.price}</span>
                                        <button className="mp-order-btn" onClick={() => handleAction(product)}>
                                            {product.price.includes('/mo') ? 'Subscribe' :
                                                product.price.startsWith('From') ? 'Configure' : 'Order Now'}
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </ScrollFadeIn>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="mp-empty">
                        <div className="mp-empty-icon">🔍</div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or category filter</p>
                    </div>
                )}
            </section>

            {/* Purchase Form Modal */}
            {selectedProduct && (
                <PurchaseForm
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}
