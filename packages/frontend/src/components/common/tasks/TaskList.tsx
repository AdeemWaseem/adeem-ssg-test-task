import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import axios from 'axios';
import CreateTaskDialog from '@/components/common/tasks/CreateTaskDialog';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const TaskList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { isLogin, user: authUser } = useAuthContext();

  useEffect(() => {
    fetchTasks();
  }, [isLogin]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId)); // Update the state to remove the deleted task
      toast.success('The task has been deleted.');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('There was an error deleting the task.');
    }
  };

  return (
    <div className="container mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Good Morning {authUser?.full_name}, Welcome to SSG
      </h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Task List</h2>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
          >
            <FontAwesomeIcon icon="plus" /> Create Task
          </button>
        </div>

        {tasks.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                {/* <th className="px-4 py-3 text-left text-gray-600 font-medium">
                  ID
                </th> */}
                <th className="px-4 py-3 text-left text-gray-600 font-medium">
                  Task Name
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">
                  Shared With
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  {/* <td className="px-4 py-3 text-gray-700">{task.id}</td> */}
                  <td className="px-4 py-3 text-gray-700">{task.task_name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {task.description}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {task.shared_with.map((sharedUser) => (
                        <span
                          key={sharedUser.id}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            String(sharedUser.id) === String(authUser?.id)
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {sharedUser.full_name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 px-3 py-1 rounded"
                    >
                      <FontAwesomeIcon icon="trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 py-10">No tasks available.</p>
        )}
      </div>
      {/* Create Task Dialog */}
      <CreateTaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onTaskCreated={fetchTasks} // Re-fetch tasks on creation
      />
    </div>
  );
};
