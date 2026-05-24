output "worker_ip" {
  description = "IP address of the worker node"
  value       = libvirt_domain.vm_worker.network_interface[0].addresses[0]
}

output "db_ip" {
  description = "IP address of the database node"
  value       = libvirt_domain.vm_db.network_interface[0].addresses[0]
}