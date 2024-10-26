import './App.css'
import AppHeader from './components/AppHeader/AppHeader'
import BurgerIngredients from './components/BurgerIngredients/BurgerIngredients'
import BurgerConstructor from './components/BurgerConstructor/BurgerConstructor'

function App() {
  return (
    <>
      <AppHeader />
      <div className='wrapepr overflow_hidden height_100'>
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
