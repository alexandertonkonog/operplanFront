import React, {useState, useRef} from 'react';
import {connect} from 'react-redux';

let Grid = ({full, setFull, boxes, setBoxes}) => {
    let addSlide = () => {
        let arr = [...boxes, boxes.length+1];
        setBoxes(arr);
    };
    let arr = [1,2,3,4];
    let getElems = (box, place) => {
        let item = full.find(el => el.box === box && el.place === place);
        if (item) {
            return  <div className="report-setting__icon">
                    <img src={item.link}
                        alt={item.name}
                        className="report-setting__img report-setting__img" />
                    <p className="config__name">{item.reportName}</p>
                    <p  onClick={() => 
                        setFull(full.filter(el => el.id !== item.id ))}
                        className="grid__box-remove">&times;</p>
                </div> 
        } else {
            return <div className="grid__add" data-box={box} data-place={place}>+</div>
        }
        
    }
    return  <div className="grid">
                {boxes.map(el => <div key={el} className="grid__box-wrapper">
                    <p className="config__title">Слайд {el}</p>
                    <div className="grid__box">
                        {arr.map(item => <div 
                            key={item}
                            className="grid__place" data-box={el} data-place={item}>
                            {getElems(el, item)}
                        </div>)}
                    </div>
                </div>)}
                <div className="grid__box-wrapper">
                    <p className="config__title">Добавить слайд</p>
                    <div className="grid__box grid__box_grey" onClick={addSlide}>
                        <p className="grid__add">+</p>
                    </div>
                </div>
            </div>
}

let mapStateToProps = state => ({
  
})

export default connect(mapStateToProps, {})(Grid);
