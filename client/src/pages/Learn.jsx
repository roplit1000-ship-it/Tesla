import { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import ScrollFadeIn from '../components/ScrollFadeIn';
import './Learn.css';

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001`;

const fallbackCoursesData = [
    {
        id: 1, title: 'Tesla Earnings 101', description: 'Understand how Tesla reports financials and what drives its revenue streams.', image: '/images/courses/earnings.png', duration: '5 min', lessonCount: 2, lessons: [
            { id: 1, title: 'Reading the Income Statement', content: 'Tesla\'s income statement reveals three core revenue streams: automotive sales, energy generation and storage, and services. Automotive consistently accounts for over 80% of total revenue.', takeaways: ['Automotive is 80%+ of Tesla revenue', 'Gross margin reflects manufacturing efficiency', 'Revenue growth rate signals demand health'], quiz: { question: 'Which segment accounts for over 80% of Tesla revenue?', options: ['Energy', 'Automotive', 'Services'], answer: 1 } },
            { id: 2, title: 'Cash Flow vs Profit', content: 'Tesla\'s free cash flow often diverges from net income due to massive capital expenditures on new factories and equipment. Understanding operating cash flow minus capex provides a clearer picture of financial health.', takeaways: ['Free cash flow = operating cash flow minus capex', 'Capex is high due to factory buildouts', 'FCF is more telling than net income for growth companies'], quiz: { question: 'What is free cash flow?', options: ['Revenue minus costs', 'Operating cash flow minus capex', 'Net income minus dividends'], answer: 1 } },
        ]
    },
    {
        id: 2, title: 'Time Value of Money', description: 'Learn why a dollar today is worth more than a dollar tomorrow.', image: '/images/courses/time-value.png', duration: '5 min', lessonCount: 2, lessons: [
            { id: 1, title: 'Present vs Future Value', content: 'The time value of money is the foundation of all financial analysis. Money available today is worth more than the same amount in the future because of its potential earning capacity.', takeaways: ['Money today is worth more than money tomorrow', 'Opportunity cost drives time value', 'This principle underpins all valuation models'], quiz: { question: 'Why is $100 today worth more than $100 in a year?', options: ['Inflation only', 'Earning potential and opportunity cost', 'Government regulation'], answer: 1 } },
            { id: 2, title: 'Compounding Growth', content: 'Compounding is the process where investment returns generate their own returns over time. If Tesla grows revenue at 30% annually, $100 becomes $130, then $169, then $220.', takeaways: ['Returns generate their own returns', 'Small rate differences compound into large gaps', 'Tesla\'s growth rate compounds revenue significantly'], quiz: { question: 'What does compounding mean?', options: ['Linear growth over time', 'Returns generating their own returns', 'Fixed interest payments'], answer: 1 } },
        ]
    },
    {
        id: 3, title: 'Margins Explained', description: 'Why profit margins matter more than raw revenue for Tesla investors.', image: '/images/courses/margins.png', duration: '5 min', lessonCount: 1, lessons: [
            { id: 1, title: 'Gross vs Operating vs Net Margin', content: 'Gross margin shows how much Tesla keeps after direct manufacturing costs. Operating margin adds in R&D and other operating expenses. Net margin is the bottom line after interest and taxes.', takeaways: ['Gross margin = revenue minus cost of goods sold', 'Operating margin includes R&D and overhead', 'Automotive gross margin is Tesla\'s key metric'], quiz: { question: 'Which margin is most watched for Tesla?', options: ['Net margin', 'Automotive gross margin', 'EBITDA margin'], answer: 1 } },
        ]
    },
    {
        id: 4, title: 'Delivery Numbers', description: 'How to read Tesla\'s quarterly delivery reports and what they signal.', image: '/images/courses/deliveries.png', duration: '5 min', lessonCount: 1, lessons: [
            { id: 1, title: 'Production vs Deliveries', content: 'Tesla reports both production and delivery numbers quarterly. The gap between them — known as in-transit inventory — can signal demand strength or weakness.', takeaways: ['Production ≠ Deliveries', 'The gap reveals demand signals', 'In-transit inventory is a key watchpoint'], quiz: { question: 'What does a growing gap between production and deliveries suggest?', options: ['Strong demand', 'Potential demand weakness', 'Manufacturing problems'], answer: 1 } },
        ]
    },
    {
        id: 5, title: 'Valuation Basics', description: 'PE ratios, forward multiples, and why Tesla trades at a premium.', image: '/images/courses/valuation.png', duration: '5 min', lessonCount: 2, lessons: [
            { id: 1, title: 'PE Ratio and Forward PE', content: 'The Price-to-Earnings ratio divides stock price by earnings per share. Tesla\'s PE is typically much higher than traditional automakers because the market prices in future growth from AI, robotics, and energy.', takeaways: ['PE = Price / Earnings per share', 'High PE reflects growth expectations', 'Forward PE uses future earnings estimates'], quiz: { question: 'Why does Tesla have a high PE ratio?', options: ['Poor profitability', 'Market pricing in future growth', 'Low stock price'], answer: 1 } },
            { id: 2, title: 'Growth Premium Explained', content: 'Tesla trades at a premium to legacy automakers because its total addressable market extends beyond cars into energy, AI, and robotics.', takeaways: ['TAM extends beyond automotive', 'Growth companies command higher multiples', 'Traditional metrics may not capture full value'], quiz: { question: 'What justifies Tesla\'s premium valuation?', options: ['Current car sales only', 'Expansion into energy, AI, and robotics', 'Dividend payments'], answer: 1 } },
        ]
    },
];

export default function Learn() {
    const [courses, setCourses] = useState(fallbackCoursesData);
    const [activeCourse, setActiveCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(0);
    const [quizAnswer, setQuizAnswer] = useState(null);

    useEffect(() => {
        axios.get(`${API}/api/learn/courses`).then(res => {
            if (res.data?.length) setCourses(res.data);
        }).catch(() => { });
    }, []);

    const openCourse = (id) => {
        axios.get(`${API}/api/learn/courses/${id}`).then(res => {
            setActiveCourse(res.data);
            setActiveLesson(0);
            setQuizAnswer(null);
        }).catch(() => {
            // Fallback: use embedded data
            const found = fallbackCoursesData.find(c => c.id === id);
            if (found) {
                setActiveCourse(found);
                setActiveLesson(0);
                setQuizAnswer(null);
            }
        });
    };

    const lesson = activeCourse?.lessons?.[activeLesson];

    if (activeCourse && lesson) {
        return (
            <div className="learn-page">
                <section className="learn-header">
                    <div className="lesson-view">
                        <button className="lesson-back" onClick={() => { setActiveCourse(null); setQuizAnswer(null); }}>
                            ← Back to Courses
                        </button>

                        <h1>{activeCourse.title}</h1>

                        <div style={{ display: 'flex', gap: 8, margin: '16px 0 24px', flexWrap: 'wrap' }}>
                            {activeCourse.lessons.map((l, i) => (
                                <Button
                                    key={i}
                                    size="sm"
                                    variant={i === activeLesson ? 'primary' : 'secondary'}
                                    onClick={() => { setActiveLesson(i); setQuizAnswer(null); }}
                                >
                                    Lesson {i + 1}
                                </Button>
                            ))}
                        </div>

                        <div className="lesson-content">
                            <h2>{lesson.title}</h2>
                            <p>{lesson.content}</p>

                            <div className="takeaways">
                                <h4>Key Takeaways</h4>
                                {lesson.takeaways.map((t, i) => (
                                    <div className="takeaway-item" key={i}>
                                        <span className="takeaway-check">✓</span>
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {lesson.quiz && (
                            <div className="quiz-section">
                                <h4>{lesson.quiz.question}</h4>
                                {lesson.quiz.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        className={`quiz-option ${quizAnswer !== null ? (i === lesson.quiz.answer ? 'correct' : quizAnswer === i ? 'wrong' : '') : ''}`}
                                        onClick={() => setQuizAnswer(i)}
                                        disabled={quizAnswer !== null}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="learn-page">
            <section className="learn-header">
                <ScrollFadeIn>
                    <h1>Learn</h1>
                    <p>Five-minute courses on Tesla finance, valuation, and fundamentals.</p>
                </ScrollFadeIn>
            </section>

            <section className="learn-body">
                <div className="course-grid">
                    {courses.map((course, i) => (
                        <ScrollFadeIn key={course.id} delay={i * 0.06}>
                            <GlassCard className="course-card" onClick={() => openCourse(course.id)}>
                                <div className="course-card-img">
                                    <img src={course.image} alt={course.title} />
                                    <div className="course-card-overlay">
                                        <span className="course-card-badge">{course.duration}</span>
                                    </div>
                                </div>
                                <div className="course-card-body">
                                    <h3>{course.title}</h3>
                                    <p>{course.description}</p>
                                    <div className="course-meta">
                                        <span>{course.lessonCount} lessons</span>
                                    </div>
                                    <Button size="sm" variant="secondary">Start Course →</Button>
                                </div>
                            </GlassCard>
                        </ScrollFadeIn>
                    ))}
                </div>
            </section>
        </div>
    );
}
