import React from 'react';
import { getIcon, cn, getCroppedImg } from './Utils/iconUtils';

function App() {
  const HomeIcon = getIcon('Home');
  const CircleIcon = getIcon('Circle');

  return (
    <div className="App">
      <h1>Testing Icon Utils</h1>
      <HomeIcon size={24} />
      <CircleIcon size={24} />
    </div>
  );
}

export default App;