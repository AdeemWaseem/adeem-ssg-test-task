import { NextPage } from 'next';
import { useAuthContext } from '@/context/AuthContext';
import { SignInComponent } from '@/components/common/auth/SignInComponent';
import { TaskList } from '@/components/common/tasks/TaskList';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/common/shared/Header';
import '../utils/fontawesome';

const Home: NextPage = () => {
  const { isLogin } = useAuthContext();

  return (
    <main>
      {isLogin ? (
        <>
          <Header />
          <TaskList />
        </>
      ) : (
        <SignInComponent />
      )}
      <Toaster position="bottom-left" />
    </main>
  );
};

export default Home;
