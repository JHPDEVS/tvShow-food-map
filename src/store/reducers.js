import { handleActions } from 'redux-actions'

const GET_STORES_PENDING = 'GET_STORES_PENDING'
const GET_STORES_SUCCESS = 'GET_STORES_SUCCESS'
const GET_STORES_FAILURE = 'GET_STORES_FAILURE'

const initialState = {
  stores: [],
}

export default handleActions(
  {
    [GET_STORES_PENDING]: (state, action) => {
      return {
        store_pending: true,
        error: false,
      }
    },
    [GET_STORES_SUCCESS]: (state, action) => {
      return {
        store_pending: false,
        stores: action.payload,
        error: false,
      }
    },
    [GET_STORES_FAILURE]: (state, action) => {
      return {
        store_pending: false,
        store_pending: action.payload,
        error: true,
      }
    },
  },
  initialState
)
