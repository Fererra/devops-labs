Vagrant.configure("2") do |config|
  config.vm.box = "generic/fedora39"
  
  config.ssh.insert_key = false
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.synced_folder ".", "/vagrant", type: "rsync"
  config.vm.provision "shell", path: "setup.sh"
  
  config.vm.provider :libvirt do |libvirt|
    libvirt.memory = 2048
    libvirt.cpus = 2
  end
end