import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutContext";

const WorkoutForm = ({ workout, onDone }) => {
    const { dispatch } = useWorkoutsContext()
    const isEditing = Boolean(workout)

    const [title, setTitle] = useState(workout ? workout.title : '')
    const [reps, setReps] = useState(workout ? workout.reps : '')
    const [load, setLoad] = useState(workout ? workout.load : '')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        //To prevent refresh
        e.preventDefault()

        const payload = { title, load, reps }

        const url = isEditing ? '/api/workouts/' + workout._id : '/api/workouts'
        const method = isEditing ? 'PATCH' : 'POST'

        const response = await fetch(url, {
            method,
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields || [])
        }
        if (response.ok) {
            setError(null)
            setEmptyFields([])

            if (isEditing) {
                dispatch({ type: 'UPDATE_WORKOUT', payload: json })
                if (onDone) onDone()
            } else {
                setTitle('')
                setReps('')
                setLoad('')
                dispatch({ type: 'CREATE_WORKOUT', payload: json })
            }
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>{isEditing ? 'Edit Workout:' : 'Add a New Workout:'}</h3>

            <label>Exercise Title:</label>
            <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} className={emptyFields.includes('title') ? 'error' : ''} />

            <label>Load(kg):</label>
            <input type="number" onChange={(e) => setLoad(e.target.value)} value={load} className={emptyFields.includes('load') ? 'error' : ''} />

            <label>Reps:</label>
            <input type="number" onChange={(e) => setReps(e.target.value)} value={reps} className={emptyFields.includes('reps') ? 'error' : ''} />

            <button>{isEditing ? 'Save Changes' : 'Add Workout'}</button>
            {isEditing && (
                <button type="button" className="cancel" onClick={onDone}>Cancel</button>
            )}
            {error && <div className="error">{error}</div>}
        </form>
    );
}

export default WorkoutForm;
