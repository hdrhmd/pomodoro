const blacklist = [
    "facebook.com",
    "youtube.com",
    "twitter.com"
];

$(document).ready(() => {
    if (blacklist.filter(w => window.location.origin.includes(w)).length > 0) {
        window.location.href = chrome.extension.getURL("/pages/blocked.html");
    } else {
        const src = chrome.extension.getURL("/pages/iframe/index.html");
        $('body').prepend(`<iframe src="${src}" width="100%" height="20px" frameBorder="0px" style="display: inherit;"></iframe>`);
    }
});