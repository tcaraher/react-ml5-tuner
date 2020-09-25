import React, { useEffect, useRef, useState } from 'react';
import ml5 from 'ml5';
import { motion } from 'framer-motion';
import useAudioContext from './use-audio-context';
import useInterval from './use-interval';
import './App.css';

const A = 440;
const equalTemperment = 1.059463;
const scale = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

// Convert frequency detected to the number of semitones away from A440
function ftoSemitoneDiff(freq) {
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
function semiDifftoCentsDiff(freq, diffInSemitones) {
  let centDiff = 0;
  if (!freq) {
    return null;
  }
  //Use the difference in semitones to figure out what the correctFreq should be. 
  // It's the same equation to figure out the difference in semitone, just this time we're solving for the correct frequency, as we know the diffInSemis
  const correctFreq = A * Math.pow(equalTemperment, diffInSemitones);
  // Below is equation to conver diff in hz to cents. look it up... 
  // We're rounding it off. too many decimals..
  centDiff = Math.round(1200 * Math.log2(freq / correctFreq));
  // set a max difference??? not really needed
  // if (centDiff > 32) {
  //   centDiff = 32
  // } else if (centDiff < -32) {
  //   centDiff = -32
  // }
  return centDiff;
}

function semiDifftoNote(freq, diffInSemitones) {
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

const Tuner = (effect, deps) => {
  const pitchDetectorRef = useRef();
  const audioContextRef = useAudioContext();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [frequencies, setFrequencies] = useState([]);
  const [pitchfreq, setPitchFreq] = useState(0);
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    (async () => {
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      pitchDetectorRef.current = ml5.pitchDetection(
        '/models/pitch-detection/crepe',
        audioContextRef.current,
        micStream,
        () => setModelLoaded(true)
      );
    })();
  }, []);

  useInterval(() => {
    if (!pitchDetectorRef.current) {
      return;
    }
    pitchDetectorRef.current.getPitch((err, detectedPitch) => {
      // Putting frequencies into an array for no real reason here yet. 
      // Need to try to smooth out the responses and take out anomalies somehow so think it'll help in future.
      if (frequencies.length < 10) {
        setFrequencies([...frequencies, detectedPitch]);
        setPitchFreq(Math.round(detectedPitch * 10) / 10);
        setDiff(
          semiDifftoCentsDiff(detectedPitch, ftoSemitoneDiff(detectedPitch))
        );
      } else if (frequencies.length >= 10) {
        setFrequencies([...frequencies.slice(1), detectedPitch]);
        setPitchFreq(Math.round(detectedPitch * 10) / 10);
        setDiff(
          semiDifftoCentsDiff(detectedPitch, ftoSemitoneDiff(detectedPitch))
        );
      }
    });
  }, 1000 / 30);

  return (
    <div>
      <div className="note-freq">
        <h2>Note: {semiDifftoNote(pitchfreq, ftoSemitoneDiff(pitchfreq))}</h2>
        <p>freq: {pitchfreq} </p>
        <p>cents: {diff}</p>
      </div>
      <div className="tuner-wrapper">
        <motion.hr
          className="diff-hr"
          animate={{
            y: -diff * 3,
          }}
        ></motion.hr>
        <hr className="ref-hr" />
      </div>
    </div>
  );
};

export default Tuner;
