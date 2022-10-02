import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import NavLink from "next/link";

import { Header } from "../../../../components/layout/Header";
import isServer from "../../../../components/isServer";
import styles from "../../daos.module.css";
import Card from "../../../../components/components/Card/Card";
import { ControlsPlus, ControlsChevronRight } from "@heathmont/moon-icons-tw";
import { Button } from "@heathmont/moon-core-tw";

export default function Goal() {
  //Variables
  const [list, setList] = useState([]);
  const [GoalURI, setGoalURI] = useState({   goalId:"",Title:"",Description: "",Budget: "",StructureLeft: [],StructureRight: [],logo: "" });
  const [goalId, setGoalID] = useState(-1);


  const regex = /\[(.*)\]/g;
  let m;
  let id = ""; //id from url

  useEffect(() => {
    fetchContractData();
  }, [id]);
  setInterval(function () {
    calculateTimeLeft();
  }, 1000);

  if (isServer()) return null;
  const str = decodeURIComponent(window.location.search);

  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    id = m[1];
  }
  function calculateTimeLeft() {
    //Calculate time left
    try {
      var allDates = document.getElementsByName("DateCount");
      for (let i = 0; i < allDates.length; i++) {
        var date = allDates[i].getAttribute("date");
        var status = allDates[i].getAttribute("status");
        allDates[i].innerHTML = LeftDate(date, status);
      }
    } catch (error) { }
  }

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  async function fetchContractData() {
    //Fetching data from Smart contract
    try {
      if (window.nearcontract && id) {
        setGoalID(Number(id));

        const goalURI = JSON.parse(JSON.parse(await window.nearcontract.goal_uri({ "goal_id": Number(id) }))[1]); //Getting total goal (Number)

        // const totalGoals =JSON.parse(await window.nearcontract.get_all_goals_by_goal_id({"_goal_id": Number(id)})); //Getting total goal (Number)
        // const arr = [];
        // for (let i = 0; i < Object.keys(totalGoals).length; i++) {
        //   //total goal number Iteration
        //   const goalid = Object.keys(totalGoals[i])[i];
        //   const object =JSON.parse(totalGoals[goalid]);
        //   if (object) {
           
        //     arr.push({
        //       //Pushing all data into array
        //       goalId: goalid,
        //       Title: object.properties.Title.description,
        //       Description: object.properties.Description.description,
        //       Budget: object.properties.Budget.description,
        //       StructureLeft: object.properties.StructureLeft.description,
        //       StructureRight: object.properties.StructureRight.description,
        //       logo: object.properties.logo.description.url
        //     });
        //   }
        // }
        // setList(arr);
        setGoalURI({
          goalId: Number(id),
          Title: goalURI.properties.Title.description,
          Description: goalURI.properties.Description.description,
          Budget: goalURI.properties.Budget.description,
          StructureLeft: goalURI.properties.StructureLeft.description,
          StructureRight: goalURI.properties.StructureRight.description,
          logo: goalURI.properties.logo.description.url
        })

        /** TODO: Fix fetch to get completed ones as well */
        document.getElementById("Loading").style = "display:none";
      }
    } catch (error) {
      console.error(error);
    }
  }


  function LeftDate(datetext, status) {
    //Counting Left date in date format
    var c = new Date(datetext).getTime();
    var n = new Date().getTime();
    var d = c - n;
    var da = Math.floor(d / (1000 * 60 * 60 * 24));
    var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((d % (1000 * 60)) / 1000);
    if (s.toString().includes("-") && status === "Finished") {
      return "Goal Ended";
    }
    return (
      da.toString() +
      " Days " +
      h.toString() +
      " hours " +
      m.toString() +
      " minutes " +
      s.toString() +
      " seconds"
    );
  }

  return (
    <>
      <Header></Header>
      <Head>
        <title>Goal</title>
        <meta name="description" content="Goal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.container} flex items-center flex-col gap-8 relative`}>
        <div className={`${styles.title} gap-8 flex flex-col relative`}>
          <h1 className="text-moon-32 font-bold">{GoalURI.Title}</h1>

          <div className={`${styles.tabs} flex gap-4`}>
            <NavLink href="?q=All">
              <a className="DonationBarLink tab block px-3 py-2 active">All</a>
            </NavLink>
            <NavLink href="?q=Today">
              <a className="DonationBarLink tab block px-3 py-2">Today</a>
            </NavLink>
            <NavLink href="?q=This Month">
              <a className="DonationBarLink tab block px-3 py-2">This Month</a>
            </NavLink>
            <NavLink href={`/CreateIdeas?[${goalId}]`}>
              <Button style={{ width: '135px', position: 'absolute', right: '1rem' }} iconLeft>
                <ControlsPlus className="text-moon-24" />
                <div className="card BidcontainerCard">
                  <div className="card-body bidbuttonText">
                    Create Ideas
                  </div>
                </div>
              </Button>
            </NavLink>
          </div>

        </div>

        <div className={styles.divider}></div>

        <div id="Loading" className="LoadingArea">
          <h1>Loading...</h1>
        </div>

        <div className="flex flex-col gap-8">
          {list.map((listItem, index) => (
            <Card height={300} width={640} key={index} className="p-10">
              <div className="flex flex-col gap-8 w-full">
                <div className="flex gap-6 w-full">
                  <span className={styles.image}>
                    <img alt="" src={listItem.logo} />
                  </span>
                  <div className="flex flex-col gap-2 overflow-hidden text-left">
                    <div className="font-bold">{listItem.Title}</div>
                    <div>Budget {listItem.Budget} NEAR</div>
                  </div>
                </div>
                <div className="flex justify-between align-center"> 
                <div className="flex items-center font-bold">
                    {listItem.StructureRight.map((item,id)=>(<>
                      <div className="mr-4"> {item}</div>
                    </>))}
                  </div>                 
                  <NavLink href={`/goals/goal/goal?[${listItem.goalId}]`}>
                    <Button iconleft>
                      <ControlsChevronRight />
                      Go to Goal
                    </Button>
                  </NavLink>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
