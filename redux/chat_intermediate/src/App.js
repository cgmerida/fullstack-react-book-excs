import React, { Component } from 'react'
import { createStore, combineReducers } from 'redux';
import uuid from 'uuid';
import { connect, Provider } from 'react-redux'

const ADD_MESSAGE = 'ADD_MESSAGE';
const DELETE_MESSAGE = 'DELETE_MESSAGE';
const CHANGE_TAB = 'CHANGE_TAB';

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});

function activeThreadIdReducer(state = '1-fca2', action) {
  switch (action.type) {
    case CHANGE_TAB:
      return action.threadId;

    default:
      return state;
  }
}


function threadsReducer(state = [
  {
    id: '1-fca2', // hardcoded pseudo-UUID
    title: 'Buzz Aldrin',
    messages: messagesReducer(undefined, {})
  },
  {
    id: '2-be91',
    title: 'Michael Collins',
    messages: messagesReducer(undefined, {}),
  },
], action) {
  let threadIndex = state.findIndex((t) => t.id === action.threadId);
  let oldThread = state[threadIndex];
  let threads = [...state];
  let nThread;

  switch (action.type) {
    case ADD_MESSAGE:
    case DELETE_MESSAGE:
      nThread = {
        ...oldThread,
        messages: messagesReducer(oldThread.messages, action)
      }

      // Update/Replace the old Thread from the array
      threads.splice(threadIndex, 1, nThread);

      return threads;

    default:
      return state;
  }
}


function messagesReducer(state = [], action) {
  switch (action.type) {
    case ADD_MESSAGE:
      const newMsg = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid.v4(),
      };
      return state.concat(newMsg);

    case DELETE_MESSAGE:
      return state.filter((m) => m.id !== action.id);

    default:
      return state;
  }
}

const store = createStore(reducer);

const deleteMessage = (id) => ({
  type: DELETE_MESSAGE,
  id
});

const addMessage = (text, threadId) => ({
  type: ADD_MESSAGE,
  text,
  threadId
});

const changeTab = (threadId) => ({
  type: CHANGE_TAB,
  threadId
});

class App extends Component {

  render() {
    return (
      <div className="ui segment">
        <ThreadTabs />
        <ThreadDisplay />
      </div>
    )
  }
}

const mapStateToTabsProps = (state) => {
  const tabs = state.threads.map(t => (
    {
      id: t.id,
      title: t.title,
      active: state.activeThreadId === t.id,
    }
  ));

  return {
    tabs,
  }
}


const mapDispatchToTabsProps = (dispatch) => {
  const onChangeTab = (threadId) => {
    dispatch(changeTab(threadId))
  }

  return {
    onChangeTab
  }
}

const Tabs = ({ tabs, onChangeTab }) => (
  <div className="ui top attached tabular menu">
    {tabs.map(t => (
      <div
        className={`${t.active ? 'active ' : ''}item clickable`}
        key={t.id}
        onClick={() => onChangeTab(t.id)}
      >
        {t.title}
      </div >
    ))}
  </div>
)

const ThreadTabs = connect(
  mapStateToTabsProps,
  mapDispatchToTabsProps
)(Tabs);


const mapStateToThreadProps = (state) => {
  const activeThread = state.threads.find(t => t.id === state.activeThreadId);
  return {
    thread: activeThread,
  }
}


const mergeThreadProps = (stateProps, dispatchProps) => {
  const onMessageSubmits = (text) => {
    dispatchProps.dispatch(addMessage(text, stateProps.thread.id));
  }

  const onMessageClick = (id) => {
    dispatchProps.dispatch(deleteMessage(id));
  }


  return {
    ...stateProps,
    onMessageClick,
    onMessageSubmits
  }
}


const Thread = ({ thread, onMessageClick, onMessageSubmits }) => (
  <div className="ui centered aligned basic segment">
    <MessageList
      messages={thread.messages}
      onMessageClick={onMessageClick}
    />
    <TextFieldSubmit onSubmit={onMessageSubmits} />
  </div>
)

const ThreadDisplay = connect(
  mapStateToThreadProps, null, mergeThreadProps
)(Thread);


const MessageList = ({ messages, onMessageClick }) => (
  <div className="ui comments">
    {messages.map((m) => (
      <div className="comment"
        key={m.id}
        onClick={() => onMessageClick(m.id)}
      >
        <div className="text">
          {m.text}
          <span className="metadata">@{m.timestamp}</span>
        </div>
      </div>
    ))}
  </div>
)


class TextFieldSubmit extends Component {
  state = {
    value: ''
  }

  onChange = (e => {
    this.setState({ value: e.target.value })
  });

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.value)
    this.setState({ value: '' });
  }

  render() {
    return (
      <div className="ui input">
        <form onSubmit={this.onSubmit}>
          <input type="text"
            value={this.state.value}
            onChange={this.onChange}
          />
          <button
            className='ui primary button'
            type='submit'
          >
            Submit
          </button>
        </form>
      </div>
    )
  }
}


const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
)


export default WrappedApp;