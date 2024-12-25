import './App.css';

function App() {
  return (
    <div className="h-screen bg-blue-to-white flex flex-col gap-4 justify-center items-center">
      <Button className="border-2 border-secondary-500">Bordure secondaire</Button>
    </div>
    <div className="p-6 font-poppins">
      <h1 className="text-title text-primary-500">Ceci est un titre</h1>
      <h2 className="text-subtitle text-secondary-500">Ceci est un sous-titre</h2>
      <p className="text-text text-text-500">
        Ceci est un texte normal. Edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
}

export default App;
