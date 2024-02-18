import { describe, expect, jest, test } from '@jest/globals'
import { Server } from './server'

describe('Server', () => {
    test('valid class', () => {
        expect(typeof Server).toBe('function')
    })

    describe('.listen()', () => {
        test('valid method', () => {
            expect(typeof Server.prototype.listen).toBe('function')
        })

        test('execute application.listen()', () => {
            const listen = jest.fn()
            
            new Server({ listen })
                .listen()

            expect(listen).toBeCalledWith(3000)
        })

        test('execute with config.port', () => {
            const listen = jest.fn()

            new Server({ listen }, { port: 4000 })
                .listen()

            expect(listen).toBeCalledWith(4000)
        })

        test('execute callback', () => {
            const listen = jest.fn()
            const callback = jest.fn()

            new Server({ listen })
                .listen(callback)

            expect(callback).toBeCalledWith(3000)
        })
    })
})