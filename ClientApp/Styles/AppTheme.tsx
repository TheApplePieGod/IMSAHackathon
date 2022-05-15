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
				main: "#736F54"
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
			fontFamily: "'Bahnschrift', sans-serif",
			h1: {
				fontSize: '50px',
			},
			h4: {
				fontSize: '40px',
			},
			h5: {
				fontSize: '30px',
			},
			body1: {
				fontSize: '20px',
			},
			button: {
				lineHeight: "2rem"
			}
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