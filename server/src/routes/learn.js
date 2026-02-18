const express = require('express');
const router = express.Router();

const coursesData = require('../data/courses.json');

router.get('/courses', (req, res) => {
    const overview = coursesData.map(({ lessons, ...course }) => ({
        ...course,
        lessonCount: lessons.length,
    }));
    res.json(overview);
});

router.get('/courses/:id', (req, res) => {
    const course = coursesData.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
});

module.exports = router;
