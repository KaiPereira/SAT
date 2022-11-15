import * as React from 'react';
import browser from 'webextension-polyfill';
import './styles.scss';
import axios from "axios"

const Popup = () => {
  const token = "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"





  




  // All of the states
  const [search, changeSearch] = React.useState()
  const [answer, changeAnswer] = React.useState()
  const [pageDetails, changePageDetails] = React.useState()

  // Input search function because it's React :(
  function changeSearchFunction(e) {
    changeSearch(e.target.value)
  }

  // Function to request the model from hugging face
  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
      {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }

  // Function to get the answer to a question using the query function
  function getAnswer() {
      query({"inputs": {
        "question": search,
        "context": pageDetails
      }}).then((response) => {
      console.log(changeAnswer(response.answer));
    });
  } 

  // Fetches all the page text to use for the context in the model
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

  // Frontend
  return (
    <main id="popup">
      <input type="text" className="searchBar" onChange={changeSearchFunction} />
      <button className="searchButton" onClick={getAnswer}>Search</button>
      <p>{answer}</p>
    </main>
  );
};

export default Popup;
