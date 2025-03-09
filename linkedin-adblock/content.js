//logic for blocking sponsored messages and promotional content using html tags and classes blocking

// Variables to track statistics
let blockedCount = 0;
let blockedTypes = {
  "Sponsored": 0,
  "LinkedIn Offer": 0,
  "Promotional": 0,
  "InMail": 0,
  "Job Alert": 0,
  "Other": 0
};

// Load statistics from storage
chrome.storage.local.get(['blockedCount', 'blockedTypes'], function(result) {
  if (result.blockedCount) blockedCount = result.blockedCount;
  if (result.blockedTypes) blockedTypes = result.blockedTypes;
});


// Function to save statistics
function saveStats() {
    chrome.storage.local.set({
      blockedCount: blockedCount,
      blockedTypes: blockedTypes
    });
  }
  