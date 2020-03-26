/ Encase the script in it's own scope, 
// this makes sure other scripts do not override 
// variables and that functions are exclusive to this script only
(() => {
    var clicks = 0;
    var clickssec = 0;
    var clickssec100 = 0;
    
    // Saving the elements as constant variables (variables that cannot be changed)
    // means that we do not have to query the DOM
    // every time the user clicks, greatly increasing performance
    const clickLabel = document.getElementById("score");
    const cpsLabel = document.getElementById("bonus");
    const clickButton = document.getElementById("clicker");
    const upgradeButtons = document.querySelectorAll(".upgrade-btn");

    // By using both the 'click' and the 'ontouchstart' events
    // we can easily allow for touch support without having
    // to restructure the code much
    ['click','ontouchstart'].forEach((eventname) => {

        // Using an eventlistener, we can programmatically add
        // events without having to edit the HTML.
        //
        // This is generally preferred over onclick="" events
        // as it is more adaptable and obscures the events 
        // from the user, making them more secure.
        //
        // An additional advantage over HTML-based events is that
        // programmatically added events can be added to any 
        // element, not just buttons.
        //
        // HTML-based events also do not work with methods inside other scopes.
        // (scopes are a tad complicated, ask me if you're more interested in them)
        clickButton.addEventListener(eventname, (event) => {
            // Increases 'clicks' by 1 
            clicks++;

            clickLabel.innerHTML = clicks;
        });
    });
    

    // Loop over every upgrade button asynchronously, 
    // saving them as an 'element' paremeter.
    //
    // This means that rather than looping then doing 
    // whatever comes next, we allow the program to continue
    // doing tasks while we are looping.
    //
    // While this makes the loop hard to manage - for 
    // example, we are no longer able to know the output
    // of the loop unless we keep track of how many times it
    // has looped and compare to an expected value, it allows 
    // for much higher performance and should be used whereever possible
    upgradeButtons.forEach((element) => {

        // Get the 'cost' and 'clicks' attributes from the element
        // generally, these should be an integer formatted like 'cost="10"'.
        //
        // These attributes are used to reduce the amount of 'magic numbers'
        // in the code. That is, numbers that are simply defined and have no
        // affiliation with the rest of the code. Such numbers should not be defined
        // in the code, but rather in configurations or HTML documents.
        const upgradeCost = parseInt(element.getAttribute('cost'));
        const upgradeClicks = parseInt(element.getAttribute('clicks'));

        element.addEventListener('click', (e) => {
            if(clicks >= upgradeCost) {
                clicks -= upgradeCost;
                clickssec += upgradeClicks;

                cpsLabel.innerHTML = clickssec;
            }
        })
    })
    
    // How many times per second we should update the clicks
    const updateSpeed = 1;

    // Instead of creating a function and calling it using
    // setInterval, we can use an arrow function: '()=>{}'
    //
    // Arrow functions do not actually do anything special
    // they are simply an alias for 'function() {}'
    setInterval(() => {
        // Make sure to divide clickssec by the update speed
        // to make sure it doesnt increase faster with a faster update speed.
        clicks += clickssec / updateSpeed;

        clickLabel.innerHTML = clicks;
    }, 1000 / updateSpeed);
})();