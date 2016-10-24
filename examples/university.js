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
    // const {sessionId, context, entities} = request
    // const {text, quickreplies} = response
    return new Promise(function (resolve, reject) {
      console.log('sending...', JSON.stringify(response))
      return resolve()
    })
  },
  getStaffInfo ({context, entities}) {
    return new Promise(function (resolve, reject) {
      let typeInfo = firstEntityValue(entities, 'typeInfo')
      let staff = firstEntityValue(entities, 'staff')

      delete context.result
      staff = staff || context.prevStaff
      typeInfo = typeInfo || context.prevTypeInfo

      if (staff && typeInfo) {
        context.prevStaff = staff
        context.prevTypeInfo = typeInfo
        switch (typeInfo) {
          case 'despacho':
            context.result = 'DKV-5' // we should call a Staff API here
            delete context.unknownTypeinfo
            break;
          case 'email':
            context.result = 'charlesaraya@gmail.com' // we should call a Staff API here
            delete context.unknownTypeinfo
            break;
          case 'asignaturas':
            context.result = 'Electrónica, Patrones de Comunicación y Redes III' // we should call a Staff API here
            delete context.unknownTypeinfo
            break;
          case 'departamento':
            context.result = 'Departamento de Ingeniería Informática' // we should call a Staff API here
            delete context.unknownTypeinfo
            break;
          case 'telefono':
            context.result = '628111020' // we should call a Staff API here
            delete context.unknownTypeinfo
            break;
          case 'fax':
            context.result = '914552113' // we should call a Staff API here
            delete context.unknownTypeinfo
            break;
          case 'web':
            context.result = 'http://charlesaraya.com' // we should call a Staff API here
            delete context.unknownTypeinfo
            break;
          default:
            delete context.result
            context.unknownTypeinfo = typeInfo
        }
        delete context.error
        delete context.missingProfessor
        // we should call search the person in the staff Api
        if (['Charles Araya', 'Borja Boada'].indexOf(staff) < 0) {
          delete context.result
          delete context.unknownTypeinfo
          delete context.prevStaff
          context.missingProfessor = staff
        }
      } else {
        delete context.result
        delete context.unknownTypeinfo
        delete context.missingProfessor
        delete context.prevStaff
        context.error = true
      }
      console.log(`context: ${JSON.stringify(context)}`)
      return resolve(context)
    })
  }
}

const client = new Wit({accessToken, actions})
interactive(client)
