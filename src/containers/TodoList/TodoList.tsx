import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../api/store";
import {
  selectTodos,
  fetchList,
  addTodo,
  switchTodo,
  deleteTodo,
} from "./todoListSlice";
import Spinner from "../../UI/Spinner.tsx";
import ButtonSpinner from "../../UI/ButtonSpinner.tsx";

const TodosList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector(selectTodos);
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const loading = useSelector((state: RootState) => state.todos.loading);

  useEffect(() => {
    dispatch(fetchList());
  }, [dispatch]);

  const onAddTodo = () => {
    if (text.trim()) {
      setAdding(true);
      dispatch(addTodo(text));
      setText("");
      setAdding(false);
    }
  };

  const onSwitchTodo = (id: string) => {
    setSwitchingId(id);
    dispatch(switchTodo(id));
    setSwitchingId(null);
  };

  const onDeleteTodo = (id: string) => {
    setDeletingId(id);
    dispatch(deleteTodo(id));
    setDeletingId(null);
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
              disabled={adding}
            />
            <button
              className="btn btn-primary"
              onClick={onAddTodo}
              disabled={adding}
            >
              {adding ? <ButtonSpinner /> : "Add Task"}
            </button>
          </div>

          {loading ? (
            <div className="text-center z-3">
              <Spinner />
            </div>
          ) : (
            <ul className="list-group w-50 mx-auto">
              {todos
                .slice()
                .reverse()
                .map((todo) => (
                  <li
                    key={todo.id}
                    className={`list-group-item mb-3 d-flex align-items-center justify-content-between  
                  ${todo.done ? "bg-primary-subtle text-primary" : ""}`}
                  >
                    <span>{todo.text}</span>

                    <div className="d-flex flex-column align-items-center gap-2">
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => onSwitchTodo(todo.id)}
                        className="form-check-input me-2"
                        disabled={switchingId === todo.id}
                      />

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDeleteTodo(todo.id)}
                        disabled={deletingId === todo.id}
                      >
                        {deletingId === todo.id ? <ButtonSpinner /> : "Delete"}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodosList;
