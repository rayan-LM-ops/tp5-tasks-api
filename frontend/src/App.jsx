import { useEffect, useState } from 'react';
import './App.css';


const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errortitle, setErrorTitle] = useState('');
  const [assignee, setAssignee] = useState('');


  // Afficher un message temporaire
  const showMessage = (text, isError = false) => {
    if (isError) {
      setError(text);
      setMessage('');
    } else {
      setMessage(text);
      setError('');
    }

    setTimeout(() => {
      setMessage('');
      setError('');
    }, 3000);
  };

  // GET /tasks
  const loadTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) {
        throw new Error('Impossible de récupérer les tâches.');
      }

      const data = await response.json();

      setTasks(data);
    } catch (error) {
      showMessage(
        'Impossible de contacter l’API. Vérifiez qu’elle est démarrée.',
        true
      );
    }
  };

  // Charger les tâches au démarrage
  useEffect(() => {
    loadTasks();
  }, []);

  // POST /tasks
  const addTask = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    setError('');
    setErrorTitle('');

    // Vérifier que le titre n'est pas vide
    if (!cleanTitle) {
      setErrorTitle('Le titre de la tâche est obligatoire.');
      return;
    }

    // Vérifier la longueur
    if (cleanTitle.length > 255) {
      setErrorTitle(
        'Le titre ne peut pas dépasser 255 caractères.'
      );
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: cleanTitle,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setTitle('');
      setErrorTitle('');

      showMessage('Tâche ajoutée avec succès.');

      // Recharger les tâches
      await loadTasks();
    } catch {
      showMessage(
        'Impossible d’ajouter la tâche.',
        true
      );
    }
  };

  // PATCH /tasks/:id/completed
  const toggleTask = async (task) => {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${task.id}/completed`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completed: !task.completed,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      if (task.completed) {
        showMessage(
          'Tâche marquée comme non complétée.'
        );
      } else {
        showMessage(
          'Tâche marquée comme complétée.'
        );
      }

      // Recharger les tâches
      await loadTasks();
    } catch {
      showMessage(
        'Impossible de modifier l’état de la tâche.',
        true
      );
    }
  };

  // DELETE /tasks/:id
  const deleteTask = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      showMessage('Tâche supprimée avec succès.');

      await loadTasks();
    } catch {
      showMessage(
        'Impossible de supprimer la tâche.',
        true
      );
    }
  };

  // Filtrage des tâches côté React
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'completed') {
      return task.completed === true;
    }

    if (filter === 'pending') {
      return task.completed === false;
    }

    return true;
  });

  return (
    <div className="container">

      <header>
        <h1>Gestionnaire de tâches</h1>
      </header>

      <main>

        {/* Messages */}
        {message && (
          <div
            className="message success"
            role="status"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="message error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form
          onSubmit={addTask}
          className="task-form"
        >
          <div className="form-field">
            <label htmlFor="task-title">
              Titre de la tâche
            </label>

            <input
              id="task-title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              required
              aria-describedby={
                errortitle
                  ? 'title-error'
                  : undefined
              }
            />

            {errortitle && (
              <p
                id="title-error"
                className="field-error"
              >
                {errortitle}
              </p>
            )}
          </div>

          <button type="submit">
            Ajouter la tâche
          </button>
        </form>

        {/* Filtres */}
        <div
          className="filters"
          aria-label="Filtrer les tâches"
        >
          <button
            type="button"
            className={
              filter === 'all'
                ? 'active'
                : ''
            }
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
          >
            Toutes
          </button>

          <button
            type="button"
            className={
              filter === 'completed'
                ? 'active'
                : ''
            }
            onClick={() => setFilter('completed')}
            aria-pressed={filter === 'completed'}
          >
            Complétées
          </button>

          <button
            type="button"
            className={
              filter === 'pending'
                ? 'active'
                : ''
            }
            onClick={() => setFilter('pending')}
            aria-pressed={filter === 'pending'}
          >
            Non complétées
          </button>
        </div>

        {/* Liste des tâches */}
        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <li className="empty">
              Aucune tâche à afficher.
            </li>
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className="task"
              >
                <div className="task-content">

                  <label
                    htmlFor={`task-${task.id}`}
                    className={
                      task.completed
                        ? 'completed'
                        : ''
                    }
                  >
                    <input
                      id={`task-${task.id}`}
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />

                    <span>
                      {task.title}
                    </span>
                  </label>

                </div>

                <div className="actions">
                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Supprimer la tâche ${task.title}`}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

      </main>
    </div>
  );
}

export default App;