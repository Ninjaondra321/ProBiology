import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';
import { PractiseCard } from './Cards';


export const PractiseCards = () => {
    let { id } = useParams();
    let obj = JSON.parse(localStorage.getItem(id));
  
    const title = obj.title;
  
    const [dict, setDict] = useState(null);
    const [baseURL, setBaseURL] = useState(null);
  
    useEffect(() => {
      fetch(obj.listURL)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          console.log(data.title);
          setDict(data.dict);
          setBaseURL(data.baseURL);
        });
    }, []);
  
    console.log(dict);
  
    return (
      <>
        <NavBar
          M_txt={title}
          L_icon="arrow-simple-left"
          R_icon="card"
          L_link="/"
          R_link={"/quiz/" + id}
        />

        {dict && <PractiseCardsWidget dict={dict} baseURL={baseURL} />}

      </>
    );
  
}


export const PractiseCardsWidget = ({dict, baseURL}) => {
    const [recentWordsID, setRecentWordsID] = useState([]);

  console.warn(dict);
  console.warn(baseURL);


  const [started, setStarted] = useState(false);

  const [LeftSrcURL, setLeftSrcURL] = useState('')
  const [RightsrcURL, setRightSrcURL] = useState("");

  const [LeftAnswer, setLeftAnswer] = useState("");
  const [RightAnswer, setRightAnswer] = useState("");

  const [isNextShown, setIsNextShown] = useState(false);

  const [rightPicIsShown, setRightPicIsShown] = useState(true)

  // Generate random number
  function genRandomID(keepTrack) {
    var copy = recentWordsID;

    // Maintain the lenght
    if (recentWordsID.length > (dict.length / 2) - 1) {
      copy.shift();
    }

    function myIncludes(numero) {
      if (copy.length === 0) {
        return false;
      }
      for (let i = 0; i < copy.length; i++) {
        if (copy[i] == numero) {
          return true;
        }
      }
      return false;
    }

    // Generate random number
    let number = undefined;
    do {
      number = Math.floor(Math.random() * dict.length);
    } while (myIncludes(number.toString()) && keepTrack);

    // Add the number to the KeepTrack array
    if (keepTrack) {
      copy.push(number);
    }

    return number;
  }

  function getAnswers(currentID) {
    // Generate random answerIDs
    let wrong_answersID = [];
    while (wrong_answersID.length < 3) {
      let n = genRandomID(false);
      if (n !== currentID && !wrong_answersID.includes(n)) {
        wrong_answersID.push(n);
      }
    }

    // Use IDs to create verbal answers
    let srcURLL = "";
    let answer = "";

    

    
    srcURLL = dict[currentID].src;
    answer = dict[currentID].title;

    let nextSrcIdk = dict[recentWordsID[recentWordsID.length- 1]].src


    if (LeftSrcURL === "" && RightsrcURL === "") {
      setLeftSrcURL(srcURLL)
      setRightSrcURL(srcURLL)
      setRightAnswer(answer)
    }

    if (!rightPicIsShown) {
      setLeftSrcURL(nextSrcIdk)
      setRightPicIsShown(!rightPicIsShown)
      setRightAnswer(answer)
    } else {
    setLeftAnswer(answer)
      setRightSrcURL(nextSrcIdk)
      setRightPicIsShown(!rightPicIsShown)
    }
    


    return {answer: answer, srcURL: srcURLL };

  }

  function revealCorrectAnswer() {
    setIsNextShown(true);

  }

  function nextQuiestion() {

    setIsNextShown(false);

    if (recentWordsID.length === 0) {genRandomID(true)} 
    genRandomID(true)

    
    const CURRENTID = recentWordsID[recentWordsID.length - 2];


    const { answers, correctID, title } = getAnswers(CURRENTID);

    return {
      answers: answers,
      CURRENTID: CURRENTID,
      correctID: correctID,
      title: title,
    };
  }

  if (!started) {
    console.log("zacinam hru");
    const { answers, CURRENTID, correctID, title } = nextQuiestion();
    setStarted(true);
  } else {
    console.log("aspon neco");
    console.log(recentWordsID);
  }

  console.info("halabalahoeiahi")
  console.info(LeftAnswer)
  console.info(RightAnswer)

  return (
    <div className="content content-padding">
      <div className="PractiseCard">
          <div className="center " style={{"padding-top": "10px"}}>
            <img  src={"" + baseURL + LeftSrcURL} alt="obrazek nebo tak něco"  className={rightPicIsShown ? "omezeni-obrazkuuu hidden" : "omezeni-obrazkuuu " } />
            <img  src={"" + baseURL + RightsrcURL} alt="obrazek nebo tak něco"  className={!rightPicIsShown ? "omezeni-obrazkuuu hidden" : "omezeni-obrazkuuu "} />
          </div>
        
        <div className="cetner" >
            <h1 className={!isNextShown ? "hidden card-subtitle center" : "card-subtitle center" }>{rightPicIsShown ? RightAnswer : LeftAnswer}</h1>
        </div>
        
      </div>




      <div className="center-right fine-padding">
        {isNextShown && (
          <div
            className={"icon i-arrow-simple-right  "}
            onClick={() => nextQuiestion()}
          ></div>
        )}

        {!isNextShown && (
          <div
            className={"icon i-rubberduck"}
            onClick={() => revealCorrectAnswer()}
          ></div>
        )}
      </div>

    </div>
  );
};
