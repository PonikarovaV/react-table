import React from 'react';

import { db } from '../../db/db';
import { Table } from '../../components/Table/Table';
import { AddRowForm } from '../../components/AddRowForm/AddRowForm';

import './App.css';

export const App = () => {
  const [formStatus, setFormStatus] = React.useState(false);
  const [taskList, setTaskList] = React.useState([]);

  const addTaskHandler = React.useCallback(() => {
    setFormStatus(!formStatus);
  }, [formStatus]);

  React.useEffect(() => {
    db.table('taskList')
      .toArray()
      .then((tasks) => setTaskList(tasks))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="body">
        <div className="headache">
          <span className="headache__image" role="img" aria-label="Голова болит">🤕</span>
        </div>
        <Table 
          data={taskList}
          setTaskList={setTaskList}
        />
        {formStatus && <AddRowForm clickHandler={addTaskHandler} setTaskList={setTaskList} />}
        <button 
          className="button"
          onClick={addTaskHandler}
        >
          Add headache
        </button>
    </div>
  );
}
