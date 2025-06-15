import "./dist/output.css";
import bg from "./img/bg.gif";
import bg2 from "./img/bg2.gif";
import bg3 from "./img/bg3.gif";
import logo from "./img/food_map.png";
import Button from "./Button.js";
import "./App.css";
import { Link } from "react-router-dom";
const backgroundArr = [bg, bg2, bg3];
const randomIndex = Math.floor(Math.random() * backgroundArr.length);
const backgroundImg = backgroundArr[randomIndex];
function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
      }}
      className="w-full h-full bg-food  mx-auto bg-gray-400  flex items-center bg-blend-multiply bg-no-repeat bg-cover"
    >
      <div class="hero min-h-screen ">
        <div class="hero-content text-center items-center">
          <div class="max-w-md">
            <div className="flex justify-center animate-[bounce_5s_ease-in-out_infinite]">
              <img src={logo} alt="Logo" />{" "}
            </div>
            <h2 className="text-white font-bold text-2xl">
              放送に出た美味しい店を探してみてください！
            </h2>

            <div class="flex justify-center mt-3">
              <button class="text-white text-2xl font-bold"></button>
              <Link to="/map">
                <div class="alert shadow-lg items-center justify-center text-5xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 ">
                  🔍
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
