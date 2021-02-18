var lastSendTimeout = null;
var lastConnectTimeout = null;

var useRandomConnectClickTime = false;
var connectMissesBeforeMovingToNextPage = 3;
var currentConnectMisses = connectMissesBeforeMovingToNextPage;

var minimumConnectWaitTime = 700;
var maximumConnectWaitTime = 2000;

var goToNextPage = () =>
{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });

    // click on next button
    let nextButtons = document.getElementsByClassName("artdeco-pagination__button--next");
    if (nextButtons.length)
    {
        nextButtons[0].click();
        console.log("Clicked next button");

        // 3 sec after clicking next button
        setTimeout(findConnectButton, 300);
    } else
    {
        console.log("No Next button");
    }
};

// if connect buttons length has stayed the same for X number even after clicking on send button, then go to next page
var numTriesConnectStaySame = 3;
var curNumTriesConnectStaySame = numTriesConnectStaySame;

var lastConnectButtonsLength = null;

var findConnectButton = () =>
{
    let allButtons = document.getElementsByClassName("artdeco-button--2");
    let connectButtons = Array.from(allButtons).filter((el) =>
    {
        return !el.classList.contains("artdeco-button--muted") && el.innerText === "Connect"
    });

    let connectTimeoutMS = 700;
    if (useRandomConnectClickTime)
    {
        // range of number between 500ms to 1s, so width of range == 500, and start number = 500
        connectTimeoutMS = Math.floor(Math.random() * (maximumConnectWaitTime - minimumConnectWaitTime) + 1) + minimumConnectWaitTime;
    }

    if (connectButtons.length)
    {
        console.log(`${connectButtons.length} connect buttons`);

        connectButtons[0].click();

        clearTimeout(lastSendTimeout);
        findSendButton();

        let weeklyInvitationLimitButton = document.getElementsByClassName("artdeco-button ip-fuse-limit-alert__primary-action");
        if (weeklyInvitationLimitButton.length)
        {
            // stop clicking on connect buttons if we reach our weekly connect limit
            clearTimeout(lastConnectTimeout);
            alert("Reached Connect Invitation Limit!");
            return;
        }


        if (connectButtons.length == lastConnectButtonsLength)
        {
            curNumTriesConnectStaySame--;
        } else
        {
            curNumTriesConnectStaySame = numTriesConnectStaySame;
            lastConnectButtonsLength = null;
        }

        if (curNumTriesConnectStaySame <= 0)
        {
            //go to next page
            goToNextPage();

            curNumTriesConnectStaySame = numTriesConnectStaySame;
            lastConnectButtonsLength = null;
        } else
        {
            // look and click on next Connect button after 700ms
            lastConnectTimeout = setTimeout(findConnectButton, connectTimeoutMS);

            curNumTriesConnectStaySame--;

            lastConnectButtonsLength = connectButtons.length;
        }
    } else
    {
        // try 3 more times before saying no more connect buttons on this page
        if (currentConnectMisses > 0)
        {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });

            lastConnectTimeout = setTimeout(findConnectButton, connectTimeoutMS);

            currentConnectMisses--;
        } else
        {
            // let goToNextPage = confirm("No more Connect buttons. Go to next page");
            goToNextPage();

            currentConnectMisses = connectMissesBeforeMovingToNextPage;
        }
    }
}


var findSendButton = () =>
{
    let sendButtons = document.getElementsByClassName("ml1 artdeco-button");
    if (sendButtons.length)
    {
        sendButtons[0].click();
    } else
    {
        // try again after 300ms
        lastSendTimeout = setTimeout(findSendButton, 300);
    }
}


findConnectButton();