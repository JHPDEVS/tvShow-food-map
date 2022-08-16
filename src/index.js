import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './dist/output.css'
import AnimatedCursor from 'react-animated-cursor'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
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
      <Route path="/" element={<App />}>
        <Route index element={<App />} />
        <Route path="/main" element={<App />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
