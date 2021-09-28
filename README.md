# AutoVirt
An (experimental) attempt at making single-GPU PCIe passthrough to QEMU VMs easier.

_This project is still in development and is not currently feature complete._

With AutoVirt, you can easily setup a Windows/macOS/Linux Virtual Machine on a Linux host with a single GPU and full PCIe passthrough to run at near-native performance without having to dual-boot. Perfect for running a Windows gaming VM under Linux.

Currently includes iommu-tool, which displays IOMMU groups in a GUI. The goal is to be able to select groups/devices to passthrough and have iommu-tool automatically generate valid libvirt hook scripts to unbind/rebind PCIe devices.

## Compatibility
This project has been tested on the following system:
* **Motherboard:** ASUS ROG Strix X570-E
* **Processor:** AMD Ryzen 3900X
* **Graphics:** ASUS GeForce RTX 3080 ROG Strix
* **Host OS:** Manjaro Linux 21.1.4

Ideally you should have relatively sane IOMMU grouping to avoid ACS patching. The ambition is to eventually have AutoVirt handle this stuff automatically for you, but that's not the case yet.

While this project has only been tested on Manjaro (so far), it's designed to run on most Debian, Arch and RHEL based Linux distributions. Windows will never be supported as a host OS due to technical limitations.

## Installation
The _install.sh_ script in the project's root directory will attempt to configure your system for virtualisation by installing the QEMU/Libvirt/OVMF stack, Node.js (for AutoVirt's iommu-tool and web-remote) and The Passthrough Post's VFIO-Tools Hook Helper. It'll also build the project's _node_modules_ directory using `npm install`.
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

## Progress
- [ ] Check for hardware accelerated virtualisation support (VT-x / AMD-V)
- [x] Automatically prepare a Linux system for virtualisation
- [x] Display IOMMU Groups in GUI
- [ ] Filter IOMMU devices by type (eg: GPU, USB Controller, etc..)
- [ ] Generate libvirt hook scripts based on passthrough selection
- [ ] Create and define libvirt XML with passthrough host devices pre-configured
- [ ] Easy "Create a VM" wizard (GUI based, auto configures VM from scratch)
- [ ] TPM Emulation & Hardware TPM Passthrough
- [ ] Automatic CPU Pinning & performance optimisations
- [ ] Automatic UUID configuration to prevent Windows deactivation when running a dual-booted native OS in a VM
- [ ] WebUI to control VMs and invoke hook scripts
