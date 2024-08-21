// src/app/page.tsx
import NotificationManager from './components/NotificationManager';

const Home: React.FC = () => {
  return (
    <main>
      <h1>Bienvenido a la Web Push App</h1>
      <NotificationManager />
    </main>
  );
};

export default Home;
