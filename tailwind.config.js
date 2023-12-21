/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				sm: { min: "320px", max: "767px" },
				md: { min: "768px", max: "1023px" },
				lg: { min: "1024px", max: "1279px" },
				xl: { min: "1280px", max: "1535px" },
				"2xl": { min: "1536px" },
			},
			backgroundImage: {
				main: "url('/background/bg.png')",
				"spin-bg": "url('/background/bg-overlay.jpg')",
				"spin-wheel": "url('/spin/wheel.png')",
				"spin-wheel-bg": "url('/spin/wheelBorder.png')",
				"spin-arrow": "url('/spin/wheelBorder.png')",
			},
			backgroundSize: {
				'auto': 'auto',
				'cover': 'cover',
				'contain': 'contain',
				'50%': '50%',
				'105%':'105%',
				'110%': '110%',
				'120%':'120%'
			  },
			fontFamily: {
				gamer: ["Gamer", "cursive"],
				easy: ["easy", "cursive"],
			},
			keyframes: {
				jelly: {
					"25%": {
						transform: "scale(0.9, 1.1)",
					},
					"50%": {
						transform: "scale(1.1, 0.9)",
					},
					"75%": {
						transform: "scale(0.95, 1.05)",
					},
				},
				expand: {
					"0%": {
						transform: "scale(0.1)",
						opacity: 0,
					},
					"100%": {
						transform: "scale(1)",
						opacity: 1,
					},
				},
				shake: {
					"0%": { transform: "translate(1px, 1px) rotate(0deg)" },
					"10%": { transform: "translate(-1px, -2px) rotate(-1deg)" },
					"20%": { transform: "translate(-3px, 0px) rotate(1deg)" },
					"30%": { transform: "translate(3px, 2px) rotate(0deg)" },
					"40%": { transform: "translate(1px, -1px) rotate(1deg)" },
					"50%": { transform: "translate(-1px, 2px) rotate(-1deg)" },
					"60%": { transform: "translate(-3px, 1px) rotate(0deg)" },
					"70%": { transform: "translate(3px, 1px) rotate(-1deg)" },
					"80%": { transform: "translate(-1px, -1px) rotate(1deg)" },
					"90%": { transform: "translate(1px, 2px) rotate(0deg)" },
					"100%": { transform: "translate(1px, -2px) rotate(-1deg)" },
				},
				spin: {
					from: {
						transform: "rotate(0deg)",
					},
					to: {
						transform: "rotate(360deg)",
					},
				},
			},
			animation: {
				jelly: "jelly 1s ease-in-out infinite",
				expand: "expand 0.5s ease-in-out forwards",
				shake: "shake 0.5s infinite",
				spin: "spin 50s linear infinite",
				slowShake: "shake 5s infinite",
			},
			flex: {
				2: "50%",
			},
		},
	},
	plugins: [],
};
