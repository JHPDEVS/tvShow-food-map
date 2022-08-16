import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './dist/output.css'
import AnimatedCursor from 'react-animated-cursor'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './Main.js'
import { Provider } from 'react-redux'

import { store } from './store'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AnimatedCursor
        innerSize={20}
        outerSize={20}
        color="1, 200, 111"
        outerAlpha={0.2}
        innerScale={0.7}
        outerScale={5}
      />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="map" element={<Main />} />
      </Routes>
    </BrowserRouter>
  </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
