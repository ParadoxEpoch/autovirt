const {spawn} = require("child_process");

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
    const result = await new Promise(async function(resolve, reject) {
    
        const script = spawn("bash", [`./app/iommu-json.sh`]);
        script.stdout.on("data", data => resolve(data));
        script.stderr.on("data", data => console.error(`Script wrote to stderr: ${data}`));
        script.on('error', (error) => reject(error));
        
        /* script.on("close", code => console.log(`child process exited with code ${code}`)); */
    
    });

    const jsonParsed = JSON.parse(result);

    const jsonResult = jsonParsed.sort((a, b) => parseInt(a.group) - parseInt(b.group));

    console.log(jsonResult);
}