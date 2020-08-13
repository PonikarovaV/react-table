import React from 'react';

import db from '../../db';

import { TASK_STATUS } from '../../constants';

import './Table.css';


export const Table = (props) => {
    const { data, setTaskList } = props;

    const handleEditStatus = React.useCallback((id) => {
        alert('В процессе реализации.');
    }, []);

    const handleDeleteTask = React.useCallback((id) => {
        db.table('taskList')
            .delete(id)
            .then(() => {
                setTaskList((prevState) => {
                    const newState = prevState.filter((item) => item.id !== id);

                    return newState;
                })
            })
            .catch((error) => console.error(error));
    }, [setTaskList]);

    return (
        <table className="table">
            <thead className="table__head">
                <tr className="table__row">
                    <th className="table__cell">ID</th>
                    <th className="table__cell">Description</th>
                    <th className="table__cell">Status</th>
                    <th className="table__cell"></th>
                    <th className="table__cell"></th>
                </tr>
            </thead>
            <tbody className="table__body">
                {data.map((row) => (
                    <tr 
                        key={row.id} 
                        className="table__row table__row_clickable"
                    >
                        <td className="table__cell">{row.id}</td>
                        <td className="table__cell">{row.description}</td>
                        <td className="table__cell">{TASK_STATUS[row.status]}
                        </td>
                        <td className="table__cell">
                            <button 
                                className="table__button"
                                onClick={() => handleEditStatus(row.id)}
                            >
                                <span className="table__image" role="img" aria-label="Редактировать статус">📝</span>
                            </button>
                        </td>
                        <td className="table__cell">
                            <button 
                                className="table__button"
                                onClick={() => handleDeleteTask(row.id)}
                            >
                                <span className="table__image" role="img" aria-label="Удалить задачу">❌</span>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
