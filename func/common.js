const chalk = require('chalk');
const {exec, spawn} = require("child_process");

const msg = {
    bold: chalk.bold,
    info: chalk.bold.blue,
    link: chalk.underline.blue,
    //error: chalk.bgRed.hex('#cccccc'),
    error: chalk.bold.red,
    warn: chalk.bold.yellow,
    success: chalk.bold.green,
    brand: chalk.bold.hex('#7f00ff')
}
exports.msg = msg;

// * Adds padding to both side of a string to center align it to the ASCII logo in the console
function centerString(text) {
    if (text >= 40) return text; // If text is too long to center, do nothing.
    const padding = Math.floor((40 - text.length) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(padding);
}

exports.printLogo = function(text, style) {
    console.clear();
    console.log('                                        ');
    console.log(msg.brand('               ___  _____               '));
    console.log(msg.brand('              /  / /  _  \\             '));
    console.log(msg.brand('             /  / /  / \\  \\           '));
    console.log(msg.brand('            /  / /  /   \\  \\          '));
    console.log(msg.brand('           /  / /  /     \\  \\         '));
    console.log(msg.brand('          /  / /  /       \\  \\        '));
    console.log(msg.brand('         /__/ /__/         \\__\\       '));
    console.log('                                        ');
    console.log('----------------------------------------');
    console.log(msg[style || 'bold'](centerString(text || 'Nebula Harmony v0.1.0')));
    console.log('----------------------------------------');
    console.log('                                        ');
}

exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.epochToDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return (
        seconds === 60
            ? (minutes + 1) + ':00'
            : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    );
}

// Executes a shell command. Inherits stdio if verbose=true, so output is shown and input is interactive.
exports.shellExec = async (shellCmd, shellArgs = [], verbose = false) => {
    const result = await new Promise(async function(resolve, reject) {
        const spawnArgs = verbose ? {stdio: 'inherit'} : {}
        let stdoutData = '';
        const script = spawn(shellCmd, shellArgs, spawnArgs);
        script.stdout.on('data', data => stdoutData += data);
        script.on('close', (code) => {
            resolve({
                code: code,
                stdout: stdoutData
            });
        });

    });
    return result;
};