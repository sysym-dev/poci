interface Application {
    listen(port: number): void
}
interface Config {
    port: number
}

function parseConfig(raw?: Partial<Config>): Config {
    return {
        port: raw?.port ?? 3000
    }
}

export class Server {
    private application: Application
    private config: Config

    constructor (application: Application, config?: Config) {
        this.application = application
        this.config = parseConfig(config)
    }

    listen(cb?: (port: number) => void) {
        this.application.listen(this.config.port)

        if (cb) {
            cb(this.config.port)
        }
    }
}