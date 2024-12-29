import React from 'react';
import { Button } from './components/atoms';

function App() {
  return (
      <div className="h-screen bg-background flex justify-center items-center">
          <Button className={`px-4 py-1 bg-primary-500 text-white font-poppins text-subtitle rounded-full hover:bg-primary-600 transition duration-300`}>Se connecter</Button>
      </div>
  );
}

export default App;
