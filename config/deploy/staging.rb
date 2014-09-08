fetch(:hostnames).each do |host|
  server host, user: 'conan', roles: %w{web app}
end

namespace :deploy do
  desc 'Restart monit'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # TODO: restart application
      # exec "sudo restart #{fetch(:application)} || sudo start #{fetch(:application)}"
    end
  end
end
