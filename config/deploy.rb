# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'tracking-node'
set :repo_url, 'git@github.com:tuisco/tracking-node.git'

# Default branch is :master
ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/apps/mark-tracking-node'

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :sudo, 'restart mark-tracking-node'
    end
  end

  after :publishing, :restart
end
