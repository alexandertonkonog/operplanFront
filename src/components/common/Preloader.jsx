import React from 'react';
import loader from '../../images/preloader.gif';

function App() {
  return  <div className="preloader-wrapper">
            <img className="preloader" src={loader} alt="preloader" />
          </div>
}

export default App;