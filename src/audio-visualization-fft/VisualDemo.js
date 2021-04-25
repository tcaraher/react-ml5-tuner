import React, { useEffect, useRef } from "react";
import Paper from "@material-ui/core/Paper";
// import '../stylesheets/App.scss';
import styled from "styled-components";

const VisualDemo = ({
  initializeAudioAnalyser,
  frequencyBandArray,
  getFrequencyData,
  visualStarted,
}) => {
  const amplitudeValues = useRef(null);

  function adjustFreqBandStyle(newAmplitudeData) {
    amplitudeValues.current = newAmplitudeData;
    let domElements = frequencyBandArray.map((num) =>
      document.getElementById(num)
    );
    for (let i = 0; i < frequencyBandArray.length; i++) {
      let num = frequencyBandArray[i];
      domElements[
        num
      ].style.backgroundColor = `rgb(0, 255, ${amplitudeValues.current[num]})`;
      domElements[num].style.height = `${amplitudeValues.current[num]}px`;
    }
  }

  function runSpectrum() {
    getFrequencyData(adjustFreqBandStyle);
    requestAnimationFrame(runSpectrum);
  }

  useEffect(() => {
    if (visualStarted) {
      initializeAudioAnalyser();
      requestAnimationFrame(runSpectrum);
    }
  }, [visualStarted, initializeAudioAnalyser]);

  return (
    <VisualWrapper>
      {frequencyBandArray.map((num) => (
        <Paper className={"frequencyBands"} elevation={4} id={num} key={num} />
      ))}
    </VisualWrapper>
  );
};

export default VisualDemo;


const VisualWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 25%;
  .frequencyBands {
    padding: 12px;
    margin: 8px;
    transform: rotatex(180deg);
    transform-origin: top;
  }
`;


