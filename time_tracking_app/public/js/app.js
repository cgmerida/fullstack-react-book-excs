const { useState, useEffect, useRef } = React;

const TimersDashboard = () => {
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    const loadTimersFromServer = () => {
      client.getTimers((serverTimers) => {
        setTimers(serverTimers);
      });
    }

    loadTimersFromServer();
    const intId = setInterval(loadTimersFromServer, 5000);

    return () => {
      clearInterval(intId);
    }
  }, []);

  const onSubmitTimer = (timer) => {
    //updating
    if (timer.hasOwnProperty('id')) {
      setTimers(timers.map(t => t.id === timer.id ? timer : t));
      client.updateTimer(timer);
    }
    else {
      // Create new Timer
      const t = helpers.newTimer(timer);
      setTimers(timers.concat(t));
      client.createTimer(t);

    }
  }

  const onStartTimer = (timerID) => {
    const now = Date.now();
    setTimers(timers.map(t => t.id === timerID ? (t.runningSince = now, t) : t));

    client.startTimer({ id: timerID, start: now });
  }

  const onStopTimer = (timerID) => {
    const now = Date.now();
    setTimers(timers.map(t => t.id === timerID ?
      (
        t.elapsed = t.elapsed + now - t.runningSince,
        t.runningSince = null,
        t
      )
      : t));

    client.stopTimer({ id: timerID, stop: now })
  }

  const onDeleteTimer = (timerID) => {
    setTimers(timers.filter(t => t.id !== timerID));
    client.deleteTimer({ id: timerID })
  }


  return (
    <div className='ui three column centered grid'>
      <div className='column'>
        <EditableTimerList
          timers={timers}
          onFormSubmit={onSubmitTimer}
          onDeleteTimer={onDeleteTimer}
          onStartTimer={onStartTimer}
          onStopTimer={onStopTimer}
        />
        <ToggleableTimerForm onFormSubmit={onSubmitTimer} />
      </div>
    </div>
  )
}


const EditableTimerList = ({ timers, onFormSubmit, onDeleteTimer, onStartTimer, onStopTimer }) => {

  let timersComponents = timers.map((t) =>
    <EditableTimer
      key={t.id} timer={t}
      onFormSubmit={onFormSubmit}
      onDeleteTimer={onDeleteTimer}
      onStartTimer={onStartTimer}
      onStopTimer={onStopTimer}
    />
  );

  return (
    <div id='timers'>
      {timersComponents}
    </div>
  );
}

const EditableTimer = ({ timer, onFormSubmit, onDeleteTimer, onStartTimer, onStopTimer }) => {
  const [editFormOpen, setEditFormOpen] = useState(false);

  const onFormOpen = () => {
    setEditFormOpen(true);
  }

  const onFormClose = () => {
    setEditFormOpen(false)
  }

  const onSubmit = (t) => {
    setEditFormOpen(false);
    onFormSubmit(t);
  }

  if (editFormOpen)
    return (
      <TimerForm
        timer={timer}
        onFormClose={onFormClose}
        onFormSubmit={onSubmit} />
    );

  return (
    <Timer
      timer={timer}
      onFormOpen={onFormOpen}
      onDelete={onDeleteTimer}
      onStartTimer={onStartTimer}
      onStopTimer={onStopTimer}
    />
  );
}

const Timer = ({ timer, onFormOpen, onDelete, onStartTimer, onStopTimer }) => {
  // const [elapsedString, setElapsedString] = useState(helpers.renderElapsedString(timer.elapsed));
  const [counter, setCounter] = useState(0);

  /*
  ** Function forces re-rendering the timer 
  ** and helps if backend changes
  */
  useEffect(() => {
    let id;
    id = setTimeout(() => {
      setCounter(c => c + 1);
    }, 50);

    return () => {
      if (id)
        clearTimeout(id);
    }
  }, [counter])

  /*
  ** The problem using this function is that if the timer gets rerender 
  ** from backend this wouldnt force the update 
  */

  // useEffect(() => {
  //   let id;
  //   if (!!timer.runningSince) {
  //     id = setTimeout(() =>
  //       setElapsedString(helpers.renderElapsedString(timer.elapsed, timer.runningSince))
  //       , 500);
  //   }
  //   // clearTimeout(id);
  //   return () => {
  //     if (id)
  //       clearTimeout(id);
  //   }
  // }, [elapsedString, timer.runningSince]);

  const onStart = () => {
    onStartTimer(timer.id);
  }
  const onStop = () => {
    onStopTimer(timer.id);
  }


  return (

    <div className='ui centered card'>
      <div className='content'>
        <div className='header'>
          {timer.title}
        </div>
        <div className='meta'>
          {timer.project}
        </div>
        <div className='center aligned description'>
          <h2>
            {/* {elapsedString.slice(0, elapsedString.lastIndexOf(':'))} */}
            {helpers.renderElapsedString(timer.elapsed, timer.runningSince)}
          </h2>
        </div>
        <div className='extra content'>
          <span className='right floated edit icon'
            onClick={onFormOpen}>
            <i className='edit icon' />
          </span>
          <span className='right floated trash icon'
            onClick={() => onDelete(timer.id)}>
            <i className='trash icon' />
          </span>
        </div>
      </div>
      <TimerActionButton
        timerIsRunning={!!timer.runningSince}
        onStart={onStart}
        onStop={onStop}
      />
    </div>
  );
}

const TimerActionButton = ({ timerIsRunning, onStop, onStart }) => {
  if (timerIsRunning) {
    return (
      <div
        className='ui bottom attached red basic button'
        onClick={onStop}
      >
        Stop
      </div>
    );
  } else {
    return (
      <div
        className='ui bottom attached green basic button'
        onClick={onStart}
      >
        Start
      </div>
    );
  }
}



const ToggleableTimerForm = ({ onFormSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (timer) => {
    onFormSubmit(timer);
    setIsOpen(false);
  }

  if (isOpen) {
    return (
      <TimerForm
        onFormClose={() => setIsOpen(false)}
        onFormSubmit={handleSubmit}
      />
    );
  } else {
    return (
      <div className='ui basic content center aligned segment'>
        <button className='ui basic button icon'
          onClick={() => setIsOpen(true)}
        >
          <i className='plus icon' />
        </button>
      </div>
    );
  }
}


const TimerForm = ({ timer = {}, onFormClose, onFormSubmit }) => {
  const [title, setTitle] = useState(timer.title);
  const [project, setProject] = useState(timer.project);
  const submitText = timer.id ? 'Update' : 'Create';

  const onSubmit = () => {
    let newTimer = { ...timer, title, project };
    onFormSubmit(newTimer);
  }


  return (
    <div className='ui centered card'>
      <div className='content'>
        <div className='ui form'>
          <div className='field'>
            <label>Title</label>
            <input type='text' defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='field'>
            <label>Project</label>
            <input type='text' defaultValue={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </div>
          <div className='ui two bottom attached buttons'>
            <button className='ui basic blue button' onClick={onSubmit}>
              {submitText}
            </button>
            <button className='ui basic red button' onClick={onFormClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <TimersDashboard />,
  document.getElementById('content')
);
