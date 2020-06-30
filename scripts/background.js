const Mode = {
    POMODORO: 'pomodoro',
    SHORT_BREAK: 'short-break',
    LONG_BREAK: 'long-break'
};

const State = {
    IDLE: 'idle',
    RUNNING: 'running',
}

const StorageKey = {
    MODE: 'pomodoro-mode',
    STATE: 'pomodoro-state',
    SEC: 'pomodoro-seconds',
    COUNT: 'pomodoro-count',
    DATE: 'pomodoro-datestamp'
}

const Default = {
    MODE: Mode.POMODORO,
    STATE: State.IDLE,
    SEC: {
        POMODORO: '1800',
        SHORT_BREAK: '300',
        LONG_BREAK: '900',
    },
    COUNT: 0
}

const secToStr = (seconds) => {
    const sec = seconds % 60;
    const min = (seconds - sec) / 60;
    return ('0' + min).slice(-2) + '' + ('0' + sec).slice(-2);
}

setInterval(() => {
    chrome.storage.local.get([StorageKey.MODE, StorageKey.STATE, StorageKey.SEC, StorageKey.DATE, StorageKey.COUNT], (result) => {
        const date = moment().format().split('T')[0];
        if (result[StorageKey.DATE] != date) {
            const values = {
                [StorageKey.MODE]: Default.MODE,
                [StorageKey.STATE]: Default.STATE,
                [StorageKey.SEC]: Default.SEC.POMODORO,
                [StorageKey.COUNT]: Default.COUNT,
                [StorageKey.DATE]: date
            };
            chrome.storage.local.set(values);
            chrome.browserAction.setBadgeText({text: ""});
        } else if (result[StorageKey.STATE] == State.RUNNING) {
            if (result[StorageKey.SEC] == 1) {
                chrome.storage.local.set({
                    [StorageKey.MODE]: Default.MODE,
                    [StorageKey.STATE]: Default.STATE,
                    [StorageKey.SEC]: Default.SEC.POMODORO,
                    [StorageKey.COUNT]: result[StorageKey.MODE] == Mode.POMODORO ? result[StorageKey.COUNT] + 1 : result[StorageKey.COUNT]
                });
                chrome.browserAction.setBadgeText({text: ""});
            } else {
                chrome.storage.local.set({[StorageKey.SEC]: Math.max(0, result[StorageKey.SEC] - 1)});
                chrome.browserAction.setBadgeText({text: secToStr(result[StorageKey.SEC] - 1)});
                chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
            }
        } else {
            chrome.browserAction.setBadgeText({text: result[StorageKey.COUNT].toString()});
            chrome.browserAction.setBadgeBackgroundColor({color: "#0000FF"});
        }
    });
}, 1000);