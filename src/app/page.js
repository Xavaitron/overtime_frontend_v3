'use client'

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Web3 from "web3";

// Function to get user account
export const getUserAccount = async () => {
  if (window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      return accounts[0];
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      return null;
    }
  } else {
    console.warn("MetaMask not detected. Please install MetaMask.");
    return null;
  }
};

export default function Home() {
  const [account, setAccount] = useState(null);

  const handleConnect = async () => {
    const userAccount = await getUserAccount();
    if (userAccount) {
      setAccount(userAccount);
      console.log("Connected account:", userAccount);
    } else {
      console.error("Failed to connect to MetaMask.");
    }
  };

  useEffect(() => {
    const updateAccount = async () => {
      const userAccount = await getUserAccount();
      if (userAccount && userAccount !== account) {
        setAccount(userAccount);
        console.log("Account updated:", userAccount);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', updateAccount);
    }

    // Cleanup on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', updateAccount);
      }
    };
  }, [account]);

  return (
    <div className=" dark flex min-h-[100dvh] flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Connect to Metamask
          </h1>
          <p className="text-muted-foreground">
            Connect your Ethereum wallet to access decentralized applications.
          </p>
          <Button
            onClick={handleConnect}
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Connect Metamask
          </Button>
          {account && (
            <p className="mt-4 text-foreground">
              Connected account: {account}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
