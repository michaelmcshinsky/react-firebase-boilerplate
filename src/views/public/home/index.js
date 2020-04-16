import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Newsletter } from "@components";
import { TeamMember, WelcomeLead } from "./components";

export default function Home() {
	return (
		<>
			<div id="home-banner" className="bg-primary text-white">
				<Container className="text-center">
					<h1>
						<span role="img" aria-label="react">
							⚛️
						</span>{" "}
						React Firebase Boilerplate{" "}
						<span role="img" aria-label="firebase">
							🔥
						</span>
					</h1>
					<p className="lead">
						A boilerplate built to get all your projects off the ground quickly
					</p>
				</Container>
			</div>
			<section id="home-welcome" className="home-section bg-light">
				<Container>
					<Row>
						<Col sm="12">
							<Row>
								<Col sm="4">
									<WelcomeLead
										icon="desktop"
										title="Title"
										body="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
									/>
								</Col>
								<Col sm="4">
									<WelcomeLead
										icon="layer-group"
										title="Title"
										body="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
									/>
								</Col>
								<Col sm="4">
									<WelcomeLead
										icon="check-circle"
										title="Title"
										body="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			</section>
			<section id="home-showcase">
				<Container fluid className="p-0">
					<Row noGutters>
						<Col md={{ size: 6, order: 2 }} className="home-showcase-img"></Col>
						<Col md={{ size: 6, order: 1 }} className="my-auto px-5">
							<div className="my-5">
								<h2>Why a boilerplate?</h2>
								<p className="lead mb-0">
									Created to help myself and others get projects off the ground
									and running without having to create the same code for every
									project over and over and over and over...
								</p>
							</div>
						</Col>
					</Row>
					<Row noGutters>
						<Col md={{ size: 6, order: 1 }} className="home-showcase-img"></Col>
						<Col md={{ size: 6, order: 2 }} className="my-auto px-5">
							<div className="my-5">
								<h2>A Dash of Opinion</h2>
								<p className="lead mb-0">
									Some sense of structure is good and so this was built to get
									the job done but not so opinionated that you can't change the
									flow and structure to match your teams needs.
								</p>
							</div>
						</Col>
					</Row>
					<Row noGutters>
						<Col md={{ size: 6, order: 2 }} className="home-showcase-img"></Col>
						<Col md={{ size: 6, order: 1 }} className="my-auto px-5">
							<div className="my-5">
								<h2>What's baked in?</h2>
								<p className="lead mb-0">
									Firebase, Bootstrap and React are the primary ingredients.
									Everything else is a sprinkling of enhancement to make the
									experience more delightful while not getting in your way.
								</p>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
			<section id="home-about" className="home-section text-center bg-light">
				<h2 className="mb-5">Meet the Team</h2>
				<Row>
					<Col md="4">
						<TeamMember
							src="//via.placeholder.com/200x200/007bff/ffffff?text=Team+Member"
							title="Lorem ipsum dolor sit amet"
						/>
					</Col>
					<Col md="4">
						<TeamMember
							src="//via.placeholder.com/200x200/007bff/ffffff?text=Team+Member"
							title="Lorem ipsum dolor sit amet"
						/>
					</Col>
					<Col md="4">
						<TeamMember
							src="//via.placeholder.com/200x200/007bff/ffffff?text=Team+Member"
							title="Lorem ipsum dolor sit amet"
						/>
					</Col>
					<Col md="4">
						<TeamMember
							src="//via.placeholder.com/200x200/007bff/ffffff?text=Team+Member"
							title="Lorem ipsum dolor sit amet"
						/>
					</Col>
					<Col md="4">
						<TeamMember
							src="//via.placeholder.com/200x200/007bff/ffffff?text=Team+Member"
							title="Lorem ipsum dolor sit amet"
						/>
					</Col>
					<Col md="4">
						<TeamMember
							src="//via.placeholder.com/200x200/007bff/ffffff?text=Team+Member"
							title="Lorem ipsum dolor sit amet"
						/>
					</Col>
				</Row>
			</section>
			<section
				id="home-newsletter"
				className="home-section bg-secondary text-white"
			>
				<Newsletter />
			</section>
		</>
	);
}
