/* Clicker spelobjektet
 * score är spelets score
 * timer är den timer som räknas upp av requestanimframe
 * den är per frame och används av bonus
 * activebonusar är en array för att hålla koll på vilka bonusar vi har
 *
 * update körs av requestanimationframe
 * click(värde) körs för att uppdatera score
 */
const Clicker = function() {
  const clicker = {};
  clicker.score = 0;
  clicker.timer = 0;
  clicker.activeBonuses = [];

  clicker.update = function() {
    clicker.timer++;
  };

  clicker.click = function(val) {
    clicker.score += val;
  };

  return clicker;
};

/* Bonus objekt, skapas för varje aktiv bonus
 * duration är antalet intervaller som bonusen ska gälla
 * value är hur mycket score ska öka med
 * intervallen är hur många frames ska löpa mellan att score uppdateas
 *
 * update kallas i requestanimationframe
 */
const Bonus = function(duration, value, interval) {
  const bonus = {};
  bonus.duration = duration;
  bonus.value = value;
  bonus.interval = interval;

  bonus.update = function(timer) {
    if (timer % this.interval === 0) {
      this.duration--;
      clicker.click(this.value);
    }
  };
  return bonus;
};

// Initiera spelets objekt
let clicker = Clicker();
let score;
let ccscore;
let clickerButton = document.querySelector("#clicker");
let bonusButton = document.querySelector("#bonus");
let clickerButton2 = document.querySelector("#clicker2");
let bonusButton2 = document.querySelector("#bonus2");
let chrisn = document.querySelector("#chris-n");
let chrise = document.querySelector("#chris-e");
let clicktotal = 1;
let multi1 = 1;
let multi2 = 1;
let ccs = 0;

clickerButton2.textContent = "+2cc : " + clicktotal*200*multi1;
bonusButton.textContent = "+2cc/s : " + 1000*multi2;

ccscore = document.querySelector("#scores");
score = document.querySelector("#score"); // score element

// Vänta på att sidan ska laddas
window.addEventListener(
  "load",
  event => {
    console.log("page is fully loaded");

    // Hämta html element

    // eventlisteners för knappar med tillhörande funktioner
    clickerButton.addEventListener(
      "click",
      e => {
        // vid click öka score med 1
        clicker.click(clicktotal);
        console.log(clicker.score);
        chrise.classList.toggle("displaynone");
        chrisn.classList.toggle("displaynone");
      },
      false
    );

    clickerButton2.addEventListener("click", e => {
      if (clicker.score >= 200*clicktotal*multi1) {
        clicker.score -= 200*clicktotal* multi1;
        multi1++;
        if (clicktotal === 1) {
          clicktotal++;
        } else {
          clicktotal *= clicktotal;
        }
        clickerButton2.textContent = "+2cc : " + clicktotal*200*multi1;
        console.log(clicker.score);
      }
    });

    bonusButton.addEventListener(
      "click",
      e => {
        if (!ccs === 0) {
          if (clicker.score >= 1000*ccs*multi2) {
            ccs += 2;
            clicker.score -= 1000*multi2;
            multi2++;
            bonusButton.textContent = "+2cc/s : " + 1000*multi2; 
          }
        } else if(clicker.score >= 1000*multi2){
          clicker.score -= 1000*multi2*ccs;
          ccs += 2;
          multi2++;
          bonusButton.textContent = "+2cc/s : " + 1000*multi2*ccs; 
        }
        
      },
      false
    );

    bonusButton2.addEventListener("click", e => {
      if (clicker.score >= 100) {
        clicker.activeBonuses.push(Bonus(10, 10, 60));
        clicker.score -= 100;
      }
    });

    window.requestAnimationFrame(runClicker);
  },
  false
);

/*
 * runClicker är vår requestAnimationFrame metod
 * som webbläsaren försöker köra med 60 fps
 * så allt som sker i denna funktion försöker
 * webbläsaren köra 60 ggr i sekunden
 */

let i = 0;

function runClicker() {
  clicker.update(); // uppdatera spelet
  i++;

  if (i === 60) {
    i = 0;
    console.log("dö");
      if (!chrise.classList.contains("displaynone")) {
        chrise.classList.toggle("displaynone");
        chrisn.classList.toggle("displaynone");
      }
      clicker.score += ccs;

  }

  // gå igenom spelets bonusar och aktivera dem
  for (let bonus of clicker.activeBonuses) {
    bonus.update(clicker.timer);

    // om en bonus löpt ut, ta bort den från arrayen
    if (bonus.duration <= 0) {
      clicker.activeBonuses.splice(
        clicker.activeBonuses.indexOf(x => x === bonus),
        1
      );
    }
  }

  // uppdaterar score texten
  score.textContent = "Chriscoins: " + clicker.score;
  ccscore.textContent = "cc/s: " + ccs;

  window.requestAnimationFrame(runClicker);
}
