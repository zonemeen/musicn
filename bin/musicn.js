#!/usr/bin/env node
'use strict'
import musicn from '../lib/index.js'

// Provide a title to the process in `ps`
process.title = 'musicn'

!(async () => {
  await musicn()
})()
