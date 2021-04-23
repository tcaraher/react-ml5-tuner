import React, { useRef }  from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { makeStyles } from '@material-ui/core/styles';
// import '../stylesheets/App.scss';
import styled from "styled-components"

const VisualWrapper = styled.div`
.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}


.App-link {
  color: #09d3ac;
}

#startButton {
  margin: 10px;
  width: 50px;
  height: 50px;
  background-color: rgb(0, 255, 66);
}

.frequencyBands {
  padding: 12px;
  margin: 8px;
  transform: rotatex(180deg);
  transform-origin: top;
}

`

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: '25%'
  }
}));

export default function VisualDemo(props) {

    const classes = useStyles();

    const amplitudeValues = useRef(null);

    function adjustFreqBandStyle(newAmplitudeData){
      amplitudeValues.current = newAmplitudeData;
      let domElements = props.frequencyBandArray.map((num) =>
        document.getElementById(num))
      for(let i=0; i<props.frequencyBandArray.length; i++){
        let num = props.frequencyBandArray[i]
        domElements[num].style.backgroundColor = `rgb(0, 255, ${amplitudeValues.current[num]})`
        domElements[num].style.height = `${amplitudeValues.current[num]}px`
      }
    };

    function runSpectrum(){
      props.getFrequencyData(adjustFreqBandStyle)
      requestAnimationFrame(runSpectrum)
    }


    
    function handleStartBottonClick(){
      props.initializeAudioAnalyser()
      requestAnimationFrame(runSpectrum)
    }

    return (

      <VisualWrapper>

        <div>
          <Tooltip
            title="Start"
            aria-label="Start"
            placement="right">
            <IconButton
              id='startButton'
              onClick={() => handleStartBottonClick()}
              disabled={!!props.audioData ? true : false}>
              <EqualizerIcon/>
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.flexContainer}>
          {props.frequencyBandArray.map((num) =>
            <Paper
              className={'frequencyBands'}
              elevation={4}
              id={num}
              key={num}
            />
          )}
        </div>

      </VisualWrapper>

    );

}
