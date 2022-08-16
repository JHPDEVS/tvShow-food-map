import './dist/output.css'
import bg from './img/bg.gif'
import bg2 from './img/bg2.gif'
import bg3 from './img/bg3.gif'
import logo from './img/food_map.png'
import Button from './Button.js'
import { Link } from 'react-router-dom'
const backgroundArr = [bg, bg2, bg3]
const randomIndex = Math.floor(Math.random() * backgroundArr.length)
const backgroundImg = backgroundArr[randomIndex]
function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
      className="w-full h-full bg-food  mx-auto bg-gray-400  flex items-center bg-blend-multiply bg-no-repeat bg-cover"
    >
      <div class="hero min-h-screen ">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <div className=" animate-[bounce_6s_ease-in-out_infinite]">
              <img src={logo} />
              <h2 className="text-white font-bold text-2xl">
                방송에서 나온 맛집을 찾아보세요!
              </h2>
            </div>

            <div class="flex justify-center mt-3">
              <button class="text-white text-2xl font-bold"></button>
              <div class="alert shadow-lg items-center justify-center">
                <button class="alert btn ">
                  <Link to="/main">접속하기</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
