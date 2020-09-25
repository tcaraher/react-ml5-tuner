import React, { useEffect, useRef, useState } from 'react';
import ml5 from 'ml5';
import { motion } from 'framer-motion';
import useAudioContext from './use-audio-context';
import useInterval from './use-interval';
import './App.css';
// import scale2 from './scale2';

const A = 440;
const equalTemperment = 1.059463;
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

function ftoSemitoneDiff(freq) {
  let diffInSemitones = 0;
  if (!freq) {
    return null;
  }
  // See equations on figuring out equal temperment w/ the freqency you have.
  // But we're rounding them b/c we need the semitone the frequency is closest to...
  return (diffInSemitones = Math.round(
    Math.log(freq / A) / Math.log(equalTemperment)
  ));
}

function semiDifftoOutOfTune(freq, diffInSemitones) {
  let diff = 0
  // using the difference in semitones to figure out what the correctFreq should be,
  // then getting difference
  const correctFreq = A * Math.pow(equalTemperment, diffInSemitones);
  diff = freq - correctFreq;
  // set a max difference...
  if (diff > 25) {
    diff = 25
  } else if (diff < -25) {
    diff = -25
  }
  return diff;
}

function semiDifftoNote(freq, diffInSemitones) {
  let note = scale2[0];
  if (diffInSemitones > 0) {
    diffInSemitones = diffInSemitones % 12; // going back over array of scale if semitone above A
    note = scale2[diffInSemitones];
  } else if (diffInSemitones < 0) {
    // same but if semitone below A
    diffInSemitones = diffInSemitones % -12;
    note = scale2[scale2.length + diffInSemitones];
  }
  return note;
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
        setDiff(
          semiDifftoOutOfTune(detectedPitch, ftoSemitoneDiff(detectedPitch))
        );
        // setAnim(fToNote(detectedPitch)*50)
      } else if (frequencies.length >= 10) {
        setFrequencies([...frequencies.slice(1), detectedPitch]);
        setPitchFreq(detectedPitch);
        setDiff(
          semiDifftoOutOfTune(detectedPitch, ftoSemitoneDiff(detectedPitch))
        );
        // setAnim(fToNote(detectedPitch)*50)
      }
    });
  }, 200);

  const midis = frequencies.map(freqToMidi).filter((midiNum) => !!midiNum);
  const { mode: modalMidi, greatestFreq, modalMisses } = modeWithConfidence(
    midis,
    10
  );
  // const confidence = (greatestFreq - 3) / Math.max(modalMisses, 1);

  return (
    <div>
      <h1>Note from midi: {freqToNote(pitchfreq)} </h1>
      <h2>My Notes: {semiDifftoNote(pitchfreq, ftoSemitoneDiff(pitchfreq))}</h2>
      <p>freq:{pitchfreq}</p>
      {/* <p>diff: {diffInNote(pitchfreq)}</p> */}
      <p>semi {diff}</p>
      <motion.div
        animate={{
          y: -diff * 15, // grrr this isn't working. got it! Your diff func was returnig n/a, not null
          // nevermind. still sooo sensitive
        }}
      >
        <hr />
      </motion.div>
    </div>
  );
};

export default TunerSimple;
