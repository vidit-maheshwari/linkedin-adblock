document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const totalBlockedElement = document.getElementById('total-blocked');
    const sponsoredCountElement = document.getElementById('sponsored-count');
    const linkedinOfferCountElement = document.getElementById('linkedin-offer-count');
    const promotionalCountElement = document.getElementById('promotional-count');
    const inmailCountElement = document.getElementById('inmail-count');
    const jobAlertCountElement = document.getElementById('job-alert-count');
    const otherCountElement = document.getElementById('other-count');
    const resetButton = document.getElementById('reset-stats');
    
    // Load statistics
    function loadStats() {
      chrome.storage.local.get(['blockedCount', 'blockedTypes'], function(result) {
        // Set default values if undefined
        const blockedCount = result.blockedCount || 0;
        const blockedTypes = result.blockedTypes || {
          "Sponsored": 0,
          "LinkedIn Offer": 0,
          "Promotional": 0,
          "InMail": 0,
          "Job Alert": 0,
          "Other": 0
        };
        
        // Update counters
        totalBlockedElement.textContent = blockedCount;
        sponsoredCountElement.textContent = blockedTypes["Sponsored"];
        linkedinOfferCountElement.textContent = blockedTypes["LinkedIn Offer"];
        promotionalCountElement.textContent = blockedTypes["Promotional"];
        inmailCountElement.textContent = blockedTypes["InMail"];
        jobAlertCountElement.textContent = blockedTypes["Job Alert"];
        otherCountElement.textContent = blockedTypes["Other"];
      });
    }
    
    // Reset statistics
    resetButton.addEventListener('click', function() {
      const resetData = {
        blockedCount: 0,
        blockedTypes: {
          "Sponsored": 0,
          "LinkedIn Offer": 0,
          "Promotional": 0,
          "InMail": 0,
          "Job Alert": 0,
          "Other": 0
        }
      };
      
      chrome.storage.local.set(resetData, function() {
        loadStats();
        
        // Add visual feedback
        totalBlockedElement.style.color = '#2ecc71';
        setTimeout(() => {
          totalBlockedElement.style.color = '#0077B5';
        }, 500);
      });
    });
    
    // Load stats when popup opens
    loadStats();
  });