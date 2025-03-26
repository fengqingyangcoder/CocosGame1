import { Asset, AssetManager, assetManager } from 'cc'
import { ArrayUtil } from '../util/ArrayUtil'
import { Debug } from '../util/Debug'

const Tag: string = 'ResMgr'

type Bundle = AssetManager.Bundle

export class ResMgr {

    public static get Assets() {
        return assetManager.assets
    }

    private static _loadedRefRes: Object = {}
    public static get LoadedRes(): Object {
        return this._loadedRefRes
    }

    public static loadBundle(Bundle: string, onComplete: Function = null): Promise<Bundle> {
        return new Promise<Bundle>((resolve, reject) => {
            let startTime: number = Date.now()
            if (assetManager.getBundle(Bundle)) {
                Debug.Warn(Tag, `资源包${Bundle}已加载,无需重复加载`)
                resolve(assetManager.getBundle(Bundle))
            } else {
                Debug.Log(Tag, `资源包${Bundle}开始加载`)
                assetManager.loadBundle(Bundle, (err: Error, bundle: Bundle) => {
                    if (err) {
                        Debug.Error(Tag, `资源包${Bundle}加载失败 err:${err}`)
                        reject(err)
                    } else {
                        let endTime: number = Date.now()
                        Debug.Log(Tag, `资源包${Bundle}加载完毕,用时${endTime - startTime}ms`)
                        onComplete && onComplete(bundle)
                        resolve(bundle)
                    }
                })
            }
        })
    }

    public static preloadDir(Bundle: string, dir: string = "./"): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            Debug.Log(Tag, `开始预加载资源包${Bundle}下的文件夹${dir}`)
            let bundle: Bundle = assetManager.getBundle(Bundle)
            if (!bundle) {
                bundle = await this.loadBundle(Bundle)
            }
            let startTime: number = Date.now()
            bundle.preloadDir(dir, (err: Error, items) => {
                if (err) {
                    Debug.Error(Tag, `资源包${Bundle}下的文件夹${dir}预加载失败,err:${err}`)
                    reject(err)
                } else {
                    let endTime: number = Date.now()
                    Debug.Log(Tag, `资源包${Bundle}下的文件夹${dir}预加载完毕,用时${endTime - startTime}ms`)
                    resolve()
                }
            })
        })
    }

    public static loadDir(Bundle: string, dir: string = "./", ref: boolean = false): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            Debug.Log(Tag, `开始加载资源包${Bundle}下的文件夹${dir}`)
            let bundle: Bundle = assetManager.getBundle(Bundle)
            if (!bundle) {
                bundle = await this.loadBundle(Bundle)
            }
            let startTime: number = Date.now()
            bundle.loadDir(dir, (err: Error, assets: Asset[]) => {
                if (err) {
                    Debug.Error(Tag, `资源包${Bundle}下的文件夹${dir}加载失败,err:${err}`)
                    reject(err)
                } else {

                    if (ref) {
                        if (!this._loadedRefRes.hasOwnProperty(Bundle)) {
                            this._loadedRefRes[Bundle] = []
                        }
                        for (let i = 0; i < assets.length; i++) {
                            const asset: Asset = assets[i]
                            if (!ArrayUtil.has(this._loadedRefRes[Bundle], asset)) {
                                this._loadedRefRes[Bundle].push(asset)
                                asset.addRef()
                            }
                        }
                    }

                    let endTime: number = Date.now()
                    Debug.Log(Tag, `资源包${Bundle}下的文件夹${dir}加载完毕,用时${endTime - startTime}ms`)
                    resolve()
                }
            })
        })
    }

    public static loadRes<T extends Asset>(Bundle: string, resName: string, relative_path: string = "", ref: boolean = false): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            let path: string = relative_path + resName
            Debug.Log(Tag, `开始加载资源包${Bundle}下的文件${path}`)
            let bundle: Bundle = assetManager.getBundle(Bundle)
            if (!bundle) {
                bundle = await this.loadBundle(Bundle)
            }
            let startTime: number = Date.now()
            bundle.load(path, (err: Error, asset: T) => {
                if (err) {
                    Debug.Error(Tag, `资源包${Bundle}下的文件${path}加载失败,err:${err}`)
                    reject(err)
                } else {
                    let endTime: number = Date.now()
                    if (ref) {
                        if (!this._loadedRefRes.hasOwnProperty(Bundle)) {
                            this._loadedRefRes[Bundle] = []
                        }
                        if (!ArrayUtil.has(this._loadedRefRes[Bundle], asset)) {
                            this._loadedRefRes[Bundle].push(asset)
                            asset.addRef()
                        }
                    }
                    Debug.Log(Tag, `资源包${Bundle}下的文件${path}加载完毕,用时${endTime - startTime}ms`)
                    resolve(asset)
                }
            })
        })
    }

    public static getRes<T extends Asset>(Bundle: string, resName: string, relative_path: string = ""): T {
        let bundle: Bundle = assetManager.getBundle(Bundle)
        if (!bundle) {
            Debug.Error(Tag, `资源包${Bundle}暂未加载,无法获取资源${resName}`)
            return null
        }
        let path: string = relative_path + resName
        const res: T = bundle.get(path)
        if (!res) {
            Debug.Warn(Tag, '资源获取失败', path)
        }
        return res
    }

    public static isLoaded(Bundle: string, resName: string, relative_path: string = ""): boolean {
        let bundle: Bundle = assetManager.getBundle(Bundle)
        if (!bundle) {
            Debug.Error(Tag, `资源包${Bundle}暂未加载`)
            return false
        }
        let path: string = relative_path + resName
        return !!bundle.get(path)
    }

    public static release(Bundle: string): void {
        if (!this._loadedRefRes.hasOwnProperty(Bundle)) {
            Debug.Warn(this.name, `暂未记录资源包${Bundle}中任何资源，无需释放`)
            return
        }
        let assets: Asset[] = this._loadedRefRes[Bundle]
        let len: number = assets.length
        for (let i = 0; i < len; i++) {
            const asset: Asset = assets[i]
            if (!asset.isValid) {
                Debug.Warn(this.name, `忽略无效资源,${asset.name}:${asset.uuid}`)
                continue
            }
            asset.decRef()
        }
        delete this._loadedRefRes[Bundle]
        Debug.Log(this.name, `释放资源包${Bundle}中的${len}个资源`)
    }


    static recordedAssets: Object = {}

    static recordAssets(): void {
        //@ts-ignore
        this.recordedAssets = { ...this.Assets._map }
    }

    static compareAssets(): void {
        //@ts-ignore
        let curAssets: Object = { ...this.Assets._map }
        let arr1: Object = {}
        let arr2: Object = {}
        for (const key in this.recordedAssets) {
            if (curAssets.hasOwnProperty(key)) continue
            arr1[key] = this.recordedAssets[key]
        }
        for (const key in curAssets) {
            if (this.recordedAssets.hasOwnProperty(key)) continue
            arr2[key] = curAssets[key]
        }
        console.log(arr1)
        console.log(arr2)
    }

    public static getSpriteFrame<T extends Asset>(Bundle: string, resName: string, relative_path: string = ""): T {
        return this.getRes<T>(Bundle, resName + "/spriteFrame", relative_path)
    }

}