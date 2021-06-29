import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import Grid from '../Grid/Grid';
import table from '../../images/table.png';
import bar from '../../images/bar.png';
import circle from '../../images/circle.png';

let Config = props => {
    let [reports, setReports] = useState([
        {id: 1, name: 'Отчет 1'},
        {id: 2, name: 'Отчет 2'},
        {id: 3, name: 'Отчет 3'},
        {id: 4, name: 'Отчет 4'},
    ]);
    let [full, setFull] = useState([]);
    let [coor, setCoor] = useState({x: -100, y: -100});
    let [boxes, setBoxes] = useState([1]);
    let [currentTarget, setCurrentTarget] = useState(null);
    let [selectReports, setSelectReports] = useState([]);
    let icons = [
        {id: 1, name: 'table', link: table},
        {id: 2, name: 'bar', link: bar},
        {id: 3, name: 'circle', link: circle}
    ];
    let checkCursor = e => {
        if(currentTarget) {
            let elem = document.querySelector('.report-setting__icon_absolute');
            setCoor({x: e.pageX, y: e.pageY});
            elem.classList.add('report-setting__icon_hidden');
            showHoverPlace(document.elementFromPoint(e.pageX, e.pageY));            
            elem.classList.remove('report-setting__icon_hidden');
        } 
    }
    let hideHoverPlace = () => {
        let box = document.querySelector('.grid__place_hover');
        if(box) box.classList.remove('grid__place_hover');
    }
    let showHoverPlace = node => {
        if(node) {
            if(node.classList.contains('grid__place'))  {
                hideHoverPlace();
                node.classList.add('grid__place_hover');
            } else if (node.classList.contains('grid__add')) {
                hideHoverPlace();
                node.parentNode.classList.add('grid__place_hover');
            } else {
                hideHoverPlace();
            }
        }
    }
    let addFull = (node, cursor) => {
        if(node && (node.classList.contains('grid__place') || node.classList.contains('grid__add'))) {
            setFull([
                ...full, 
                {   
                    ...cursor,
                    id: full.length + 1, 
                    box: +node.dataset.box,
                    place: +node.dataset.place
                }
            ]);
        }
        
    }
    let selectStatusReport = el => {
        if(selectReports.includes(el)) {
            setSelectReports(selectReports.filter(item => item.id!==el.id));
        } else {
            setSelectReports([...selectReports, el]);
        }
    }
    let mouseUp = e => {
        if(currentTarget) {
            let elem = document.querySelector('.report-setting__icon_absolute');
            hideHoverPlace();
            elem.classList.add('report-setting__icon_hidden');
            addFull(document.elementFromPoint(e.clientX, e.clientY), currentTarget);
            elem.classList.remove('report-setting__icon_hidden');
            setCurrentTarget(null);
            setCoor({x: -100, y: -100});
        }
    }
    let getLocalization = name => {
        if(name === 'table') return 'Таблица';
        else if(name === 'bar') return 'Столбчатая диаграмма';
        else return 'Круговая диаграмма';
    }
    let autoComplete = (elem) => {
        // outer: for(let j = 1; j <= boxes.length; j++) {
        //     for(let i = 1; i <= 4; i++) {
        //         if(!full.some(el => el.place === i && el.box === j)) {
        //             debugger
        //             setFull([
        //                 ...full, 
        //                 {   
        //                     ...elem,
        //                     id: full.length + 1, 
        //                     box: i,
        //                     place: j
        //                 }
        //             ]);
        //             break outer;
        //         } 
        //     }
        // }неправильно: или цикл, или отрисовка в grid
    }
    console.log(full)
    return  <div className="config" onMouseMove={e => checkCursor(e)} onMouseUp={mouseUp}>
                <div className="visual">
                    <Grid full={full} 
                        setFull={setFull}
                        boxes={boxes}
                        setBoxes={setBoxes} />
                </div>
                <div className="setting">
                    <div className="reports-wrapper">
                        <div className="setting__item">
                            <p className="config__title">Выберите отчеты</p>
                            <div className="reports">
                                {reports.map(item => <div 
                                    key={item.id} 
                                    onClick={() => selectStatusReport(item)} 
                                    className={selectReports.includes(item) ? 
                                        "report report_selected" :
                                        "report"}>{item.name}</div>)}
                            </div>
                        </div>
                    </div>
                    <div className="setting__reports">
                        {selectReports.map(report => <div key={report.id} className="report-setting">
                            <p className="config__title">{report.name}</p>
                            <div className="report-setting__icons">
                                {icons.map(item => <div
                                    key={item.id}
                                    className="report-setting__icon"
                                    onClick={() => 
                                        autoComplete({...item,
                                            report: report.id, 
                                            reportName: report.name})}
                                    onMouseDown={e => 
                                        setCurrentTarget({...item, 
                                            report: report.id, 
                                            reportName: report.name})}>
                                    <img src={item.link}
                                        alt={item.name}
                                        className="report-setting__img report-setting__img" />
                                    <p className="config__name">{getLocalization(item.name)}</p>
                                </div>)}
                            </div>
                        </div>)}
                    </div>
                </div>
                {currentTarget && <div
                    style={{left: coor.x - 50, top: coor.y - 50}} 
                    className="report-setting__icon report-setting__icon_absolute">
                    <img src={currentTarget.link}
                        alt={currentTarget.name}
                        className="report-setting__img report-setting__img" />
                </div>}
            </div>
}

let mapStateToProps = state => ({

})

export default connect(mapStateToProps,{})(Config);