let React = require('react');

var Main = React.createClass({
  getInitialState() {
    return { 
        
     };
  },

  render() {

    return (
      <div className="mask">
        <div className="tilt-bar">
          <div className="tilt-indicator"></div>
        </div>
        <img src="http://farm5.staticflickr.com/4016/4251578904_f13592585c_b.jpg">
      </div>
    );
  }

});

module.exports = Main;