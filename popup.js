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
}

const Default = {
    MODE: Mode.POMODORO,
    STATE: State.IDLE,
    SEC: {
        POMODORO: '1800',
        SHORT_BREAK: '300',
        LONG_BREAK: '900',
    }
}

const secToStr = (seconds) => {
    const sec = seconds % 60;
    const min = (seconds - sec) / 60;
    return ('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2);
}

var app = angular.module('popupApp', []);
app.controller('popupCtrl', function ($scope) {
    $scope.timerDisplay = '--:--';

    $scope.initialize = () => {
        chrome.storage.local.get([StorageKey.MODE, StorageKey.STATE, StorageKey.SEC], (result) => {
            const mode = result[StorageKey.MODE] || Default.MODE;
            const state = result[StorageKey.STATE] || Default.STATE;
            const sec = parseInt(result[StorageKey.SEC] || Default.SEC.POMODORO);
            
            const syncTimer = () => {
                chrome.storage.local.get([StorageKey.SEC], (result) => {
                    $scope.sec = parseInt(result[StorageKey.SEC]);
                    $scope.timerDisplay = secToStr($scope.sec);
                    $scope.$apply();
                });
            }
            
            const values = {
                [StorageKey.MODE]: mode,
                [StorageKey.STATE]: state,
                [StorageKey.SEC]: sec
            };
            
            chrome.storage.local.set(values, () => {
                $scope.mode = mode;
                $scope.state = state;
                $scope.sec = sec;
                $scope.timerDisplay = secToStr($scope.sec);
                $scope.$apply();
                setInterval(syncTimer, 250);
            });
        });
    }

    $scope.changeMode = (mode) => {
        if (mode != $scope.mode) {
            const values = {
                [StorageKey.MODE]: mode,
                [StorageKey.STATE]: State.IDLE,
                [StorageKey.SEC]: mode == Mode.POMODORO ? Default.SEC.POMODORO : (mode == Mode.SHORT_BREAK ? Default.SEC.SHORT_BREAK : Default.SEC.LONG_BREAK)
            };
            chrome.storage.local.set(values, () => {
                $scope.mode = values[StorageKey.MODE];
                $scope.state = values[StorageKey.STATE];
                $scope.sec = values[StorageKey.SEC];
                $scope.timerDisplay = secToStr($scope.sec);
                $scope.$apply();
            }); 
        }
    }

    $scope.toggleState = () => {
        state = $scope.state == 'running' ? 'idle' : 'running';
        chrome.storage.local.set({[StorageKey.STATE]: state}, () => {
            $scope.state = state;
            $scope.$apply();
        }); 
    }
});