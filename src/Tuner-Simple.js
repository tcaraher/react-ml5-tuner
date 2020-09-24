import React, { useEffect, useRef, useState } from 'react';
import ml5 from 'ml5';
import {motion} from "framer-motion";
import useAudioContext from './use-audio-context';
import useInterval from './use-interval';
import logo from './logo.svg';
import './App.css';

const scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function freqToMidi(f) {
  if (!f) {
    return;
  }
  const mathlog2 = Math.log(f / 440) / Math.log(2);
  return Math.round(12 * mathlog2) + 69;
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

const TunerSimple = () => {
  const pitchDetectorRef = useRef();
  const audioContextRef = useAudioContext();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [frequencies, setFrequencies] = useState([]);
  const [pitchfreq, setPitchFreq] = useState(0); // displays the frequency.
  const [didFreqChange, setDidFChange] = useState(false);
  const [isFreqNull, setIsFreqNull] = useState(true);

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
      } else if (frequencies.length >= 10) {
        setFrequencies([...frequencies.slice(1), detectedPitch]);
        setPitchFreq(detectedPitch);
      }
    });
  }, 0);

  const midis = frequencies.map(freqToMidi).filter((midiNum) => !!midiNum);
  const { mode: modalMidi, greatestFreq, modalMisses } = modeWithConfidence(
    midis,
    10
  );
  const confidence = (greatestFreq - 3) / Math.max(modalMisses, 1);


  return (
    <div>
      <h1>Note: {midiToNote(modalMidi)} </h1>
      {/*<p>{freqToNote(frequencies)}</p>*/}
      {/*<h2>Frequencies:</h2>*/}
      {/*<code>{JSON.stringify(frequencies)}</code>*/}
      {/*<p>{pitchfreq}</p>*/}
      {/*<p>{midis}</p>*/}
      <motion.div animate={{
        y: -pitchfreq
      }}>
        <img className="animated-img" src={logo} alt="hi" />
      </motion.div>
    </div>
  );
};

export default TunerSimple;
