interface IUserOpts {
    container: HTMLElement
    content: string
    width: number
    height: number
    textAlign: CanvasTextAlign
    textBaseline: CanvasTextBaseline
    font: string
    fillStyle: string
    rotate: number
    zIndex: number
}

class WatermarkPage {
    // 水印样式
    private container: HTMLElement = document.body
    private content: string = 'water mark'
    private width: string = '300px'
    private height: string = '300px'
    private textAlign: CanvasTextAlign = 'center'
    private textBaseline: CanvasTextBaseline = 'middle'
    private font: string = '20px Microsoft Yahei'
    private fillStyle: string = 'rgba(184, 184, 184, 0.4)'
    private rotate: number = 24
    private zIndex: number = 999
    // 水印 canvas
    private canvas: HTMLCanvasElement = document.createElement('canvas')
    private styleStr: string = ''
    private monitor: any
    private uniEleToken: string = ''

    constructor(opts: Partial<IUserOpts>) {
        this.uniEleToken = `watermark-container_${parseInt((Math.random() * 1000000) as any)}`
        this.resetWaterParams(opts)
        this.setWaterCanvas()
        this.addMonitor()
    }

    private resetWaterParams = (opts: Partial<IUserOpts>): void => {
        opts.container && (this.container = opts.container)
        opts.content && (this.content = opts.content)
        opts.width && (this.width = `${opts.width}px`)
        opts.height && (this.height = `${opts.height}px`)
        opts.textAlign && (this.textAlign = opts.textAlign)
        opts.textBaseline && (this.textBaseline = opts.textBaseline)
        opts.font && (this.font = opts.font)
        opts.fillStyle && (this.fillStyle = opts.fillStyle)
        opts.rotate && (this.rotate = opts.rotate)
        opts.zIndex && (this.zIndex = opts.zIndex)
    }

    private setWaterCanvas = (): void => {
        const {
            canvas,
            content,
            width,
            height,
            textAlign,
            textBaseline,
            font,
            fillStyle,
            rotate,
            zIndex,
            uniEleToken,
        } = this
        canvas.setAttribute('width', width)
        canvas.setAttribute('height', height)
        let ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
        ctx.textAlign = textAlign
        ctx.textBaseline = textBaseline
        ctx.font = font
        ctx.fillStyle = fillStyle
        ctx.rotate((Math.PI / 180) * rotate)
        ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2)

        const base64Url = canvas.toDataURL()
        const watermarkDiv = document.createElement('div')
        this.styleStr =
            'position:absolute; top:0; left:0; width:100%; height:100%; z-index:' +
            zIndex +
            "; pointer-events:none; background-repeat:repeat; background-image:url('" +
            base64Url +
            "')"
        watermarkDiv.setAttribute('style', this.styleStr)
        watermarkDiv.classList.add(uniEleToken)
        watermarkDiv.id = uniEleToken
        this.container.style.position = 'relative'
        this.container.insertBefore(watermarkDiv, this.container.firstChild)
    }

    private addMonitor = (): void => {
        const { styleStr, container, uniEleToken } = this
        const MutationObserver = (window as any).MutationObserver || (window as any).WebKitMutationObserver
        if (MutationObserver) {
            this.monitor = new MutationObserver(() => {
                const __wm = document.querySelector(`.${uniEleToken}`)
                if ((__wm && __wm.getAttribute('style') !== styleStr) || !__wm) {
                    // 避免一直触发
                    this.setWaterCanvas()
                }
            })

            this.monitor.observe(container, {
                attributes: true,
                subtree: true,
                childList: true,
            })
        }
    }

    public destroy = (): void => {
        const { uniEleToken } = this
        if (!this.monitor) return
        this.monitor.disconnect()
        this.monitor = null
        const wmContainer: HTMLElement = document.getElementById(`${uniEleToken}`)!
        const parentNode: HTMLElement = wmContainer.parentElement!
        parentNode.removeChild(wmContainer)
    }
}

export default WatermarkPage
