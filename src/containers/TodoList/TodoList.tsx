import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../api/store';
import { selectTodos, fetchList, addTodo,switchTodo } from './todoListSlice';

const TodosList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector(selectTodos);
  const [text, setText] = useState('');

  useEffect(() => {
    dispatch(fetchList());
  }, [dispatch]);


  const onAddTodo = () => {
    if (text.trim()) {
      dispatch(addTodo(text));
      setText('');
    }
  };


  const onSwitchTodo = (id: string) => {
    dispatch(switchTodo(id));
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">

          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter new task"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-primary" onClick={onAddTodo}>
              Add Task
            </button>
          </div>

            <ul className="list-group w-50 mx-auto">
            {todos.slice().reverse().map((todo) => (
              <li key={todo.id}
                  className={`list-group-item mb-3 d-flex align-items-center justify-content-between  
                  ${todo.done ? 'bg-primary-subtle text-primary' : ''}`}>
                <span>
                  {todo.text}
                </span>

                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => onSwitchTodo(todo.id)}
                  className="form-check-input me-2"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodosList;
