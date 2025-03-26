import { math } from "cc"

export class MathUtil {

    public static IsInRange(v: number, min: number, max: number): boolean {
        if (v < min) return false
        if (v > max) return false
        return true
    }

    public static randWeight(weight_arr: number[]): number {
        if (!weight_arr) return -1
        if (weight_arr.length <= 0) return -1
        const arr: number[] = [0]
        let totalWeight: number = 0
        for (let i = 0; i < weight_arr.length; i++) {
            const weight: number = weight_arr[i];
            totalWeight += weight
            arr.push(arr[i] + weight)
        }
        const w: number = math.randomRange(0, totalWeight)
        for (let i = 0; i < arr.length; i++) {
            if (w >= arr[i] && w <= arr[i + 1]) return i
        }
        return -1
    }

}


