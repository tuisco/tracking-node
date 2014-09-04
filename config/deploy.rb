lock '3.2.1'

set :application, 'tracking-node'
set :repo_url, 'git@github.com:tuisco/tracking-node.git'
set :deploy_to, "/apps/#{fetch(:application)}"
set :npm_target_path, -> { release_path.join('node_modules') }
ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do

    end
  end

  after :publishing, :restart
end
