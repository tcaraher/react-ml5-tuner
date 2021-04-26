// import React from "react";
// import VisualDemo from "./VisualDemo";
//
// // import soundFile from '../audio/GummyBearz.mp3'
//
// class AudioDataContainer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//     this.frequencyBandArray = [...Array(25).keys()];
//   }
//
//   initializeAudioAnalyser = () => {
//     const audioContext = this.props.audioContext.current;
//     const source = audioContext.createMediaStreamSource(this.props.audioStream);
//     const analyser = audioContext.createAnalyser();
//     analyser.fftSize = 2048;
//     source.connect(analyser);
//     this.setState({
//       audioData: analyser,
//     });
//   };
//
//   getFrequencyData = (styleAdjuster) => {
//     const bufferLength = this.state.audioData.frequencyBinCount;
//     const amplitudeArray = new Uint8Array(bufferLength);
//     this.state.audioData.getByteFrequencyData(amplitudeArray);
//     styleAdjuster(amplitudeArray);
//   };
//
//   render() {
//     return (
//       <div>
//         <VisualDemo
//           initializeAudioAnalyser={this.initializeAudioAnalyser}
//           frequencyBandArray={this.frequencyBandArray}
//           getFrequencyData={this.getFrequencyData}
//           audioData={this.state.audioData}
//           visualStarted={this.props.visualStarted}
//         />
//       </div>
//     );
//   }
// }
//
// export default AudioDataContainer;
