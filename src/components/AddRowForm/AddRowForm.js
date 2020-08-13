import React from 'react';

import db from '../../db';

import { TASK_STATUS, VALIDATION_ERRORS, DESCRIPTION_REGEXP } from '../../constants';

import DropdownList from '../DropdownList';

import './AddRowForm.css';


export const AddRowForm = (props) => {
    const { clickHandler, setTaskList } = props;

    const formInitialState = {
        description: false,
        status: false,
    };

    const [dropdownState, setDropdownState] = React.useState(false);
    const [taskStatus, setTaskStatus] = React.useState('');
    const [taskDescription, setTaskDescription] = React.useState('');
    const [formValidationState, setFormValidationState] = React.useState(formInitialState);

    const [descriptionWasChanged, setDescriptionWasChanged] = React.useState(false);
    const [statusWasChanged, setStatusWasChanged] = React.useState(false);


    const isTaskDescriptionValid = React.useCallback((value) => {
        const isDescriptionValid = DESCRIPTION_REGEXP.test(value);

        setFormValidationState((prevState) => ({
            ...prevState,
            description: isDescriptionValid,
        }));
    }, []);

    const taskDescriptionChangeHandler = React.useCallback((event) => {
        const taskDescription = event.target.value;

        isTaskDescriptionValid(taskDescription);

        setTaskDescription(taskDescription);

        setDescriptionWasChanged(true);
    }, [isTaskDescriptionValid]);

    const addTask = React.useCallback((event) => {
        event.preventDefault();

        const statusCode = Object.keys(TASK_STATUS).find((key) => TASK_STATUS[key] === taskStatus);

        const data = {
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

    const descriptionFieldIsValid = React.useMemo(() => {
        if (!descriptionWasChanged) {
            return 'form__error form__error_hidden';
        }
        
        return `form__error ${formValidationState.description ? 'form__error_hidden' : 'form__error_visible'}`;
    }, [descriptionWasChanged, formValidationState.description]);

    const statusFieldIsValid = React.useMemo(() => {
        if (!statusWasChanged) {
            return 'form__error form__error_hidden';
        }

        setFormValidationState((prevState) => ({
            ...prevState,
            status: !!taskStatus,
        }));

        return `form__error ${formValidationState.status ? 'form__error_hidden' : 'form__error_visible'}`;
    }, [formValidationState.status, statusWasChanged, taskStatus]);

    const hasInvalidInput = React.useMemo(() => {
        return Object.values(formValidationState).some((status) => !status);
    }, [formValidationState]);


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
                            className={descriptionFieldIsValid}
                            id="error-add-task"
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
                            onChange={() => {
                                setStatusWasChanged(true);

                                return null;
                            }}
                            required />
                        <span
                            className={statusFieldIsValid}
                            id="error-add-task-status"
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
                <button 
                    className={`form__button ${hasInvalidInput ? 'form__button_disabled' : 'form__button_active'}`} 
                    onClick={addTask} 
                    disabled={hasInvalidInput}
                >
                    Add headache
                </button>
            </form>

            <button className="button button_theme_dark" onClick={clickHandler}>Cancel headache</button>
        </div>
    );
}
