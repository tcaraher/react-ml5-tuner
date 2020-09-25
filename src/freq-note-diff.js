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


function ftoSemitoneDiff(freq) {
  const A = 440;
  const equalTemperment = 1.059463;
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

function semiDifftoOutOfTune(freq, diffInSemitones, equalTemperment, A) {
  // using the difference in semitones to figure out what the correctFreq should be,
  // then getting difference
  const correctFreq = A * Math.pow(equalTemperment, diffInSemitones);
  const diff = freq - correctFreq;
  return diff;
}

function semiDifftoNote(freq, diffInSemitones) {
  let note = scale2[0];
  if (diffInSemitones > 0) {
    diffInSemitones = (diffInSemitones % 12); // going back over array of scale if semitone above A
    note = scale2[diffInSemitones];
  } else if (diffInSemitones < 0) {
    // same but if semitone below A
    diffInSemitones = diffInSemitones % -12;
    note = scale2[scale2.length + diffInSemitones];
  }
  return note
}
