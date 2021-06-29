import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons';

const Modal = ({alert}) => {
    return (
        <div className="modal-wrapper">
            <div className="modal">
                <div className="alert">
                    <FontAwesomeIcon className="alert__icon" icon={faExclamationCircle} />
                    <h1 className="alert__title" >{alert.name} пропустил наряд {alert.corp} на {alert.time}!</h1>
                    <audio duration={3} autoPlay preload="auto" >
                        <source src={alert} type="audio/mp3"  />
                    </audio>
                </div>
            </div>
        </div>
    )
}

export default Modal;