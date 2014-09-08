fetch(:hostnames).each do |host|
  server host, user: 'conan', roles: %w{web app}
end

namespace :deploy do
  desc 'Restart monit'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      exec "sudo restart #{fetch(:application)} || sudo start #{fetch(:application)}"
    end
  end

  desc 'Link required files'
  task :link_files do
    on roles(:app) do
      exec "ln -s #{shared_path.join('newrelic.js')} newrelic.js"
    end
  end
end
