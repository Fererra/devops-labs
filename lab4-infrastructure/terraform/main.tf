terraform {
  required_version = ">= 1.0"
  required_providers {
    libvirt = {
      source  = "dmacvicar/libvirt"
      version = "~> 0.7.6"
    }
  }
}

provider "libvirt" {
  uri = "qemu:///system"
}

resource "libvirt_network" "lab4_net" {
  name      = "lab4-network"
  mode      = "nat"
  addresses = ["192.168.100.0/24"]
  
  dhcp {
    enabled = true
  }

  dns {
    enabled    = true
    local_only = true
  }
}

resource "libvirt_volume" "os_image" {
  name   = "ubuntu-22.04-base.qcow2"
  pool   = "default"
  source = var.os_image_url
  format = "qcow2"
}

resource "libvirt_volume" "worker_disk" {
  name           = "worker.qcow2"
  base_volume_id = libvirt_volume.os_image.id
  pool           = "default"
  size           = 10737418240
}

resource "libvirt_cloudinit_disk" "worker_init" {
  name      = "worker-init.iso"
  user_data = file("${path.module}/user_data.cfg")
  pool      = "default"
}

resource "libvirt_domain" "vm_worker" {
  name   = "lab4-worker"
  memory = var.vm_memory
  vcpu   = var.vm_vcpu

  cloudinit = libvirt_cloudinit_disk.worker_init.id

  network_interface {
    network_id     = libvirt_network.lab4_net.id
    wait_for_lease = true
  }

  disk {
    volume_id = libvirt_volume.worker_disk.id
  }

  console {
    type        = "pty"
    target_port = "0"
    target_type = "serial"
  }
}


resource "libvirt_volume" "db_disk" {
  name           = "db.qcow2"
  base_volume_id = libvirt_volume.os_image.id
  pool           = "default"
  size           = 10737418240
}

resource "libvirt_cloudinit_disk" "db_init" {
  name      = "db-init.iso"
  user_data = file("${path.module}/user_data.cfg")
  pool      = "default"
}

resource "libvirt_domain" "vm_db" {
  name   = "lab4-db"
  memory = var.vm_memory
  vcpu   = var.vm_vcpu

  cloudinit = libvirt_cloudinit_disk.db_init.id

  network_interface {
    network_id     = libvirt_network.lab4_net.id
    wait_for_lease = true
  }

  disk {
    volume_id = libvirt_volume.db_disk.id
  }

  console {
    type        = "pty"
    target_port = "0"
    target_type = "serial"
  }
}

resource "local_file" "ansible_inventory" {
  filename = "${path.module}/../ansible/inventory.ini"
  content  = <<EOT
[workers]
worker-node ansible_host=${libvirt_domain.vm_worker.network_interface[0].addresses[0]}

[db]
db-node ansible_host=${libvirt_domain.vm_db.network_interface[0].addresses[0]}

[all:vars]
ansible_user=ansible
ansible_ssh_private_key_file=~/.ssh/id_ed25519
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
ansible_python_interpreter=/usr/bin/python3
EOT
}