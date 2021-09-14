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
async function updateActivity(activityToUpdate) {

    const id = activityToUpdate.id;

    const setString = Object.keys(activityToUpdate).map(
        (key, index) => `"${key}"=$${index + 1}`,
    ).join(', ');

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [activity] } = await client.query(`
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(activityToUpdate));
        return activity;
    } catch (error) {
        throw error;
    }
};



module.exports = {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity
};
