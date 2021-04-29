import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useAudioContext from "./use-audio-context";
import useInterval from "./use-interval";
import "./App.css";
import { Helmet } from "react-helmet";
import { css } from "styled-components";
import {
  AnimationWrapper,
  InfoDiv,
  StartButton,
  TunerWrapper,
} from "./tunerStyles";
import Visualiser from "./Visualiser";
import Metronome from './metronome';



const Tuner = (effect, deps) => {
  const audioStream = useRef();
  const pitchDetectorRef = useRef();
  const [tunerStarted, setTunerStarted] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [pitchfreq, setPitchFreq] = useState(0);
  const [diff, setDiff] = useState(0);
  const [note, setNote] = useState(["A"]);
  const [color, setColor] = useState("#74c748");
  const [visualStarted, setVisualStarted] = useState(false);
  const audioContextRef = useAudioContext();

  const modelURL =
    "https://github.com/ml5js/ml5-data-and-models/tree/master/models/pitch-detection/crepe/";
  const A = 440;
  const equalTemperment = 1.059463;
  const scale = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ];

  // Convert frequency detected to the number of semitones away from A440
  function getNumSemitonesFromA(freq) {
    let diffInSemitones = 0;
    if (!freq) {
      return null;
    }
    // See equation online on figuring out how many semitones away you are from 440hz
    // But we're rounding them too b/c we need the semitone the frequency is closest to...
    return (diffInSemitones = Math.round(
      Math.log(freq / A) / Math.log(equalTemperment)
    ));
  }

  // Uses the difference in semitones to cacluate how out of tune you are in cents
  function getDifferenceInCents(freq, diffInSemitones) {
    let centDiff = 0;
    if (!freq) {
      return null;
    }
    //Use the difference in semitones to figure out what the correctFreq should be.
    // It's the same equation to figure out the difference in semitone, just this time we're solving for the correct
    // frequency, as we know the diffInSemis
    const correctFreq = A * Math.pow(equalTemperment, diffInSemitones);
    // Below is equation to convert diff in hz to cents. look it up...
    // We're rounding it off. too many decimals..
    centDiff = Math.round(1200 * Math.log2(freq / correctFreq));
    return centDiff;
  }

  // Gets the note from how many semitones away you are from A440 (getNumSemitonesFromA)
  function getNoteFromSemitones(freq, diffInSemitones) {
    let note = scale[0];
    if (diffInSemitones > 0) {
      diffInSemitones = diffInSemitones % 12; // going back over array of scale if semitone above A
      note = scale[diffInSemitones];
    } else if (diffInSemitones < 0) {
      // same but if semitone below A
      diffInSemitones = diffInSemitones % -12;
      note = scale[scale.length + diffInSemitones];
    }
    return note;
  }

  function chooseColorFromCents(diff) {
    let color = "#74c748";
    if (diff > 10 || diff < -10) {
      color = "#ffa500";
    }
    if (diff > 20 || diff < -20) {
      color = "#c5001b";
    }
    return color;
  }

  useEffect(() => {
    if (tunerStarted) {
      audioContextRef.current.resume();
      console.log(audioContextRef.current.state);
      (async () => {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        pitchDetectorRef.current = window.ml5.pitchDetection(
          "/crepe",
          audioContextRef.current,
          micStream,
          () => setModelLoaded(true)
        );
        audioStream.current = micStream;
      })();
    }
    audioContextRef.current.suspend();
  }, [audioContextRef, tunerStarted]);

  useInterval(() => {
    if (!tunerStarted) {
      return;
    }
    if (!pitchDetectorRef.current) {
      return;
    }
    setVisualStarted(true);
    pitchDetectorRef.current.getPitch((err, detectedPitch) => {
      setNote(getNoteFromSemitones(pitchfreq, getNumSemitonesFromA(pitchfreq)));
      setPitchFreq(Math.round(detectedPitch * 10) / 10);
      setDiff(
        getDifferenceInCents(detectedPitch, getNumSemitonesFromA(detectedPitch))
      );
      setColor(chooseColorFromCents(diff));
    });
  }, 1000 / 80);

  return (
    <TunerWrapper>
      <Helmet>
        <script src="https://unpkg.com/ml5@latest/dist/ml5.min.js" />
      </Helmet>
      <Metronome/>
      <StartButton type="button" onClick={() => setTunerStarted(!tunerStarted)}>
        {(tunerStarted && <p>Stop!</p>) || <p>Start!</p>}
      </StartButton>
      <AnimationWrapper>
        <InfoDiv animate={{ backgroundColor: color }}>
          <h2>{note}</h2>
          <p>{diff}</p>
        </InfoDiv>
        <motion.hr
          className="diff-hr"
          animate={{
            y: -diff * 4.7,
            backgroundColor: color,
          }}
        />
        <h2 className="small-note">{note}</h2>
      </AnimationWrapper>
      {/*<AudioDataContainer*/}
      {/*  audioStream={audioStream.current}*/}
      {/*  visualStarted={visualStarted}*/}
      {/*  audioContext={audioContextRef}*/}
      {/*/>*/}
      <Visualiser
        diff={diff}
        audioContext={audioContextRef.current}
        visualStarted={visualStarted}
        audioStream={audioStream.current}
      />
    </TunerWrapper>
  );
};

export default Tuner;
