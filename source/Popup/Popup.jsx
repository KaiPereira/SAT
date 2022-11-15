import * as React from 'react';
import browser from 'webextension-polyfill';
import './styles.scss';
import axios from "axios"

function openWebPage(url) {
  return browser.tabs.create({url});
}

const Popup = () => {
  const [search, changeSearch] = React.useState()
  const [answer, changeAnswer] = React.useState()
  const [pageDetails, changePageDetails] = React.useState()

  function changeSearchFunction(e) {
    changeSearch(e.target.value)
    console.log(search)
  }

  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
      {
        headers: { Authorization: "Bearer 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" },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  // chrome.runtime.sendMessage("Hello", (response) => {
  //   localStorage.setItem("pageDetails", response)
  // });

  function getAnswer() {
      query({"inputs": {
        "question": search,
        "context": pageDetails
      }}).then((response) => {
      console.log(changeAnswer(response.answer));
    });
  } 

  function modifyDOM() {
    console.log('Tab script:');
    console.log(document.body);
    return document.body.innerText;
  }

  chrome.tabs.executeScript({
    code: '(' + modifyDOM + ')();' 
  }, (results) => {
      console.log(results[0])
      changePageDetails(results[0]);
  });

  return (
    <main id="popup">
      <input type="text" className="searchBar" onChange={changeSearchFunction} />
      <button className="searchButton" onClick={getAnswer}>Search</button>
      <p>{answer}</p>
    </main>
  );
};

export default Popup;
