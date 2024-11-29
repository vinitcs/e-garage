import pool from "../db/db.js";

const resetIdSequence = async () => {
  const queryText = `
     SELECT setval(
      pg_get_serial_sequence('Users', 'id'), 
      coalesce((SELECT MAX(id) FROM Users), 0) + 1, 
      false
    );
    `;

  try {
    await pool.query(queryText);
    console.log("User table id reset to manage sequence!!!");
  } catch (error) {
    console.log("Error while reseting id of the user table ", error);
  }
};

export default resetIdSequence;
