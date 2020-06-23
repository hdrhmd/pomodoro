setInterval(() => {
    chrome.storage.local.get(['pomodoro-state', 'pomodoro-seconds'], (result) => {
        if (result['pomodoro-state'] == 'running') {
            chrome.storage.local.set({'pomodoro-seconds': Math.max(0, result['pomodoro-seconds'] - 1)});
        }
    });
}, 1000);