const { client } = require('./client');

// addActivityToRoutine
// addActivityToRoutine({ routineId, activityId, count, duration })
// create a new routine_activity, and return it
async function addActivityToRoutine({
    routineId, 
    activityId, 
    count, 
    duration
})  {
    try {
        const { rows: [routine_activity] } = await client.query(`
        INSERT INTRO routine_activities("routineId", "activityId", count, duration)
        VALUES($1, $2, $3, $4)
        RETURNING *;
        `, [routineId, activityId, count, duration]);
            return routine_activity;
    } catch (error) {
        throw error;
    } 
};


// getRoutineActivitiesByRoutine

// getRoutineActivitiesByRoutine({ id })
// select and return an array of all routine_activity records
async function getRoutineActivitiesByRoutine({ id: routineId }) {
    try {
        const { rows } = await client.query(`
            SELECT "activityId" FROM routine_activities 
            WHERE "routineId=${routineId};
        `);
        return rows;
    } catch (error) {
        throw error;
    }
};


async function getRoutineActivitiesByRoutineId(routineId) {
    try {
        const { rows: [routine_activity]} = await client.query(`
            SELECT * FROM routine_activities 
            WHERE "routineId"=${routineId};
        `);
        return routine_activity;
    } catch (error) {
        throw error;
    }
}





// updateRoutineActivity
// updateRoutineActivity({ id, count, duration })
// Find the routine with id equal to the passed in id
// Update the count or duration as necessary

async function updateRoutineActivity ({id, count, duration}) {
    // build the set string
    const setString = Object.keys({id, count, duration}).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ routine_activity ] } = await client.query(`
        UPDATE routine_activity
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values({id, count, duration}));
  
      return routine_activity;
    } catch (error) {
      throw error;
    }
  }

// destroyRoutineActivity
// destroyRoutineActivity(id)
// remove routine_activity from database

module.exports = {
    addActivityToRoutine,
    getRoutineActivitiesByRoutine,
    getRoutineActivitiesByRoutineId,
    updateRoutineActivity
};