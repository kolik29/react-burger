import './App.css'
import AppHeader from '../AppHeader/AppHeader'
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients'
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor'

function App() {
  return (
    <>
      <AppHeader />
      <div className='wrapper overflow_hidden height_100'>
        <main className='container display_flex flex-direction_column height_100'>
          <div className="display_flex justify-content_space-between height_100 overflow_hidden">
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>        
      </div>
    </>
  )
}

export default App
