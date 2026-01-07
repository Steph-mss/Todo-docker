import { useState, useEffect } from 'react'
import './App.css'

// Configuration de l'URL de l'API
// En production: utilise VITE_API_URL défini au build time
// En développement: utilise le proxy Vite (/api)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('🔗 API URL configurée:', API_URL);

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Récupérer les tâches au montage du composant
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/tasks`)
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
      console.error('❌ Erreur lors de la récupération des tâches:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      setError(null)
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask })
      })
      
      if (!response.ok) throw new Error('Failed to create task')
      
      const task = await response.json()
      setTasks([task, ...tasks])
      setNewTask('')
    } catch (err) {
      setError(err.message)
      console.error('Error creating task:', err)
    }
  }

  const toggleTask = async (id, completed) => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      })
      
      if (!response.ok) throw new Error('Failed to update task')
      
      const updatedTask = await response.json()
      setTasks(tasks.map(task => task.id === id ? updatedTask : task))
    } catch (err) {
      setError(err.message)
      console.error('Error updating task:', err)
    }
  }

  const deleteTask = async (id) => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete task')
      
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting task:', err)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>✨ Todo App</h1>
          <p>Gérez vos tâches avec style</p>
        </header>

        <div className="task-form">
          <form onSubmit={addTask}>
            <div className="form-group">
              <input
                type="text"
                className="task-input"
                placeholder="Ajouter une nouvelle tâche..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                disabled={loading}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || !newTask.trim()}
              >
                ➕ Ajouter
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ Erreur: {error}
          </div>
        )}

        <div className="tasks-container">
          <div className="tasks-header">
            <h2>Mes Tâches</h2>
            <span className="task-count">
              {tasks.length} {tasks.length > 1 ? 'tâches' : 'tâche'}
            </span>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Chargement...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>Aucune tâche</h3>
              <p>Commencez par ajouter votre première tâche !</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                  />
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    <div className="task-date">
                      {formatDate(task.created_at)}
                    </div>
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => deleteTask(task.id)}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
