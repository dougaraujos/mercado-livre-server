/**
 * Module Dependencies
 */

import pkg from 'package.json';
import cfg from './config.json';


/**
 * Configuration File
 */

const config = {
	// From package.json
	name: pkg.name,
	version: pkg.version,
	description: pkg.description,
	company: pkg.company,
	keywords: pkg.keywords,
	engine: pkg.engines.node,
	
	// From config.json
	port: process.env.PORT || cfg.port,
	environment: cfg.environment,
	apiTrace: cfg.apiTrace,
	author: cfg.author
}


export default config;