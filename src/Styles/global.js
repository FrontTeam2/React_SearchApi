import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    button {
        cursor: pointer;
    }

    button, input{
        border: none;
    }

    input:focus{
        outline: none;
    }

    li{
        list-style: none;
    }
`
export default GlobalStyles
