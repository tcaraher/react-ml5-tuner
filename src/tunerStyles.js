import styled from 'styled-components';
import { motion } from 'framer-motion';

export const TunerWrapper = styled.div `
  border: 5px solid gray;
  width: 80%;
  border-radius: 25px;
  margin: 10rem auto;
  margin-top: 10rem;
  display: flex;
  flex-direction: column;
  button,h2 {
    margin: 1rem auto;
  }
`

export const AnimationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  width: 800px;
  margin: auto;
  border: 5px solid gray;
  border-radius: 25px;
  padding: 2rem;
  .diff-hr {
    width: 700px;
    height: 5px;
    //background-color: #7db361;
    //border: 5px solid #7db361;
    border-radius: 25px;
  }
  .ref-hr {
    width: 200px;
  }
`

export const InfoDiv = styled(motion.div) `
  font-size: 2rem;
  //border: 5px solid #7db361;
  border-radius: 25px;
  padding: 3rem;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 150px;
  width: 150px;
`

export const StartButton = styled.div `
  width: 80px;
  text-align: center;
  font-size: 1.5rem;
  margin: 2rem auto;
  border: none;
  background: #404040;
  color: #ffffff;
  padding: 20px;
  text-transform: uppercase;
  border-radius: 6px;
  display: inline-block;
  transition: all 0.3s ease 0s;
  cursor:pointer;
  &:hover {
    //color: #7db361;
    font-weight: 700 !important;
    //letter-spacing: 3px;
    background: none;
    transition: all 0.3s ease 0s;
  }

`