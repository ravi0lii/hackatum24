import './App.css'
import LeftPanel from "./components/LeftPanel.tsx";

function App() {

  return (
      <>
          <div className="flex h-screen w-screen">
              <LeftPanel/>
              <div className="flex-grow bg-gray-50 flex items-center justify-center">
                  <h1 className="text-2xl font-bold">Dashboard Content</h1>
              </div>
          </div>
      </>
  )
}

export default App
