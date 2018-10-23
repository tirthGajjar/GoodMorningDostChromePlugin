'use strict';

let notificationInst = chrome.notifications;
chrome.tabs.onCreated.addListener(function(tab) {
  chrome.storage.sync.get(['lastLaunchDate'], function(result) {
    let previousDate = result.lastLaunchDate;
    createNotification(previousDate);
    chrome.runtime.sendMessage({previousDate: previousDate}, function() {
      console.log("done");
    });
  });
  // if(tab.openerTabId=== undefined && tab.url === "chrome://newtab/"){
  //   chrome.tabs.executeScript({
  //     code: 'console.log("chax");chrome.storage.sync.get(["lastLaunchDate"], function(result) { let previousDate = result.lastLaunchDate; chrome.runtime.sendMessage({previousDate: previousDate}, function() {console.log("done");});});'
  //   });
  // }
  // chrome.tabs.update(tab.id, {url:"popup.html", active: true}, function(tab1) {
  //   console.log("tab updated");
  //   window.location.hash="no-back-button";
  // });
});

let getRandomColor = function () {
  var letters = 'BCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

let createNotification = function(previousDate){
  let currentDate = new Date().toDateString();
  if(!previousDate || (previousDate.toString() === "" || new Date(currentDate) > new Date(previousDate))){
    chrome.storage.sync.set({lastLaunchDate: currentDate}, function() {
      console.log('Value is set to ' + currentDate);
    });
    document.body.style.backgroundColor = getRandomColor();
    
    fetch('https://talaikis.com/api/quotes/random/')
      .then(function(response) {
        return response.json();
      })
      .then(function(oQoute) {
        oQoute;
        notificationInst.create(
          'QouteOfTheDay',
          {
            type:'basic',
            iconUrl:'images/get_started128.png',
            title : "Qoute Of The Day",
            message: oQoute.quote ? (oQoute.quote + (oQoute.author ? " \n- " + oQoute.author : "")) : "Oops!! No qoute for today :(",
            priority:0,
            isClickable: false
          },
          function() {
            console.log(chrome.runtime.lastError);
          }
        );
    });

  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  createNotification(request.previousDate)
  sendResponse();
});

