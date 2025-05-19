import { useDataContext } from '@renderer/context/DataContext'
import { Action } from '@renderer/types/action'
import { ReactElement } from 'react'

export const Sidebar = (): ReactElement => {
  const { actions, setSelectedAction, selectedAction } = useDataContext()

  const handleActionClick = (action: Action): void => {
    setSelectedAction(action)
    console.log('Selected action:', action.title)
  }

  const isActionSelected = (action: Action): boolean => {
    return selectedAction?.title === action.title
  }

  return (
    <aside className=" rounded w-45 flex flex-col bg-gray-800 text-gray-100 border-gray-700 mr-4">
      <div className="flex-1 flex flex-col h-full w-full">
        <section className="flex-col flex-grow-1 p-4 overflow-y-auto h-full custom-scrollbar">
          <ul className="flex flex-col gap-2 max-h-full">
            {actions.map((action: Action) => (
              <li key={action.title + action.description} className="w-full">
                <button
                  className={`w-full text-left px-3 py-2 rounded  hover:bg-gray-600 transition-colors overflow-hidden text-ellipsis cursor-pointer whitespace-nowrap ${
                    isActionSelected(action) ? 'bg-gray-500' : 'bg-gray-700'
                  }`}
                  title={action.title}
                  onClick={() => handleActionClick(action)}
                >
                  {action.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}
