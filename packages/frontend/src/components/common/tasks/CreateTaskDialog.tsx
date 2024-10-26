import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Select from 'react-select';
import toast from 'react-hot-toast';

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const [taskData, setTaskData] = useState({
    task_name: '',
    description: '',
    shared_with: [] as number[],
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleOwnerChange = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map(
      (option: { value: number }) => option.value,
    );
    setTaskData((prevData) => ({ ...prevData, shared_with: selectedIds }));
  };

  const createTask = async () => {
    if (!taskData.task_name || !taskData.description || taskData.shared_with.length === 0) {
      toast.error('All fields are required.');
      return;
    }

    try {
      await axios.post('http://localhost:4000/tasks', taskData);
      setTaskData({ task_name: '', description: '', shared_with: [] });
      onTaskCreated();
      onClose();
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('There was an error creating the task.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Task Name
          </label>
          <input
            type="text"
            name="task_name"
            value={taskData.task_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Owners
          </label>
          <Select
            isMulti
            options={users.map((user) => ({
              value: user.id,
              label: user.full_name,
            }))}
            onChange={handleOwnerChange}
            className="w-full border rounded"
            placeholder="Select owners"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={createTask}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskDialog;
