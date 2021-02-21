var lastSendTimeout = null;
var lastConnectTimeout = null;

var useRandomConnectClickTime = true;
var connectMissesBeforeMovingToNextPage = 3;
var currentConnectMisses = connectMissesBeforeMovingToNextPage;

var minimumConnectWaitTime = 1000;
var maximumConnectWaitTime = 2500;

var numTriesNextPage = 3;
var curNumTriesNextPage = numTriesNextPage;

var goToNextPage = () =>
{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });

    if (curNumTriesNextPage <= 0)
    {
        alert("No Next button detected.  Rerun script after zooming out");
        return;
    }

    // click on next button
    let nextButtons = document.getElementsByClassName("artdeco-pagination__button--next");
    if (nextButtons.length)
    {
        curNumTriesNextPage = numTriesNextPage;
        console.log("Click next button");

        nextButtons[0].click();

        setTimeout(findConnectButton, minimumConnectWaitTime);
    } else
    {
        curNumTriesNextPage--;
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
            alert("Reached Connect Invitation Limit! Stopped script");
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
            // look and click on next Connect button after connectTimeoutMS
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

var linkedin_search_regexp = /http[s]?:[/][/][a-zA-Z]+.linkedin.com[/]search[/]results/;

if (window.location.href.match(linkedin_search_regexp) === null)
{
    alert("Can't run Linkedin Autoconnect script on pages other than Linkedin Search Results");
} else
{
    alert("Zoom out with Ctrl+Minus repeatedly until the Next page button is visible, before pressing OK");
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
    findConnectButton();
}
