import React, { useEffect, useState } from "react";
import VeridaClient from "../api/veridaClient";
import { CopyToClipboard } from "react-copy-to-clipboard";
import VeridaLogo from "../assets/images/verida_logo.svg";
import { useNavigate } from "react-router-dom";

const BaseHeader = () => {
	const [isOpened, setIsOpened] = useState(true);
	const [isCopied, setIsCopy] = useState({ copied: false });
	const [profile, setProfile] = useState({});

	const navigate = useNavigate();

	const truncateDID = (did) => {
		return did && did.slice(0, 13);
	};

	const toggleDropdown = () => {
		setIsOpened(!isOpened);
	};

	const logout = async () => {
		await VeridaClient.logout();
		navigate("/connect");
	};

	useEffect(() => {
		//init profile
		setProfile(VeridaClient.profile);

		// Listen for profile change
		VeridaClient.on("profileChanged", (data) => {
			setProfile(data);
		});
	}, []);

	return (
		<header className='user-menu'>
			<img
				className='vda-meu-logo'
				height={"30"}
				src={VeridaLogo}
				alt={"verida-logo"}
			/>
			<div className='vda-menu'>
				<div className='vda-menu-widget'>
					<div className='vda-dropdown'>
						<div
							role='button'
							onClick={toggleDropdown}
							className={
								isOpened ? "vda-dropdown-top-active" : "vda-dropdown-top"
							}
						>
							{profile.avatar ? (
								<img alt='vda-avatar' src={profile.avatar} />
							) : (
								<img
									height='40'
									src='https://assets.verida.io/avatar.svg'
									alt='user-avatar'
								/>
							)}
						</div>
						<div className='vda-dropdown-profile'>
							<span>{profile.name}</span>
							<span>{truncateDID(profile.did)}</span>
						</div>
						{isOpened && (
							<div className='vda-dropdown-logout'>
								<div>
									<img
										src='https://s3.us-west-2.amazonaws.com/assets.verida.io/icon_duplicate.svg'
										alt='icon'
										title='Copy to clipboard'
									/>
									<CopyToClipboard
										text={profile.did}
										onCopy={() => {
											setIsCopy({ copied: true });
											setTimeout(() => {
												setIsCopy({ copied: false });
											}, 2000);
										}}
									>
										<span>
											{isCopied.copied ? "Copied !" : "Copy DID to Clip board"}{" "}
										</span>
									</CopyToClipboard>
								</div>
								<div>
									<img
										src='https://assets.verida.io/icon_search.svg'
										alt='icon'
									/>
									<span>
										<a
											href={`https://verida.network/did/${profile.did}`}
											target='_blank'
											rel='noopener noreferrer'
										>
											View DID in Account Explorer
										</a>
									</span>
								</div>

								<div
									role='button'
									className='vda-dropdown-logout-button'
									onClick={logout}
								>
									<img
										height='20'
										src='https://assets.verida.io/icon_logout.svg'
										alt='icon'
									/>
									<span> Log out </span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default BaseHeader;
