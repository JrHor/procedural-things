
export class random {
    seed = 0;
    next = 0;
    constructor(seed=1) {
        this.setSeed(seed);
    }
    Num(min=0, max=2**32 - 1){
        let mod = 2**32-1;
        this.next = (this.next * 1664525 + 1013904223) % mod;
    
        let result = (this.next / mod) * (max + 1 - min) + min;
        return Math.round(result);
    }
    setSeed(seed){
        if (seed == this.seed) return;
        this.seed = this.next = seed;
    }
    resetSeq(){
        this.next = this.seed;
    }
}