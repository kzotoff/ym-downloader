'use strict';

$(function() {

    refreshList();

});

var playItem = function(url) {
    window.open(url);
}

var refreshList = function() {

    chrome.runtime.sendMessage(
        {
            action: 'trackList'
        },
        function(response) {
           showTrackInfo(response);
        }
    );
}

var deleteItem = function(url) {
    chrome.runtime.sendMessage(
        {
            action: 'deleteTrack',
            url: url,
        },
        function(response) {
           showTrackInfo(response);
        }
    );
}

var downloadItem = function(url, filename) {
    chrome.downloads.download({
        url: url,
        filename: filename
    });
}

var showTrackInfo = function(info) {

    $('.ext-6677-links').empty();

    if (info.length == 0) {
        $('.ext-6677-links').append(
            $('<div class="ext-6677-nothing">').text('No tracks captured yet')
        );
    }

    var list = $('<div>');

    info.forEach( function(elem) {

        var name = elem.author + ' - ' + elem.title;

        list.append(
            $(' \
                <div class="ext-6677-one-link" data-url="' + elem.url + '" data-name="' + name + '"> \
                    <div class="ext-6677-link-text">' + name + '</div> \
                    <div class="ext-6677-svg-button ext-6677-link-play"> \
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"  viewBox="0 0 200 200" fill="#0a0"> \
                            <path d="m20 0 l160 100 -160 100z" /> \
                        </svg> \
                    </div> \
                    <div class="ext-6677-svg-button ext-6677-link-download"> \
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"  viewBox="0 0 408 428" fill="#00f"> \
                            <path d="m147 0v184h-127l184 166 184-166h-127v-184z" /> \
                            <path d="m0 360v69h409v-69z" /> \
                        </svg> \
                    </div> \
                    <div class="ext-6677-svg-button ext-6677-link-delete"> \
                        <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 264 264" fill="#f00"> \
                            <path d="m36 5-31 31 95 95-95 95 31 31 95-95 95 95 31-31-95-95 95-95-31-31-95 95z" /> \
                        </svg> \
                    </div> \
                </div> \
            ')
        );
    });

    list.appendTo('.ext-6677-links');

    $('.ext-6677-link-play').on('click', function(e) {
        e.stopPropagation();
        var url = $(this).closest('.ext-6677-one-link').attr('data-url');
        playItem(url);
    });

    $('.ext-6677-link-download').on('click', function(e) {
        e.stopPropagation();
        var url = $(this).closest('.ext-6677-one-link').attr('data-url');
        var name = $(this).closest('.ext-6677-one-link').attr('data-name') + '.mp3';
        downloadItem(url, name);
    });

    $('.ext-6677-link-delete').on('click', function(e) {
        e.stopPropagation();
        var url = $(this).closest('.ext-6677-one-link').attr('data-url');
        deleteItem(url, name);
    });
}

