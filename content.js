const blacklist = [
    "facebook.com",
    "youtube.com",
    "twitter.com"
];

$(document).ready(() => {
    if (blacklist.filter(w => window.location.origin.includes(w)).length > 0) {
        window.location.href = chrome.extension.getURL("blocked.html");
    }
});