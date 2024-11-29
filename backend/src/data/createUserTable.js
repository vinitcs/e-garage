import pool from "../db/db.js";

const createUserTable = async () => {
  const queryText = `
     CREATE TABLE IF NOT EXISTS Users(
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(100) NOT NULL,
     feedback VARCHAR(100),
     created_at TIMESTAMP DEFAULT NOW()
)
`;

  try {
    pool.query(queryText);
    console.log("User table created if not exists!!!");
  } catch (error) {
    console.log("Error while creating the user table ", error);
  }
};

export default createUserTable;
