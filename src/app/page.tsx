// src/app/page.tsx
import NotificationManager from './components/NotificationManager';

const Home: React.FC = () => {
  return (
    <main className="bg-white min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Notificaciones Génesis</h1>
      <NotificationManager />
    </main>
  );
};

export default Home;
