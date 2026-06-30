import { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutContext'
import { formatDistanceToNow } from 'date-fns'

import WorkoutForm from './WorkoutForm'

const WorkoutDetails = ({ workout }) => {
    const { dispatch } = useWorkoutsContext()
    const [isEditing, setIsEditing] = useState(false)

    const handleClick = async () => {
        const response = await fetch('/api/workouts/' + workout._id, {
            method: 'DELETE'
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_WORKOUT', payload: json})
        }
    }

    if (isEditing) {
        return (
            <div className="workout-details editing">
                <WorkoutForm workout={workout} onDone={() => setIsEditing(false)} />
            </div>
        )
    }

    return (
        <div className="workout-details">
            <h4>{workout.title}</h4>
            <p><strong>Load(kg): </strong>{workout.load}</p>
            <p><strong>Reps: </strong>{workout.reps}</p>
            <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
            <div className="actions">
                <span className="material-symbols-outlined edit" onClick={() => setIsEditing(true)}>edit</span>
                <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            </div>
        </div>
     );
}

export default WorkoutDetails;
