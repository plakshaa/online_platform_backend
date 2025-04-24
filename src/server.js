const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await db.query('SELECT 1');
    console.log('Database connection successful');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer(); 