import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useAudioContext from "./use-audio-context";
import useInterval from "./use-interval";
import "./App.css";
import { Helmet } from "react-helmet";
import {
  AnimationWrapper,
  InfoDiv,
  StartButton,
  TunerWrapper,
} from "./tunerStyles";
import Visualiser from "./Visualiser";

const Tuner = (effect, deps) => {
  const audioStream = useRef();
  const pitchDetectorRef = useRef();
  const [tunerStarted, setTunerStarted] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [pitchfreq, setPitchFreq] = useState(0);
  const [diff, setDiff] = useState(0);
  const [note, setNote] = useState("A");
  const [color, setColor] = useState("#74c748");
  const [visualStarted, setVisualStarted] = useState(false);
  const [noteFromArray, setNoteFromArray] = useState("");
  const audioContextRef = useAudioContext();

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
    const scaleSize = scale.length;
    const normalizedDiff =
      ((diffInSemitones % scaleSize) + scaleSize) % scaleSize;
    setNoteFromArray(scale[normalizedDiff]);
    return noteFromArray;
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
  }, [tunerStarted]);

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

  function startTuner() {
    setTunerStarted(!tunerStarted);
    if (tunerStarted == true) {
      // console.log(audioContextRef.current.state);
      audioContextRef.current.suspend();
      // console.log(tunerStarted)
    } else if (tunerStarted == false) {
      // console.log(audioContextRef.current.state);
      audioContextRef.current.resume();
      // console.log(tunerStarted)
    }
  }

  return (
    <TunerWrapper>
      <Helmet>
        <script src="https://unpkg.com/ml5@latest/dist/ml5.min.js" />
      </Helmet>
      <StartButton type="button" onClick={() => startTuner()}>
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
