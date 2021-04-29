import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import { StartButton, TunerWrapper } from "./tunerStyles";
import styled from "styled-components";
import { Button, Grid, Input, InputAdornment, Slider, TextField } from '@material-ui/core';
import { PlayArrow, Stop, VolumeUp } from '@material-ui/icons';

const Metronome = () => {
  const [metronomeStarted, setMetronomeStarted] = useState();

  const player = new Tone.Player("/click.wav").toDestination();
  const [value, setValue] = useState(80);

  useEffect(() => {
    if (!metronomeStarted) {
      Tone.Transport.cancel();
      return;
    }
    Tone.Transport.cancel();
    Tone.Transport.bpm.value = value;
    Tone.Transport.scheduleRepeat((time) => {
      player.start(time).stop(time + 0.1);
    }, "4n");
    Tone.Transport.start();
  }, [metronomeStarted, value]);

  // const marks = [
  //   {
  //     value: 40,
  //     label: "40 BPM",
  //   },
  //   {
  //     value: 60,
  //     label: "40 BPM",
  //   },
  //   {
  //     value: 80,
  //     label: "40 BPM",
  //   },
  //   {
  //     value: 100,
  //     label: "40 BPM",
  //   },
  // ];
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 300) {
      setValue(300);
    }
  };

  return (
    <MetronomeWrapper>
      <Grid className="slider" container spacing={2} alignItems="center">
        {/*<Grid item>*/}

        <Grid item xs>
          <Slider
            // marks={marks}
            min={30}
            max={340}
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              min: 40,
              max: 350,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
            startAdornment={<InputAdornment position="start">BPM</InputAdornment>}
          />
          {/*<TextField*/}
          {/*  value={value}*/}
          {/*  margin="dense"*/}
          {/*  onChange={handleInputChange}*/}
          {/*  onBlur={handleBlur}*/}
          {/*  inputProps={{*/}
          {/*    min: 40,*/}
          {/*    max: 350,*/}
          {/*    type: "number",*/}
          {/*    "aria-labelledby": "input-slider",*/}
          {/*  }}*/}
          {/*  id="outlined-number"*/}
          {/*  label="Number"*/}
          {/*  type="number"*/}
          {/*  InputLabelProps={{*/}
          {/*    shrink: true,*/}
          {/*  }}*/}
          {/*  variant="outlined"*/}
          {/*/>*/}
        </Grid>
      </Grid>
      <StartButton
        className="metronome-button"
        type="button"
        onClick={() => setMetronomeStarted(!metronomeStarted)}
      >
        {(metronomeStarted && <Stop fontSize={"large"}/>) || <PlayArrow fontSize={"large"}/>}
      </StartButton>
    </MetronomeWrapper>
  );
};

export default Metronome;

const MetronomeWrapper = styled.div`
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .slider {
    border: solid 1px darkgray;
    border-radius: 25px;
  }
  .metronome-button {
    
    padding:0.5rem;
    font-size: 2rem;
    text-align: center;
    //background-color: transparent;
    border: none;
    svg {
      color: white;
    }
  }
  .MuiInput-root {
    
    padding: 0.5rem;
    color: white;
    font-weight: 600;
    font-size: 1.2rem;
    p {
      color: darkgray;
    }
    input {
      width:60px;
    }
  }
`;
