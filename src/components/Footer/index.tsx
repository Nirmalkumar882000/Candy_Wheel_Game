import { FC, useState } from "react";
import "./index.css"
import empty from "/coins/empty.png";
import coin1 from "/coins/coin1.png"
import coin2 from "/coins/coin2.png"
import coin3 from "/coins/coin3.png"
import coin4 from "/coins/coin4.png"
import coin5 from "/coins/coin5.png"
import trend from "/coins/trends.png"

interface FooterProps {
	setCoins: React.Dispatch<React.SetStateAction<number>>;
	coins: number;
}

const Footer: FC<FooterProps> = ({ setCoins, coins }) => {
	
	const handleCoins = (coins: number) => {
		setCoins(coins);
		console.log(coins);
	};


	const handleClick=(e)=>{
		console.log("clicked")
	}

	

	return (
		<>
			<div className="flex flex-row mt-20 -ml-10 -mr-24 sm:mt-10 sm:ml-2 sm:-mr-12 md:mt-6 md:-ml-5 lg:mt-36 lg:mr-0 lg:ml-0 xl:mt-20 xl:-ml-24 xl:-mr-0 coins">
				<div
					onClick={() => handleCoins(500)}
					className={`${coins === 500 ? "scale-105" : ""}`}
				>
					<img
						src={coin1}
						alt="coins"
						className={`w-24 h-24 mr-3 motion-safe:hover:scale-110 sm:w-8 sm:h-8 sm:mr-4 md:w-12 md:h-12 lg:w-20 lg:h-20 2xl:w-28 2xl:h-28 2xl:mr-10 glowing`}
					/>
					
				</div>

				<div
					className={`${coins === 1000 ? "scale-105" : ""}`}
					onClick={() => handleCoins(1000)}
				>
					<img
						src={coin2}
						alt="coins"
						className={`w-24 h-24 mr-3  2xl:w-28 2xl:h-28  motion-safe:hover:scale-110 sm:w-8 sm:h-8 sm:mr-4 md:w-12 md:h-12 lg:w-20 lg:h-20 2xl:mr-10`}
					/>
					
				</div>

				<div
					className={`${coins === 10000 ? "scale-105" : ""}`}
					onClick={() => handleCoins(10000)}
				>
					<img
						src={coin3}
						alt="coins"
						className={`w-24 h-24 mr-3  2xl:w-28 2xl:h-28 motion-safe:hover:scale-110 sm:w-8 sm:h-8 sm:mr-4 md:w-12 md:h-12 lg:w-20 lg:h-20 2xl:mr-10`}
					/>
					
				</div>

				<div
					className={`${coins === 50000 ? "scale-105" : ""}`}
					onClick={() => handleCoins(50000)}
				>
					<img
						src={coin4}
						alt="coins"
						className={`w-24 h-24 mr-3 2xl:w-28 2xl:h-28  motion-safe:hover:scale-110 sm:w-8 sm:h-8 sm:mr-4 md:w-12 md:h-12 lg:w-20 lg:h-20 2xl:mr-10`}
					/>
					
				</div>

				<div
					className={`${coins === 100000 ? "scale-105" : ""}`}
					onClick={() => handleCoins(100000)}
				>
					<img
						src={coin5}
						alt="coins"
						className={`w-24 h-24 mr-3 2xl:w-28 2xl:h-28 motion-safe:hover:scale-110 sm:w-8 sm:h-8 sm:mr-4 md:w-12 md:h-12 lg:w-20 lg:h-20 2xl:mr-10`}
					/>
					
				</div>
				<div  className="w-24 h-24 mt-5 sm:w-11 sm:h-11 sm:-mt-2 md:w-12 md:h-12 md:-mt-1 lg:w-16 lg:h-16 xl:w-16 xl:h-16">
				<img src={trend} alt="trends image" onClick={(e)=>handleClick(e)} />
			</div>
			
			</div>
		</>
	);
};

export default Footer;
