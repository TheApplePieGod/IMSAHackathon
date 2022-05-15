import { createTheme, responsiveFontSizes, Theme } from "@mui/material";
import { amber, blueGrey, deepOrange } from "@mui/material/colors";

// https://material.io/resources/color/
// https://mui.com/customization/palette/
// https://mui.com/customization/color/
export const createAppTheme = () => {
	let theme = createTheme({
		palette: {
			primary: {
				main: "#A2845A",
				contrastText: "#454F25"
			},
			secondary: {
				main: deepOrange[500],
			},
			background: {
				default: "#C3BA83",
				paper: "#9e9665"
			},
			text: {
				primary: "#454F25"
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
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: "10px"
					}
				}
			}
		}
	});

	theme = responsiveFontSizes(theme);
	return theme;
};