import React from "react";
import {Button} from "./components/atoms";

function App() {
  return (
    <div className="h-screen bg-blue-to-white flex flex-col gap-4 justify-center items-center">
      <Button className="border-2 border-secondary-500">Bordure secondaire</Button>
    </div>
  );
}

export default App;
