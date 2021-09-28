#!/bin/bash

echo "--- AutoVirt Install Script ---"

if [[ ! $EUID -ne 0 ]]; then
   echo "This script must not be run as root. It will elevate itself when necessary." 
   exit 1
fi

source ./scripts/ask

checkDeps() {

    # Check for QEMU and virsh. If either are missing, prompt to install.
    if ! command -v qemu-system-x86_64 &> /dev/null || ! command -v virsh &> /dev/null
    then
        echo -e "\nQEMU and/or Libvirt is not installed!"
        
        if ask "Install Virtualisation Stack?"; then
            installVirt
        else
            echo "Cannot proceed without QEMU and Libvirt. Aborting."
            exit 1
        fi

    fi

    # Check for Node.js. If missing, prompt to install.
    if ! command -v node &> /dev/null
    then
        echo -e "\nNode.js is not installed!"

        if ask "Install Node.js?"; then
            installNode
        else
            echo "Cannot proceed without Node.js. Aborting."
            exit 1
        fi

    fi

    # Check for Libvirt Hook Helper. If missing, prompt to install.
    if [ ! -x "/etc/libvirt/hooks/qemu" ]
    then
        echo -e "\nLibvirt hook helper is either missing or not executable!"

        if ask "Install Libvirt hook helper?"; then
            installHookHelper
        else
            echo "Cannot proceed without hook helper. Aborting."
            exit 1
        fi

    fi

    # Check that qemu hooks directory does not already exist. If it does, prompt to delete.
    if [ -d "/etc/libvirt/hooks/qemu.d" ]
    then
        echo -e "\nLibvirt hooks already appear to be present."
        echo "You can proceed without deleting existing hooks, however you may run into conflicts if these hooks were not configured by AutoVirt."

        if ask "Delete existing hooks?"; then
            deleteHooks
        fi
        
    fi

}

installVirt() {
    echo
    chmod +x ./scripts/installVirt
    ./scripts/installVirt
    if [ $? -ne 0 ]; then
        exit 1
    fi
}

installNode() {
    echo
    chmod +x ./scripts/installNode
    ./scripts/installNode
    if [ $? -ne 0 ]; then
        exit 1
    fi
}

installHookHelper() {
    echo
    chmod +x ./scripts/installHookHelper
    sudo ./scripts/installHookHelper
    if [ $? -ne 0 ]; then
        exit 1
    fi
}

deleteHooks() {
    echo
    sudo rm -rf /etc/libvirt/hooks/qemu.d
    echo "Existing hooks have been deleted"
}

checkDeps

echo

echo ">> Preparing AutoVirt..."
npm install

echo
echo "All done! You can now launch AutoVirt by running 'npm start'"
exit 0