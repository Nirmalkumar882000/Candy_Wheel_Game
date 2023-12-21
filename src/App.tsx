import GameArea from "./components/GameArea";
import Header from "./components/Header";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import JSEncrypt from "jsencrypt";
import axios from "./api/axios";
import { SocketContext } from "./context/socket/socket";
import Frame from "/modal/frame.png";

//Lottie
import CoinstLottie from "./lottie/CoinsLottie";

//Music
import useSound from "use-sound";
import { SoundContext } from "./context/sound/sound";
import BetToProfile from "/sounds/multicoinsBetToProfile.mp3";
import ProfileToBet from "/sounds/multicoinsProfileToBet.mp3";
import SingleCoin from "/sounds/singleCoin.mp3";
import SpinWheel from "/sounds/spinWheelSound.mp3";
import GameLoader from "./components/Loader";

export interface AuthData {
	userId?: number;
	coins?: number;
	profilePic?: number;
	tok?: string;
}

export interface OnlineUser {
	userName: string;
	userId: number;
	profilePic: string;
}

const publicKey = import.meta.env.VITE_PUBLIC_KEY;

function App() {
	const socket = useContext(SocketContext);

	const [betModal, setBetModal] = useState(false);
	const [betStart, setBetStart] = useState(true);
	const [counter, setCounter] = useState(0);

	const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

	const [soundVolume, setSoundVolume] = useState(40);
	const [isPlaying, setIsPlaying] = useState({
		betToProfile: false,
		profileToBet: false,
		singleCoin: false,
		spinWheel: false,
	});

	const [currentComponent, setCurrentComponent] = useState(1);

	const [playBetToProfile, { stop: betToProfileStop }] = useSound(
		BetToProfile,
		{
			volume: soundVolume / 100,
		}
	);
	const [playProfileToBet, { stop: profileToBetStop }] = useSound(
		ProfileToBet,
		{
			volume: soundVolume / 100,
			onplay: () =>
				setIsPlaying((prev) => ({
					...prev,
					profileToBet: true,
				})),
			onend: () =>
				setIsPlaying((prev) => ({
					...prev,
					profileToBet: false,
				})),
		}
	);
	const [playSigleCoin, { stop: singleCoinStop }] = useSound(SingleCoin, {
		volume: soundVolume / 100,
		onplay: () =>
			setIsPlaying((prev) => ({
				...prev,
				singleCoin: true,
			})),
		onend: () =>
			setIsPlaying((prev) => ({
				...prev,
				singleCoin: false,
			})),
		playbackRate: 0.75,
	});
	const [playSpinWheel, { stop: spinWheelStop }] = useSound(SpinWheel, {
		volume: soundVolume / 100,
		onplay: () =>
			setIsPlaying((prev) => ({
				...prev,
				spinWheel: true,
			})),
		onend: () =>
			setIsPlaying((prev) => ({
				...prev,
				spinWheel: false,
			})),
	});

	const [authData, setAuthData] = useState<AuthData>();
	const [accessDenied, setAccessDenied] = useState(false);
	const [startSpin, setStartSpin] = useState<string>("");

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);

	const enterGame = async () => {
		try {
			const jsencrypt = new JSEncrypt();
			jsencrypt.setPublicKey(publicKey);

			const enterGamePayload = {
				userId: searchParams.get("userId"),
				deviceId: searchParams.get("deviceId"),
				gameKeyCode: searchParams.get("gameKeyCode"),
				lang: searchParams.get("lang"),
			};

			const encryptedPayload = jsencrypt.encrypt(
				JSON.stringify(enterGamePayload)
			);

			const response = await axios.post<AuthData>(
				"/games/fruitLoops/enterGame",
				{
					dgs: encryptedPayload,
				}
			);

			if (response.status === 200) {
				setAuthData(response.data);
				localStorage.setItem("dgs_", response.data.tok as string);
				socket.connect();
			}
		} catch (error) {
			console.log(error);
			setAccessDenied(true);
		}
	};

	const exitGame = async () => {
		try {
			const jsencrypt = new JSEncrypt();
			jsencrypt.setPublicKey(publicKey);

			const exitGamePayload = {
				userId: searchParams.get("userId"),
				gameKeyCode: searchParams.get("gameKeyCode"),
			};

			const encryptedPayload = jsencrypt.encrypt(
				JSON.stringify(exitGamePayload)
			);

			const tok = localStorage.getItem("dgs_");

			const response = await axios.post(
				"/games/fruitLoops/exitGame",
				{
					dgs: encryptedPayload,
				},
				{
					headers: {
						Authorization: `Bearer ${tok}`,
					},
				}
			);

			console.log(response.data);

			if (response.status === 200) {
				localStorage.removeItem("dgs_");
				socket.disconnect();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const onRefresh = () => {
		exitGame();
		socket.off("betStart");
		socket.off("betEnd");
		socket.off("counter");
		socket.disconnect();
	};

	useEffect(() => {
		if (currentComponent === 2) {
			// enterGame();
		}

		window.addEventListener("beforeunload", onRefresh);

		return () => {
			if (currentComponent === 2) {
				// exitGame();
			}
			window.removeEventListener("beforeunload", onRefresh);
		};
	}, [currentComponent]);

	const getOnlineUsers = async () => {
		try {
			const jsencrypt = new JSEncrypt();
			jsencrypt.setPublicKey(publicKey);

			const enterGamePayload = {
				gameKeyCode: searchParams.get("gameKeyCode"),
			};

			const encryptedPayload = jsencrypt.encrypt(
				JSON.stringify(enterGamePayload)
			);

			const tok = localStorage.getItem("dgs_");

			const response = await axios.post(
				"/games/fruitLoops/onlineSessions",
				{
					dgs: encryptedPayload,
				},
				{
					headers: {
						Authorization: `Bearer ${tok}`,
					},
				}
			);

			if (response.status === 200) {
				setOnlineUsers(response.data.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		socket.on("betStart", () => {
			setBetStart(true);
			setBetModal(true);
			setStartSpin("");

			setTimeout(() => {
				setBetModal(false);
			}, 3000);
		});

		socket.on("betEnd", () => {
			setBetStart(false);
			setBetModal(true);
			setStartSpin("spin");

			setTimeout(() => {
				setBetModal(false);
			}, 3000);
		});

		socket.on("getOnlineUsers", () => {
			getOnlineUsers();
		});

		socket.on("counter", (counter) => setCounter(counter));

		return () => {
			socket.off("betStart");
			socket.off("betEnd");
			socket.off("counter");
		};
	}, []);

	if (accessDenied) {
		return (
			<div className="text-6xl font-bold text-black">Access Denied</div>
		);
	}

	useEffect(() => {
		setTimeout(() => {
			setCurrentComponent(2);
		}, 6200);
	}, []);

	return (
		<>
			{currentComponent === 1 && <GameLoader />}
			{currentComponent === 2 && (
				<SoundContext.Provider
					value={{
						playBetToProfile,
						playProfileToBet,
						playSigleCoin,
						playSpinWheel,
						isPlaying,
						betToProfileStop,
						profileToBetStop,
						singleCoinStop,
						spinWheelStop,
					}}
				>
					<div className="h-screen bg-fixed bg-center bg-no-repeat bg-120% bg-main">
						<Header
							setSoundVolume={setSoundVolume}
							soundVolume={soundVolume}
							counter={counter}
							authData={authData}
							onlineUsers={onlineUsers}
							setOnlineUsers={setOnlineUsers}
						/>
						<div className="flex justify-center">
							<GameArea
								betStart={betStart}
								startSpin={startSpin}
								authData={authData}
								setAuthData={setAuthData}
								onlineUsers={onlineUsers}
								setOnlineUsers={setOnlineUsers}
							/>
						</div>
					</div>
				</SoundContext.Provider>
			)}

			{betModal ? (
				<>
					<div className="fixed inset-0 z-40 flex items-center justify-center animate-expand focus:outline-none backdrop-blur-sm">
						<img
							src={Frame}
							alt="frame"
							className="w-2/5 sm:w-96 md:w-96 lg:w-3/5 xl:w-2/5"
						/>
						<div className="absolute -mt-32 text-2xl animate-jelly win sm:text-xl sm:mt-4 md:mt-5 lg:mt-8">
							<h2 className="text-white font-gamer font-outline-1">
								{betStart
									? "Start Betting Coins"
									: "Stop Betting Coins"}
							</h2>
							<CoinstLottie />
						</div>
					</div>
				</>
			) : null}
		</>
	);
}

export default App;
