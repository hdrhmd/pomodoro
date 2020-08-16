const blacklist = [
    "facebook.com",
    "youtube.com",
    "twitter.com"
];

const StorageKey = {
    MODE: 'pomodoro-mode',
    STATE: 'pomodoro-state',
    SEC: 'pomodoro-seconds',
    COUNT: 'pomodoro-count',
    DATE: 'pomodoro-datestamp'
}

$(document).ready(() => {
    chrome.storage.local.get([StorageKey.COUNT], (result) => {
        if (result[StorageKey.COUNT] < 10) {
            if (blacklist.filter(w => window.location.origin.includes(w)).length > 0) {
                window.location.href = chrome.extension.getURL("/pages/blocked.html");
            } else {
                var height = '20px';
                var iframe = document.createElement('iframe');
                iframe.src = chrome.extension.getURL('/pages/iframe/index.html');
                iframe.style.height = height;
                iframe.style.width = '100%';
                iframe.style.position = 'fixed';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.border = '0px';
                iframe.style.zIndex = '938089'; // Some high value
                // Etc. Add your own styles if you want to
                document.documentElement.appendChild(iframe);
                var bodyStyle = document.body.style;
                var cssTransform = 'transform' in bodyStyle ? 'transform' : 'webkitTransform';
                bodyStyle[cssTransform] = 'translateY(' + height + ')';
            }
        }
    });
});