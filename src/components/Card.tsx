import { useContext, useRef } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd'
import produce from 'immer';

import { TodoContext } from '../contexts/TodoContext';

interface CardProps {
  index: number,
  taskID: number,
  description: string
}

function Card( props: CardProps ) {
  const { index, taskID, description } = props;
  const { todos, setTodos, moveCard } = useContext(TodoContext);
  const ref = useRef<HTMLHeadingElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'CARD',
    item: { type: 'CARD', index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: "CARD",
    hover: ( item: any, monitor ) => {
      const draggedIndex = item.index;
      const targetIndex = index;

      if( draggedIndex === targetIndex ) {
        return;
      }

      const targetSize = ref.current?.getBoundingClientRect();
      const targetCenter = ( ( targetSize?.bottom ? targetSize.bottom : 0 ) - ( targetSize?.top ? targetSize.top : 0 ) ) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggetTop = ( draggedOffset?.y ? draggedOffset.y : 0 ) - ( targetSize?.top ? targetSize.top : 0 );

      if( draggedIndex < targetIndex && draggetTop < targetCenter ) {
        return;
      }

      if( draggedIndex > targetIndex && draggetTop > targetCenter ) {
        return;
      }

      moveCard( draggedIndex, targetIndex );

      item.index = targetIndex;

    }
  })

  const styleDrag = {
    border: '2px dashed rgba(0,0,0,0.2)',
    background: 'transparent',
    boxShadow: 'none',
    cursor: 'grabbing',
    itens: {
      opacity: '0'
    }
  }

  function removeTodo(id: number) {
    setTodos(produce( todos, ( draft ) => {
      draft.splice(id, 1);
    }))
  }

  dragRef(dropRef(ref));

  return (
    <div ref={ref}
      style={ isDragging ? styleDrag : {} }
      className="
        bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200
        h-24
        rounded-lg
        break-words
        border-4 border-slate-50 border-l-indigo-500
        relative
      "
    >
      <div className="flex ml-6 pt-2 ">
        <p style={ isDragging ? styleDrag.itens : {} }
          className="
            font-sans
            font-bold
            text-indigo-500
            grow
          "
        >
          Task {taskID.toString() }
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg" 
          className="
            h-6 
            w-6 
            mr-2 
            stroke-indigo-500 
            cursor-pointer 
            top-2 
            right-0
          "
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth="2" 
          onClick={() => removeTodo(index)} 
          style={ isDragging ? styleDrag.itens : {} }
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
      </div>
      
      <p style={ isDragging ? styleDrag.itens : {} }
        className="
          font-sans
          font-normal
          mx-6
          text-gray-400
        "
      >
        {description}
      </p>
      
    </div>
  )
}

export default Card;