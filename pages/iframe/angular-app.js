const totalPerDay = 10;

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
    return ('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2);
}

var app = angular.module('iframeApp', []);
app.controller('iframeCtrl', function ($scope) {
    $scope.blinkColor = 'bg-danger';
    $scope.displayString = '--/--';
    $scope.totalPerDay = totalPerDay;
    $scope.displayString = '0%';
    $scope.totalSec = Default.SEC.POMODORO;

    const scopeSync = () => {
        chrome.storage.local.get([StorageKey.MODE, StorageKey.STATE, StorageKey.SEC, StorageKey.COUNT], (result) => {
            $scope.mode = result[StorageKey.MODE];
            $scope.state = result[StorageKey.STATE];
            $scope.count = result[StorageKey.COUNT];
            $scope.sec = result[StorageKey.SEC];
            
            const progressString = $scope.count + ' / ' + $scope.totalPerDay;

            if ($scope.sec > 0) {
                $scope.totalSec = $scope.mode == 'pomodoro' ? Default.SEC.POMODORO : ($scope.mode == 'short-break' ? Default.SEC.SHORT_BREAK : Default.SEC.LONG_BREAK);
                $scope.displayString = secToStr($scope.sec) + ' [' + progressString + ']';
            } else {
                $scope.displayString = progressString;
            }

            if ($scope.count < $scope.totalPerDay) {
                var secRemaining = ($scope.totalPerDay - $scope.count - 1) * Default.SEC.POMODORO * 1.5;
                if ($scope.mode == Mode.POMODORO) {
                    secRemaining += $scope.sec - 0;
                } else {
                    secRemaining += Default.SEC.POMODORO - 0;
                }
                var date = Date.now() + secRemaining * 1000;
                var exploded = new Date(date).toLocaleTimeString().split(' ');
                var time = exploded[0].split(':').slice(0, 2).join(':') + exploded[1];
                // date = [new Date(date), new Date(date).toLocaleTimeString(), time].join(' ');
                $scope.displayString += ' - ' + time;
            }

            $scope.$apply();
        });
    }
    
    $scope.initialize = () => {
        scopeSync();
        setInterval(scopeSync, 1000);
        setInterval(() => {
            $scope.blinkColor = $scope.blinkColor == 'bg-danger' ? 'bg-warning' : 'bg-danger';
            $scope.$apply();
        }, 500);
    }
});