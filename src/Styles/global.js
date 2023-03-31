import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    font-family: 'NanumBarunGothic';
  }

  input {
    color: inherit;
    font: inherit;
    margin: 0;
    :focus-visible { outline: none }
  }
`;
