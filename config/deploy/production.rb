fetch(:hostnames).each do |host|
  server host, user: 'conan', roles: %w{web app}
end
