#!/usr/bin/env node

import * as program from 'yargs'
import makeModule from './make-module'

program
	.command('$0 <name>', 'Bootstrap a Drupal module. Defaults to Drupal 8.', {}, makeModule)
	.alias('version', 'v')
	.option('seven', {alias: 's', description: 'Create a module for Drupal 7'})
	.option('default-folder', {alias: 'd', description: 'Create module in the `sites/default/` folder rather than the `sites/all/` folder.'})
	.option('machine-name', {alias: 'm', description: 'Manually specify module\'s machine name. Must be snake case.'})
	.option('current-directory', {alias: 'c', description: 'Create module in the current directory. Good for creating contrib modules.'})
	.conflicts('default-folder', 'current-directory')
	.help()
	.argv
