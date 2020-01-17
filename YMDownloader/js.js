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
    console.log('%cAll hail yandex.music tools', 'color: red;');

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.action == 'getDetails') {
            sendResponse(getCurrentTrackInfo());
        }
    });


    var nameObserver = new MutationObserver(function(data) {
        console.log('observer triggered');
        console.log('data:', data);
    });

    installInterval = setInterval(function() {

        var trackTitleContainer = $('.track__name-innerwrap .track__title');
        console.log(trackTitleContainer.length);

        if (trackTitleContainer.length) {
            clearInterval(installInterval);
            trackTitleContainer.css('border', '1px red dashed');

            nameObserver.observe(trackTitleContainer.get(0), {subtree: true, childList: true })
        }
    }, 200);

});
