import './App.scss'
import { Map } from './Components';
import { Nav } from './Components/Nav';



const App: React.FC = () => {
  return (
    <div className='app'>
      <Nav />
      <Map />
    </div>
  )
}


export default App