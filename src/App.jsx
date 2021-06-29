import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { getConnect, pingServer, getData } from './redux/mainReducer';
import Table from './components/Table/Table';
import Modal from './components/Modal/Modal';
import Config from './components/Config/Config';

let App = props => {
  useEffect(()=>{
    props.getConnect();
    props.getData();
    let interval = setInterval(() => {
      props.getData();
    }, 300000);
    return () => {
      clearInterval(interval);
    }
  }, []);
  
  return(
    <div className="wrapper">
      {/* <button onClick={props.pingServer}>dsdsdsdsdsd</button> */}
      <Route exact path="/config" render={() => <Config />} />
      <Route path="/" render={() => <Table />} />
      {props.activeAlert && <Modal alert={props.activeAlert}  />}
    </div>
  )
}

let mapStateToProps = (state) => ({
  isConnect: state.main.isConnect,
  activeAlert: state.main.activeAlert,
})

export default connect(
  mapStateToProps, 
  {getConnect, 
  pingServer,
  getData})(App);
