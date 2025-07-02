// fine/db.js
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Xapkib/Mriya2004', 
  database: 'escuela',
});
