import { ChangeEvent, KeyboardEvent, useState } from "react"
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import produce from "immer";

import Card from "./components/Card";
import { TodoContext } from "./contexts/TodoContext";

interface Todo {
  id: number,
  description: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputTodo, setInputTodo] = useState<string>("");

  const fullDateTime = new Date().toLocaleTimeString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  async function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputTodo(event.target.value);
  }

  async function handleKeywordKeyPress( eventKey: KeyboardEvent<HTMLInputElement>) {
      const keyCode = eventKey.code;

      if( keyCode === "Enter" || keyCode === "NumpadEnter" ) {
        addTodo();
      }
  }

  function addTodo() {
    const newTodo = { 
      id: todos.reduce((acc, shot) => acc = acc > shot.id ? acc : shot.id + 1, 1),
      description: inputTodo
    }

    setTodos([...todos, newTodo]);
    setInputTodo("");
  }

  function moveCard(from: number, to: number) {
    setTodos(produce( todos, ( draft ) => {
      const dragged = draft[from];

      draft.splice(from, 1);
      draft.splice(to, 0, dragged);
    }))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <TodoContext.Provider value={{todos, setTodos, moveCard}}>
        <div className="
            flex
            justify-center
            bg-gradient-to-r from-violet-300 via-violet-400 to-violet-700
            h-screen
          "
        >
          <div className="
              bg-white
              my-12
              rounded-lg
              border-2
              border-slate-100
              shadow-2xl
              relative
              w-5/6
              md:w-4/12
              md-l:w-2/4
            "
          >
            <div className="
              h-[12%]
              sm:h-[22%]
              md:h-[10%]
              md-l:h-[22%]
              "
            >
              <div className="
                flex
                flex-col
                relative
                px-8
                space-y-2
                md-l: space-y-0
              "
              >
                <p className="
                    font-sans 
                    font-bold
                    text-lg md:text-2xl md-l:text-base
                    mt-4
                  "
                >
                  Todo List
                </p>
                <p className="
                    font-sans 
                    font-medium
                    text-xs md:text-base md-l:text-sm
                    text-slate-400
                    mt-2
                  "
                >
                  { fullDateTime }
                </p>
              </div>
            </div>
            <div className="
              relative
              py-4
              md-l:py-2
              px-8
              h-[10%]
              sm:h-[20%]
              md:h-[10%]
              md-l:h-[15%]
              "
            >
              <input type="text" 
                id="description"
                placeholder="Add a todo..."
                value={inputTodo}
                maxLength={124}
                onChange={ handleInputChange }
                onKeyDownCapture={ handleKeywordKeyPress }
                className="
                  rounded-full
                  w-full
                  border-2
                  border-slate-200
                  sm:h-full
                  md:h-12
                  md-l:h-6
                  text-md
                  text-gray-400
                "
              />
            </div>
            <div className="
              h-[76%]
              sm:h-[56%]
              md:h-[78%]
              md-l:h-[63%]
              absolute
              w-full
              px-8
              overflow-auto
              "
            >
              {
                todos.map( ( todo, index ) => {
                  const { id, description } = todo;
                  const taskID = id;
              
                  return (
                    <Card 
                      key={id}
                      taskID={taskID}
                      index={index}
                      description={description} 
                    />
                  )
                } )
              }
            </div>
          </div>
        </div>
      </TodoContext.Provider>
    </DndProvider>
  )
}

export default App
