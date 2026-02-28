source "https://rubygems.org"

gem "fastlane", "~> 2.232"
gem "dotenv", "~> 2.8"
gem "cocoapods", "~> 1.16"

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
