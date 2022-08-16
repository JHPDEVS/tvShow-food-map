import logo from './logo.svg'
import './App.css'
import bg from './img/bg.gif'
const backgroundArr = [bg]
const randomIndex = Math.floor(Math.random() * backgroundArr.length)
const backgroundImg = backgroundArr[randomIndex]
function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
      }}
      className="w-full h-full bg-food  mx-auto bg-gray-200 rounded-md flex items-center bg-blend-multiply bg-no-repeat bg-cover"
    >
      <div class="hero min-h-screen ">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold text-white">안녕하세요!</h1>
            <h2>방송에서 나온 맛집을 찾아보세요!</h2>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered input-primary w-full max-w-xs m-6"
            />
            <button class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
