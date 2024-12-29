import React from 'react';
import { Button, Input } from './components/atoms';
import userIcon from './assets/svg/user.svg';
import passwordIcon from './assets/svg/password.svg';

function App() {
  return (
      <div className="h-screen bg-background flex flex-col justify-center items-center">
        <Input type="text" icon={userIcon} placeholder="Email" className="px-4 py-1 border-b-2 border-primary-500 text-primary-500 font-poppins text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50" />
        <Input type="password" icon={passwordIcon} placeholder="Mot de passe" className="px-4 py-1 border-b-2 border-primary-500 text-primary-500 font-poppins text-subtitle focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50" />
        <Button className={`px-4 py-1 bg-primary-500 text-white font-poppins text-subtitle rounded-full hover:bg-primary-600 transition duration-300`}>Se connecter</Button>
      </div>
  );
}

export default App;
