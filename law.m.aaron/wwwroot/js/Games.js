document.addEventListener('DOMContentLoaded', function (event) {

    // Will not work for all devices but this works for a good chunk.
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        // console.log("mobile device");

        disableNonMobileGameSelect();
    } else {
        // false for not mobile device
       // console.log("not mobile device");

        enableGameSelect();
    }

    function disableNonMobileGameSelect() {
        const errorElement = document.getElementById('mobile-error');
        errorElement.style.display = 'block';
        errorElement.style.visibility = 'visible';

        const gameAnchorElement = document.getElementById('game-anchor');
        gameAnchorElement.style.opacity = 0.5;
    }

    function enableGameSelect() {
        const errorElement = document.getElementById('mobile-error');
        errorElement.style.visibility = 'hidden';
    }

});