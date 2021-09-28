# AutoVirt
An (experimental) attempt at making PCIe passthrough to KVM VMs easier

Currently includes iommu-tool, which displays IOMMU groups in a GUI. The goal is to be able to select groups/devices to passthrough and have iommu-tool automatically generate valid libvirt hook scripts to unbind/rebind PCIe devices.
 
## Installation
The _install.sh_ script in the project's root directory will attempt to configure your system for virtualisation by installing the QEMU/Libvirt/OVMF stack, Node.js (for AutoVirt's iommu-tool and web-remote) and The Passthrough Post's VFIO-Tools Hook Helper. It'll also build the project's _node_modules_ directory using _npm install_.
```
git clone https://github.com/maega/autovirt
cd autovirt
chmod +x ./install.sh
./install.sh
```

## Usage
The default entrypoint defined in package.json will currently launch iommu-tool.
```
npm start
```
