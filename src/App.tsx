import React from 'react';
import TodoList from './containers/TodoList/TodoList.tsx';
import Navbar from './components/Navbar/Navbar.tsx';

const App = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <TodoList/>
      </main>
    </>
  );
};

export default App;