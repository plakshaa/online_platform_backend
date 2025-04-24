const express = require('express');
const router = express.Router();
const { authenticateToken, isStudent } = require('../middleware/auth.middleware');
const db = require('../config/database');

// Mark lesson as completed
router.post('/:lessonId', authenticateToken, isStudent, async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const userId = req.user.id;

    // Check if lesson exists and user is enrolled in the course
    const [lessons] = await db.query(`
      SELECT l.*, e.id as enrollment_id 
      FROM lessons l
      JOIN courses c ON l.course_id = c.id
      JOIN enrollments e ON c.id = e.course_id
      WHERE l.id = ? AND e.user_id = ?
    `, [lessonId, userId]);

    if (lessons.length === 0) {
      return res.status(404).json({ 
        message: 'Lesson not found or not enrolled in the course' 
      });
    }

    // Check if progress already exists
    const [existing] = await db.query(
      'SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?',
      [userId, lessonId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Lesson already completed' });
    }

    // Create progress record
    const [result] = await db.query(
      'INSERT INTO progress (user_id, lesson_id, completed_date) VALUES (?, ?, NOW())',
      [userId, lessonId]
    );

    res.status(201).json({
      message: 'Lesson marked as completed',
      progressId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating progress' });
  }
});

// Get course progress
router.get('/:courseId', authenticateToken, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Get all lessons and completed status
    const [progress] = await db.query(`
      SELECT 
        l.id as lesson_id,
        l.title as lesson_title,
        CASE WHEN p.id IS NOT NULL THEN true ELSE false END as completed,
        p.completed_date
      FROM lessons l
      LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ?
      WHERE l.course_id = ?
      ORDER BY l.order_index
    `, [userId, courseId]);

    // Calculate overall progress
    const totalLessons = progress.length;
    const completedLessons = progress.filter(p => p.completed).length;
    const progressPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    res.json({
      courseId,
      totalLessons,
      completedLessons,
      progressPercentage,
      lessons: progress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

module.exports = router; 