import React, { useEffect, useRef, useState } from 'react';
import ml5 from 'ml5';
import { motion } from 'framer-motion';
import useAudioContext from './use-audio-context';
import useInterval from './use-interval';
import logo from './logo.svg';
import './App.css';
import notes from './notes';
// import scale2 from './scale2';

const scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const scale2 = [
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
];


function freqToMidi(f) {
  if (!f) {
    return;
  }
  const mathlog2 = Math.log(f / 440) / Math.log(2);
  return Math.round(12 * mathlog2) + 69;
}

// Calculate how many semitones freq is away from 440.
function fToNote(f) {
  let A = 440;
  let i = 0;
  let semiDiff = 0;
  let note = scale2[i];
  if (!f) {
    return null;
  }
  semiDiff = Math.round(Math.log(f / A) / Math.log(1.059463)); 
  if (semiDiff > 11) {
    semiDiff = (semiDiff-12)
  } else if (semiDiff < -12) {
    semiDiff = (semiDiff + 12)
  }
  if (semiDiff < 0) {
    note = scale2[scale2.length + semiDiff]
  }
    note = scale2[semiDiff]
  let correctFreq = A * Math.pow(1.059463,semiDiff)
  let diff = f - correctFreq
  if (diff > 20 || diff < -20) {
    return diff = 0
  }
  return diff
  // can also return the note here too...
}

const midiToNote = (midiNum) => scale[midiNum % 12];
const freqToNote = (frequency) => midiToNote(freqToMidi(frequency));


const modeWithConfidence = (arr, limit) => {
  const numMapping = {};
  let greatestFreq = 0;
  let mode;
  for (const number of arr) {
    numMapping[number] = (numMapping[number] || 0) + 1;

    if (greatestFreq < numMapping[number]) {
      greatestFreq = numMapping[number];
      mode = number;
    }
  }

  let modalMisses = 0;
  for (const [key, frequency] of Object.entries(numMapping)) {
    if (Number(key) !== mode) {
      modalMisses += frequency;
    }
  }
  return { mode, greatestFreq, modalMisses };
};

const TunerSimple = (effect, deps) => {
  const pitchDetectorRef = useRef();
  const audioContextRef = useAudioContext();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [frequencies, setFrequencies] = useState([]);
  const [pitchfreq, setPitchFreq] = useState(0); // displays the frequency.
  const [diff, setDiff] = useState(0);
  // const [anim, setAnim] = useState(0)

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
      if (frequencies.length < 10) {
        setFrequencies([...frequencies, detectedPitch]);
        setPitchFreq(detectedPitch);
        setDiff(fToNote(detectedPitch))
        // setAnim(fToNote(detectedPitch)*50)
      } else if (frequencies.length >= 10) {
        setFrequencies([...frequencies.slice(1), detectedPitch]);
        setPitchFreq(detectedPitch);
        setDiff(fToNote(detectedPitch))
        // setAnim(fToNote(detectedPitch)*50)
      }
    });
  }, 0);

  const midis = frequencies.map(freqToMidi).filter((midiNum) => !!midiNum);
  const { mode: modalMidi, greatestFreq, modalMisses } = modeWithConfidence(
    midis,
    10
  );
  // const confidence = (greatestFreq - 3) / Math.max(modalMisses, 1);
  
console.log(pitchfreq)
  return (
    <div>
      <h1>Note: {freqToNote(pitchfreq)} </h1>
      <p>freq:{pitchfreq}</p>
      {/* <p>diff: {diffInNote(pitchfreq)}</p> */}
      <p>semi - {diff}</p>
      <motion.div
        animate={{
          y: -(10*Math.round(diff/10))*10, // grrr this isn't working. got it! Your diff func was returnig n/a, not null
          // nevermind. still sooo sensitive
        }}
      >
        <hr/>
      </motion.div>
    </div>
  );
};

export default TunerSimple;
