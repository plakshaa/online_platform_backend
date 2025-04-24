const express = require('express');
const router = express.Router();
const { authenticateToken, isStudent } = require('../middleware/auth.middleware');
const db = require('../config/database');

// Enroll in a course
router.post('/:courseId', authenticateToken, isStudent, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Check if course exists
    const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const [enrollments] = await db.query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollments.length > 0) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const [result] = await db.query(
      'INSERT INTO enrollments (user_id, course_id, enrollment_date) VALUES (?, ?, NOW())',
      [userId, courseId]
    );

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollmentId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
});

// Get user's enrolled courses
router.get('/my-courses', authenticateToken, async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT c.*, e.enrollment_date, u.name as instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = ?
    `, [req.user.id]);

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
});

// Unenroll from a course
router.delete('/:courseId', authenticateToken, isStudent, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM enrollments WHERE user_id = ? AND course_id = ?',
      [req.user.id, req.params.courseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error unenrolling from course' });
  }
});

module.exports = router; 