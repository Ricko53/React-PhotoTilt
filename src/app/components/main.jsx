let React = require('react');

var Main = React.createClass({

  getInitialState() {
    return { 
        viewportWidth : 0,
        viewportHeight : 0,
        centerOffset : 0,
        tiltCenterOffset : 0,
        tiltBarWidth : 0,
        tiltBarIndicatorWidth : 0,
        latestTilt : 0,
        // pxToMoveImg : 0,
        // pxToMoveBar : 0,
        disableTilt : false
     };
  },

  componentWillMount() {
    this.generateViewPort();
  },

  componentDidMount() {
    this.generateImgData();
    this.addEventListeners();
  },

  generateViewPort() {
    let container = document.body;
    let containerStyle = window.getComputedStyle(container, null);

    this.setState({
        viewportWidth: parseInt(containerStyle.width, 10),
        viewportHeight: parseInt(containerStyle.height, 10)
    });
  },

  generateImgData() {

    let aspectRatio = 1024/683,
        tiltBarPadding = 20,
        resizedImgWidth,
        minitiltBarWidth,
        minicenterOffset,
        minitiltCenterOffset,
        minitiltBarIndicatorWidth,
        delta;

    resizedImgWidth = (aspectRatio * this.state.viewportHeight);
    delta = resizedImgWidth - this.state.viewportWidth;
    minicenterOffset = delta / 2;
    minitiltBarWidth = this.state.viewportWidth - tiltBarPadding;
    minitiltBarIndicatorWidth = (this.state.viewportWidth * minitiltBarWidth) / resizedImgWidth;
    minitiltCenterOffset = ((minitiltBarWidth / 2) - (minitiltBarIndicatorWidth / 2));

    this.setState({
        tiltBarWidth : minitiltBarWidth,
        centerOffset : minicenterOffset,
        tiltBarIndicatorWidth : minitiltBarIndicatorWidth,
        tiltCenterOffset : minitiltCenterOffset
    });

    if(minicenterOffset > 0){
      this.setState({
          disableTilt : false
      });
    }
  },

  addEventListeners() {
    if (window.DeviceOrientationEvent) {

      let averageGamma = [],
          minidisableTilt = this.state.disableTilt,
          self = this,
          minilatestTilt;

      window.addEventListener('deviceorientation', function(eventData) {
        if (!minidisableTilt) {

          if (averageGamma.length > 8) {
            averageGamma.shift();
          }

          averageGamma.push(eventData.gamma);

          minilatestTilt = averageGamma.reduce(function(a, b) { return a+b; }) / averageGamma.length;

          console.log(averageGamma);
          console.log(minilatestTilt);

          self.setState({
              latestTilt : minilatestTilt
          });
        }

      }, false);

      window.requestAnimationFrame(this.updatePosition);
    }
  },

  updatePosition() {
    let tilt = this.state.latestTilt,
        maxTilt = 18,
        minipxToMoveImg,
        minipxToMoveBar,
        pxToMove;

    if (tilt > 0) {
      tilt = Math.min(tilt, maxTilt);
    } else {
      tilt = Math.max(tilt, maxTilt * -1);
    }

    tilt = tilt * -1;

    pxToMove = (tilt * this.state.centerOffset) / maxTilt;
    minipxToMoveImg = (this.state.centerOffset + pxToMove) * -1;
    minipxToMoveBar = (tilt * ((this.state.tiltBarWidth - this.state.tiltBarIndicatorWidth) / 2)) / maxTilt;

    // this.setState({
    //     pxToMoveImg : minipxToMoveimg,
    //     pxToMoveBar : minipxToMoveBar
    // });

    let bar = this.refs.bar.getDOMNode();
    let img = this.refs.img.getDOMNode();
    this.setTranslateX(bar, minipxToMoveBar);
    this.setTranslateX(img, minipxToMoveImg);

    window.requestAnimationFrame(this.updatePosition);
  },

  getStyles() {
    // let x1 = Math.round(this.state.pxToMoveBar + this.state.tiltCenterOffset) + 'px';
    // let x2 = Math.round(this.state.pxToMoveImg) + 'px';
    let styles = {

      indicator: {
        width: this.state.tiltBarIndicatorWidth + 'px',
        // tramsform: 'translateX(' + x1 + ')'
      },

      tiltimg: {
        height: this.state.viewportHeight + 'px',
        // tramsform: 'translateX(' + x2 + ')'
      }
    };
    return styles;
  },

  setTranslateX(node, amount) {
    node.style.webkitTransform =
    node.style.MozTransform =
    node.style.msTransform =
    node.style.transform = "translateX(" + Math.round(amount) + "px)";
  },

  render() {
    let styles = this.getStyles();
    console.log(styles);
    return (
      <div className="mask">
        <div className="tilt-bar">
          <div ref="bar" className="tilt-indicator" style={styles.indicator} ></div>
        </div>
        <img ref="img" src={'http://farm5.staticflickr.com/4016/4251578904_f13592585c_b.jpg'} style={styles.tiltimg} />
      </div>
    );
  }

});

module.exports = Main;