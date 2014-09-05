lock '3.2.1'

set :application, 'tracking-node'
set :repo_url, 'git@github.com:tuisco/tracking-node.git'
set :deploy_to, "/apps/#{fetch(:application)}"
set :npm_target_path, -> { release_path.join('node_modules') }
ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

namespace :deploy do
  after :updated, :link_files
  after :publishing, :restart
end
