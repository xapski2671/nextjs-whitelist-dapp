import Head from "next/head"
import Image from "next/image"
import bg from "../assets/mythos.jpg"
import networkMapping from "../constants/networkMapping.json"
import WhitelistABI from "../constants/WhitelistABI.json"
import { ethers } from "ethers"
import useConnection from "../utils/useConnection"
import styles from "../styles/Home.module.css"
import { truncateStr } from "../utils/truncateStr"
import { useEffect, useState } from "react"

export default function Home() {

  const [navBg, setNavBg] = useState(false)

  const [noOfWhitelistedAddresses, setNoOfWhitelistedAddresses] = useState("0")
  const [joinedWhiteList, setJoinedWhitelist] = useState(false)

  const { isConnected, chainId, signer, account, connect } = useConnection()
  const whitelistContractAddress = networkMapping["4"]["WhiteList"][0]
  // console.log(whitelistContractAddress)

  async function retrieveWhitelistData()
  {
    if(typeof window.ethereum !== "undefined")
    {
      try{
        const whitelistContract = new ethers.Contract(whitelistContractAddress, WhitelistABI, signer)
        const whitelistedAddresses = await whitelistContract.s_addressesWhitelisted()
        const inWhitelist = await whitelistContract.s_whitelistedAddresses(account) // returns bool
        setNoOfWhitelistedAddresses(whitelistedAddresses.toString())
        setJoinedWhitelist(inWhitelist)
      }catch(e){console.log(e)}
    }
  }

  function handleScroll()
  {
    if(window.scrollY > 0)
    {
      setNavBg(true)
    }
    else{setNavBg(false)}
  }

  useEffect(()=>{
    window.addEventListener("scroll", handleScroll)
  },[])

  useEffect(()=>{
    async function runUI()
    {
      if(!isConnected){await connect()}
      await retrieveWhitelistData()
    }
    runUI()
  },[isConnected, account, chainId])

  return (
    <div className={styles["whitelist__home"]}>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="a whitelist dapp" content="whitelist dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles["nimg"]}>
        <Image alt='bg' src={bg} layout="fill" objectFit="cover"/>
      </div>

      <div className={styles["whitelist__home_container"]}>
        <div className={`${styles["whitelist__home-container--navbar"]} ${navBg ? styles["navBg"] : styles["noNavBg"]}`}>
          <div className={styles["whitelist__home-container--navbar--logo"]}>
            <h3>Mythos</h3>
          </div>
          <div className={styles["whitelist__home-container--navbar--connect"]}>
            {
              isConnected 
                ? <button>Connected | {truncateStr(account || "", 12)}</button>
                : <button onClick={connect}>Connect Wallet</button>
            }
          </div>
        </div>
        
        <div className={`section__padding ${styles["whitelist__home-container--header"]}`}>
          <div className={styles["whitelist__home-container--header--hero_text"]}>
            <h1>MYTHOS</h1>
            <p>
              {"Welcome to the Mythos NFT Metaverse!! "}<br/> 
              {"Mythos is an NFT that reflects the aesthetics of greek myhthology " +
              "in respect and remembrance of the beautiful ancient culture. " +
              "Each Mythos NFT is of a notable ancient greek personality, with the most important beings such as gods and " + 
              "titans being the most rare NFTs in the collection. " + 
              "You would mint your NFTs on this site when we launch. Check if you're on our whitelist by connecting your wallet. " +
              "You are allowed to mint at most two Mythos NFTs. " +
              "Check out the personalities of the Mythos NFTs you mint. The Mythos team hopes you love your NFT. Cheers!!"}
            </p>
          </div>
          <div className={styles["whitelist__home-container--header--whitelist_info--container"]}>
            <div className={styles["whitelist__home-container--header--whitelist_info"]}>
              {
                isConnected 
                  ? <div className={styles["whitelist__home-container--header--whitelist_info--connected"]}>
                    <p>{noOfWhitelistedAddresses} people have already joined the whitelist</p>
                  </div>
                  : <div className={styles["whitelist__home-container--header--whitelist_info--disconnected"]}>
                    <p>Connect your wallet to see WhiteList info!!</p>
                  </div>
              }   
            </div>
            {isConnected && 
              <div className={styles["whitelist__home-container--header--whitelist_info--in_whitelist"]}>
                {joinedWhiteList
                  ? <p>Congrats!!, you are in the whitelist</p>
                  : <p>This address is not in the whitelist</p>
                }
              </div>
            }
          </div>
        </div>

        <div className={styles["whitelist__home-container--footer"]}>
          <footer>
            <p>Made with &#10084; by The Mythos Team</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
