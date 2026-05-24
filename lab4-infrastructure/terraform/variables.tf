variable "vm_memory" {
  type        = string
  default     = "2048"
  description = "RAM size for virtual machines"
}

variable "vm_vcpu" {
  type        = number
  default     = 2
  description = "Number of CPU cores"
}

variable "os_image_url" {
  type        = string
  default     = "https://cloud-images.ubuntu.com/releases/22.04/release/ubuntu-22.04-server-cloudimg-amd64.img"
  description = "URL of the cloud OS image to download"
}