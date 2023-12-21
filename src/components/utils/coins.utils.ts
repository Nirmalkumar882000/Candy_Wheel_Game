const profileToBetDestination = {
	sm: [
		{ top: 80, left: 190 },
		{ top: 160, left: 190 },
		{ top: 230, left: 190 },
		{ top: 90, left: 500 },
		{ top: 160, left: 500 },
		{ top: 230, left: 500 },
	],
	md: [
		{ top: 90, left: 230 },
		{ top: 180, left: 230 },
		{ top: 270, left: 230 },
		{ top: 90, left: 620 },
		{ top: 180, left: 620 },
		{ top: 270, left: 620 },
	],
	lg: [
		{ top: 150, left: 270 },
		{ top: 300, left: 270 },
		{ top: 450, left: 270 },
		{ top: 150, left: 800 },
		{ top: 300, left: 800 },
		{ top: 450, left: 800 },
	],
	xl: [
		{ top: 180, left: 360 },
		{ top: 320, left: 360 },
		{ top: 460, left: 360 },
		{ top: 170, left: 1020 },
		{ top: 310, left: 1020 },
		{ top: 450, left: 1020 },
	],
	xxl: [
		{ top: 180, left: 360 },
		{ top: 380, left: 360 },
		{ top: 600, left: 360 },
		{ top: 180, left: 1350 },
		{ top: 380, left: 1350 },
		{ top: 600, left: 1350 },
	],
};

const betToProfileDestination = {
	sm: [
		{ top: 80, left: 190 },
		{ top: 160, left: 190 },
		{ top: 230, left: 190 },
		{ top: 90, left: 500 },
		{ top: 160, left: 500 },
		{ top: 230, left: 500 },
	],
	md: [
		{ top: 90, left: 230 },
		{ top: 180, left: 230 },
		{ top: 270, left: 230 },
		{ top: 90, left: 620 },
		{ top: 180, left: 620 },
		{ top: 270, left: 620 },
	],
	lg: [
		{ top: 150, left: 270 },
		{ top: 300, left: 270 },
		{ top: 450, left: 270 },
		{ top: 150, left: 800 },
		{ top: 300, left: 800 },
		{ top: 450, left: 800 },
	],
	xl: [
		{ top: 180, left: 360 },
		{ top: 320, left: 360 },
		{ top: 460, left: 360 },
		{ top: 170, left: 1020 },
		{ top: 310, left: 1020 },
		{ top: 450, left: 1020 },
	],
	xxl: [
		{ top: 180, left: 360 },
		{ top: 380, left: 360 },
		{ top: 600, left: 360 },
		{ top: 180, left: 1350 },
		{ top: 380, left: 1350 },
		{ top: 600, left: 1350 },
	],
};

const getScreenSize = () => {
	// Determine the screen size based on window width
	const windowWidth = window.innerWidth;
	if (windowWidth < 768) {
		return "sm";
	} else if (windowWidth < 1024) {
		return "md";
	} else if (windowWidth < 1168) {
		return "lg";
	} else if (windowWidth < 1600) {
		return "xl";
	} else {
		return "xxl";
	}
};

export const handleMultipleCoins = (
	coinsFlow: "profileToBet" | "betToProfile",
	playSound: any
) => {
	playSound();
	// Define an array of fixed destinations for different screen sizes
	const numCoins = coinsFlow === "profileToBet" ? 30 : 30;
	const screenSize = getScreenSize(); // Get the current screen size

	const fixedDestinations =
		coinsFlow === "profileToBet"
			? profileToBetDestination
			: betToProfileDestination;

	for (let i = 0; i < numCoins; i++) {
		const randomDestination =
			fixedDestinations[screenSize][
				Math.floor(Math.random() * fixedDestinations[screenSize].length)
			];
		setTimeout(() => {
			generateMultipleCoins(
				{ target: { offsetLeft: 0, offsetTop: 0 } },
				randomDestination,
				coinsFlow,
				playSound
			);
		}, i * 100);
	}
};

const generateMultipleCoins = (
	event: { target: { offsetLeft: number; offsetTop: number } },
	fixedDestination: { top: number; left: number },
	coinsFlow: "profileToBet" | "betToProfile",
	playSound: any
) => {
	playSound();
	const div = event.target;

	const coin = document.createElement("div");
	coin.className = "coin xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 lg:w-8 lg:h-8";
	coin.style.left = `${div.offsetLeft}px`;
	coin.style.top = `${div.offsetTop}px`;
	document.body.appendChild(coin);

	const profile = document.getElementById("profileContainer"); // Assuming you have a cart element with the class "cart"

	const coinsFlowAnimation =
		coinsFlow === "profileToBet"
			? [
					{
						top: `${profile?.offsetTop}px`,
						left: `${profile?.offsetLeft}px`,
					},
					{
						top: `${fixedDestination.top}px`,
						left: `${fixedDestination.left}px`,
					},
			  ]
			: [
					{
						top: `${fixedDestination.top}px`,
						left: `${fixedDestination.left}px`,
					},
					{
						top: `${profile?.offsetTop}px`,
						left: `${profile?.offsetLeft}px`,
					},
			  ];

	const coinAnimation = coin.animate(coinsFlowAnimation, {
		duration: coinsFlow === "profileToBet" ? 500 : 300,
	});

	coinAnimation.onfinish = () => {
		coin.remove();
		// You can add logic here to update the cart or keep track of the number of coins collected.
	};
};
