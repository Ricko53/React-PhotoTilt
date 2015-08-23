let React = require('react');

window.requestAnimationFrame =  window.requestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.msRequestAnimationFrame;

var Main = React.createClass({
  getInitialState() {
    return { 
        width : 1280,
        viewportWidth : 0,
        viewportHeight : 0,
        centerOffset : 0,
        tiltCenterOffset : 0,
        tiltBarWidth : 0,
        tiltBarIndicatorWidth : 0
     };
  },

  componentWillMount() {
    this.generateViewPort();
  },

  componentDidMount() {
    this.generateImgData();
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

    console.log( minitiltCenterOffset );
  },

  updatePosition() {

  },

  getStyles() {
    let x1 = 20 + 'px';
    let x2 = 30 + 'px';
    let styles = {

      indicator: {
        width: this.state.tiltBarIndicatorWidth + 'px',
        tramsform: 'translateX('+ x1 +')'
      },

      tiltimg: {
        height: this.state.viewportHeight + 'px',
        tramsform: 'translateX(' + x2 + ')'
      }
    };
    return styles;
  },

  render() {
    let styles = this.getStyles();
    console.log(styles);
    return (
      <div className="mask">
        <div className="tilt-bar">
          <div className="tilt-indicator" style={styles.indicator} ></div>
        </div>
        <img src={'http://farm5.staticflickr.com/4016/4251578904_f13592585c_b.jpg'} style={styles.tiltimg} />
      </div>
    );
  }

});

module.exports = Main;