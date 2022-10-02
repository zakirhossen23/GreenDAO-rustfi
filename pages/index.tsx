import { Button } from "@heathmont/moon-core-tw";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Header } from "../components/layout/Header";
import styles from "./Home.module.css";
import section2Image from "/public/home/section-2-img.jpg";
import section1Image from "/public/home/section-1-img.jpg";
import logo from "/public/logo-lg.png";

declare let window: any;
export default function Welcome() {
  const router = useRouter();
  function donateCLICK() {
    if (typeof window.ethereum === "undefined") {
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
        "_blank"
      );
    } else  if (window.walletConnection?.isSignedIn() == false) {
      router.push("/login?[/daos]");
    } else {
      router.push("/daos");
    }
  }

  function CreateProjectsCLICK() {
    if (typeof window.ethereum === "undefined") {
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
        "_blank"
      );
    } else {
      router.push("/daos");
    }
  }
  return (
    <>
      <Head>
        <title>GreenDAO</title>
        <meta name="description" content="GreenDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className={styles.section}>
        <div className={styles.text}>
          <div className={`${styles.logo} pb-4`}>
            <Image src={logo} alt="" />
          </div>
          <h1 className="text-moon-32 font-bold pt-2 pb-4">
          Empower your Community with Trust
          </h1>
          <p className="py-4">
            Donation events as a service, to create the most easy, transparent
            and fun NFT charity auction, by using the power of Near to help
            organisations raise additional support for a better world.
          </p>
          <div className="pt-4">
            <Button onClick={donateCLICK}>Let’s make decisions</Button>
          </div>
        </div>
        <div className={styles.image}>
          <Image src={section1Image} objectFit="cover" layout="fill" alt="" />
        </div>
      </div>
      <div className={`${styles.section} ${styles["section-dark"]}`}>
        <div className={styles.image}>
          <Image src={section2Image} objectFit="cover" layout="fill" alt="" />
        </div>
        <div className={styles.text}>
          <div className={`${styles.logo} pb-4`}>
            <Image src={logo} alt="" />
          </div>
          <h1 className="text-moon-32 font-bold pb-4">Empower your Community with Trust</h1>
          <p className="py-4">
            Donation events as a service, to create the most easy, transparaent
            and fun NFT charity auction, by using the power of Near to help
            organisations raise additional support for a better world.
          </p>
          <div className="pt-4">
            <Button onClick={CreateProjectsCLICK}>Let’s make decisions</Button>
          </div>
        </div>
      </div>
    </>
  );
}
