import { useLottie } from "lottie-react";
import CoinAnimation from "./coins.json";

const style = {
	height: 100,
};

const CoinstLottie = () => {
	const options = {
		animationData: CoinAnimation,
		loop: true,
		autoplay: true,
	};

	const { View } = useLottie(options, style);

	return View;
};

export default CoinstLottie;
