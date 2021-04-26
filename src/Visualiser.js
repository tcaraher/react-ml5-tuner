import React, { useEffect, useRef, useState } from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import { motion } from "framer-motion";
import useInterval from "./use-interval";

const Visualiser = ({ audioContext, visualStarted, audioStream, color }) => {
  const amplitudeValues = useRef(null);
  const [audioData, setAudioData] = useState();
  const [frequencyBandArray, setFrequencyBandArray] = useState([
    ...Array(25).keys(),
  ]);
  const sourceRef = useRef();
  const [analyserLoaded, setAnalyserLoaded] = useState(false);
  // const [heightValue, setHeight] = useState([]);
  // const heightRef = useRef(null);

  useEffect(() => {
    if (!visualStarted) {
      return;
    }
    // setAnalyser(audioContext.createAnalyser());
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    sourceRef.current = audioContext.createMediaStreamSource(audioStream);
    sourceRef.current.connect(analyser);
    setAudioData(analyser);
    setAnalyserLoaded(true);
  }, [visualStarted]);


//Below is option not to use useInterval, but requestAnimationFrame instead.

  // useEffect(() => {
  //   if (!analyserLoaded) {
  //     return;
  //   }
  //   animationRef.current = requestAnimationFrame(runSpectrum);
  //   return () => cancelAnimationFrame(animationRef.current);
  // }, [analyserLoaded]);
  //
  // const runSpectrum = () => {
  //   getFrequencyData(adjustFreqBandStyle);
  //   requestAnimationFrame(runSpectrum);
  // };
  //
  // const getFrequencyData = (adjustFreqBandStyle) => {
  //   const bufferLength = audioData.frequencyBinCount;
  //   const amplitudeArray = new Uint8Array(bufferLength);
  //   audioData.getByteFrequencyData(amplitudeArray);
  //   adjustFreqBandStyle(amplitudeArray);
  // };
  //
  // const adjustFreqBandStyle = (newAmplitudeData) => {
  //   amplitudeValues.current = newAmplitudeData;
  //   let domElements = frequencyBandArray.map((num) =>
  //     document.getElementById(num)
  //   );
  //   for (let i = 0; i < frequencyBandArray.length; i++) {
  //     let num = frequencyBandArray[i];
  //     domElements[
  //       num
  //       ].style.backgroundColor = `rgb(0, 255, ${amplitudeValues.current[num]})`;
  //     domElements[num].style.height = `${amplitudeValues.current[num]}px`;
  //     // setHeight(amplitudeValues.current[frequencyBandArray[i]]);
  //   }
  // };


  useInterval(() => {
    if (!analyserLoaded) {
      return;
    }
    const bufferLength = audioData.frequencyBinCount;
    const amplitudeArray = new Uint8Array(bufferLength);
    audioData.getByteFrequencyData(amplitudeArray);
    amplitudeValues.current = amplitudeArray;
    let domElements = frequencyBandArray.map((num) =>
      document.getElementById(num)
    );
    for (let i = 0; i < frequencyBandArray.length; i++) {
      let num = frequencyBandArray[i];
      domElements[
        num
        ].style.backgroundColor = `rgb(0, 255, ${amplitudeValues.current[num]})`;
      domElements[num].style.height = `${amplitudeValues.current[num]}px`;
      // setHeight(amplitudeValues.current[frequencyBandArray[i]]);
    }
  }, 0.1);

  return (
    <>
      {/*<VisualWrapper>*/}
      {/*  {frequencyBandArray.map((i) => (*/}
      {/*    <motion.hr*/}
      {/*      className={"frequencyBands"}*/}
      {/*      initial={{*/}
      {/*        height: "10px"*/}
      {/*      }}*/}
      {/*      animate={{*/}
      {/*        height: heightValue[i],*/}
      {/*        // backgroundColor: `rgba(0,255,${heightRef.current},1)`,*/}
      {/*      }}*/}
      {/*      id={i}*/}
      {/*      key={i}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</VisualWrapper>*/}
      <VisualWrapper>
        {frequencyBandArray.map((num) => (
          <Paper
            className={"frequencyBands"}
            elevation={4}
            id={num}
            key={num}
          />
        ))}
      </VisualWrapper>
    </>
  );
};

export default Visualiser;

const VisualWrapper = styled.div`
  hr {
    border: none;
    background-color: green;
  }

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
