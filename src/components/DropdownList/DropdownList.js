import React from 'react';

import { TASK_STATUS } from '../../constants';

import './DropdownList.css';

export const DropdownList = (props) => {
    const { setTaskStatus, setDropdownState } = props;

    const statusValueHandler = React.useCallback((event) => {
        const status = event.target.textContent;
        
        setTaskStatus(status);
        setDropdownState(false);
    }, [setDropdownState, setTaskStatus]);

    return (
        <ul className="dropdown-list">
            {Object.values(TASK_STATUS).map((taskStatus, index) => {
                return (
                    <li
                        key={index}
                        className="dropdown-item"
                        onClick={statusValueHandler}
                    >
                        {taskStatus}
                    </li>
                );
            })}
        </ul>
    );
}
