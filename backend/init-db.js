import mysql from 'mysql2/promise';

async function initDB() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'countcat'
    });

    // Disable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    await connection.execute(`DELETE FROM user_roles WHERE user_id = 'test@test.com'`);
    await connection.execute(`DELETE FROM profiles WHERE user_id = 'test@test.com'`);

    const passwordHash = 'password'; // plain text password

    await connection.execute(`
      INSERT INTO profiles (id, user_id, full_name, password_hash) VALUES ('test-id', 'test@test.com', 'Test User', ?)
    `, [passwordHash]);

    await connection.execute(`
      INSERT INTO user_roles (id, user_id, role) VALUES ('test-role', 'test@test.com', 'inventory_manager')
    `);

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Test user recreated successfully (email: test@test.com, password: password)');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) connection.end();
  }
}

initDB();
