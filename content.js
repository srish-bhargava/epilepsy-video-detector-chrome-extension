CURRENT_PAGE = "";
BLOCK = {
    times: [],
    state: 0
}


function afterNavigate() {
    if ('/watch' === location.pathname) {
        
        var url = new URL(location.href);
        getBlockingTimesForVideo(location.href)
            .then((blockingTimes) => {
                resetBlockingTimes(blockingTimes)
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }
}


function getBlockingTimesForVideo(){
    return fetch('https://localhost:5000/get_blocked_timestamps?url='+location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            return data['result']
        })
}


function resetBlockingTimes(newBlockingTimes){
    BLOCK = {
        times: newBlockingTimes,
        state: 0
    }
}


function setBlockingFilter(update){
    var videos = document.getElementsByTagName("video");
    if (videos.length == 0){
        return
    }
    if (update){
        videos[0].style.filter = "brightness(10%)";
    } else {
        videos[0].style.filter = "brightness(100%)";
    }
}


function checkFilter(){
    video_streams = document.getElementsByClassName('video-stream')
    if (video_streams.length == 0){
        return
    }
    video_stream = video_streams[0]
    currtime = video_stream.currentTime;
    while (BLOCK['state'] < BLOCK['times'].length && currtime >= BLOCK['times'][BLOCK['state']][0]){
        setBlockingFilter(BLOCK['times'][BLOCK['state']][1])
        BLOCK['state'] += 1
    }
}


setInterval(() => {
    if (CURRENT_PAGE != location.href){
        CURRENT_PAGE = location.href;
        afterNavigate();
    }
}, 1000)

setInterval(() => {
    checkFilter()
}, 50)

afterNavigate();

