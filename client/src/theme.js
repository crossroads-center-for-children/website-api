import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    secondary: {
      light: '#81bdff',
      main: '#428dfc',
      dark: '#0060c8',
      contrastText: '#ffffff',
    },
    primary: {
      light: '#44407c',
      main: '#151A4F',
      dark: '#000027',
      contrastText: '#ffffff',
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
    },
  },
});

export default theme;
