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

```bash
git clone https://github.com/maega/autovirt
cd autovirt
chmod +x ./install.sh
./install.sh
```

## Usage

The default entrypoint defined in package.json will currently launch iommu-tool.

```bash
npm start
```

## Progress

* [ ] Check for hardware accelerated virtualisation support (VT-x / AMD-V)

* [x] Automatically prepare a Linux system for virtualisation

* [x] Display IOMMU Groups in GUI

* [ ] Filter IOMMU devices by type (eg: GPU, USB Controller, etc..)

* [ ] Generate libvirt hook scripts based on passthrough selection

* [ ] Create and define libvirt XML with passthrough host devices pre-configured

* [ ] Easy "Create a VM" wizard (GUI based, auto configures VM from scratch)

* [ ] TPM Emulation & Hardware TPM Passthrough

* [ ] Automatic CPU Pinning & performance optimisations

* [ ] Automatic UUID configuration to prevent Windows deactivation when running a dual-booted native OS in a VM

* [ ] WebUI to control VMs and invoke hook scripts

## Support

If you'd like to support ongoing development of this project, a donation would be very much appreciated to help me dedicate more of my time making AutoVirt a reality. I accept direct crypto donations via any of the addresses below or through [Coinbase Commerce](https://commerce.coinbase.com/checkout/bb4f7665-bfdc-4c22-9fc8-78299010b1c8).

**BTC:** bc1q6kqv5u2368j4l00rls5frg78wt7m6vf7a50sa7

**ETH:** 0x704fb3fD106D00e6D78880C25139141C4B24DFd7

**DOGE:** D6MZp3HMZQA6gFBhmcmYs6AjytXwQJ4bYj

**LTC:** ltc1qhqgsnzwumxm7q3u3m4rj0zcvwcvcvhqqrke07p

**XMR:** 8429Hzck9gdX43MF9NzNGjaeGdKBwjVTjgGDQfXKV6WxfSGubxuBi6mEh2nDWwXtAZUjMejV4Pamr5SfYp96QJZNEQecMqS
