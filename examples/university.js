'use strict'

let Wit = null
let interactive = null
try {
  // if running from repo
  Wit = require('../').Wit
  interactive = require('../').interactive
} catch (e) {
  Wit = require('node-wit').Wit
  interactive = require('node-wit').interactive
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/quickstart.js <wit-access-token>')
    process.exit(1)
  }
  return process.argv[2]
})()

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value

  if (!val) {
    return null
  }
  return typeof val === 'object' ? val.value : val
}

const actions = {
  send (request, response) {
    const {sessionId, context, entities} = request
    const {text, quickreplies} = response

    return new Promise(function (resolve, reject) {
      console.log('sending...', JSON.stringify(response))
      return resolve()
    })
  },
  getProfessorInfo ({context, entities}) {
    return new Promise(function (resolve, reject) {
      // university things here
      return resolve(context)
    })
  },
}

const client = new Wit({accessToken, actions})
interactive(client)
