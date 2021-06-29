import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {mainReducer} from './mainReducer';

let reducers = combineReducers({
    main: mainReducer
})

let store = createStore(reducers, applyMiddleware(thunk));

window.store = store;

export default store;