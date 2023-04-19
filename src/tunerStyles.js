import styled from 'styled-components';
import { motion } from 'framer-motion';

export const TunerWrapper = styled.div `
  //border: 5px solid gray;
  width: 1300px;
  border-radius: 25px;
  //padding-top: 1rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  button,h2 {
    margin: 1rem auto;
  }
`

export const AnimationWrapper = styled.div`
  background-image: url("/tunergrid.svg");
  display: flex;
  justify-content: center;
  align-items: center;
  height: 397px;
  width: 896px;
  margin: auto;
  border: 5px solid gray;
  border-radius: 25px;
  padding: 1.6rem 1.2rem 0 1.6rem;
  .diff-hr {
    width: 700px;
    height: 5px;
    //background-color: #7db361;
    //border: 5px solid #7db361;
    border-radius: 25px;
    margin: 0 20px 32px 10px;
    //margin-bottom: 41px;
    //margin-right: 20px;
    //margin-left: 10px;
  }
  .ref-hr {
    width: 200px;
  }
  .small-note {
    margin-top: 20px;
    padding-left: 30px;
    text-align: right;
    
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
  height: 10rem;
  width: 10rem;
  margin-bottom: 40px;
`

export const StartButton = styled.div `
  width: 80px;
  text-align: center;
  font-size: 1.5rem;
  margin: 3rem auto;
  border: none;
  background: #404040;
  color: #ffffff;
  padding: 0.3rem 2.5rem;
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