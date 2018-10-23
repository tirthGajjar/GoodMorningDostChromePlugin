'use strict';

console.log("chax");
chrome.storage.sync.get(['lastLaunchDate'], function(result) {
  let previousDate = result.lastLaunchDate;
  chrome.runtime.sendMessage({previousDate: previousDate}, function() {
    console.log("done");
  });
});