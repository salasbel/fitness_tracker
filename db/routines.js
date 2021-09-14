const { client } = require("./client");
const { getUserById } = require("./users");
const {
  getRoutineActivitiesByRoutineId,
  getRoutineActivitiesByRoutine,
} = require("./routine_activities");

// createRoutine
// createRoutine({ creatorId, isPublic, name, goal })
// create and return the new routine
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routines("creatorId", "isPublic", name, goal) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}


async function updateRoutine(routineToUpdate) {
    const id = routineToUpdate.id;
  
    const setString = Object.keys(routineToUpdate)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
  
    if (setString.length === 0) {
      return;
    }
  
    try {
      const {
        rows: [activity],
      } = await client.query(
        `
          UPDATE routines
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
        `,
        Object.values(routineToUpdate)
      );
      return activity;
    } catch (error) {
      throw error;
    }
  }
  
  // destroyRoutine
  // destroyRoutine(id)
  // remove routine from database
  // Make sure to delete all the routine_activities whose routine is the one being deleted.
  async function destroyRoutine(routineId) {
    try {
      await client.query(`
            DELETE FROM routines
            WHERE id=${routineId};
          `);
      const { rows: allRoutineActivities } = await client.query(`
          SELECT *
          FROM routineactivities;`);
  
      await client.query(`
            DELETE FROM routineactivities
            WHERE "routineId"=${routineId};
          `);
  
      const { rows: fewerRoutineActivities } = await client.query(`
          SELECT *
          FROM routineactivities;`);
  
    } catch (error) {
      throw error;
    }
  }

// getRoutineById
// getRoutineById(id)
// return the routine
// async function getRoutineById(routineId) {
//     try {
//         const { rows: [ routine ] } = await client.query(`
//             SELECT * FROM routines
//             WHERE id=${routineId};
//         `);
//         return routineId;
//     } catch (error) {
//         throw error;
//     }
// };

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
          SELECT * FROM routines
          WHERE id=${id};
        `);
    return routine;
  } catch (error) {
    throw error;
  }
}

// updateRoutine
// updateRoutine({ id, isPublic, name, goal })
// Find the routine with id equal to the passed in id
// Don't update the routine id, but do update the isPublic status, name, or goal, as necessary
// Return the updated routine

async function getActivityById(activityId) {
  try {
    const {
      rows: [activity],
    } = await client.query(`
            SELECT * FROM activities
            WHERE id=${activityId};
        `);
    return activity;
  } catch (error) {
    throw error;
  }
}

// getAllRoutines
// select and return an array of all routines, include their activities
// async function getAllRoutines() {
//     try{
//         const {rows: routines} = await client.query(`
//         SELECT *
//         FROM routines
//         `)

//         return routines;
//     } catch(error) {
//         throw error
//     }
// }

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
        SELECT * FROM routines;
        `);
    const routinesWithDataAdded = await addActivityDataToRoutines(routines);
    return routinesWithDataAdded;
  } catch (error) {
    throw error;
  }
}

// getAllPublicRoutines
// select and return an array of public routines, include their activities

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
        SELECT * FROM routines
        WHERE "isPublic"=true;
        `);
    const routinesWithDataAdded = await addActivityDataToRoutines(routines);
    return routinesWithDataAdded;
  } catch (error) {
    throw error;
  }
}

// async function getAllPublicRoutines() {
//     try {
//         const { rows: routines } = await client.query(`
//             SELECT * FROM routines
//             WHERE "isPublic"=true;
//         `);
//     } catch (error) {
//         throw error;
//     }
// };

//getRoutinesWithoutActivities
// select and return an array of all routines
async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
            SELECT * FROM routines;
        `);
    return rows;
  } catch (error) {
    throw error;
    0;
  }
}

async function getAllRoutinesByUser({id}) {
    try {
        const { rows: routines } = await client.query(`
        SELECT * FROM routines
        WHERE "creatorId"=${id};
        `);
        const routinesWithDataAdded = await addActivityDataToRoutines(routines);
        return routinesWithDataAdded;
    } catch (error) {
        throw error;
    }
};


// getPublicRoutinesByUser
// getPublicRoutinesByUser({ username })
// select and return an array of public routines made by user, include their activities

async function getPublicRoutinesByUser({ id }) {
  try {
    const { rows: routines } = await client.query(`
            SELECT * FROM routines
            WHERE "creatorId"=${id}
            AND "isPublic"=true;
        `);
  } catch (error) {
    throw error;
  }
}

// getPublicRoutinesByActivity
// getPublicRoutinesByActivity({ id })
// select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities

// async function getPublicRoutinesByActivity({id}) {
//     try {
//         const { rows: routineIds } = await client.query(`
//         SELECT "routineId" FROM routine_activities
//         WHERE "activityId"=${id};
//         `);

// updateRoutine
// updateRoutine({ id, isPublic, name, goal })
// Find the routine with id equal to the passed in id
// Don't update the routine id, but do update the isPublic status, name, or goal, as necessary
// Return the updated routine



module.exports = {
  createRoutine,
  getRoutineById,
  getActivityById,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getRoutinesWithoutActivities,
  getPublicRoutinesByUser,
  updateRoutine,
  destroyRoutine,
};
