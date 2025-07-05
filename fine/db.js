
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: '',
  user: '',
  password: '', 
  database: '',
});
