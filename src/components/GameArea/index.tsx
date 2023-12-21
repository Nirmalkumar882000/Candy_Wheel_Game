import { FC, useContext, useEffect, useRef, useState } from "react";
import SpinWheel from "../SpinWheel";
import { AuthData, OnlineUser } from "../../App";
import StrawBerryImg from "/fruits/strawberry.png";
import GrapesImg from "/fruits/grapes.png";
import PeachImg from "/fruits/peach.png";
import BananaImg from "/fruits/banana.png";
import WatermelonImg from "/fruits/watermelon.png";
import AppleImg from "/fruits/apple.png";
import BoardImg from "/fruits/board.png";
import FrameImg from "/user/frame.png";
import Avatar from "/user/avatar.png";
import Frame from "/modal/frame.png";

// numbers images

import one from "/number/1.png"
import two from "/number/2.png"
import three from "/number/3.png"
import four from "/number/4.png"
import five from "/number/5.png"
import six from "/number/6.png"


// Candy Images

import candy1 from "/candy/candys1.png"
import candy2 from "/candy/candys2.png"
import candy3 from "/candy/candys3.png"
import candy4 from "/candy/candys4.png"
import candy5 from "/candy/candys5.png"
import candy6 from "/candy/candys6.png"


// Board Banner Images
import banner1 from "/banner/one.png"
import banner2 from "/banner/two.png"
import banner3  from "/banner/three.png"
import banner4 from "/banner/four.png"
import banner5  from "/banner/five.png"
import banner6 from "/banner/six.png"


import { SocketContext } from "../../context/socket/socket";
import { SoundContext } from "../../context/sound/sound";
import { useLocation } from "react-router-dom";

export interface BetValues {
	bet1: number;
	bet2: number;
	bet3: number;
	bet4: number;
	bet5: number;
	bet6: number;
}

interface GameAreaProps {
	startSpin: string;
	betStart: boolean;
	authData?: AuthData;
	setAuthData: React.Dispatch<React.SetStateAction<AuthData | undefined>>;
	onlineUsers: OnlineUser[];
	setOnlineUsers: React.Dispatch<React.SetStateAction<OnlineUser[]>>;
}

const fruitImages = [
	PeachImg,
	GrapesImg,
	AppleImg,
	BananaImg,
	StrawBerryImg,
	WatermelonImg,
];

