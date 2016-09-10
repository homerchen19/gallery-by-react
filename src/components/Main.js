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

var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

// 得到0~30度之間的任意正負值
var get30DegRandom = () => {
    let deg = '';
    deg = (Math.random() > 0.5) ? '' : '-';
    return deg + Math.ceil(Math.random() * 30);
};

//  圖片本身component
class ImgFigure extends React.Component{
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    //  imgFigure的點擊處理函數
    handleClick(e) {

        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render () {

        var styleObj = {};

        //  如果props屬性中指定這張照片的位置
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        //  如果圖片旋轉角度不為0
        if(this.props.arrange.rotate) {
            (['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
                styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            })
        }

        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        return (
            <figure className={imgFigureClassName}
                style={styleObj}
                onClick={this.handleClick}
            >
                <img src={this.props.data.imageURL}
                    alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">
                        {this.props.data.title}
                    </h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

//  大框架component
class GalleryByReactApp extends React.Component {

    constructor (props) {
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
        };

        this.state = {
            // 存圖片的狀態訊息
            imgsArrangeArr: [
                // pos: {
                //     left: 0,
                //     top: 0
                // },
                // rotate: 0 ,  // 旋轉角度
                // isInverse: false, //  圖片正反面
                // isCenter: false //   圖片是否在中間
            ]
        };
    }

    //  旋轉圖片
    //  index是目前要旋轉的圖片的index值
    inverse (index) {
        return () => {
            let imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            })
        }
    }

    //  居中照片
    center (index) {
        return () => {
            this.rearrange(index);
        }
    }

    //  重新佈局所有圖片
    //  centerImage = 指定哪張圖要居中
    rearrange (centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr, //存所有圖片的狀態訊息
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2), //取一個或不取
            topImgSpliceIndex = 0,

            // 從imgsArrangeArr中把centerIndex拿掉
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

            //  首先居中centerIndex這張圖片，centerIndex不用旋轉
            imgsArrangeCenterArr[0] = {
                pos: centerPos,
                rotate: 0,
                isCenter: true
            };

        // 居中的圖片不用旋轉
        imgsArrangeCenterArr[0].rotate = 0;

        //  語出要放在上冊的圖片的狀態訊息
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum); // 從imgsArrangeArr把topImgSpliceIndex拿掉

        //  佈局位於上側的圖片
        imgsArrangeTopArr.forEach((value, index) => {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }
        });

        //  佈局位於兩側的圖片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;

            //  前半部分分佈在左邊，後半部分分佈在右邊
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }
        }

        if(imgsArrangeTopArr && imgsArrangeArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]); // 把上方的那張圖塞回imgsArrangeArr
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]); // 把中間的圖也塞回imgsArrangeArr

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });

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

        let num = Math.floor(Math.random() * 13);
        this.rearrange(num);
    }

    render() {

        var controllerUnits = [], imgFigures = [];

        imageDatas.forEach((value, index) => {

            //  把每張圖先定在左上角，初始化
            if(!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }

            //產生DOM節點，放進array裡
            imgFigures.push(
                <ImgFigure
                    data={value}
                    key={index}
                    ref={'imgFigure' + index}
                    arrange={this.state.imgsArrangeArr[index]}
                    inverse={this.inverse(index)}
                    center={this.center(index)}
                />
            );
        });

        return (
            <section className="stage" ref="stage">
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
