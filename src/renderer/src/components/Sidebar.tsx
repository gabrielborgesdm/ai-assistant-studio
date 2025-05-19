import { ReactElement } from 'react'

interface Action {
  id: string
  label: string
  onClick: () => void
}

// Example actions without icons
const actions: Action[] = new Array(5).fill(null).map((_, index) => ({
  id: `action-${index}`,
  label: `Action ${index + 1}`,
  onClick: () => {
    console.log(`Action ${index + 1} clicked`)
  }
}))

export const Sidebar = (): ReactElement => {
  return (
    <aside className=" rounded w-35 flex flex-col bg-gray-800 text-gray-100 border-gray-700 mr-4">
      <div className="flex-1 flex flex-col h-full w-full">
        <section className="flex-col flex-grow-1 p-4 overflow-y-auto h-full custom-scrollbar">
          <ul className="flex flex-col gap-2 max-h-full">
            {actions.map((item) => (
              <li key={item.id}>
                <button
                  className="w-full text-left px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={item.onClick}
                  title={item.label}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}
