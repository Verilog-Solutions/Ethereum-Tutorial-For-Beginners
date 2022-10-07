import React from "react";
import { useEffect, useState } from "react";
import {
	TinTinTokenContract,
	connectWallet,
	transferToken,
	loadTokenName,
	loadTokenAccountBalance,
	getCurrentWalletConnected,
} from "./util/web3interact.js";

import TinTinlogo from "./assets/tintinLogo.jpeg";

const TinTinToken = () => {
	const [walletAddress, setWallet] = useState("");                     // 连接钱包的地址
	const [status, setStatus] = useState("");                            // 状态信息，告诉user 现在的交互状态，
	const [tokenName, setTokenName] = useState("No connection.");        // Token名称
	const [tokenBalance, settokenBalance] = useState("No connection.");  // 智能合约交互时，获取的信息。
	const [toAddress, setToAddress] = useState("");                      // 发送token 接收方的地址

	// 当walletAddress值变化时，就会执行。 
	useEffect(() => {
		async function fetchData() {
			if (walletAddress !== "") {
				const tokenBalance = await loadTokenAccountBalance(walletAddress);
				settokenBalance(tokenBalance);
			}
			const tokenName = await loadTokenName();
			setTokenName(tokenName);
			const { address, status } = await getCurrentWalletConnected();
			setWallet(address);
			setStatus(status);
			addWalletListener();
			addSmartContractListener();
		}
		fetchData();
	}, [walletAddress]);

  // 监听metamask 连接账户的改变，然后实时显示在前端。
	function addWalletListener() {
		if (window.ethereum) {
			window.ethereum.on("accountsChanged", (accounts) => {
				if (accounts.length > 0) {
					setWallet(accounts[0]);
					setStatus(
						"👆🏽 input the transfer to addresst in the text-field above."
					);
				} else {
					setWallet("");
					setStatus("🦊 Connect to Metamask using the top right button.");
				}
			});
		} else {
			setStatus(
				<p>
					{" "}
					🦊{" "}
					<a target="_blank" href={`https://metamask.io/download.html`}>
						You must install Metamask, a virtual Ethereum wallet, in your
						browser.
					</a>
				</p>
			);
		}
	}

  // 监听 智能合约
	function addSmartContractListener() {
		TinTinTokenContract.events.Transfer({}, (error, data) => {
			console.log(data);
			if (error) {
				setStatus("😥 " + error.message);
			} else {
				setToAddress("");
				setStatus("token transfer completed");
			}
		});
	}

  // 连接钱包按钮被点击时候，执行连接钱包，并更新状态。
	const connectWalletPressed = async () => {
		const walletResponse = await connectWallet();
		setStatus(walletResponse.status);
		setWallet(walletResponse.address);
	};

  // 发送token，并更新状态。
	const onTransferPressed = async () => {
		const { status } = await transferToken(walletAddress, toAddress);
		setStatus(status);
	};

	//the UI of our component
	return (
		<div id="container">
			<img id="logo" src={TinTinlogo}></img>
			<button id="walletButton" onClick={connectWalletPressed}>
				{walletAddress.length > 0 ? (
					"Connected: " +
					String(walletAddress).substring(0, 6) +
					"..." +
					String(walletAddress).substring(38)
				) : (
					<span>Connect Wallet</span>
				)}
			</button>

			<h2 style={{ paddingTop: "50px" }}>Token Nmae:</h2>
			<p>{tokenName}</p>

			<h2 style={{ paddingTop: "50px" }}>Balance:</h2>
			<p>{tokenBalance}</p>

			<h2 style={{ paddingTop: "18px" }}>Transfer 1 TinTin Token To:</h2>

			<div>
				<input
					type="text"
					placeholder="transfer token to:"
					onChange={(e) => setToAddress(e.target.value)}
					value={toAddress}
				/>
				<p id="status">{status}</p>

				<button id="publish" onClick={onTransferPressed}>
					Transfer
				</button>
			</div>
		</div>
	);
};

export default TinTinToken;
