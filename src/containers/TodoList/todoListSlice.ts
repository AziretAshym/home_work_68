import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import axiosAPI from '../../AxiosAPI';
import { RootState } from '../../api/store';

interface Task {
  id: string;
  text: string;
  done: boolean
}


interface TaskState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchList = createAsyncThunk<Task[]>('todos/fetchTodos', async () => {
    const response = await axiosAPI.get('/todos.json');
    const data = response.data;
    return data ? Object.keys(data).map((key) => ({ ...data[key], id: key })) : [];
  }
);


export const addTodo = createAsyncThunk<Task, string>('todos/addTodo', async (text) => {
    const newTodo = { text };
    const response = await axiosAPI.post('/todos.json', newTodo);

    return { ...newTodo, id: response.data.name };
  }
);


export const switchTodo = createAsyncThunk<Task, string>('todos/switchTodo', async (id) => {
  const response = await axiosAPI.get(`/todos/${id}.json`);
  const todo = response.data;
  const updatedTodo = { ...todo, done: !todo.done };

  await axiosAPI.put(`/todos/${id}.json`, updatedTodo);
  return { ...updatedTodo, id };
});


export const deleteTodo = createAsyncThunk<string, string>('todos/deleteTodo', async (id) => {
  await axiosAPI.delete(`/todos/${id}.json`);
  return id;
});



const todosSlice:Slice<TaskState> = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchList.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      })


      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add todo';
      })


      .addCase(switchTodo.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.items.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(switchTodo.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to toggle todo';
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete todo';
      })
  },
});

export const selectTodos = (state: RootState) => state.todos.items;
export const todosReducer = todosSlice.reducer;
