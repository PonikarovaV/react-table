import React from 'react';

import { db } from '../../db/db';

import { TASK_STATUS, VALIDATION_ERRORS } from '../../constants/constants';

import { DropdownList } from '../DropdownList/DropdownList';

import './AddRowForm.css';


export const AddRowForm = (props) => {
    const { clickHandler, setTaskList } = props;

    const [dropdownState, setDropdownState] = React.useState(false);
    const [taskStatus, setTaskStatus] = React.useState('');
    const [taskDescription, setTaskDescription] = React.useState('');

    const taskDescriptionErrorField = React.useRef(null);
    const taskStatusErrorField = React.useRef(null);


    const setError = React.useCallback((errorField, errorStatus) => {
        if (!errorStatus) {
            errorField.classList.remove('form__error_hidden');
            errorField.classList.add('form__error_visible');
        } else {
            errorField.classList.add('form__error_hidden');
            errorField.classList.remove('form__error_visible');
        }
    }, []);

    const isTaskDescriptionValid = React.useCallback((value) => {
        const regexp = /^[a-zа-яё0-9\s]{5,50}$/i;

        const errorField = taskDescriptionErrorField.current;

        const isDescriptionValid = regexp.test(value);

        setError(errorField, isDescriptionValid);
    }, [setError]);

    const taskDescriptionChangeHandler = React.useCallback((event) => {
        const taskDescription = event.target.value;

        isTaskDescriptionValid(taskDescription);

        setTaskDescription(taskDescription);
    }, [isTaskDescriptionValid]);

    const addTask = React.useCallback((event) => {
        event.preventDefault();

        const statusCode = Object.keys(TASK_STATUS).find((key) => TASK_STATUS[key] === taskStatus);

        const data = {
            id: Date.now(),
            description: taskDescription,
            status: statusCode,
        }

        db.table('taskList')
            .add(data)
            .then(() => {
                setTaskList((prevState) => ([
                    ...prevState,
                    data
                ]))
                clickHandler();
            });
    }, [taskDescription, taskStatus, setTaskList, clickHandler]);


    return (
        <div className="under-layer">
            <form className="form">
                <fieldset className="form__fieldset">
                    <legend className="form__legend">Добавть задачу</legend>
                    <div className="form__field">
                        <label className="form__label" htmlFor="add-task">Описание задачи</label>
                        <input className="form__input"
                            id="add-task"
                            placeholder="Краткое описание задачи"
                            type="text"
                            value={taskDescription}
                            onChange={taskDescriptionChangeHandler}
                            required />
                        <span 
                            className="form__error form__error_hidden" 
                            id="error-add-task"
                            ref={taskDescriptionErrorField}
                        >
                            {VALIDATION_ERRORS.descriptionInputError}
                        </span>
                    </div>
                    <div className="form__field">
                        <label className="form__label" htmlFor="add-task-status">Статус задачи</label>
                        <input className="form__input"
                            id="add-task-status"
                            placeholder="Не выбрано"
                            type="text"
                            value={taskStatus}
                            onFocus={() => setDropdownState(true)}
                            onChange={() => null}
                            required />
                        <span 
                            className="form__error form__error_hidden" 
                            id="error-add-task-status"
                            ref={taskStatusErrorField}
                        >
                            {VALIDATION_ERRORS.statusInputError}
                        </span>

                        {dropdownState && (
                            <DropdownList 
                                setTaskStatus={setTaskStatus} 
                                setDropdownState={setDropdownState} 
                            />
                        )}
                    </div>
                </fieldset>
                <button className="button" onClick={addTask}>Add headache</button>
            </form>
        </div>
    );
}
