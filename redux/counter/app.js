const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const reducer = (state, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + action.amount;

    case DECREMENT:
      return state - action.amount;

    default:
      return state;
  }
}

const createStore = (fn) => {
  let state = 0;

  const getState = () => state

  const dispatch = (action) => {
    state = fn(state, action);
  }

  return {
    getState,
    dispatch
  }

}


const store = createStore(reducer);

const incrementAction = { type: INCREMENT, amount: 3 };

store.dispatch(incrementAction);
console.log(`store`, store.getState());
store.dispatch(incrementAction);
console.log(`store`, store.getState());


const decrementAction = { type: DECREMENT, amount: 4 };

store.dispatch(decrementAction);
console.log(`store`, store.getState());
