import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { palette } from '@material-ui/system';
import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#00838F',
    },
    secondary: {
      main: '#AD1457',
    },
    error: {
      main: '#FDD835',
    },
  },

});
