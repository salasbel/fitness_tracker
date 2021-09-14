const { client } = require("./client");
const { createInitialUsers } = require("./seedData.js");

const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

// createUser({ username, password })
async function createUser({ username, password }) {
  const hashPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password) 
        VALUES($1, $2) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `,
      [username, hashPassword]
    );

    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
}

// make sure to hash the password before storing it to the database
// getUser

// getUser({ username, password })

// async function getUser({ username, password }) {
//   try {
//     const { rows } = await client.query(
//       `
//         SELECT id, username, password, active
//         FROM users;
//       `,
//       [username, password]
//     );

//     return rows;
//   } catch (error) {
//     throw error;
//   }
// }


// getUserByUsername

// async function getUserByUsername(username) {
//   try {
//     const { rows: username } = await client.query(`
//           SELECT id 
//           FROM users
//         `);

//     if (!username) {
//       return null;
//     }

//     return { user };
//   } catch (error) {
//     throw error;
//   }
// }

// getUserByUsername(username)
// select a user using the user's username. Return the user object.
async function getUserByUsername(username) {
  try {
      const { rows: [ user ]} = await client.query(`
        SELECT * FROM users
        WHERE username='${username}';
      `);
      return user;
  } catch (error) {
      throw error;
  }
};


async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashPassword = user.password;
  try {
      const passwordsMatch = await bcrypt.compare(password, hashPassword);
      if (passwordsMatch) {
          delete user.password;
          return user;
      }
  } catch (error) {
      throw error;
  }
};


// this should be able to verify the password against the hashed password
// getUserById

// getUserById(id)
// select a user using the user's ID. Return the user object.
// do NOT return the password

async function getUserById(id) {
  try {
      const { rows: [user] } = await client.query(`
        SELECT * FROM users
        WHERE id=${id};
      `);
      return user;
  } catch (error) {
      throw error;
  }
};


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
