#!/bin/bash

iommuGroups=$(find '/sys/kernel/iommu_groups/' -maxdepth 1 -mindepth 1 -type d)

if [ -z "$iommuGroups" ]; then
	echo "{}"
	exit
fi

result="["
for iommuGroup in $iommuGroups; do

	printf -v line '{"group":"%s","devices":[' "$(basename "$iommuGroup")"
    result+=$line

	for device in $(ls -1 "$iommuGroup/devices/"); do
		devicePath="$iommuGroup/devices/$device/"

		# Print pci device
		thisDevice=$(lspci -nns "$device")

        IFS=' ' read -r devId devName <<< "$thisDevice"

        IFS=':' read -r devType devName <<< "$devName"

		# Print drivers
		driverPath=$(readlink "$devicePath/driver")
		if [ -z "$driverPath" ]; then
            devDriver="none"
		else
            devDriver=$(basename $driverPath)
		fi

		# Print usb devices
		#usbBuses=$(find $devicePath -maxdepth 2 -path '*usb*/busnum')
		#for usb in $usbBuses; do
		#	echo 'Usb bus:'
		#	lsusb -s $(cat "$usb"): | indent
		#done | indent

		# Print block devices
		#blockDevices=$(find $devicePath -mindepth 5 -maxdepth 5 -name 'block')
		#for blockDevice in $blockDevices; do
		#	echo 'Block device:'
		#	echo "Model: $(cat "$blockDevice/../model")" | indent
		#	lsblk -no NAME,SIZE,MOUNTPOINT "/dev/$(ls -1 $blockDevice)" | indent
		#done | indent

        printf -v line '{"id":"%s","type":"%s","name":"%s","driver":"%s"},' "$devId" "$devType" "$devName" "$devDriver"
        result+=$line

	done

    result+="]},"

done

result+="]"
result=${result//,\]/\]}

echo $result