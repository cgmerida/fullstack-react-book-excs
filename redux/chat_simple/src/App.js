import React, { Component } from 'react'

const ADD_MESSAGE = 'ADD_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';

function createStore(reducer, initialState) {
  let state = initialState;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        messages: state.messages.concat(action.message)
      };

    case DELETE_MESSAGE:
      return {
        messages: state.messages.filter((m, i) => i !== action.index)
      };

    default:
      return state;
  }
}

const store = createStore(reducer, { messages: [] });


class App extends Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const messages = store.getState().messages;

    return (
      <div className="ui segment">
        <MessageView messages={messages} />
        <MessageInput />
      </div>
    )
  }
}


class MessageInput extends Component {
  state = {
    value: ''
  }

  onChange = (e => {
    this.setState({ value: e.target.value })
  });

  onSubmit = () => {
    store.dispatch({
      type: ADD_MESSAGE,
      message: this.state.value
    });

    this.setState({ value: '' });
  }

  render() {
    return (
      <div className="ui input">
        <input type="text"
          value={this.state.value}
          onChange={this.onChange}
        />
        <button className='ui primary button'
          type='submit'
          onClick={this.onSubmit}>
          Submit
        </button>
      </div>
    )
  }
}

class MessageView extends Component {
  onDelete(i) {
    store.dispatch({
      type: DELETE_MESSAGE,
      index: i
    });
  }

  render() {
    const messages = this.props.messages.map((m, i) => (
      <div className="comment"
        key={i}
        onClick={() => this.onDelete(i)}>
        {m}
      </div>
    ));

    return (
      <div className="ui comments">
        {messages}
      </div>
    )
  }
}

export default App;