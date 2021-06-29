import io from  'socket.io-client';
import {addToDb} from '../db/db';
import axios from 'axios';
import dotenv  from 'dotenv';
import aud from '../audio/alert.mp3';

let myEnv = dotenv.config(); 

let GET_CONNECTION = 'GET_CONNECTION';
let SET_SOCKET = 'SET_SOCKET';
let REMOVE_SOCKET = 'REMOVE_SOCKET';
let SET_ACTIVE_ALERT = 'SET_ACTIVE_ALERT';
let GET_ALERTS = 'GET_ALERTS';
let REMOVE_ONE_ALERTS = 'REMOVE_ONE_ALERTS';
let GET_TABLE_DATA = 'GET_TABLE_DATA';

let initialState = {
    isConnect: false,
    data: {
        table: null,
        charts: []
    },
    rows: 10,
    error: false,
    alerts: [],
    activeAlert: null
}

let auth = {
    username: process.env.REACT_APP_LOGIN,
    password: process.env.REACT_APP_PASSWORD
}

export const pingServer = () => async (dispatch) => {
    let res = await axios.post('http://krdco.ufo1cbit.ru:61251/alert', {
        ...auth,
        data: [
            {
                name: 'Сергей Ершиков',
                corp: 'ООО Шарите',
                time: '14:00'
            }
        ]
    });
    console.log(res);
}

export let getTable = dispatch => {
	let openRequest = window.indexedDB.open("db", 1);
	openRequest.onupgradeneeded = function() {
		let db = openRequest.result;
		if (!db.objectStoreNames.contains('table')) { 
			db.createObjectStore('table',{keyPath: 'id'}); 
		}		
	}
	openRequest.onerror = function (err) {
		console.log(err)
	}
	openRequest.onsuccess = function (event) {
		let db = openRequest.result;
		let trans = db.transaction("table","readwrite");
		let table = trans.objectStore("table");

		table.get(1).onsuccess = event => {
            if(event.target.result) {
                dispatch({type: GET_TABLE_DATA, data: event.target.result});
            } else {
                dispatch({type: GET_TABLE_DATA, data: {success: false}});
            }
		};
	}
}

export const getData = () => async (dispatch) => {
    try {
        let res = await axios.post('http://krdco.ufo1cbit.ru:61251/client', auth);
        addToDb(res.data);
        dispatch({type: GET_TABLE_DATA, data: res.data});
    } catch (e) {{
        console.error(e);
        getTable(dispatch);
    }}
}

export let getConnect = () => dispatch => {
    // let socket = io.connect("http://krdco.ufo1cbit.ru:61251/");
    // dispatch({type: GET_CONNECTION, data: true});
    // Старая реализация через сокеты
    // socket.on('tables', (res) => {
    //     if(res.success !== false) {
    //         addToDb(res);
    //         dispatch({type: GET_TABLE_DATA, data: res});
    //     } else {
    //         getTable(dispatch);
    //     }
    // });
    // socket.on('connect_error', () => {
    //     getTable(dispatch);
    //     console.log('Нет соединения, данные взяты из локальной базы данных');
    // });
    // socket.on('alert', (res) => {
    //     let newArr = res.map((item, ind) => ({...item, id: ind+1}));
    //     dispatch({type: GET_ALERTS, data: newArr});
    //     chainPromises(newArr, dispatch);
    // })
}

export const chainPromises =  (objects, dispatch) => {
    let audio = new Audio(aud);
    let arr = [];
    objects.forEach((item) => {
        let fun = () => {
            return new Promise((resolve) => {
                dispatch({type: SET_ACTIVE_ALERT, data: item});
                audio.play();
                setTimeout(() => {
                    dispatch({type: SET_ACTIVE_ALERT, data: null});
                    dispatch({type: REMOVE_ONE_ALERTS, id: item.id});
                    audio.pause()
                    setTimeout(() => {
                        resolve();
                    }, 1000)
                }, 10000)
            })
        }
        arr.push(fun);
    });
    arr.reduce((prev, next) => prev.then(next), Promise.resolve());
}

export let mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONNECTION: {
            return {
                ...state,
                isConnect: action.data
            }
        }
        case SET_SOCKET: {
            return {
                ...state,
                socket: action.data
            }
        }
        case REMOVE_SOCKET: {
            return {
                ...state,
                socket: null
            }
        }
        case GET_ALERTS: {
            return {
                ...state,
                alerts: action.data
            }
        }
        case SET_ACTIVE_ALERT: {
            return {
                ...state,
                activeAlert: action.data
            }
        }
        case REMOVE_ONE_ALERTS: {
            let arr = state.alerts.filter((item) => item.id !== action.id);
            return {
                ...state,
                alerts: arr
            }
        }
        case GET_TABLE_DATA: {
            if(action.data.success === false) {
                return {
                    ...state, 
                    error: true,
                    data: {
                        ...state.data,
                        table: true
                    }
                }
            }
            return {
                ...state,
                data: {
                    ...state.data,
                    table: action.data,
                },
                error: false
            }
        }
        default: {
            return state;
        }
    }
}