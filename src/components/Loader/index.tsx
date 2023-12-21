import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import StrawBerryImg from "/fruits/strawberry.png";
import GrapesImg from "/fruits/grapes.png";
import PeachImg from "/fruits/peach.png";
import BananaImg from "/fruits/banana.png";
import WatermelonImg from "/fruits/watermelon.png";
import AppleImg from "/fruits/apple.png";
import background from "/background/bg.png";
import title from "/user/title.png";
import spinWheel from "/spin/wheel.png";
import Arrow from "/spin/arrow.png";
import { Engine } from "tsparticles-engine";

// Candy Images

import candy1 from "/candy/candys1.png"
import candy2 from "/candy/candys2.png"
import candy3 from "/candy/candys3.png"
import candy4 from "/candy/candys4.png"
import candy5 from "/candy/candys5.png"
import candy6 from "/candy/candys6.png"

function GameLoader() {
	const particlesInit = useCallback(async (engine: Engine) => {
		await loadFull(engine);
	}, []);

	const particlesLoaded = useCallback(async (container: any) => {
		console.log(container);
	}, []);

	return (
		<>
			<div className="">
				<Particles
					id="tsparticles"
					init={particlesInit}
					loaded={particlesLoaded}
					options={{
						fullScreen: true,
						background: {
							image: `url(${background})`,
							// "position":"right bottom",
							size: "100% 100%",
							repeat: "no-repeat",
						},
						particles: {
							number: {
								value: 25,
								density: {
									enable: true,
									value_area: 600,
								},
							},
							color: {
								value: "#ffffff",
							},
							shape: {
								type: "image", // Change the shape to "image"
								images: [
									// Use an array to store multiple images
									{
										src: `${candy1}`, // Set the image URL for the first image
										width: 300, // Set the width of the first image
										height: 300, // Set the height of the first image
									},
									{
										src: `${candy2}`, // Set the image URL for the second image
										width: 300, // Set the width of the second image
										height: 300, // Set the height of the second image
									},
									{
										src: `${candy3}`, // Set the image URL for the second image
										width: 300, // Set the width of the second image
										height: 300, // Set the height of the second image
									},
									{
										src: `${candy4}`, // Set the image URL for the second image
										width: 300, // Set the width of the second image
										height: 300, // Set the height of the second image
									},
									{
										src: `${candy5}`, // Set the image URL for the second image
										width: 300, // Set the width of the second image
										height: 300, // Set the height of the second image
									},
									{
										src: `${candy6}`, // Set the image URL for the second image
										width: 300, // Set the width of the second image
										height: 300, // Set the height of the second image
									},

									// Add more image objects as needed for additional uploads
								],
							},

							opacity: {
								value: 1,
								random: true,
								anim: {
									enable: false,
									speed: 2,
									opacity_min: 1,
									sync: false,
								},
							},
							size: {
								value: 40,
								random: true,
								anim: {
									enable: false,
									speed: 2,
									size_min: 0.5,
									sync: false,
								},
							},
							line_linked: {
								enable: false,
								distance: 100,
								color: "#ffffff",
								opacity: 1,
								width: 0,
							},
							move: {
								enable: true,
								speed: 0.5,
								direction: "top",
								straight: true,
								out_mode: "out",
								bounce: false,
								attract: {
									enable: false,
									rotateX: 600,
									rotateY: 1200,
								},
							},
						},
						interactivity: {
							detect_on: "canvas",
							events: {
								onhover: {
									enable: false,
									mode: "repulse",
								},
								onclick: {
									enable: false,
									mode: "push",
								},
								resize: true,
							},
							modes: {
								grab: {
									distance: 800,
									line_linked: {
										opacity: 1,
									},
								},
								bubble: {
									distance: 790,
									size: 79,
									duration: 2,
									opacity: 1,
									speed: 3,
								},
								repulse: {
									distance: 400,
									duration: 0.4,
								},
								push: {
									particles_nb: 4,
								},
								remove: {
									particles_nb: 2,
								},
							},
						},
						retina_detect: true,
					}}
				/>
			</div>
			<div className="absolute fru">
				<img
					src={title}
					alt="title"
					className="h-28 w-96 sm:w-56 sm:h-16 md:w-60 md:h-16 "
				/>
				<img
					src={spinWheel}
					alt="title"
					className="w-96 h-96 sm:w-48 sm:h-48 md:w-60 md:h-60 spinintro"
				/>
				<img
					id="spin"
					src={Arrow}
					alt="arrow"
					className="absolute w-8 h-14 xl:ml-1 xl:-mt-6 sm:w-6 sm:h-9 sm:mt-2 sm:ml-0.5 md:w-7 md:h-10 md:-mt-3 md:ml-0 lg:w-8 lg:h-11 lg:-mt-6 lg:-ml-1 2xl:w-12 2xl:h-16 2xl:-mt-10"
				/>
				<div className="w-3/5 mt-20 ml-10 progress sm:mt-4 md:mt-6 md:ml-6">
					<div className="h-8 progress-value sm:h-4 md:h-5 "></div>
				</div>
			</div>
		</>
	);
}

export default GameLoader;