const GameArea: FC<GameAreaProps> = ({
	startSpin,
	authData,
	setAuthData,
	betStart,
	onlineUsers,
}) => {
	const socket = useContext(SocketContext);
	const { playSigleCoin } = useContext(SoundContext);

	const [coins, setCoins] = useState(0);
	const [spin, setSpin] = useState(false);

	const locationParams = useLocation();
	const searchParams = new URLSearchParams(locationParams.search);

	const [betValues, setBetValues] = useState<BetValues>({
		bet1: 0,
		bet2: 0,
		bet3: 0,
		bet4: 0,
		bet5: 0,
		bet6: 0,
	});

	const betValuesRef = useRef<BetValues>({
		bet1: 0,
		bet2: 0,
		bet3: 0,
		bet4: 0,
		bet5: 0,
		bet6: 0,
	});

	const [overallCoins, setOverAllCoins] = useState({
		bet1: 0,
		bet2: 0,
		bet3: 0,
		bet4: 0,
		bet5: 0,
		bet6: 0,
	});

	const [virtualCoins, setVirtualCoins] = useState({
		bet1: 0,
		bet2: 0,
		bet3: 0,
		bet4: 0,
		bet5: 0,
		bet6: 0,
	});

	const [wonModal, setWonModal] = useState(false);
	const [show, setShow] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const [wonData, setWonData] = useState({
		reward: 0,
		coins: 0,
		value: -1,
	});

	useEffect(() => {
		socket.on("virtualCoins", (virtualCoinsBetted) => {
			console.log("Virtual Coins", virtualCoinsBetted);
			setVirtualCoins(virtualCoinsBetted);
		});

		socket.on("overallCoins", (overallCoinsBetted) => {
			console.log("OverAll Coins", overallCoins);
			setOverAllCoins(overallCoinsBetted);
		});

		return () => {
			socket.off("overallCoins");
			socket.off("virtualCoins");
		};
	}, []);

	const sleepTimeout = (interval: number) => {
		return new Promise((resolve) => {
			setTimeout(resolve, interval);
		});
	};

	const handleBet = async (
		bet: string,
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (authData?.coins) {
			if (!betStart) {
				setModalMessage("Wait for next round");
				setShow(true);
				setTimeout(() => {
					setShow(false);
				}, 2000);
			} else if (coins === 0) {
				setModalMessage("Please Select Coins");
				setShow(true);
				setTimeout(() => {
					setShow(false);
				}, 2000);
			} else if (authData.coins < coins) {
				setModalMessage("Not Enough Coins");
				setShow(true);
				setTimeout(() => {
					setShow(false);
				}, 2000);
			} else {
				const betsAllowed = Object.values(betValues).filter(
					(b) => b !== 0
				);

				if (betsAllowed.length < 5) {
					socket.emit("coinsBetting", { [bet]: coins });

					console.log("Socket Emitted");

					const element = e.target;

					const coinOuterContainer =
						document.getElementById("coinOuter");
					coinOuterContainer?.classList.add("animate-shake");

					// Create and animate multiple coins
					const numCoins = 5; // Adjust the number of coins as needed

					for (let i = 0; i < numCoins; i++) {
						createCoinAnimation(element);
						await sleepTimeout(100);
					}

					coinOuterContainer?.classList.remove("animate-shake");

					setAuthData((prev) => ({
						...prev,
						coins: prev?.coins ? prev.coins - coins : prev?.coins,
					}));
					betValuesRef.current = {
						...betValuesRef.current,
						[bet]: coins,
					};

					setBetValues((prev) => ({
						...prev,
						[bet]: coins,
					}));
				} else {
					setModalMessage("Only 5 Bets Allowed");
					setShow(true);

					setTimeout(() => {
						setShow(false);
					}, 2000);
				}
			}
		}
	};

	const createCoinAnimation = (element: any) => {
		playSigleCoin();
		// Create a new coin element
		const coin = document.createElement("div");
		coin.className = "coin xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 lg:w-8 lg:h-8";
		coin.style.left = `${element.offsetLeft}px`;
		coin.style.top = `${element.offsetTop}px`;
		document.body.appendChild(coin);

		// Animate the coin to the cart
		const coinContainer = document.getElementById("coinContainer"); // Assuming you have a cart element with the class "color"
		const coinAnimation = coin.animate(
			[
				{
					top: `${coinContainer?.offsetTop}px`,
					left: `${coinContainer?.offsetLeft}px`,
				},
				{
					top: `${element.offsetTop}px`,
					left: `${element.offsetLeft}px`,
				},
			],
			{
				duration: 500,
			}
		);

		// When the animation is complete, remove the coin element
		coinAnimation.onfinish = () => {
			coin.remove();
		};
	};

	let filterOnlineUsers = onlineUsers.filter(
		(user) => user.userId !== parseInt(searchParams.get("userId") as string)
	);

	const formatNumber = (num: number) => {
		const map = [
			{ suffix: "T", threshold: 1e12 },
			{ suffix: "B", threshold: 1e9 },
			{ suffix: "M", threshold: 1e6 },
			{ suffix: "K", threshold: 1e3 },
		];

		const found = map.find((x) => Math.abs(num) >= x.threshold);
		if (found) {
			const formatted = (num / found.threshold).toFixed(0) + found.suffix;
			return formatted;
		}

		return num;
	};

	return (
		<>
			<div className="flex flex-col mt-10 sm:mt-3 md:mt-3 lg:mt-14 xl:mt-14 xl:gap-16 sm:gap-5 md:gap-7 lg:gap-14 2xl:gap-20 ">

				{/* 1  */}
				
				<div className="flex xl:gap-12 sm:gap-7 md:gap-12 lg:gap-10 2xl:gap-24">

					{/* Number One */}

					<div className="">
					<img src={one} alt="one" className="w-16 h-16 mt-10 ml-6 sm:w-3 sm:h-5 sm:mt-4 sm:ml-3 md:w-5 md:h-7 md:ml-4 md:mt-8 lg:w-7 lg:h-9 lg:ml-2 xl:w-10 xl:h-12 xl:ml-6 " />
					</div>

					{/* Avathar image */}

					<div className="-ml-6 sm:-ml-3 md:-ml-4 md:mt-3 lg:-ml-5 lg:mt-3 xl:-ml-1 img">
						<img
							src={FrameImg}
							alt="user"
							className="absolute w-32 h-32 xl:w-28 xl:h-28 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36"
						/>
						<img
							src={
								filterOnlineUsers[0]?.profilePic
									? filterOnlineUsers[0].profilePic
									: Avatar
							}
							alt="user"
							className="w-24 h-24 xl:w-20 xl:h-20 xl:ml-5 mt-5 ml-4 sm:w-10 sm:h-10 sm:mt-2 sm:ml-2.5 md:mt-2.5 md:ml-2 md:w-12 md:h-12 lg:w-20 lg:h-20 lg:mt-3 lg:ml-2 2xl:w-28 2xl:h-28 rounded-full"
						/>
					</div>
					
					{/* Board one */}
					<div
						className="mt-4 sm:mt-1 sm:-mr-5 md:mr-5 lg:-mr-20 xl:ml-5 2xl:mr-10 "
						onClick={(e) => handleBet("bet3", e)}
					>
						<img
							src={BoardImg}
							alt="board"
							className="w-32 h-32 xl:w-28 xl:h-28 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-28 lg:h-28 board rounded-[25px] md:rounded-[12px] sm:rounded-[11px] 2xl:w-36 2xl:h-36"
						/>
						<img
							src={candy1}
							alt="pic"
							className="w-12 h-12 ml-10 -mt-32 sm:w-5 sm:h-5 sm:-mt-12 sm:ml-4 md:w-6 md:h-6 md:-mt-14 md:ml-5 lg:w-10 lg:h-10 lg:-mt-24 lg:ml-8 animate-jelly xl:w-10 xl:h-10 xl:-mt-24 xl:ml-8 2xl:w-14 2xl:h-14"
						/>
						<div className="absolute text-white lg:text-sm xl:text-sm 2xl:text-lg sm:-mt-6 sm:ml-10 md:-mt-7 md:ml-11 lg:-mt-12 lg:ml-20 xl:-mt-12 xl:ml-20 2xl:-mt-14 2xl:ml-24 letter">
							<p>x15</p>
						</div>

						{/* Banner 1 */}

						<img className="w-24 mt-4 ml-5 sm:w-10  sm:mt-1.5 sm:ml-1.5 sm:h-4 md:w-12 md:h-5 md:ml-2 md:mt-1 lg:w-20 lg:h-8 lg:mt-3 lg:ml-4 xl:mt-2 xl:w-20 xl:ml-4 xl:h-9 " src={banner1} alt="banner1"/>
						
						<div className="mt-0 ml-6 sm:-mt-4 sm:ml-3 md:-mt-5 md:ml-4 lg:-mt-8 lg:ml-5 xl:-mt-9 xl:ml-5 2xl:-mt-10">
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Me : {formatNumber(betValues.bet3)}
								<br/>
								Total:{" "}
								{formatNumber(
									overallCoins.bet3 + virtualCoins.bet3
								)}
							</div>	
							{/* <div className="font-bold text-black letter lg:text-xs xl:text-sm 2xl:text-sm">
								Total:{" "}
								{formatNumber(
									overallCoins.bet3 + virtualCoins.bet3
								)}
							</div> */}
						</div>
					</div>
				</div>
							

				{/* 2 */}


				<div className="flex xl:gap-10 sm:gap-7 md:gap-12 lg:gap-10 2xl:gap-24 ">

					{/* Number 2 */}
				<div className="">
					<img src={two} alt="one" className="w-16 h-16 mt-10 ml-6 xl:w-10 xl:h-12 xl:ml-6 sm:w-3 sm:h-5 sm:mt-5 sm:ml-3 md:w-5 md:h-7 md:ml-4 md:mt-5 lg:w-7 lg:h-9 lg:ml-2" />
					</div>
					<div className="-ml-6 sm:-ml-3 md:-ml-4 lg:-ml-5 xl:ml-0 img">
						<img
							src={FrameImg}
							alt="user"
							className="absolute w-32 h-32 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36 xl:w-28 xl:h-28"
						/>
						<img
							src={
								filterOnlineUsers[1]?.profilePic
									? filterOnlineUsers[1].profilePic
									: Avatar
							}
							alt="user"
							className="w-24 h-24 mt-5 ml-4 sm:w-10 sm:h-10 sm:mt-2 sm:ml-2.5  md:mt-2.5 md:ml-2 md:w-12 md:h-12 lg:w-20 lg:h-20 lg:mt-3 lg:ml-2 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 rounded-full"
						/>
					</div>
					<div
						className="mr-10 sm:-mr-5 md:mr-5 lg:-mr-16 xl:ml-7 "
						onClick={(e) => handleBet("bet2", e)}
					>
						<img
							src={BoardImg}
							alt="board"
							className="w-32 h-32 xl:w-28 xl:h-28 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-28 lg:h-28 board  rounded-[25px] md:rounded-[12px] sm:rounded-[11px] 2xl:w-36 2xl:h-36"
						/>
						<img
							src={candy2}
							alt="pic"
							className="w-10 h-10 ml-10 -mt-32 sm:w-5 sm:h-5 sm:-mt-12 sm:ml-4 md:w-6 md:h-6 md:-mt-14 md:ml-5 lg:w-10 lg:h-10 lg:-mt-24 lg:ml-8 xl:ml-8 xl:-mt-24 animate-jelly 2xl:w-14 2xl:h-14"
						/>
						<div className="absolute text-white lg:text-sm xl:text-sm 2xl:text-lg letter sm:-mt-6 sm:ml-10 md:-mt-7 md:ml-11 lg:-mt-12 lg:ml-20 xl:-mt-12 xl:ml-20 2xl:-mt-14 2xl:ml-24">
							<p>x25</p>
						</div>
						{/* Banner 2 */}

						<img className="w-24 mt-4 ml-5 sm:w-10 sm:h-4 sm:mt-1 sm:ml-1.5 md:w-12 md:h-5 md:ml-2 md:mt-1 lg:w-20 lg:h-8 lg:mt-3 lg:ml-4 xl:w-20 xl:ml-4 xl:h-9 xl:mt-2" src={banner2} alt="banner2"/>
						
						<div className="mt-4 ml-6 sm:-mt-4 sm:ml-3 md:-mt-5 md:ml-4 lg:-mt-8 lg:ml-5 xl:-mt-9 xl:ml-5 2xl:-mt-10">
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Me : {formatNumber(betValues.bet2)}
							</div>
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Total:{" "}
								{formatNumber(
									overallCoins.bet2 + virtualCoins.bet2
								)}
							</div>
						</div>
					</div>
				</div>

				{/* 3 */}

				<div className="flex xl:gap-10 sm:gap-7 md:gap-12 lg:gap-10 2xl:gap-24">
				<div className="">
					<img src={three} alt="one" className="w-16 h-16 mt-10 ml-6 sm:w-3 sm:h-5 sm:mt-5 sm:ml-3 md:w-5 md:h-7 md:ml-4 md:mt-5 lg:w-7 lg:h-9 lg:ml-2 xl:w-10 xl:h-12 xl:mt-8 xl:ml-6" />
					</div>
					<div className="-ml-6 sm:-ml-2 md:-ml-4 lg:-ml-5 xl:-ml-1 img">
						<img
							src={FrameImg}
							alt="user"
							className="absolute w-32 h-32 xl:w-28 xl:h-28 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36"
						/>
						<img
							src={
								filterOnlineUsers[2]?.profilePic
									? filterOnlineUsers[2].profilePic
									: Avatar
							}
							alt="user"
							className="w-24 h-24 mt-5 ml-4 sm:w-10 sm:h-10 sm:mt-2 sm:ml-2.5 md:mt-2.5 md:ml-2 md:w-12 md:h-12 lg:mt-3 lg:ml-2 lg:w-20 lg:h-20 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 rounded-full"
						/>	
					</div>
					<div
						className="mr-10 sm:-mr-5 md:mr-6 lg:-mr-20 xl:ml-7 "
						onClick={(e) => handleBet("bet4", e)}
					>
						<img
							src={BoardImg}
							alt="board"
							className="w-32 h-32 xl:w-28 xl:h-28 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-28 lg:h-28 board  rounded-[25px] md:rounded-[12px] sm:rounded-[11px] 2xl:w-36 2xl:h-36 "
						/>
						<img
							src={candy3}
							alt="pic"
							className="w-10 h-10 ml-10 -mt-32 sm:w-5 sm:h-5 sm:-mt-12 sm:ml-4 md:w-6 md:h-6 md:-mt-14 md:ml-5 lg:w-10 lg:h-10 lg:-mt-24 lg:ml-8 animate-jelly xl:-mt-24 2xl:w-14 2xl:h-14"
						/>
						<div className="absolute text-white lg:text-sm xl:text-sm 2xl:text-lg letter sm:-mt-6 sm:ml-9 md:-mt-7 md:ml-11 lg:-mt-12 lg:ml-20 xl:-mt-12 xl:ml-20 2xl:-mt-14 2xl:ml-24">
							<p>x5</p>
						</div> 

						{/* Banner 3 */}
						
						<img className="w-24 mt-4 ml-5 sm:w-10 sm:h-4 sm:mt-1 sm:ml-1.5 md:w-12 md:h-5 md:ml-2 md:mt-1 lg:w-20 lg:h-8 lg:mt-3 lg:ml-4 xl:w-20 xl:ml-4 xl:h-9 xl:mt-2" src={banner3} alt="banner3"/>
						
						<div className="mt-4 ml-6 sm:-mt-4 sm:ml-3 md:-mt-5 md:ml-4 lg:-mt-8 lg:ml-5 xl:-mt-9 xl:ml-5 2xl:-mt-10 ">
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Me : {formatNumber(betValues.bet4)}
							</div>
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Total:{" "}
								{formatNumber(
									overallCoins.bet4 + virtualCoins.bet4
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<SpinWheel
				coins={coins}
				setCoins={setCoins}
				spin={spin}
				setSpin={setSpin}
				startSpin={startSpin}
				authData={authData}
				setAuthData={setAuthData}
				betValuesRef={betValuesRef}
				betValues={betValues}
				setBetValues={setBetValues}
				setWonModal={setWonModal}
				setWonData={setWonData}
				wonData={wonData}
				show={show}
				setShow={setShow}
				setModalMessage={setModalMessage}
			/>

			<div className="flex flex-col mt-14 sm:mt-3 sm:ml-4 md:mt-3.5 md:ml-4 lg:ml-0 xl:gap-16 sm:gap-5 md:gap-7 lg:gap-14 2xl:gap-20 ">
				
				{/* 4 */}

				<div className="flex xl:gap-10 sm:gap-7 md:gap-7 lg:gap-10 2xl:gap-16">
					<div
						className="mt-2 xl:ml-0 sm:mt-1 md:ml-3 md:mt-3 lg:-ml-16 2xl:ml-10"
						onClick={(e) => handleBet("bet5", e)}
					>
						<img
							src={BoardImg}
							alt="board"
							className="w-32 h-32 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-28 lg:h-28 board rounded-[25px] md:rounded-[12px] sm:rounded-[11px] xl:w-28 xl:h-28 2xl:w-36 2xl:h-36"
						/>
						<img
							src={candy4}
							alt="pic"
							className="w-10 h-10 ml-10 -mt-32 sm:w-5 sm:h-5 sm:-mt-12 sm:ml-4 md:w-6 md:h-6 md:-mt-14 md:ml-5 lg:w-10 lg:h-10 lg:-mt-24 lg:ml-8 animate-jelly xl:w-10 xl:h-10 xl:-mt-24 xl:ml-8 2xl:w-14 2xl:h-14"
						/>
						<div className="absolute text-white letter lg:text-sm xl:text-sm 2xl:text-lg sm:-mt-6 sm:ml-9 md:text-xs md:-mt-7 md:ml-11 lg:-mt-12 lg:ml-20 xl:-mt-11 xl:ml-20 2xl:-mt-14 2xl:ml-24">
							<p>x5</p>
						</div>

						{/* Banner 4 */}

						<img className="w-24 mt-4 ml-5 sm:w-10 sm:h-4 sm:mt-1 sm:ml-1.5 md:w-12 md:h-5 md:ml-2 md:mt-1 lg:w-20 lg:h-8 lg:mt-3 lg:ml-4 xl:w-20 xl:ml-4 xl:h-9 xl:mt-2" src={banner4} alt="banner4"/>

						
						{/* Profile 4 */}
						
						<div className="mt-4 ml-6 sm:-mt-4 sm:ml-3 md:-mt-5 md:ml-4 lg:-mt-8 lg:ml-5 xl:ml-5 xl:-mt-9 2xl:-mt-10">
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Me : {formatNumber(betValues.bet5)}
							</div>
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Total:{" "}
								{formatNumber(
									overallCoins.bet5 + virtualCoins.bet5
								)}
							</div>
						</div>
					</div>
					<div className="img md:mt-2 lg:mt-2 xl:mr-4">
						<img	
							src={FrameImg}
							alt="user"
							className="absolute w-32 h-32 xl:w-28 xl:h-28 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36"
						/>
						<img
							src={
								filterOnlineUsers[3]?.profilePic
									? filterOnlineUsers[3].profilePic
									: Avatar
							}
							alt="user"
							className="w-24 h-24 mt-5 ml-4 sm:w-10 sm:h-10 sm:mt-2 sm:ml-2.5 md:mt-2.5 md:ml-2 md:w-12 md:h-12 lg:w-20 lg:h-20 lg:mt-3 lg:ml-2 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 rounded-full"
						/>
					</div>
					<div className="">
					<img src={four} alt="one" className="w-16 h-16 mt-10 mr-6 -ml-4 sm:w-3 sm:h-5 sm:mt-4 sm:ml-0 sm:mr-3 md:w-5 md:h-7 md:ml-0 md:mt-7 md:mr-3 lg:w-7 lg:h-9 xl:w-10 xl:h-12 xl:mr-6 xl:mt-8" />
					</div>
				</div>


				{/* 5 */}

				<div className="flex xl:gap-10 sm:gap-7 md:gap-7 lg:gap-10 2xl:gap-16">
					<div
						className="xl:ml-0 sm:ml-0 md:ml-3 lg:-ml-16 2xl:ml-10"
						onClick={(e) => handleBet("bet1", e)}
					>
						<img
							src={BoardImg}
							alt="board"
							className="w-32 h-32 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-28 lg:h-28 board  rounded-[25px] md:rounded-[12px] sm:rounded-[11px] 2xl:w-36 2xl:h-36 xl:w-28 xl:h-28"
						/>
						<img
							src={candy5}
							alt="pic"
							className="w-10 h-10 ml-10 -mt-32 sm:w-5 sm:h-5 sm:-mt-12 sm:ml-4 md:w-6 md:h-6 md:-mt-14 md:ml-5 lg:w-10 lg:h-10 lg:-mt-24 lg:ml-8 animate-jelly 2xl:w-14 2xl:h-14 xl:w-10 xl:h-10 xl:-mt-24"
						/>
						<div className="absolute text-white lg:text-sm xl:text-sm 2xl:text-lg letter sm:-mt-6 sm:ml-9 md:-mt-7 md:ml-11 lg:-mt-12 lg:ml-20 xl:-mt-11 xl:ml-20 2xl:-mt-14 2xl:ml-24">
							<p>x45</p>
						</div>

                          {/* Banner 5 */}

						<img className="w-24 mt-4 ml-5 sm:w-10 sm:h-4 sm:mt-1 sm:ml-1.5 md:w-12 md:h-5 md:ml-2 md:mt-1 lg:w-20 lg:h-8 lg:mt-3 lg:ml-4 xl:w-20 xl:h-9 xl:ml-4 xl:mt-2" src={banner5} alt="banner5"/>
						
						<div className="mt-4 ml-6 sm:-mt-4 sm:ml-3 md:-mt-5 md:ml-4 lg:-mt-8 lg:ml-5 xl:ml-5 2xl:-mt-10 xl:-mt-9 ">
							<div className="font-bold text-black letter xl:text-xs lg:text-xs 2xl:text-sm">
								Me : {formatNumber(betValues.bet1)}
							</div>
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Total:{" "}
								{formatNumber(
									overallCoins.bet1 + virtualCoins.bet1
								)}
							</div>
						</div>
					</div>
					<div className="img xl:mr-4">
						<img
							src={FrameImg}
							alt="user"
							className="absolute w-32 h-32 xl:w-28 xl:h-28 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36"
						/>
						<img
							src={
								filterOnlineUsers[4]?.profilePic
									? filterOnlineUsers[4].profilePic
									: Avatar
							}
							alt="user"
							className="w-24 h-24 mt-5 ml-4 sm:w-10 sm:h-10  sm:mt-2 sm:ml-2.5 md:mt-2.5 md:ml-2 md:w-12 md:h-12 lg:w-20 lg:h-20 lg:mt-3 lg:ml-2 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 rounded-full"
						/>
					</div>
					<div className="">
					<img src={five} alt="one" className="w-16 h-16 mt-8 mr-6 -ml-4 sm:w-3 sm:h-5 sm:mt-5 sm:ml-0 sm:mr-3 md:w-5 md:h-7 md:ml-0 md:mt-6 md:mr-3 lg:w-7 lg:h-9 lg:-ml-4 xl:w-8 xl:h-10 xl:mt-8 xl:mr-6" />
					</div>
				</div>


				{/* 6 */}



				<div className="flex xl:gap-10 sm:gap-7 md:gap-7 lg:gap-10 2xl:gap-16">
					<div
						className="xl:ml-0 sm:-ml-0 md:ml-3 lg:-ml-16 2xl:ml-12 "
						onClick={(e) => handleBet("bet6", e)}
					>
						<img
							src={BoardImg}
							alt="board"
							className="w-32 h-32 xl:w-28 xl:h-28 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-28 lg:h-28 board  rounded-[25px] md:rounded-[12px] sm:rounded-[11px] 2xl:w-36 2xl:h-36"
						/>
						<img
							src={candy6}
							alt="pic"
							className="w-10 h-10 ml-10 -mt-32 xl:w-10 xl:h-10 xl:ml-10 sm:w-5 sm:h-5 sm:-mt-12 sm:ml-4 md:w-6 md:h-6 md:-mt-14 md:ml-5 lg:w-10 lg:h-10 lg:-mt-24 lg:ml-8 xl:-mt-24 animate-jelly 2xl:w-14 2xl:h-14"
						/>
						<div className="absolute text-white lg:text-sm xl:text-sm 2xl:text-lg letter sm:-mt-6 sm:ml-9 md:-mt-7 md:ml-11 lg:-mt-12 lg:ml-20 xl:-mt-11 xl:ml-20 2xl:-mt-14 2xl:ml-24">
							<p>x2</p>
						</div>

						{/* Banner 6 */}

						<img className="w-24 mt-4 ml-5 sm:w-10 sm:mt-1 sm:h-4 sm:ml-1.5 md:w-12 md:h-5 md:ml-2 md:mt-1 lg:w-20 lg:h-8 lg:mt-3 lg:ml-4 xl:w-20 xl:h-9 xl:ml-4 xl:mt-2 " src={banner6} alt="banner6"/>
					
						<div className="mt-4 ml-6 sm:-mt-4 sm:ml-3 md:-mt-5 md:ml-4 lg:-mt-8 lg:ml-5 xl:ml-5 xl:-mt-9 2xl:-mt-10 ">
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Me : {formatNumber(betValues.bet6)}
							</div>
							<div className="font-bold text-black letter lg:text-xs xl:text-xs 2xl:text-sm">
								Total:{" "}
								{formatNumber(
									overallCoins.bet6 + virtualCoins.bet6
								)}
							</div>
						</div>
					</div>
					<div className="img xl:mr-4">
						<img
							src={FrameImg}
							alt="user"
							className="absolute w-32 h-32 xl:w-28 xl:h-28 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-24 lg:h-24 2xl:w-36 2xl:h-36"
						/>
						<img
							src={
								filterOnlineUsers[5]?.profilePic
									? filterOnlineUsers[5].profilePic
									: Avatar
							}
							alt="user"
							className="w-24 h-24 mt-5 ml-4 sm:w-10 sm:h-10 sm:mt-2 sm:ml-2.5 md:mt-2.5 md:ml-2 md:w-12 md:h-12 lg:w-20 lg:h-20 lg:mt-3 lg:ml-2 2xl:w-28 2xl:h-28 xl:w-20 xl:h-20 rounded-full"
						/>
					</div>
					<div className="">
					<img src={six} alt="one" className="w-16 h-16 mt-8 mr-6 -ml-4 sm:w-3 sm:h-5 sm:mt-5 sm:ml-0 sm:mr-3 md:w-5 md:h-7 md:ml-0 md:mt-6 md:mr-3 lg:w-7 lg:h-9 lg:mr-4 lg:-ml-4 xl:w-10 xl:h-12 xl:mr-6 xl:-ml-1"  />
					</div>
				</div>
			</div>

			

			{/* Won Modal */}
			{wonModal && (
				<div className="fixed inset-0 z-40 flex items-center justify-center animate-expand focus:outline-none backdrop-blur-sm">
					<img
						src={Frame}
						alt="frame"
						className="w-2/5 sm:w-96 md:w-96 lg:w-3/5 xl:w-2/5"
					/>
					<div className="absolute flex flex-col items-center justify-center gap-1 text-2xl text-white animate-jelly sm:text-2xl font-gamer font-outline-1">
						<img
							src={fruitImages[wonData.value]}
							className="w-10 h-10"
							alt="fruit"
						/>
						<div>Reward: {wonData.reward}</div>
						<div>You Won: {wonData.coins}</div>
					</div>
				</div>
			)}

			{/* Open bet Show modal */}

			{show && (
				<div className="fixed inset-0 z-50 flex items-center justify-center focus:outline-none backdrop-blur-sm hover:backdrop-blur-lg">
					<img
						src={Frame}
						alt="frame"
						className="w-2/5 h-1/2 sm:w-96 md:w-96 lg:w-3/5 xl:w-2/5"
					/>
					<div className="absolute flex items-center justify-center text-2xl text-white animate-jelly sm:text-2xl font-gamer font-outline-1">
						<h2>{modalMessage}</h2>
					</div>
				</div>
			)}
		</>
	);
};

export default GameArea;
