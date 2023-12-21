import { FC, useContext, useEffect, useState } from "react";
import Setting from "/user/settings.png";
import Instruction from "/user/instruction.png";
import Profile from "/user/profileIcon.png";
import GameTitle from "/user/title.png";
import { AuthData, OnlineUser } from "../../App";
import { useLocation } from "react-router-dom";
import JSEncrypt from "jsencrypt";
import axios from "../../api/axios";
import Coin from "/coins/Coin.png";

// Modal Assets
import Frame from "/modal/frame.png";
import PlayerList from "/modal/playerList.png";
import Instructions from "/modal/instruction.png";
import UserFrame from "/user/frame.png";
import Cancel from "/modal/cancel.png";
import WoodFrame from "/modal/woodFrame.png";
import SettingText from "/modal/setting.png";
import Sound from "/modal/sound.png";
import Music from "/modal/music.png";
import Plus from "/modal/plus.png";
import Minus from "/modal/minus.png";
import { handleMultipleCoins } from "../utils/coins.utils";
import { SoundContext } from "../../context/sound/sound";

const STEP = 20;
interface HeaderProps {
	counter: number;
	authData?: AuthData;
	setSoundVolume: React.Dispatch<React.SetStateAction<number>>;
	soundVolume: number;
	onlineUsers: OnlineUser[];
	setOnlineUsers: React.Dispatch<React.SetStateAction<OnlineUser[]>>;
}

const publicKey = import.meta.env.VITE_PUBLIC_KEY;

