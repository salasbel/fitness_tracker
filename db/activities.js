const { client } = require("./client");

// createActivity
// createActivity({ name, description })
// return the new activity
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(`
            INSERT INTO activities(name, description)
            VALUES($1, $2)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
            `,
      [name, description]
    );
    return activity;
  } catch (error) {
    throw error;
  }
};


// getAllActivities
// select and return an array of all activities
async function getAllActivities() {
  try {
    const { rows } = await client.query(`
            SELECT * FROM activities;
        `);
    return rows;
  } catch (error) {
    throw error;
  }
};

// getActivityById
// getActivityById(id)
//return the activity
async function getActivityById(activityId) {
    try {
        const { rows: [activity]} = await client.query(`
            SELECT * FROM activities
            WHERE id=${activityId};
        `);
        return activity;
    } catch (error) {
        throw error;
    }
};

// updateActivity
// updateActivity({ id, name, description })
// don't try to update the id
// do update the name and description
// return the updated activity

async function updateActivity(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ activity ] } = await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return activity;
    } catch (error) {
      throw error;
    }
  }

module.exports = {
  createActivity,
  getAllActivities,
  updateActivity
};
