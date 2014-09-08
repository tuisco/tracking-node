lock '3.2.1'
require 'yaml'

set :application, 'tracking_node'
set :repo_url, 'git@github.com:tuisco/tracking-node.git'
set :deploy_to, "/apps/#{fetch(:application)}"
set :npm_target_path, -> { release_path.join('node_modules') }
set :hostnames, YAML.load_file("config/hosts.#{fetch(:stage)}.yml")["hosts"]
ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

namespace :deploy do
  desc 'Link required files'
  task :link_files do
    on roles(:app) do
      exec "ln -nfs #{shared_path.join('newrelic.js')} newrelic.js"
    end
  end

  desc 'Restart app'
  task :restart do
    on roles(:app) do
      exec "sudo restart #{fetch(:application)} || sudo start #{fetch(:application)}"
    end
  end

  after :updated, :link_files
  after :publishing, :restart
end
