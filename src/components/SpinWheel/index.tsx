import { FC, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import SpinWheelImg from "/spin/wheel.png";
import Arrow from "/spin/arrow.png";
import { AuthData } from "../../App";
import Footer from "../Footer";
import { handleMultipleCoins } from "../utils/coins.utils";
import { SoundContext } from "../../context/sound/sound";
import { AxiosError } from "axios";
import { SocketContext } from "../../context/socket/socket";

interface SpinValue {
	spinValue: {
		value: number;
		reward: number;
	};
}

interface BetValues {
	bet1: number;
	bet2: number;
	bet3: number;
	bet4: number;
	bet5: number;
	bet6: number;
}

interface SpinWheelProps {
	coins: number;
	setCoins: React.Dispatch<React.SetStateAction<number>>;
	spin: boolean;
	setSpin: React.Dispatch<React.SetStateAction<boolean>>;
	startSpin: string;
	authData?: AuthData;
	setAuthData: React.Dispatch<React.SetStateAction<AuthData | undefined>>;
	betValuesRef: React.MutableRefObject<any>;
	betValues: any;
	setBetValues: React.Dispatch<React.SetStateAction<BetValues>>;
	setWonModal: React.Dispatch<React.SetStateAction<boolean>>;
	show: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	setModalMessage: React.Dispatch<React.SetStateAction<string>>;
	setWonData: React.Dispatch<
		React.SetStateAction<{
			reward: number;
			coins: number;
			value: number;
		}>
	>;
	wonData: {
		reward: number;
		coins: number;
		value: number;
	};
}

const segmentDegrees = [0, 60, 120, 180, 240, 300];

const SpinWheel: FC<SpinWheelProps> = ({
	setCoins,
	spin,
	setSpin,
	startSpin,
	betValues,
	betValuesRef,
	setBetValues,
	setWonModal,
	setWonData,
	coins,
	setAuthData,
	wonData,
	setShow,
	setModalMessage,
}) => {
	const fixedRotation = useRef(0);
	const wheelContainerRef = useRef<HTMLImageElement>(null);

	const socket = useContext(SocketContext);

	const wonDataRef = useRef<any>();

	const { playSigleCoin, playSpinWheel } = useContext(SoundContext);

	const locationParams = useLocation();
	const searchParams = new URLSearchParams(locationParams.search);

	const playGame = async () => {
		try {
			// const enterGamePayload = {
			// 	userId: searchParams.get("userId"),
			// 	gameKeyCode: searchParams.get("gameKeyCode"),
			// 	coinsBetted: totalCoinsBetted,
			// 	bet: betValues,
			// };
			// const encryptedPayload = jsencrypt.encrypt(
			// 	JSON.stringify(enterGamePayload)
			// );
			// const tok = localStorage.getItem("dgs_");
			// if (totalCoinsBetted !== 0) {
			// 	const response = await axios.post(
			// 		"/games/fruitLoops/play",
			// 		{
			// 			dgs: encryptedPayload,
			// 		},
			// 		{
			// 			headers: {
			// 				Authorization: `Bearer ${tok}`,
			// 			},
			// 		}
			// 	);
			// 	console.log(response.data);
			// 	if (response.status === 200) {
			// 		setBetValues({
			// 			bet1: 0,
			// 			bet2: 0,
			// 			bet3: 0,
			// 			bet4: 0,
			// 			bet5: 0,
			// 			bet6: 0,
			// 		});
			// 		const randomRotation =
			// 			segmentDegrees[response.data.spinValue.value];
			// 		wonDataRef.current = {
			// 			reward: response.data.newTransaction.reward,
			// 			coins: response.data.newTransaction.credited,
			// 			value: parseInt(response.data.spinValue.value),
			// 		};
			// 		setWonData({
			// 			reward: response.data.newTransaction.reward,
			// 			coins: response.data.newTransaction.credited,
			// 			value: parseInt(response.data.spinValue.value),
			// 		});
			// 		fixedRotation.current = randomRotation;
			// 	}
			// }
		} catch (error) {
			console.log(error);

			if ((error as AxiosError)?.response?.status === 506) {
				console.log(
					(error as AxiosError)?.response?.status,
					"Response Status"
				);

				setBetValues({
					bet1: 0,
					bet2: 0,
					bet3: 0,
					bet4: 0,
					bet5: 0,
					bet6: 0,
				});

				setModalMessage("Insufficient Balance from Provider");
				setTimeout(() => {
					setShow(false);
					setCoins(0);
				}, 2000);
			}
		}
	};

	const spinWheel = async () => {
		try {
			if (spin) return;

			let totalCoinsBetted = Object.values(betValuesRef.current).reduce(
				(acc: any, val: any) => {
					return acc + val;
				}
			);

			let userBettedCoins = {
				[searchParams.get("userId") as string]: {
					bet: betValuesRef.current,
					totalCoinsBetted,
				},
			};
			console.log(totalCoinsBetted, "TotalBetted Coins Outside");

			if (totalCoinsBetted !== 0) {
				console.log(totalCoinsBetted, "TotalBetted Coins Inside");
				socket.emit("bettedCoins", userBettedCoins);
			}

			setSpin(true);

			console.log(fixedRotation.current, "Fixed Rotation");

			// Set the random rotation as the fixed rotation
			const wheelContainer = wheelContainerRef.current;
			if (wheelContainer?.style) {
				wheelContainer.style.transition = "none";
				wheelContainer.style.transform = "rotate(0deg)";
			}

			await new Promise((resolve) => {
				setTimeout(() => {
					playSpinWheel();
					setSpin(false);

					if (wheelContainer?.style) {
						wheelContainer.style.transition =
							"transform 5s ease-out";
						wheelContainer.style.transform = `rotate(${
							3600 + fixedRotation.current
						}deg)`;
					}
					resolve("Spin Completed");
				}, 2000);
			});

			setTimeout(() => {
				handleMultipleCoins("betToProfile", playSigleCoin);
			}, 5000);

			if (totalCoinsBetted !== 0) {
				setTimeout(() => {
					setWonModal(true);

					setTimeout(() => {
						fixedRotation.current = 0;
						console.log(wonData, "WonData");
						setAuthData((prev) => ({
							...prev,
							coins: prev?.coins
								? prev.coins + wonDataRef.current.coins
								: prev?.coins,
						}));
						console.log("Done 2");

						setWonModal(false);
						setCoins(0);
					}, 2000);
				}, 7000);
			}
		} catch (error) {
			console.log(error);
			return;
		}
	};

	useEffect(() => {
		socket.on("playGame", (data: SpinValue) => {
			console.log(data);

			const randomRotation = segmentDegrees[data.spinValue.value];

			console.log(betValues, "BetValues");

			let winSpin = Object.keys(betValues)[data.spinValue.value];

			wonDataRef.current = {
				reward: data.spinValue.reward,
				coins: betValuesRef.current[winSpin] * data.spinValue.reward,
				value: data.spinValue.value,
			};

			console.log(wonDataRef.current, "WonData Current");

			setWonData({
				reward: data.spinValue.reward,
				coins: betValuesRef.current[winSpin] * data.spinValue.reward,
				value: data.spinValue.value,
			});
			fixedRotation.current = randomRotation;

			betValuesRef.current = {
				bet1: 0,
				bet2: 0,
				bet3: 0,
				bet4: 0,
				bet5: 0,
				bet6: 0,
			};

			setBetValues({
				bet1: 0,
				bet2: 0,
				bet3: 0,
				bet4: 0,
				bet5: 0,
				bet6: 0,
			});
		});

		return () => {
			socket.off("playGame");
		};
	}, []);

	useEffect(() => {
		if (startSpin === "spin") {
			spinWheel();
		}
	}, [startSpin]);

	return (
		<>
			<div className="flex flex-col justify-center xl:mt-20 xl:ml-10 xl:-mr-10">
				<div className="2xl:ml-14 sm:ml-4 lg:mt-10 sm:mr-2 md:ml-4 md:mr-2 lg:ml-32 xl:ml-10 spin">
					{/* Wheel */}

					<img
						ref={wheelContainerRef}
						src={SpinWheelImg}
						alt="spinwheel"
						className={`w-80 h-80 mt-5 xl:ml-1 sm:w-40 sm:h-40 sm:mt-7 sm:ml-10 md:w-56 md:h-56 md:-ml-0.5 md:mt-6 lg:w-64 lg:h-64 lg:mt-24 2xl:ml-24 2xl:mt-40 2xl:w-96 2xl:h-96 spinwheel`}
					/>
	
					{/* Arrow Spin */}
					<img
						id="spin"
						src={Arrow}
						alt="arrow"
						className="absolute w-10 h-12 xl:ml-36 xl:-mt-48 sm:w-5 sm:-pl-2 sm:h-7 sm:-my-24 sm:ml-28 md:w-7 md:h-10 md:-mt-36 md:ml-24 lg:w-8 lg:h-11 lg:-mt-40 lg:ml-28 2xl:w-14 2xl:h-16 2xl:ml-64 2xl:-mt-60 2xl:pl-2 arrowIcon "
					/>

					{/* Wheel */}
					{/* <img
						ref={wheelContainerRef}
						src={SpinWheelImg}
						alt="spinwheel"
						className={`w-96 h-96 mt-5 sm:w-48 sm:h-48 sm:mt-4 md:w-56 md:h-56 md:mt-6 lg:w-64 lg:h-64 lg:mt-24 2xl:w-96 2xl:h-96 2xl:mt-20 2xl:ml-24 spinwheel`}
					/> */}
					{/* Arrow Spin */}
					{/* <img
						id="spin"
						src={Arrow}
						alt="arrow"
						className="absolute w-16 h-20 ml-40 -mt-60 sm:w-8 sm:h-12 sm:-mt-32 sm:ml-20 md:w-9 md:h-11 md:-mt-36 md:ml-24 lg:w-9 lg:h-11 lg:-mt-40 lg:ml-28 2xl:ml-64 "
					/> */}
				</div>
				<Footer setCoins={setCoins} coins={coins} />
			</div>
		</>
	);
};

export default SpinWheel;
