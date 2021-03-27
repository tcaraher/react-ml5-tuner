import styled from 'styled-components';

export const TunerWrapper = styled.div `
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
  border: 5px solid white;
  border-radius: 25px;
  padding: 2rem;
  .diff-hr {
    width: 700px;
    border: 5px solid #7db361;

  }
  .ref-hr {
    width: 200px;
  }
`

export const InfoDiv = styled.div `
  font-size: 2rem;
  border: 5px solid #7db361;
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