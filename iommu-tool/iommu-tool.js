//const electron = require('electron');
const {exec, spawn} = require("child_process");
const jQuery = require("jquery");

// Runs a script from the scripts directory and parses its JSON stdout
async function runInternalScript() {

    const htmlElem = document.getElementById('iommu-groups');
    htmlElem.innerHTML = '<h2 style="color:white">Scanning, please wait</h2>';

    const result = await new Promise(async function(resolve, reject) {
    
        const script = spawn("bash", [`./iommu-tool/iommu-json.sh`]);
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
            
            devices.push(`
                <tr>
                    <td><input type="checkbox" ${device.driver === 'pcieport' ? 'disabled' : ''}></td>
                    <td>${device.type}</td>
                    <td>${device.name}</td>
                    <td>${device.driver}</td>
                    <td>${device.id}</td>
                </tr>
            `);
        });

        const checkLen = () => devices.length < 2 && jQuery(devices[0]).find('input[type="checkbox"][disabled]').length
            ? 'disabled'
            : '';

        htmlElem.innerHTML += `
            <div class="group" style="text-align:left">
                <h3 style="margin:0;margin-bottom:.3rem;margin-left:3rem;text-align:left;">Group ${group.group}</h3>
                <table id="gr-${group.group}">
                    <thead>
                        <tr>
                            <th><input type="checkbox" ${checkLen()}></th>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Driver</th>
                            <th>ID</th>
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