import './App.css'
import Listing from './Listing'
import propertiesData from './mockData/propertyData'

function App() {

  return (
    <>
    {/* <div className='text-green-400 text-4xl'>hbsbdhvsa</div> */}
    <Listing propertiesData={propertiesData}/>
    </>
  )
}

export default App
