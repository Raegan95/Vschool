const readlineSync = require('readline-sync');

const name = readlineSync.question('What is your name? ');

readlineSync.question('Hello ' + name + ', Defeat all the bad guys! Press Enter to begin.');

const badGuys = ['Zombie', 'Ogre', 'Wizard', 'Demon'];
const treasure = ['Extra Health', 'Armor', 'Antidote'];
var prize = [];
let userHealth = 30;
const options = ['Walk', 'Exit', 'Status'];
let enemiesDefeated = 0

function game() {
    let pickUp = treasure[Math.floor(Math.random() * treasure.length)];
    const attackPower = Math.floor(Math.random() * (5 - 4 + 3) + 5);
    const badGuy = badGuys[Math.floor(Math.random() * badGuys.length)];
    let badGuysHealth = 15;
    const badGuysPower = Math.floor(Math.random() * (5 - 3 + 2) + 5);

    const index = readlineSync.keyInSelect(options, 'What would you like to do now?');

    if (options[index] == 'Exit') {
        return userHealth = 0;
    } else if (options[index] == 'Status') {
        console.log(name + ': \n' + userHealth + '\nTreasure: ' + pickUp);
    } else if (options[index] === 'Walk') {
        let key = Math.random();
        if (key <= .3) {
            console.log('Walking.....');
        } else if (key >= .3) {
            console.log(badGuy + ' showed up.');

            //While loop for walking//
            while (badGuysHealth > 0 && userHealth > 0) {

                const user = readlineSync.question('What do you want to do? enter "r" to run or "a" to attack: ');

                switch (user) {
                    case 'r': // runaway
                        const run = Math.random();
                        if (run < .5) {
                            console.log('Before you can run away ' + badGuy + ' attacks you with: ' + badGuysPower);
                        } else {
                            console.log('You Ran Away!!');
                            break;
                        }
                    case 'a':
                        // attack the enemy
                        badGuysHealth -= attackPower;
                        console.log('You attacked ' + badGuy + ' with ' + attackPower + ' attack power');

                        userHealth -= badGuysPower;
                        console.log('Enemy just attacked you with: ' + badGuysPower + ' attack power' + ': \n');

                        if (badGuysHealth <= 0) {
                            console.log('You killed ' + badGuy + '.\n' + badGuy + ' left: ' + pickUp);
                            let loot = Math.random();
                            prize.push(pickUp);
                            userHealth += 20
                            enemiesDefeated += 1
                        } else if (userHealth <= 0) {
                            console.log(badGuy + ' has defeated you. You are dead.');
                        }
                }
            }
        }
    }
}

while (userHealth > 0 && enemiesDefeated < 3) {
    game();
}

if (enemiesDefeated >= 3) {
    console.log('You have won the game')
}
