// Define the structure of your Task and User
interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
}

interface Task {
  id: number;
  task_name: string;
  description: string;
  created_at: string;
  shared_with: User[];
}
interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void; // Notify TaskList when a task is created
}
