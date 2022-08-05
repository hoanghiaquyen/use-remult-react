import React, { useEffect, useState } from "react";
import { ErrorInfo } from "remult";
import "./App.css";
import { remult, setAuthToken } from "./common";
import { AuthController } from "./shared/AuthController";
import { Task } from "./shared/Task";
import TaskController from "./shared/TaskController";

const taskRepo = remult.repo(Task);

const fetchTask = async (hideCompleted: boolean) => {
  if (!taskRepo.metadata.apiReadAllowed) {
    return [];
  }
  return await taskRepo.find({
    limit: 20,
    orderBy: { completed: "asc" },
    where: { completed: hideCompleted ? false : undefined },
  });
};

function App() {
  const [tasks, setTasks] = useState<
    Partial<Task & { error?: ErrorInfo<Task> }>[]
  >([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchTask(hideCompleted).then(setTasks);
  }, [hideCompleted]);

  const setAll = async (completed: boolean) => {
    await TaskController.setAll(completed);
    setTasks(await fetchTask(hideCompleted));
  };

  const signIn = async () => {
    try {
      setAuthToken(await AuthController.signIn(username));
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const signOut = () => {
    setAuthToken(null);
    window.location.reload();
  };

  if (!remult.authenticated())
    return (
      <div>
        <p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={signIn}>Sign in</button>
        </p>
      </div>
    );

  return (
    <div className="App">
      <p>
        Hi {remult.user.name} <button onClick={signOut}>Sign out</button>
      </p>
      <input
        type="checkbox"
        checked={hideCompleted}
        onChange={(e) => setHideCompleted(e.target.checked)}
      />{" "}
      Hide Completed
      <hr />
      {tasks.map((task) => {
        const handleChange = (values: Partial<Task>) => {
          setTasks(tasks.map((t) => (t === task ? { ...task, ...values } : t)));
        };

        const saveTask = async () => {
          try {
            const savedTask = await taskRepo.save(task);
            setTasks(tasks.map((t) => (t === task ? savedTask : t)));
          } catch (error: any) {
            console.log(error.message);
            setTasks(tasks.map((t) => (t === task ? { ...task, error } : t)));
          }
        };

        const deleteTask = async () => {
          await taskRepo.delete(task?.id ? task.id : "");
          setTasks(tasks.filter((t) => t !== task));
        };

        return (
          <div key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => handleChange({ completed: e.target.checked })}
            />
            <input
              value={task.title}
              onChange={(e) => handleChange({ title: e.target.value })}
            />
            {task.error?.modelState?.title}
            <button onClick={saveTask}>Save</button>
            <button onClick={deleteTask}>Delete</button>
          </div>
        );
      })}
      <div>
        <button onClick={() => setAll(true)}>Set all as completed</button>
        <button onClick={() => setAll(false)}>Set all as uncompleted</button>
      </div>
    </div>
  );
}

export default App;
