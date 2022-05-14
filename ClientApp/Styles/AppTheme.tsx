import { createTheme, responsiveFontSizes, Theme } from "@mui/material";
import { amber, blueGrey, deepOrange } from "@mui/material/colors";

// https://material.io/resources/color/
// https://mui.com/customization/palette/
// https://mui.com/customization/color/
export const createAppTheme = () => {
	let theme = createTheme({
		palette: {
			primary: {
				main: amber[500],
			},
			secondary: {
				main: deepOrange[500],
			},
			background: {
				default: blueGrey[800],
				paper: blueGrey[900]
			},
			text: {
				primary: blueGrey[50]
			}
		},
		typography: {
			fontFamily: "'League Spartan', sans-serif"
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {

				}
			},
		}
	});

	theme = responsiveFontSizes(theme);
	return theme;
};