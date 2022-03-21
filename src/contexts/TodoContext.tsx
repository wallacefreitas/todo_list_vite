import { createContext } from "react";

interface Todo {
  id: number;
  description: string;
}

interface TodosContextData {
  todos: Todo[];
  setTodos: any;
  moveCard: any;
}

export const TodoContext = createContext({} as TodosContextData);