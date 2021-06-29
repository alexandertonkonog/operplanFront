import React, {useEffect} from 'react';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {connect} from 'react-redux';
import {getConnect} from '../../redux/mainReducer';
import Preloader from '../common/Preloader';
import {makeArrays, getSides, getColor} from '../../functions/functions';

let Table = props => {

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 15000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  useEffect(()=>{
    props.getConnect();
  }, []);

  if(!props.table) return <Preloader />;
  if(props.error) return <p className="not-data-text">Нет данных</p>
  let data = makeArrays(props.table, props.count)
  let sides = getSides(data.cols.length, props.count, data.results.length);

  return (
    <div className="table-wrapper">
      <Slider className="slider" {...settings}>
        {data.rows.map((slide, slideInd) => {
          return (
            <div key={slideInd+1} className="slider__item-wrapper">
              <div className="slider__item table">
                <div className="table__row table__row_title" style={{height: sides.height+'vh'}}>
                  {data.cols.map((item, ind) => ind === 0 ? 
                  <div key={ind+1} style={{width: sides.width.first+'%'}} className="table__item">{item}</div> :
                  <div key={ind+1} style={{width: sides.width.other+'%'}} className="table__item">{item}</div> )}
                </div>
                {slide.map((item, index) => <div key={index+1} className="table__row" style={{height: sides.height+'vh'}}>
                    {item.map((el, ind) => ind === 0 ? 
                      <div key={ind+1} style={{width: sides.width.first+'%'}} className="table__item">{el}</div> :
                      <div key={ind+1} style={{width: sides.width.other+'%'}} className={getColor(ind, item)}>{el}</div> )}
                  </div>
                )}
                <div className="table__row table__row_title" style={{height: sides.height+'vh'}}>
                  <div style={{width: sides.widthRes+'%'}} className="table__item table__item_res">Итого</div>
                  {data.results.map((item, ind) => <div key={ind+1} style={{width: sides.width.other+'%'}} className="table__item">{item}</div>)}
                </div>
              </div>
            </div>
            )
          })}
      </Slider>
    </div>
  )
}

let mapStateToProps = state => ({
  isConnect: state.main.isConnect,
  socket: state.main.socket,
  table: state.main.data.table,
  count: state.main.rows,
  error: state.main.error
})

export default connect(mapStateToProps, {getConnect})(Table);