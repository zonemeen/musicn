import { EventEmitter } from 'node:events'
import { inherits } from 'node:util'
import sinon from 'sinon'

const stub = {}

Object.assign(stub, {
  write: sinon.stub().returns(stub),
  moveCursor: sinon.stub().returns(stub),
  setPrompt: sinon.stub().returns(stub),
  close: sinon.stub().returns(stub),
  pause: sinon.stub().returns(stub),
  resume: sinon.stub().returns(stub),
  _getCursorPos: sinon.stub().returns({ cols: 0, rows: 0 }),
  output: {
    end: sinon.stub(),
    mute: sinon.stub(),
    unmute: sinon.stub(),
    __raw__: '',
    write(str) {
      this.__raw__ += str
    },
  },
})

const ReadlineStub = function () {
  this.line = ''
  this.input = new EventEmitter()
  EventEmitter.apply(this, arguments)
}

inherits(ReadlineStub, EventEmitter)
Object.assign(ReadlineStub.prototype, stub)

export default ReadlineStub
