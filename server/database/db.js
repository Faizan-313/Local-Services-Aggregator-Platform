import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let db;

try {
    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true
    });

    const connection = await db.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
} catch (error) {
    console.error('MySQL connection failed:', error.message);
    process.exit(1); 
}

export default db;
