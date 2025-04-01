import './App.css'
import Listing from './Listing'
import { BrowserRouter } from 'react-router-dom'
function App() {

  return (
    <BrowserRouter>
    <>

    {/* Header */}
    <div className="backdrop-blur-md rounded-xl p-2 text-center">
      <h1 className="text-xl md:text-3xl font-semibold text-blue-800 mb-4 tracking-tight">
        <span className="text-blue-600">GI Inventory Management</span> 
      </h1>
      <div className="mt-3 flex justify-center">
        <div className="w-60 h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"></div>
      </div>
    </div>

    <Listing/>

    </>
    </BrowserRouter>
  )
}

export default App
