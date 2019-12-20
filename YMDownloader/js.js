function getCurrentTrackInfo() {

    var trackTitleContainer = document.querySelector('.track__name-wrap .track__title');
    var trackAuthorContainer = document.querySelector('.track__name-wrap .d-artists__expanded');

    trackTitleContainer.style.backgroundColor = '#f77';
    trackAuthorContainer.style.backgroundColor = '#f77';

    var trackTitle = trackTitleContainer.innerText;
    var trackAuthor = trackAuthorContainer.innerText;

    setTimeout(function() {
        trackTitleContainer.style.backgroundColor = 'transparent';
        trackAuthorContainer.style.backgroundColor = 'transparent';
    }, 100);

    return {
        title: trackTitle,
        author: trackAuthor,
    }
}

$(function() {
    console.log('%cAll hail yandex.music downloader', 'color: red;');

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action == 'getDetails') {
            sendResponse(getCurrentTrackInfo());
        }
    });

});
