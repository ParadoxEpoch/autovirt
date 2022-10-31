const info = require('systeminformation');

const getSystemParam = {

    uuid: async () => {
        console.log('Getting System UUID...');
        return await info.uuid();
    },

    bios: async () => {
        console.log('Getting BIOS Information...');
        return await info.bios();
    },

    mobo: async () => {
        console.log('Getting Motherboard Information...');
        return await info.baseboard();
    },

    cpu: async () => {
        console.log('Getting CPU Information...');
        return await info.cpu();
    },

    ram: async () => {
        console.log('Getting RAM Information...');
        const memInfo = await info.mem();
        const memLayout = await info.memLayout();
        return {
            ...memInfo,
            layout: memLayout,
            dimms: memLayout.length,
            speed: memLayout[0].clockSpeed,
            manufacturer: memLayout[0].manufacturer,
            model: memLayout[0].partNum,
            totalGB: Math.ceil(memInfo.total / 1073741824), // RAM total in bytes / (1024 * 1024 * 1024), rounded up to nearest integer. Should give us total RAM in GB.)
            dimmSizeGB: Math.ceil(memLayout[0].size / 1073741824)
        }
    },

    gpu: async () => {
        console.log('Getting GPU Information...');
        const graphics = await info.graphics();
        if (graphics.controllers.length > 1) graphics.controllers[0].isMultiGPU = true;
        return graphics.controllers[0];
    },

    displays: async () => {
        console.log('Getting Display Information...');
        const graphics = await info.graphics();
        return graphics.displays;
    },

    os: async () => {
        console.log('Getting OS Information...');
        return await info.osInfo();
    },

    disks: async () => {
        console.log('Getting Disk Information...');

        return {}
    }

}

async function getAllParams() {

    const paramList = Object.keys(getSystemParam);
    const output = {};

    for (const param of paramList) {
        output[param] = await getSystemParam[param]();
    }

    return output;

}

module.exports = {
    get: {
        ...getSystemParam,
        all: getAllParams
    }
}