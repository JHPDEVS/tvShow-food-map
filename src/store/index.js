import { createStore, combineReducers, applyMiddleware } from 'redux'
import Reducers from './reducers'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension' // 리덕스 개발자 도구
import logger from 'redux-logger'
const RootReducers = combineReducers({
  // reducers
  Reducers,
})

export const store = createStore(
  RootReducers,
  composeWithDevTools(applyMiddleware(thunk, logger))
)
