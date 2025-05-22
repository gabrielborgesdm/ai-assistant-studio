import { useDataContext } from '@renderer/context/DataContext'
import { Action } from '@global/types/action'
import { ReactElement, useEffect } from 'react'

export const Sidebar = (): ReactElement => {
  const { actions, isLoading, setSelectedAction, setActions, selectedAction, setHistory } =
    useDataContext()

  useEffect(() => {
    window.api.db.getActions().then(setActions)
  }, [])

  useEffect(() => {
    if (!selectedAction) {
      return
    }
    window.api.db.getHistory(selectedAction.id).then(setHistory)
  }, [selectedAction])

  useEffect(() => {
    // set the first action as selected by default
    if (actions.length > 0 && !selectedAction) {
      setSelectedAction(actions[0])
      // TODO: GET HISTORY FOR ACTION LOAD
      console.log('Selected action as default action:', actions[0].title)
    }
  }, [actions, selectedAction])

  const handleActionClick = (action: Action): void => {
    if (isLoading) {
      return
    }
    setSelectedAction(action)
    console.log('Selected action:', action.title)
  }

  const isActionSelected = (action: Action): boolean => {
    return selectedAction?.title === action.title
  }

  return (
    <aside className=" rounded w-40 flex flex-col">
      <div className="flex-1 flex flex-col h-full w-full">
        <section className="flex-col flex-grow-1 overflow-y-auto h-full pt-2">
          <ul className="flex flex-col gap-2 w-full">
            {actions.map((action: Action) => (
              <li
                key={action.title + action.description}
                onClick={() => handleActionClick(action)}
                title={action.title}
                className={`p-2 mx-2 rounded-sm cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap 
                  ${isActionSelected(action) && 'bg-primary text-white'}
                  ${isLoading ? 'loading' : 'hover:text-warning'}  
                `}
              >
                {action.title}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}
