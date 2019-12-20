chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });

var trackList = [];

var setBadge = function(text) {
    chrome.browserAction.setBadgeText({ text: text });
}

var addTrack = function(elem) {

    var exists = trackList.find( function(e) {
        return (e.title == elem.title) && (e.author == elem.author);
    });

    if (exists) {
        return;
    }

    trackList.push({
        tabId: elem.tabId,
        url: elem.url,
        title: elem.title,
        author: elem.author,
    });

    trackList = trackList.slice(-10);
}

var deleteTrack = function(url) {

    var trackIndex = trackList.findIndex( function(e) {
        return e.url == url;
    });

    trackList.splice(trackIndex, 1);
}


chrome.webRequest.onBeforeRequest.addListener(
    function(details) {

        // details = {
        //     "frameId": 0,
        //     "initiator": "https://music.yandex.ru",
        //     "method": "POST",
        //     "parentFrameId": -1,
        //     "requestId": "93846",
        //     "tabId": 527,
        //     "timeStamp": 1576217781589.911,
        //     "type": "ping",
        //     "url": "https://mc.yandex.ru/watch/1028356/1?page-url=https%3A%2F%2Fmusic.yandex.ru%2Fhome&charset=utf-8&ut=noindex&force-urlencoded=1&browser-info=ti%3A1%3An"
        // }

        if (details.url && details.url.indexOf('yandex.net/get-mp3') > -1) {

            setTimeout(function() {

                if (details.tabId < 0) {
                    // may be closed?
                    return;
                }
                chrome.tabs.sendMessage(
                    details.tabId,
                    { action: 'getDetails' },
                    function(result) {
                        if (result) {
                            addTrack({
                                tabId: details.tabId,
                                url: details.url,
                                title: result.title,
                                author: result.author,
                            });
                        }
                    }
                );
            }, 1500)
        }

        return {};
    },
    {urls: ["<all_urls>"]},
    []
);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if ( ! message.action) {
        return;
    }

    switch (message.action) {
        case 'trackList':
            sendResponse(trackList);
            break;

        case 'deleteTrack':
            deleteTrack(message.url);
            sendResponse(trackList);
    }

    return 'NOTHING';

});
