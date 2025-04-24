const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');
const db = require('../config/database');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      JOIN users u ON c.instructor_id = u.id
    `);
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      JOIN users u ON c.instructor_id = u.id 
      WHERE c.id = ?
    `, [req.params.id]);

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(courses[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Create course (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const instructor_id = req.user.id;

    const [result] = await db.query(
      'INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)',
      [title, description, instructor_id]
    );

    res.status(201).json({
      message: 'Course created successfully',
      courseId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating course' });
  }
});

// Update course (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const courseId = req.params.id;

    const [result] = await db.query(
      'UPDATE courses SET title = ?, description = ? WHERE id = ?',
      [title, description, courseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating course' });
  }
});

// Delete course (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM courses WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting course' });
  }
});

module.exports = router; 