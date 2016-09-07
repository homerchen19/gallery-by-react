require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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

class GalleryByReactApp extends React.Component {

  render() {
    return (
        <section className="stage">
            <section className="img-sec">

            </section>
            <nav className="controller-nav">

            </nav>
        </section>
    );
  }

}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