const Header: FC<HeaderProps> = ({
	counter,
	authData,
	setSoundVolume,
	soundVolume,
	onlineUsers,
	setOnlineUsers,
}) => {
	const [showUserModal, setShowUserModal] = useState(false);
	const [showInstructionModal, setShowInstructionModal] = useState(false);
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [musicVolume, setMusicVolume] = useState(40);

	const { playSigleCoin } = useContext(SoundContext);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);

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

	const handleMusicVolumeChange = (event: any) => {
		setMusicVolume(event.target.value);
	};

	const handleSoundVolumeChange = (event: any) => {
		setSoundVolume(event.target.value);
	};

	const handleClick = (header: "profile" | "instruction" | "setting") => {
		if (header === "profile") {
			getOnlineUsers();
			setShowUserModal(true);
		} else if (header === "instruction") {
			setShowInstructionModal(true);
		} else if (header === "setting") {
			setShowSettingsModal(true);
		}
	};

	const handleMusicVolume = (volume: "increase" | "decrease") => {
		if (volume === "increase") {
			if (musicVolume < 100) {
				setMusicVolume((prev) => prev + STEP);
			} else {
				setMusicVolume(100); // Ensure the value doesn't exceed the maximum (100).
			}
		} else if (volume === "decrease") {
			if (musicVolume > 0) {
				setMusicVolume((prev) => prev - STEP);
			} else {
				setMusicVolume(0); // Ensure the value doesn't exceed the maximum (100).
			}
		}
	};

	const handleSoundVolume = (volume: "increase" | "decrease") => {
		if (volume === "increase") {
			if (soundVolume < 100) {
				setSoundVolume((prev) => prev + STEP);
			} else {
				setSoundVolume(100); // Ensure the value doesn't exceed the maximum (100).
			}
		} else if (volume === "decrease") {
			if (soundVolume > 0) {
				setSoundVolume((prev) => prev - STEP);
			} else {
				setSoundVolume(0); // Ensure the value doesn't exceed the maximum (100).
			}
		}
	};

	const playCoinsSound = () => {
		const emptyDiv = document.createElement("div");
		emptyDiv.onclick = () => {
			console.log("Clicked");
			handleMultipleCoins("profileToBet", playSigleCoin);
		};
		document.body.appendChild(emptyDiv);
		emptyDiv.click();
		emptyDiv.remove();
	};

	useEffect(() => {
		if (counter === 3) {
			playCoinsSound();
		}
	}, [counter]);

	return (
		<>
			<div className="relative flex justify-between sm:mt-0 md:mt-0 lg:mt-0">
				<div className="mt-4 ml-4 text-5xl font-black text-white font-outline-1 sm:mt-3 sm:ml-0 md:mt-4 lg:mt-5 sm:text-2xl md:text-2xl lg:text-3xl font-gamer timer">
					{counter !== 0
						? `00:${counter >= 10 ? `${counter}` : `0${counter}`}`
						: null}
				</div>
				<div
					id="coinOuter"
					className="absolute z-10 flex justify-center w-1/2 gap-1 mt-4 text-5xl font-black text-white sm:mt-4 md:mt-4 lg:mt-5 sm:text-2xl md:text-2xl lg:text-3xl font-gamer"
				>
					<img
						id="coinContainer"
						src={Coin}
						alt="coin"
						className="w-14 h-14 sm:w-8 md:w-8 lg:w-10 sm:h-8 md:h-8 lg:h-10 animate-jelly"
					/>
					<h3 className="font-outline-1">{authData?.coins}</h3>
				</div>
				<div className="absolute flex justify-center w-full mt-1 mb-2">
					<img
						src={GameTitle}
						alt="title"
						className="h-24 w-96 sm:w-40 sm:h-12 sm:mt-1 sm:-ml-0 md:w-52 md:h-12 md:mt-2 lg:w-72 lg:h-16 lg:mt-4 animate-jelly xl:ml-2"
					/>
				</div>
				
				<div className="flex flex-row md:mr-3">
					<img
						src={Setting}
						alt="setting"
						onClick={() => handleClick("setting")}
						className="mt-4 mr-3 w-14 h-14 sm:w-8 md:w-8 lg:w-10 sm:h-8 md:h-8 lg:h-10 animate-jelly"
					/>
					<img
						src={Instruction}
						alt="setting"
						onClick={() => handleClick("instruction")}
						className="mt-4 mr-3 w-14 h-14 sm:w-8 md:w-8 lg:w-10 sm:h-8 md:h-8 lg:h-10 animate-jelly"
					/>
					<img
						id="profileContainer"
						src={Profile}
						onClick={() => handleClick("profile")}
						alt="setting"
						className="mt-4 mr-3 w-14 h-14 sm:w-8 md:w-8 lg:w-10 sm:h-8 md:h-8 lg:h-10 profile animate-jelly"
					/>
				</div>
			</div>

			{showUserModal ? (
				<>
					<div className="fixed inset-0 z-50 flex items-center justify-center animate-expand focus:outline-none backdrop-blur-sm">
						<img
							src={Frame}
							alt="frame"
							className="w-2/5 sm:w-96 md:w-96 lg:w-2/3 xl:w-3/6 "
						/>
						<img
							src={PlayerList}
							alt="title"
							className="absolute w-64 mb-28 -mt-80 sm:mb-0 sm:w-44 sm:-mt-60 md:mb-0 md:w-44 md:-mt-60 lg:w-80 lg:mb-28 xl:w-64 xl:-mt-80"
						/>
						<div className="absolute w-2/6 mt-10 overflow-y-scroll xl:w-2/6 h-80 xl:h-64 no-scrollbar content sm:w-80 sm:h-48 md:w-96 md:h-48 lg:w-2/4 lg:h-72 ">
							{onlineUsers.map((user, index) => (
								<div
									key={index}
									className="ml-8 sm:ml-8 md:ml-9 xl:ml-3 lg:ml-5"
								>
									<img
										src={UserFrame}
										alt="frames"
										className="absolute mt-4 w-28 h-28 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 xl:w-24 xl:h-24"
									/>
									<img
										src={user.profilePic}
										alt="user"
										className="w-20 h-20 mt-8 ml-4 rounded-full xl:mr-4 xl:ml-4 sm:w-12 sm:h-12 sm:ml-2 sm:mt-6 md:w-14 md:h-14 md:ml-3 md:mt-7 lg:w-20 lg:h-20 xl:w-16 xl:h-16 lg:ml-4 xl:mt-8 "
									/>

									<h4 className="mt-5 ml-8 xl:mt-5 xl:ml-8 sm:mt-3 sm:ml-3 md:mt-4 md:ml-5 lg:mt-4 lg:ml-10 text-clip">
										{user.userName}
									</h4>
								</div>
							))}
						</div>
						<div className="absolute -mb-96 sm:-mb-36 md:-mb-40 xl:-mb-96 xl:pt-28">
							<img
								src={Cancel}
								className="w-16 h-16 mt-32 xl:w-20 xl:h-20 xl:mt-7 xl:ml-2 sm:w-10 sm:h-10 md:h-12 md:w-12 animate-jelly "
								alt="cancel"
								onClick={() => setShowUserModal(false)}
							/>
						</div>
					</div>
				</>
			) : null}

			{showInstructionModal ? (
				<>
					<div className="fixed inset-0 z-50 flex items-center justify-center animate-expand focus:outline-none backdrop-blur-sm hover:backdrop-blur-lg">
						<img
							src={Frame}
							alt="frame"
							className="w-2/5 sm:w-96 md:w-96 lg:w-3/5 xl:w-3/6"
						/>
						<img
							src={Instructions}
							alt="title"
							className="absolute mb-8 sm:mb-0 sm:w-44 sm:-mt-60 w-72 -mt-80 md:mb-0 md:w-44 md:-mt-60 lg:w-80 lg:mb-20 xl:-mt-96 "
						/>
						<div className="absolute mt-10 overflow-y-scroll h-80 xl:h-64 no-scrollbar content xl:ml-96 xl:mr-96 xl:pl-28 xl:pr-20 xl:mt-10 sm:ml-56 sm:h-48 sm:mt-8 sm:mr-52 md:ml-80 md:h-48 md:mt-8 md:mr-72 sm:w-72 md:w-72 lg:w-96 lg:h-80 lg:ml-96 lg:mr-96 ">
							<p className="font-serif font-extrabold mt-7 sm:mt-5 md:mt-5 md:text-xs xl:text-sm text sm:text-xs">
								1.Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Nulla vitae aliquam augue.
								Aenean vel massa eget augue pharetra dictum in
								at ipsum.
							</p>
							<p className="mt-6 font-serif font-extrabold sm:mt-4 md:text-xs xl:text-sm text sm:text-xs">
								2.Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Nulla vitae aliquam augue.
								Aenean vel massa eget augue pharetra dictum in
								at ipsum.
							</p>
							<p className="mt-6 font-serif font-extrabold sm:mt-4 md:text-xs xl:text-sm text sm:text-xs">
								3.Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Nulla vitae aliquam augue.
								Aenean vel massa eget augue pharetra dictum in
								at ipsum.
							</p>
							<p className="mt-6 font-serif font-extrabold sm:mt-4 md:text-xs xl:text-sm text sm:text-xs">
								3.Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Nulla vitae aliquam augue.
								Aenean vel massa eget augue pharetra dictum in
								at ipsum.
							</p>
							<p className="mt-6 font-serif font-extrabold sm:mt-4 md:text-xs xl:text-sm text sm:text-xs">
								3.Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Nulla vitae aliquam augue.
								Aenean vel massa eget augue pharetra dictum in
								at ipsum.
							</p>
							<p className="mt-6 font-serif font-extrabold sm:mt-4 md:text-xs xl:text-sm text sm:text-xs">
								3.Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Nulla vitae aliquam augue.
								Aenean vel massa eget augue pharetra dictum in
								at ipsum.
							</p>
							<p className="mt-6 font-serif font-extrabold sm:mt-4 md:text-xs xl:text-sm mb-7 xl:mb-7 text sm:text-xs">
								3.Lorem ipsum dolor sit amet, consectetur
								adipiscing elit. Nulla vitae aliquam augue.
								Aenean vel massa eget augue pharetra dictum in
								at ipsum.
							</p>
						</div>
						<div className="absolute -mb-96 sm:-mb-36 md:-mb-40 lg:-mb-80 xl:-mb-96 xl:pt-28">
							<img
								src={Cancel}
								className="w-16 h-16 mt-32 xl:w-20 xl:h-20 xl:mt-7 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-jelly"
								alt="cancel"
								onClick={() => setShowInstructionModal(false)}
							/>
						</div>
					</div>
				</>
			) : null}

			{showSettingsModal ? (
				<>
					<div className="fixed inset-0 z-50 flex items-center justify-center animate-expand focus:outline-none backdrop-blur-sm">
						<img
							src={WoodFrame}
							alt="frame"
							className="w-2/5 sm:w-96 md:w-96 lg:w-3/5 xl:w-3/6"
						/>
						<img
							src={SettingText}
							alt="title"
							className="absolute w-64 mb-8 -mt-80 sm:-mt-52 sm:w-40 xl:-mt-96 md:w-40 md:-mt-52"
						/>

						{/* Volume setting */}
						<div className="absolute sm:mb-2">
							<img
								src={Music}
								alt="title"
								className="w-40 ml-16 -mt-32 sm:w-24 sm:-mt-16 sm:ml-20 md:ml-20 md:-mt-16 md:w-24"
							/>
							<div className="flex flex-row mt-8 sm:mt-3 md:mt-3">
								<img
									src={Minus}
									alt="minus"
									className="absolute -mt-2 -ml-5 w-14 h-14"
									onClick={() =>
										handleMusicVolume("decrease")
									}
								/>
								<div className=" range">
									<input
										disabled
										step={STEP}
										type="range"
										value={musicVolume}
										onChange={handleMusicVolumeChange}
									/>
								</div>
								<img
									src={Plus}
									alt="minus"
									className="absolute ml-56 -mt-2 w-14 h-14"
									onClick={() =>
										handleMusicVolume("increase")
									}
								/>
							</div>
						</div>

						{/* sound effect */}
						<div className="absolute mt-72 md:mt-48">
							<img
								src={Sound}
								alt="title"
								className="w-40 ml-16 -mt-32 sm:w-24 sm:-mt-32 sm:ml-20 md:ml-20 md:-mt-16 md:w-24"
							/>
							<div className="flex flex-row mt-8 sm:mt-4 md:mt-2">
								<img
									src={Minus}
									alt="minus"
									className="absolute -mt-2 -ml-5 w-14 h-14"
									onClick={() =>
										handleSoundVolume("decrease")
									}
								/>
								<div className="range">
									<input
										disabled
										step={STEP}
										type="range"
										value={soundVolume}
										onChange={handleSoundVolumeChange}
									/>
								</div>
								<img
									src={Plus}
									alt="minus"
									className="absolute ml-56 -mt-2 w-14 h-14"
									onClick={() =>
										handleSoundVolume("increase")
									}
								/>
							</div>
						</div>

						<div className="absolute -mb-96 sm:-mb-36 xl:-mb-96 md:-mb-40 lg:-mb-80 lg:pt-2">
							<img
								src={Cancel}
								className="w-20 h-20 mt-32 xl:w-20 xl:h-20 xl:mt-50 xl:ml-2 sm:w-14 sm:h-14 md:w-14 md:h-14 lg:w-16 lg:h-16 animate-jelly"
								alt="cancel"
								onClick={() => setShowSettingsModal(false)}
							/>
						</div>
					</div>
				</>
			) : null}
		</>
	);
};

export default Header;
