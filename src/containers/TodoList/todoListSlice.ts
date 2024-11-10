import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import axiosAPI from '../../AxiosAPI';
import { RootState } from '../../api/store';

interface Task {
  id: string;
  text: string;
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
      });
  },
});

export const selectTodos = (state: RootState) => state.todos.items;
export const todosReducer = todosSlice.reducer;
