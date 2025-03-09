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
  

// Keywords that might indicate promotional content - reduced and more specific
const promotionalKeywords = [
    'sponsored', 'advertisement', 'promoted', 'marketing'
  ];
  
  // Function to check if content is promotional based on text
  // Made much more restrictive to avoid false positives
  function isPromotional(text, senderName) {
    // Don't consider normal messages as promotional
    if (!text || text.length < 10) return false;
    
    text = text.toLowerCase();
    
    // Check for obvious promotional indicators only
    return promotionalKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  // Function to hide sponsored and promotional messages
function hidePromotionalMessages() {
    // Find all conversation items
    const conversationItems = document.querySelectorAll('.msg-conversation-listitem__link');
    
    if (conversationItems.length === 0) {
      // If no conversation items found yet, try again after a short delay
      setTimeout(hidePromotionalMessages, 1000);
      return;
    }
    
    // Check each conversation item for promotional content
    conversationItems.forEach(item => {
      // Skip already processed items
      if (item.dataset.processed === 'true') return;
      
      // Mark as processed
      item.dataset.processed = 'true';
      
      // Look for the pill label
      const pill = item.querySelector('.msg-conversation-card__pill');
      
      // Only proceed if pill exists - this is a key change to prevent blocking normal messages
      if (pill) {
        // Get the message text
        const messageSnippet = item.querySelector('.msg-conversation-card__message-snippet');
        const messageText = messageSnippet ? messageSnippet.textContent.trim() : '';
        
        // Get the sender name
        const senderName = item.querySelector('.msg-conversation-listitem__participant-names .truncate');
        const senderText = senderName ? senderName.textContent.trim() : '';
        
        let isPromo = false;
        let promoType = "Other";
        
        // Check for specific pill labels
        const pillText = pill.textContent.trim().toLowerCase();
        
        // Now we only check for specific promotional indicators
        if (pillText === 'sponsored') {
          isPromo = true;
          promoType = "Sponsored";
        }
        else if (pillText.includes('linkedin offer')) {
          isPromo = true;
          promoType = "LinkedIn Offer";
        }
        else if (pillText.includes('inmail')) {
          isPromo = true;
          promoType = "InMail";
        }
        else if (pillText.includes('job alert')) {
          isPromo = true;
          promoType = "Job Alert";
        }
        
        if (isPromo) {
          // This is a promotional message, hide it
          item.style.display = 'none';
          blockedCount++;
          blockedTypes[promoType]++;
          saveStats();
          console.log(`LinkedIn Promotion Blocker: Blocked a ${promoType} message`);
        }
      }
    });
  }
  