//const electron = require('electron');
const {spawn} = require("child_process");
const jQuery = require("jquery");
const $ = jQuery;
const customTitlebar = require('@meetbutter/custom-electron-title-bar');

/* require('datatables.net-dt')(window, $);
require('datatables.net-buttons-dt')(window, $);
require('datatables.net-buttons/js/buttons.colVis.js')(window, $);
require('datatables.net-fixedheader-dt')(window, $);
require('datatables.net-keytable-dt')(window, $);
require('datatables.net-responsive-dt')(window, $);
require('datatables.net-searchpanes-dt')(window, $);
require('datatables.net-select-dt')(window, $); */

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
]
window.addEventListener('DOMContentLoaded', () => {
    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#40495c')
    });

    $('#material-tabs').each(function() {
        var active, content, links = $(this).find('a');

        active = $(links[0]);
        active.addClass('active');

        content = $(active[0].hash);

        links.not(active).each(function() {
            $(this.hash).hide();
        });

        $(this).on('click', 'a', function(e) {

                active.removeClass('active');
                content.hide();

                active = $(this);
                content = $(this.hash);

                active.addClass('active');
                content.show();

                e.preventDefault();
        });
    });

});

// Runs a script from the scripts directory and parses its JSON stdout
async function runInternalScript() {

    const htmlElem = document.getElementById('iommu-groups');
    htmlElem.innerHTML = '<h2 style="color:white">Scanning, please wait</h2>';

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

    htmlElem.innerHTML = '';

    jsonResult.forEach(group => {

        const devices = [];
        group.devices.forEach(device => {

            //if (device.driver === 'pcieport') return; // Ignore PCI bridge devices

            const thisMeta = deviceMeta.find(meta => device.type === meta.type) || {
                type: device.type,
                typeName: device.type
            };
            
            devices.push(`
                <tr>
                    <td><input type="checkbox" data-passthru="${thisMeta.passThru}" ${thisMeta.passThru === 'ignored' ? 'disabled' : ''}></td>
                    <td>${thisMeta.typeName}</td>
                    <td>${device.name}</td>
                    <td>${device.driver}</td>
                    <td>${device.id}</td>
                    <td>${thisMeta.passThru || 'unknown'}</td>
                </tr>
            `);
        });

        const checkLen = () => devices.length < 2 && jQuery(devices[0]).find('input[type="checkbox"][disabled]').length

        const isAllIgnored = () => {

            const enabledDevice = devices.find(device => {
                return jQuery(device).find('input[type="checkbox"]:not([disabled])').length
            });

            return !enabledDevice

        }

        htmlElem.innerHTML += `
            <div class="group ${isAllIgnored() ? 'is-hidden' : ''}" style="text-align:left">
                <h3 style="margin:0;margin-bottom:.3rem;margin-left:3rem;text-align:left;">Group ${group.group} <i class="fas fa-exclamation-triangle is-hidden" style="color:#fd7e14"></i></h3>
                <table id="gr-${group.group}">
                    <thead>
                        <tr>
                            <th><input type="checkbox" ${checkLen() ? 'disabled' : ''}></th>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Driver</th>
                            <th>ID</th>
                            <th>Passthru</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${devices.join('')}
                    </tbody>
                </table>
            </div>
        `;

    });

    jQuery("#iommu-groups table").simpleCheckboxTable();

    return jsonResult;

}

runInternalScript();