const {msg, printLogo, shellExec} = require('./func/common');
const sysInfo = require('./func/sysinfo');
const inquirer = require('inquirer');

async function main(getSysInfo = true) {

    printLogo();

    if (getSysInfo) await getSystemInfo();

    const action = await inquirer.prompt({
        type: 'list',
        name: 'do',
        message: 'What would you like to do?',
        choices: [
            {name: 'Run IOMMU Tool', value: 'iommu'},
            {name: '???', value: 'stress'},
            {name: '???', value: 'wininstall'},
            {name: '???', value: 'sysinfo'},
        ]
    });

    switch(action.do) {
        case 'iommu':
            await getIommu();
            break;
        case 'stress':
            // stress tests
            break;
        case 'wininstall':
            // install windows
            //await wininstall.start();
            break;
        case 'sysinfo':
            // system info
            printLogo('Dumping System Information');
            console.log(await sysInfo.get.all());
            break;
    }

    const restart = await inquirer.prompt({
        type: 'confirm',
        name: 'do',
        message: 'Would you like to do something else?',
        default: true,
    });

    restart.do
        ? main(false)
        : printLogo('Thank you, come again!') && process.exit();

}

async function getSystemInfo() {

    const info = await sysInfo.get.all();

    printLogo();

    console.log(msg.info('OS Version: ') + info.os.release);
    console.log(msg.info('Graphics Driver: ') + (info.gpu.driverVersion || msg.error('Unknown Driver')));
    console.log(msg.info('BIOS Date: ') + info.bios.releaseDate);
    console.log(msg.info('Processor: ') + `${info.cpu.brand} (${info.cpu.physicalCores}C/${info.cpu.cores}T @ ${info.cpu.speed}GHz)`);
    console.log(msg.info('Motherboard: ') + info.mobo.model);
    console.log(msg.info('Memory: ') + `${info.ram.manufacturer} ${info.ram.model} ${info.ram.totalGB}GB (${info.ram.dimms}x${info.ram.dimmSizeGB}GB @ ${info.ram.speed}MHz)`);
    console.log(msg.info('Graphics: ') + info.gpu.name);
    console.log(msg.info('Connected Displays: ') + info.displays.length);
    console.log(msg.info('System UUID: ') + info.uuid.hardware);

    // Multi-GPU Check
    if (info.gpu.isMultiGPU) console.log(msg.warn('\nWARNING: Multiple GPUs Detected!'));
    
    // RAM Speed Check (XMP/DOCP)
    if (info.ram.speed < 2150) console.log(msg.warn('\nWARNING: RAM speed is low. Check that XMP/DOCP is enabled in the BIOS!!'));
    
    // BIOS Date Check
    if ((Date.now() - 15778463000) > new Date(info.bios.releaseDate).getTime()) console.log(msg.warn('\nWARNING: BIOS is more than 6 months old and might be out of date. Check for a BIOS update!'));

    // GPU Driver Check
    if (!info.gpu.driverVersion) console.log(msg.warn('\nWARNING: Graphics driver not detected. This may be due to an iGPU only system, or missing drivers. Check that graphics drivers are installed!!'));

    console.log(' ');

    //global.sysInfo = info;

    return info;
}

main();

const deviceMeta = [
    {
        type: 'Ethernet controller [0200]',
        typeName: 'Network - Ethernet',
        passThru: 'allowed'
    },
    {
        type: 'Network controller [0280]',
        typeName: 'Network - WiFi',
        passThru: 'allowed'
    },
    {
        type: 'VGA compatible controller [0300]',
        typeName: 'Graphics Card',
        passThru: 'allowed'
    },
    {
        type: 'Audio device [0403]',
        typeName: 'Sound Card / GPU Audio',
        passThru: 'allowed'
    },
    {
        type: 'USB controller [0c03]',
        typeName: 'USB Controller',
        passThru: 'allowed'
    },
    {
        type: 'PCI bridge [0604]',
        typeName: 'PCI Bridge',
        passThru: 'ignored'
    },
    {
        type: 'Host bridge [0600]',
        typeName: 'Host Bridge',
        passThru: 'ignored'
    },
    {
        type: 'Non-Essential Instrumentation [1300]',
        typeName: 'Non-Essential Instrumentation',
        passThru: 'withGroup'
    },
    {
        type: 'Non-Volatile memory controller [0108]',
        typeName: 'NVMe SSD',
        passThru: 'allowed'
    },
    {
        type: 'SATA controller [0106]',
        typeName: 'SATA Drive',
        passThru: 'allowed'
    }
];

async function getIommu() {

    const result = await shellExec('./web/iommu-json.sh');

    const jsonParsed = JSON.parse(result.stdout);

    const jsonResult = jsonParsed.sort((a, b) => parseInt(a.group) - parseInt(b.group));

    console.log(jsonResult);

    return jsonResult;
}