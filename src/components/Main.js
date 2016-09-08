require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//得到圖片資訊
let imageDatas = require('json!../data/imageDatas.json');

// Immediately Invoked Function Expressions (IIFE)，自執行函數
imageDatas = ((imageDatasArr) => {
    for(var i = 0; i < imageDatasArr.length; i++) {
        let singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDatasArr[i].singleImageData;
    }

    return imageDatasArr;
})(imageDatas);

class ImgFigure extends React.Component{
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <figure className="img-figure">
                <img src={this.props.data.imageURL}
                    alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        )
    }
}

class GalleryByReactApp extends React.Component {

    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: { //水平方向取直範圍
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: { //垂直方向取直範圍
                x: [0, 0],
                topY: [0, 0]
            }
        }
    }

    //  component 載入後計算每張圖片的位置
    componentDidMount () {

        //  拿到stage的大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //  拿到一個imgFigure的大小
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //  計算中心點位置
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        //計算左側、右側區域圖片散佈的取值範圍
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //計算上側區域圖片散佈的取值範圍
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;
    }

    render() {

        var controllerUnits = [], imgFigures = [];

        imageDatas.forEach((value, index) => {
            imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index}/>);
        });

        return (
            <section className="stage" refs="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
  }

}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
